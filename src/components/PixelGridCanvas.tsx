import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/soundManager';

export type GameTheme = 'snake' | 'pacman' | 'tetris';

interface PixelGridCanvasProps {
  theme: GameTheme;
  onScoreUpdate?: (score: number) => void;
}

interface GridCell {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  color: string;
}

interface TetroPiece {
  x: number; // grid col index
  y: number; // float grid row
  speed: number;
  color: string;
  shape: number[][]; // 2D matrix
  type: string;
}

interface Ghost {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  dir: 'up' | 'down' | 'left' | 'right';
}

export const PixelGridCanvas: React.FC<PixelGridCanvasProps> = ({ theme, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<GameTheme>(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const cellSize = 32;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      dpr = window.devicePixelRatio || 1;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 1. GLOBAL CURSOR TRAIL - Minimal & Discrete (Never occupies or obscures the background)
    // ==========================================
    const trailColors = [
      'rgba(245, 158, 11, 0.18)', // Subtle Warm Amber
      'rgba(59, 130, 246, 0.14)', // Subtle Soft Sky
      'rgba(16, 185, 129, 0.14)', // Subtle Soft Sage
      'rgba(22, 21, 20, 0.10)'    // Subtle Warm Ink
    ];

    const trailMap = new Map<string, GridCell>();
    let lastHoverCol = -1;
    let lastHoverRow = -1;
    const MAX_TRAIL_CELLS = 3; // Strict ceiling: max 3 subtle cells active, cannot overwhelm the screen

    const activateTrailCell = (gx: number, gy: number, duration = 0.28) => {
      const key = `${gx},${gy}`;
      // Maintain strict ceiling so moving cursor cannot leave a large trail occupying the background
      if (trailMap.size >= MAX_TRAIL_CELLS && !trailMap.has(key)) {
        const oldestKey = trailMap.keys().next().value;
        if (oldestKey) trailMap.delete(oldestKey);
      }
      const color = trailColors[Math.floor(Math.random() * trailColors.length)];
      trailMap.set(key, {
        x: gx,
        y: gy,
        life: duration,
        maxLife: duration,
        color
      });
    };

    // ==========================================
    // 2. TETRIS / BLOCK GAME STATE (Image 2 Match)
    // ==========================================
    const shapes: { [key: string]: number[][] } = {
      L: [[1, 0], [1, 0], [1, 1]], // L shape from Image 2
      J: [[0, 1], [0, 1], [1, 1]],
      T: [[1, 1, 1], [0, 1, 0]],
      O: [[1, 1], [1, 1]],
      I: [[1], [1], [1], [1]],
      Z: [[1, 1, 0], [0, 1, 1]],
      S: [[0, 1, 1], [1, 1, 0]]
    };

    const shapeColors: { [key: string]: string } = {
      L: 'rgba(245, 158, 11, 0.88)', // Amber/Gold (matching Image 2!)
      J: 'rgba(59, 130, 246, 0.35)', // Blue
      T: 'rgba(168, 85, 247, 0.35)', // Purple
      O: 'rgba(234, 179, 8, 0.35)',  // Yellow
      I: 'rgba(6, 182, 212, 0.35)',  // Cyan
      Z: 'rgba(239, 68, 68, 0.35)',  // Red
      S: 'rgba(16, 185, 129, 0.35)'  // Green
    };

    const fallingPieces: TetroPiece[] = [];
    const maxPieces = 2; // Limited to 2 ambient pieces

    const createTetroPiece = (forcedType?: string, initialX?: number, initialY?: number): TetroPiece => {
      const cols = Math.max(10, Math.floor(width / cellSize));
      const typeKeys = Object.keys(shapes);
      const type = forcedType || typeKeys[Math.floor(Math.random() * typeKeys.length)];
      return {
        x: initialX !== undefined ? initialX : Math.floor(Math.random() * (cols - 4)) + 1,
        y: initialY !== undefined ? initialY : -3 - Math.random() * 8,
        speed: 0.028 + Math.random() * 0.022,
        color: shapeColors[type] || 'rgba(245, 158, 11, 0.40)',
        shape: shapes[type],
        type
      };
    };

    // Matrix rotation for interactive tetris
    const rotateShape = (matrix: number[][]): number[][] => {
      const rCount = matrix.length;
      const cCount = matrix[0].length;
      const res: number[][] = [];
      for (let c = 0; c < cCount; c++) {
        res[c] = [];
        for (let r = rCount - 1; r >= 0; r--) {
          res[c].push(matrix[r][c]);
        }
      }
      return res;
    };

    // Active falling tetromino (Golden L-shape from Image 2 in continuous dynamic motion - never stuck!)
    const activeTetro = {
      x: 12,
      y: -2,
      shape: shapes.L,
      color: '#f59e0b',
      speed: 0.045,
      type: 'L'
    };

    // Initialize ambient background falling pieces with smooth visible speed
    for (let i = 0; i < maxPieces; i++) {
      fallingPieces.push(createTetroPiece());
    }

    // ==========================================
    // 3. SNAKE GAME STATE (Recommended Theme) - Compact, nimble 3-cell mascot that never grows big
    // ==========================================
    let snakeScore = 0;
    const snakeBody = [
      { x: 12, y: 8 },
      { x: 11, y: 8 },
      { x: 10, y: 8 }
    ];
    let snakeDir = { x: 1, y: 0 };
    let snakeNextDir = { x: 1, y: 0 };
    let snakeLastMoveTime = 0;
    const snakeStepInterval = 110; // ms per step (silky retro speed)

    // Snake food pellets on the grid (only 1 subtle food pellet to prevent clutter)
    const snakeFoods: { x: number; y: number; color: string; pulse: number }[] = [];
    const spawnSnakeFood = () => {
      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);
      if (cols <= 4 || rows <= 4 || snakeFoods.length >= 1) return;
      snakeFoods.push({
        x: Math.floor(Math.random() * (cols - 4)) + 2,
        y: Math.floor(Math.random() * (rows - 4)) + 2,
        color: '#f59e0b',
        pulse: 0
      });
    };

    spawnSnakeFood();

    // ==========================================
    // 4. PAC-MAN GAME STATE
    // ==========================================
    let pacmanScore = 0;
    let pacmanX = 8;
    let pacmanY = 10;
    let pacmanTargetX = 8;
    let pacmanTargetY = 10;
    let pacmanDir: 'up' | 'down' | 'left' | 'right' = 'right';
    let pacmanNextDir: 'up' | 'down' | 'left' | 'right' = 'right';
    let mouthAngle = 0.2;
    let mouthDir = 1;

    // Pac-Man Dots across grid lines
    const pacmanDots: { x: number; y: number }[] = [];
    const initPacmanDots = () => {
      pacmanDots.length = 0;
      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);
      for (let r = 2; r < rows - 2; r += 2) {
        for (let c = 2; c < cols - 2; c += 2) {
          pacmanDots.push({ x: c, y: r });
        }
      }
    };
    initPacmanDots();

    // Ghosts
    const ghosts: Ghost[] = [
      { x: 16, y: 10, targetX: 16, targetY: 10, color: '#ef4444', dir: 'left' },  // Blinky
      { x: 18, y: 12, targetX: 18, targetY: 12, color: '#f472b6', dir: 'up' },    // Pinky
      { x: 20, y: 10, targetX: 20, targetY: 10, color: '#06b6d4', dir: 'right' }  // Inky
    ];

    // ==========================================
    // USER INPUT & INTERACTION (Confined to Canvas Bounds)
    // ==========================================
    const getLocalGrid = (clientX: number, clientY: number) => {
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      if (localX < 0 || localX > rect.width || localY < 0 || localY > rect.height) {
        return null;
      }
      return {
        gx: Math.floor(localX / cellSize),
        gy: Math.floor(localY / cellSize)
      };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const coords = getLocalGrid(e.clientX, e.clientY);
      if (!coords) {
        lastHoverCol = -1;
        lastHoverRow = -1;
        return;
      }
      const { gx, gy } = coords;

      // Only activate when crossing into a new cell to avoid overwhelming the grid
      if (gx === lastHoverCol && gy === lastHoverRow) return;
      lastHoverCol = gx;
      lastHoverRow = gy;

      // Subtle, discreet single-cell highlight with fast 0.26s fade
      activateTrailCell(gx, gy, 0.26);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const coords = getLocalGrid(touch.clientX, touch.clientY);
        if (!coords) return;
        const { gx, gy } = coords;
        if (gx === lastHoverCol && gy === lastHoverRow) return;
        lastHoverCol = gx;
        lastHoverRow = gy;
        activateTrailCell(gx, gy, 0.26);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      const coords = getLocalGrid(e.clientX, e.clientY);
      if (!coords) return;
      const { gx, gy } = coords;

      // Discrete single-cell touch/click micro-pulse (fast 0.32s fade, no 9-cell cluster explosion)
      activateTrailCell(gx, gy, 0.32);

      // Interactive Theme Reactions
      const curTheme = themeRef.current;
      if (curTheme === 'snake') {
        soundManager.play('click');
        // Limit to 1 food at a time to prevent background clutter
        if (snakeFoods.length < 1) {
          snakeFoods.push({
            x: gx,
            y: gy,
            color: '#f59e0b',
            pulse: 0
          });
        }
      } else if (curTheme === 'tetris') {
        soundManager.play('drop');
        fallingPieces.push(createTetroPiece(undefined, gx, -2));
      } else if (curTheme === 'pacman') {
        soundManager.play('click');
        // Direct Pac-Man toward click point
        if (Math.abs(gx - pacmanX) > Math.abs(gy - pacmanY)) {
          pacmanNextDir = gx > pacmanX ? 'right' : 'left';
        } else {
          pacmanNextDir = gy > pacmanY ? 'down' : 'up';
        }
      }
    };

    // Keyboard controls for active game
    const handleKeyDown = (e: KeyboardEvent) => {
      const curTheme = themeRef.current;
      let handled = false;
      if (curTheme === 'snake') {
        if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && snakeDir.y === 0) {
          snakeNextDir = { x: 0, y: -1 };
          handled = true;
        } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && snakeDir.y === 0) {
          snakeNextDir = { x: 0, y: 1 };
          handled = true;
        } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && snakeDir.x === 0) {
          snakeNextDir = { x: -1, y: 0 };
          handled = true;
        } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && snakeDir.x === 0) {
          snakeNextDir = { x: 1, y: 0 };
          handled = true;
        }
      } else if (curTheme === 'pacman') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { pacmanNextDir = 'up'; handled = true; }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { pacmanNextDir = 'down'; handled = true; }
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { pacmanNextDir = 'left'; handled = true; }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { pacmanNextDir = 'right'; handled = true; }
      } else if (curTheme === 'tetris') {
        const shapeW = activeTetro.shape[0]?.length || 2;
        const gridCols = Math.max(10, Math.floor(width / cellSize));
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          activeTetro.x = Math.max(0, activeTetro.x - 1);
          handled = true;
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          activeTetro.x = Math.min(gridCols - shapeW, activeTetro.x + 1);
          handled = true;
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          activeTetro.y += 0.8;
          handled = true;
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          activeTetro.shape = rotateShape(activeTetro.shape);
          handled = true;
        } else if (e.key === ' ') {
          activeTetro.y += 2.5;
          handled = true;
        }
      }

      if (handled) {
        soundManager.play('click');
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    // ==========================================
    // MAIN 60 FPS RENDER LOOP
    // ==========================================
    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);
      const curTheme = themeRef.current;

      // 1. Draw Global Cursor Trail - Whispering minimal highlight (strictly capped, never occupies background)
      trailMap.forEach((item, key) => {
        item.life -= 0.016;
        if (item.life <= 0) {
          trailMap.delete(key);
          return;
        }

        const progress = Math.max(0, item.life / item.maxLife);
        // Ultra-delicate micro-opacity: peak 0.14 fading smoothly to 0
        const alpha = Math.min(0.14, progress * 0.14);
        const baseColor = item.color.replace(/[\d\.]+\)$/, `${alpha.toFixed(3)})`);
        ctx.fillStyle = baseColor;
        ctx.fillRect(item.x * cellSize + 1, item.y * cellSize + 1, cellSize - 2, cellSize - 2);

        // Barely perceptible hairline accent border
        ctx.strokeStyle = `rgba(22, 21, 20, ${(alpha * 0.35).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(item.x * cellSize + 0.5, item.y * cellSize + 0.5, cellSize - 1, cellSize - 1);
      });

      // ==========================================
      // THEME A: TETRIS / BLOCK GAME (Image 2 Match)
      // ==========================================
      if (curTheme === 'tetris') {
        // 1. Advance the active Golden Tetromino downwards (continuous motion, never stuck!)
        activeTetro.y += activeTetro.speed;
        if (activeTetro.y > rows + 2) {
          // Reset to top with fresh shape and position
          const typeKeys = Object.keys(shapes);
          const nextType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
          activeTetro.type = nextType;
          activeTetro.shape = shapes[nextType];
          activeTetro.color = shapeColors[nextType] || '#f59e0b';
          activeTetro.x = Math.max(2, Math.min(cols - 5, Math.floor(Math.random() * (cols - 4))));
          activeTetro.y = -3;
          activeTetro.speed = 0.036 + Math.random() * 0.018;
        }

        // Render the active Golden L / Tetromino piece
        for (let r = 0; r < activeTetro.shape.length; r++) {
          for (let c = 0; c < activeTetro.shape[r].length; c++) {
            if (activeTetro.shape[r][c] === 1) {
              const drawX = (activeTetro.x + c) * cellSize;
              const drawY = (activeTetro.y + r) * cellSize;

              if (drawY >= -cellSize && drawY <= height) {
                // Solid golden/amber fill matching Image 2
                ctx.fillStyle = activeTetro.color;
                ctx.fillRect(drawX + 1, drawY + 1, cellSize - 2, cellSize - 2);

                // Top & Left 3D highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.fillRect(drawX + 1, drawY + 1, cellSize - 2, 2);
                ctx.fillRect(drawX + 1, drawY + 1, 2, cellSize - 2);

                // Bottom & Right shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(drawX + 1, drawY + cellSize - 3, cellSize - 2, 2);
                ctx.fillRect(drawX + cellSize - 3, drawY + 1, 2, cellSize - 2);

                // Crisp amber border
                ctx.strokeStyle = 'rgba(180, 83, 9, 0.45)';
                ctx.lineWidth = 1;
                ctx.strokeRect(drawX + 0.5, drawY + 0.5, cellSize - 1, cellSize - 1);
              }
            }
          }
        }

        // Falling Tetris pieces in motion
        fallingPieces.forEach((piece) => {
          piece.y += piece.speed;

          for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
              if (piece.shape[r][c] === 1) {
                const drawX = (piece.x + c) * cellSize;
                const drawY = (piece.y + r) * cellSize;

                if (drawY >= -cellSize && drawY <= height) {
                  ctx.fillStyle = piece.color;
                  ctx.fillRect(drawX + 1, drawY + 1, cellSize - 2, cellSize - 2);

                  // Highlight & Shadow
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                  ctx.fillRect(drawX + 1, drawY + 1, cellSize - 2, 2);
                  ctx.fillRect(drawX + 1, drawY + 1, 2, cellSize - 2);

                  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
                  ctx.fillRect(drawX + 1, drawY + cellSize - 3, cellSize - 2, 2);
                  ctx.fillRect(drawX + cellSize - 3, drawY + 1, 2, cellSize - 2);

                  ctx.strokeStyle = 'rgba(22, 21, 20, 0.25)';
                  ctx.lineWidth = 1;
                  ctx.strokeRect(drawX + 0.5, drawY + 0.5, cellSize - 1, cellSize - 1);
                }
              }
            }
          }

          if (piece.y > rows + 2) {
            Object.assign(piece, createTetroPiece());
          }
        });
      }

      // ==========================================
      // THEME B: SNAKE (RECOMMENDED THEME)
      // ==========================================
      if (curTheme === 'snake') {
        // Step snake logic
        if (time - snakeLastMoveTime > snakeStepInterval) {
          snakeLastMoveTime = time;
          snakeDir = snakeNextDir;

          // Autonomous food seeking if no manual override
          if (snakeFoods.length > 0) {
            const head = snakeBody[0];
            const target = snakeFoods[0];

            // Autonomous steering logic: move towards food
            const dx = target.x - head.x;
            const dy = target.y - head.y;

            if (Math.abs(dx) > Math.abs(dy)) {
              if (dx > 0 && snakeDir.x !== -1) snakeNextDir = { x: 1, y: 0 };
              else if (dx < 0 && snakeDir.x !== 1) snakeNextDir = { x: -1, y: 0 };
              else if (dy > 0 && snakeDir.y !== -1) snakeNextDir = { x: 0, y: 1 };
              else if (dy < 0 && snakeDir.y !== 1) snakeNextDir = { x: 0, y: -1 };
            } else {
              if (dy > 0 && snakeDir.y !== -1) snakeNextDir = { x: 0, y: 1 };
              else if (dy < 0 && snakeDir.y !== 1) snakeNextDir = { x: 0, y: -1 };
              else if (dx > 0 && snakeDir.x !== -1) snakeNextDir = { x: 1, y: 0 };
              else if (dx < 0 && snakeDir.x !== 1) snakeNextDir = { x: -1, y: 0 };
            }
          }

          // Advance snake head
          const newHead = {
            x: (snakeBody[0].x + snakeDir.x + cols) % cols,
            y: (snakeBody[0].y + snakeDir.y + rows) % rows
          };

          // Check if food eaten
          const foodIdx = snakeFoods.findIndex(f => f.x === newHead.x && f.y === newHead.y);
          if (foodIdx >= 0) {
            snakeScore += 10;
            if (onScoreUpdate) onScoreUpdate(snakeScore);

            // Remove eaten food and spawn replacement
            snakeFoods.splice(foodIdx, 1);
            spawnSnakeFood();

            // Subtle micro-glow at food position
            activateTrailCell(newHead.x, newHead.y, 0.28);
          }

          // Strictly keep snake at a compact 3-cell length (never grows big or clutters the screen)
          snakeBody.pop();
          snakeBody.unshift(newHead);
        }

        // Draw Food Pellets with subtle pulse
        snakeFoods.forEach(food => {
          food.pulse = (food.pulse + 0.05) % (Math.PI * 2);
          const scale = 1 + Math.sin(food.pulse) * 0.12;
          const drawX = food.x * cellSize + cellSize / 2;
          const drawY = food.y * cellSize + cellSize / 2;

          ctx.save();
          ctx.translate(drawX, drawY);
          ctx.scale(scale, scale);

          // Subtle amber food pellet
          ctx.fillStyle = 'rgba(245, 158, 11, 0.75)';
          ctx.beginPath();
          ctx.arc(0, 0, (cellSize / 2) - 8, 0, Math.PI * 2);
          ctx.fill();

          // Highlight dot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(-2, -2, 1.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // Draw Snake Body - Tasteful, subtle background transparency
        snakeBody.forEach((seg, index) => {
          const drawX = seg.x * cellSize;
          const drawY = seg.y * cellSize;

          if (index === 0) {
            // Snake Head: Refined emerald with soft alpha
            ctx.fillStyle = 'rgba(16, 185, 129, 0.65)';
            ctx.beginPath();
            ctx.roundRect(drawX + 2, drawY + 2, cellSize - 4, cellSize - 4, 6);
            ctx.fill();

            // Eyes
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            let eye1X = drawX + 9;
            let eye1Y = drawY + 9;
            let eye2X = drawX + cellSize - 9;
            let eye2Y = drawY + 9;

            if (snakeDir.x === 1) {
              eye1X = drawX + cellSize - 8;
              eye1Y = drawY + 8;
              eye2X = drawX + cellSize - 8;
              eye2Y = drawY + cellSize - 8;
            } else if (snakeDir.x === -1) {
              eye1X = drawX + 8;
              eye1Y = drawY + 8;
              eye2X = drawX + 8;
              eye2Y = drawY + cellSize - 8;
            } else if (snakeDir.y === 1) {
              eye1X = drawX + 8;
              eye1Y = drawY + cellSize - 8;
              eye2X = drawX + cellSize - 8;
              eye2Y = drawY + cellSize - 8;
            }

            ctx.beginPath();
            ctx.arc(eye1X, eye1Y, 2.5, 0, Math.PI * 2);
            ctx.arc(eye2X, eye2Y, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Pupils
            ctx.fillStyle = '#064e3b';
            ctx.beginPath();
            ctx.arc(eye1X, eye1Y, 1.2, 0, Math.PI * 2);
            ctx.arc(eye2X, eye2Y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Snake Body Segment - gentle, unobtrusive background tint
            const alpha = Math.max(0.18, 0.38 - (index / snakeBody.length) * 0.16);
            ctx.fillStyle = `rgba(16, 185, 129, ${alpha.toFixed(2)})`;
            ctx.beginPath();
            ctx.roundRect(drawX + 3, drawY + 3, cellSize - 6, cellSize - 6, 5);
            ctx.fill();
          }
        });
      }

      // ==========================================
      // THEME C: PAC-MAN
      // ==========================================
      if (curTheme === 'pacman') {
        // Draw Dots - Low contrast subtle amber dots
        ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
        pacmanDots.forEach(dot => {
          ctx.beginPath();
          ctx.arc(dot.x * cellSize + cellSize / 2, dot.y * cellSize + cellSize / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Animate Pac-Man position
        const speed = 0.08;
        if (pacmanDir === 'right') pacmanX += speed;
        if (pacmanDir === 'left') pacmanX -= speed;
        if (pacmanDir === 'down') pacmanY += speed;
        if (pacmanDir === 'up') pacmanY -= speed;

        // Wrap around screen
        if (pacmanX >= cols) pacmanX = 0;
        if (pacmanX < 0) pacmanX = cols - 1;
        if (pacmanY >= rows) pacmanY = 0;
        if (pacmanY < 0) pacmanY = rows - 1;

        // Chomp dots
        const gx = Math.round(pacmanX);
        const gy = Math.round(pacmanY);
        const dotIdx = pacmanDots.findIndex(d => d.x === gx && d.y === gy);
        if (dotIdx >= 0) {
          pacmanDots.splice(dotIdx, 1);
          pacmanScore += 10;
          if (onScoreUpdate) onScoreUpdate(pacmanScore);
          activateTrailCell(gx, gy, 0.25);
        }

        // Animate mouth
        mouthAngle += 0.03 * mouthDir;
        if (mouthAngle > 0.35) mouthDir = -1;
        if (mouthAngle < 0.05) mouthDir = 1;

        // Turn Pac-Man towards next direction at grid align
        if (Math.abs(pacmanX - Math.round(pacmanX)) < 0.1 && Math.abs(pacmanY - Math.round(pacmanY)) < 0.1) {
          pacmanDir = pacmanNextDir;
        }

        // Draw Pac-Man
        const pCenterX = pacmanX * cellSize + cellSize / 2;
        const pCenterY = pacmanY * cellSize + cellSize / 2;
        const pRadius = cellSize / 2 - 3;

        let rotation = 0;
        if (pacmanDir === 'right') rotation = 0;
        if (pacmanDir === 'down') rotation = Math.PI / 2;
        if (pacmanDir === 'left') rotation = Math.PI;
        if (pacmanDir === 'up') rotation = -Math.PI / 2;

        ctx.save();
        ctx.translate(pCenterX, pCenterY);
        ctx.rotate(rotation);

        ctx.fillStyle = '#facc15'; // Retro yellow
        ctx.beginPath();
        ctx.arc(0, 0, pRadius, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI);
        ctx.lineTo(0, 0);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(2, -pRadius / 2, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Animate & Draw Ghosts
        ghosts.forEach((ghost, idx) => {
          // Wander ghost
          if (Math.random() < 0.02) {
            const dirs: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
            ghost.dir = dirs[Math.floor(Math.random() * dirs.length)];
          }

          const ghostSpeed = 0.05;
          if (ghost.dir === 'right') ghost.x += ghostSpeed;
          if (ghost.dir === 'left') ghost.x -= ghostSpeed;
          if (ghost.dir === 'down') ghost.y += ghostSpeed;
          if (ghost.dir === 'up') ghost.y -= ghostSpeed;

          ghost.x = (ghost.x + cols) % cols;
          ghost.y = (ghost.y + rows) % rows;

          const gX = ghost.x * cellSize + cellSize / 2;
          const gY = ghost.y * cellSize + cellSize / 2;
          const gRadius = cellSize / 2 - 4;

          // Ghost dome
          ctx.fillStyle = ghost.color;
          ctx.beginPath();
          ctx.arc(gX, gY - 2, gRadius, Math.PI, 0, false);
          ctx.lineTo(gX + gRadius, gY + gRadius - 2);
          // Wavy skirt
          ctx.lineTo(gX + gRadius / 2, gY + gRadius - 5);
          ctx.lineTo(gX, gY + gRadius - 2);
          ctx.lineTo(gX - gRadius / 2, gY + gRadius - 5);
          ctx.lineTo(gX - gRadius, gY + gRadius - 2);
          ctx.closePath();
          ctx.fill();

          // Ghost Eyes
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(gX - 4, gY - 4, 3, 0, Math.PI * 2);
          ctx.arc(gX + 4, gY - 4, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.arc(gX - 3, gY - 4, 1.5, 0, Math.PI * 2);
          ctx.arc(gX + 5, gY - 4, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)'
      }}
      aria-hidden="true"
    />
  );
};
