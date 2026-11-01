import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Volume2, VolumeX, Trophy, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2 } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface ArcadeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGame?: 'snake' | 'pacman';
}

export const ArcadeGameModal: React.FC<ArcadeGameModalProps> = ({ 
  isOpen, 
  onClose, 
  initialGame = 'snake' 
}) => {
  const [selectedGame, setSelectedGame] = useState<'snake' | 'pacman'>(initialGame);
  const { isMuted, toggleMute, playSound } = useSound();
  const [highScores, setHighScores] = useState({ snake: 0, pacman: 0 });

  // Procedural retro sound effects synced with global sound manager
  const playRetroSound = (type: 'eat' | 'power' | 'die' | 'start') => {
    playSound(type);
  };

  // Load high scores from localStorage
  useEffect(() => {
    try {
      const storedSnake = localStorage.getItem('gk_arcade_snake_hs');
      const storedPacman = localStorage.getItem('gk_arcade_pacman_hs');
      setHighScores({
        snake: storedSnake ? parseInt(storedSnake, 10) : 0,
        pacman: storedPacman ? parseInt(storedPacman, 10) : 0
      });
    } catch {
      // Storage failover
    }
  }, []);

  const updateHighScore = (game: 'snake' | 'pacman', score: number) => {
    if (score > highScores[game]) {
      const updated = { ...highScores, [game]: score };
      setHighScores(updated);
      try {
        localStorage.setItem(`gk_arcade_${game}_hs`, score.toString());
      } catch {
        // storage failover
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#ffffff] border border-[#d5d1c5] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#e6e3da] bg-[#f9f8f5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#161514] text-white flex items-center justify-center">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-[#161514]">
                  Developer Retro Arcade
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f0ede6] text-[#6e6b63] border border-[#e6e3da]">
                  Mini-Game Break
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#6e6b63]">
                Zero dependencies · 60 FPS HTML5 Canvas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg border border-[#d5d1c5] bg-[#ffffff] text-[#6e6b63] hover:text-[#161514] hover:bg-[#f0ede6] cursor-pointer"
              title={!isMuted ? "Mute audio" : "Enable 8-bit sound"}
              aria-label={!isMuted ? "Mute audio" : "Enable 8-bit sound"}
            >
              {!isMuted ? <Volume2 className="w-4 h-4 text-[#161514]" /> : <VolumeX className="w-4 h-4 text-[#9c988d]" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[#d5d1c5] bg-[#ffffff] text-[#6e6b63] hover:text-[#161514] hover:bg-[#f0ede6]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Selector Tabs with (Recommended) Badge */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#e6e3da] bg-[#fdfcf9] text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedGame('snake')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedGame === 'snake'
                  ? 'bg-[#161514] text-white font-semibold shadow-xs'
                  : 'text-[#6e6b63] hover:text-[#161514] hover:bg-[#f0ede6]'
              }`}
            >
              <span>🐍 Cyber Snake</span>
              <span className="text-[9px] uppercase tracking-wider font-bold bg-[#16a34a] text-white px-1.5 py-0.2 rounded">
                Recommended
              </span>
            </button>

            <button
              onClick={() => setSelectedGame('pacman')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedGame === 'pacman'
                  ? 'bg-[#161514] text-white font-semibold shadow-xs'
                  : 'text-[#6e6b63] hover:text-[#161514] hover:bg-[#f0ede6]'
              }`}
            >
              <span>🟡 Dev Pac-Man</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#6e6b63]">
            <Trophy className="w-3.5 h-3.5 text-[#eab308]" />
            <span>High: {selectedGame === 'snake' ? highScores.snake : highScores.pacman}</span>
          </div>
        </div>

        {/* Game Container */}
        <div className="p-3 sm:p-5 flex flex-col items-center justify-center bg-[#f9f8f5] grid-bg">
          {selectedGame === 'snake' ? (
            <SnakeGame 
              onScoreUpdate={(s) => updateHighScore('snake', s)} 
              playSound={playRetroSound}
              highScore={highScores.snake}
            />
          ) : (
            <PacmanGame 
              onScoreUpdate={(s) => updateHighScore('pacman', s)} 
              playSound={playRetroSound}
              highScore={highScores.pacman}
            />
          )}
        </div>

        {/* Footer tips */}
        <div className="p-3 border-t border-[#e6e3da] bg-[#ffffff] flex items-center justify-between text-[11px] font-mono text-[#6e6b63]">
          <span>Controls: Arrow Keys / WASD or On-Screen D-Pad</span>
          <button
            onClick={() => setSelectedGame(selectedGame === 'snake' ? 'pacman' : 'snake')}
            className="text-[#161514] hover:underline"
          >
            Switch to {selectedGame === 'snake' ? 'Pac-Man' : 'Snake'} →
          </button>
        </div>

      </div>
    </div>
  );
};

/* =========================================================================
   1. CYBER SNAKE GAME (RECOMMENDED)
   ========================================================================= */
interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  playSound: (type: 'eat' | 'power' | 'die' | 'start') => void;
  highScore: number;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate, playSound, highScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [speedLevel, setSpeedLevel] = useState<'normal' | 'turbo'>('normal');

  const GRID_SIZE = 18;
  const CELL_SIZE = 18; // 324 x 324 canvas

  const snakeRef = useRef([
    { x: 9, y: 9 },
    { x: 9, y: 10 },
    { x: 9, y: 11 }
  ]);
  const dirRef = useRef({ x: 0, y: -1 });
  const nextDirRef = useRef({ x: 0, y: -1 });
  const foodRef = useRef({ x: 5, y: 5, isSpecial: false });
  const scoreRef = useRef(0);

  const spawnFood = () => {
    let newX = Math.floor(Math.random() * GRID_SIZE);
    let newY = Math.floor(Math.random() * GRID_SIZE);
    const isSpecial = Math.random() < 0.25; // 25% chance of bonus star food
    foodRef.current = { x: newX, y: newY, isSpecial };
  };

  const resetGame = () => {
    snakeRef.current = [
      { x: 9, y: 9 },
      { x: 9, y: 10 },
      { x: 9, y: 11 }
    ];
    dirRef.current = { x: 0, y: -1 };
    nextDirRef.current = { x: 0, y: -1 };
    scoreRef.current = 0;
    setScore(0);
    setIsGameOver(false);
    setIsStarted(true);
    spawnFood();
    playSound('start');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      const cur = dirRef.current;
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(key)) {
        if (cur.y === 0) nextDirRef.current = { x: 0, y: -1 };
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(key)) {
        if (cur.y === 0) nextDirRef.current = { x: 0, y: 1 };
      } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(key)) {
        if (cur.x === 0) nextDirRef.current = { x: -1, y: 0 };
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(key)) {
        if (cur.x === 0) nextDirRef.current = { x: 1, y: 0 };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const intervalMs = speedLevel === 'turbo' ? 85 : 125;
    const interval = setInterval(() => {
      const snake = snakeRef.current;
      const head = { ...snake[0] };
      const nextDir = nextDirRef.current;
      dirRef.current = nextDir;

      head.x += nextDir.x;
      head.y += nextDir.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        playSound('die');
        onScoreUpdate(scoreRef.current);
        return;
      }

      // Self collision
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          setIsGameOver(true);
          playSound('die');
          onScoreUpdate(scoreRef.current);
          return;
        }
      }

      snake.unshift(head);

      // Check food
      const food = foodRef.current;
      if (head.x === food.x && head.y === food.y) {
        const added = food.isSpecial ? 30 : 10;
        scoreRef.current += added;
        setScore(scoreRef.current);
        playSound(food.isSpecial ? 'power' : 'eat');
        spawnFood();
        // Prevent snake from growing very big: cap length at max 5 segments
        if (snake.length > 5) {
          snake.pop();
        }
      } else {
        snake.pop();
      }

      draw();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isStarted, isGameOver, speedLevel]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid pattern
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food
    const food = foodRef.current;
    if (food.isSpecial) {
      // Golden star / release tag
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2);
    } else {
      // Green commit dot
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Snake
    const snake = snakeRef.current;
    snake.forEach((segment, i) => {
      if (i === 0) {
        // Snake Head
        ctx.fillStyle = '#161514';
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Snake Eyes
        ctx.fillStyle = '#ffffff';
        const eyeOffset = 4;
        ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + eyeOffset, 3, 3);
        ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - 3, segment.y * CELL_SIZE + eyeOffset, 3, 3);
      } else {
        // Body segment with gradient tone
        ctx.fillStyle = i % 2 === 0 ? '#383633' : '#52504b';
        ctx.fillRect(segment.x * CELL_SIZE + 2, segment.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      }
    });
  };

  const handleMobileDir = (dx: number, dy: number) => {
    if (!isStarted) {
      resetGame();
      return;
    }
    const cur = dirRef.current;
    if (dx !== 0 && cur.x === 0) {
      nextDirRef.current = { x: dx, y: 0 };
    } else if (dy !== 0 && cur.y === 0) {
      nextDirRef.current = { x: 0, y: dy };
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Game Bar */}
      <div className="flex items-center justify-between w-full max-w-[324px] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#161514]">Score: {score}</span>
          <span className="text-[#9c988d]">|</span>
          <span className="text-[#6e6b63]">Best: {Math.max(score, highScore)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSpeedLevel(speedLevel === 'normal' ? 'turbo' : 'normal')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
              speedLevel === 'turbo' ? 'bg-[#d41514] text-white border-[#d41514]' : 'bg-[#ffffff] text-[#6e6b63] border-[#d5d1c5]'
            }`}
          >
            {speedLevel === 'turbo' ? 'Turbo 🔥' : 'Normal'}
          </button>
        </div>
      </div>

      {/* Canvas Frame */}
      <div className="relative rounded-xl border-2 border-[#161514] bg-[#ffffff] shadow-md overflow-hidden">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />

        {/* Start / Game Over Overlay */}
        {(!isStarted || isGameOver) && (
          <div className="absolute inset-0 bg-[#ffffff]/90 backdrop-blur-2xs flex flex-col items-center justify-center gap-3 p-4 text-center">
            {isGameOver ? (
              <>
                <span className="text-xl font-bold text-[#d41514] font-mono">GAME OVER</span>
                <span className="text-xs font-mono text-[#6e6b63]">Final Score: {score}</span>
              </>
            ) : (
              <>
                <span className="text-xl font-bold text-[#161514] font-mono">🐍 CYBER SNAKE</span>
                <span className="text-xs font-mono text-[#6e6b63] max-w-[200px]">
                  Eat green commits & golden release tags. Don't hit the walls!
                </span>
              </>
            )}

            <button
              onClick={resetGame}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#161514] hover:bg-[#333] text-white font-mono text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isGameOver ? 'Play Again' : 'Start Game'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch D-Pad */}
      <div className="flex flex-col items-center gap-1 mt-1 sm:hidden">
        <button
          onClick={() => handleMobileDir(0, -1)}
          className="w-11 h-10 rounded-lg bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514] shadow-xs"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleMobileDir(-1, 0)}
            className="w-11 h-10 rounded-lg bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514] shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMobileDir(0, 1)}
            className="w-11 h-10 rounded-lg bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514] shadow-xs"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMobileDir(1, 0)}
            className="w-11 h-10 rounded-lg bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514] shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. DEV PAC-MAN GAME
   ========================================================================= */
interface PacmanGameProps {
  onScoreUpdate: (score: number) => void;
  playSound: (type: 'eat' | 'power' | 'die' | 'start') => void;
  highScore: number;
}

const PacmanGame: React.FC<PacmanGameProps> = ({ onScoreUpdate, playSound, highScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const COLS = 19;
  const ROWS = 17;
  const CELL = 19; // 361 x 323 canvas

  // 1 = Wall, 0 = Dot, 2 = Power Pellet, 3 = Empty space
  const initialMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,2,1],
    [1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,3,1,3,1,1,1,0,1,1,1,1],
    [3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3],
    [1,1,1,1,0,1,3,1,1,3,1,1,3,1,0,1,1,1,1],
    [3,3,3,3,0,3,3,1,3,3,3,1,3,3,0,3,3,3,3],
    [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,0,1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,1],
    [1,2,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  const mapRef = useRef<number[][]>(JSON.parse(JSON.stringify(initialMap)));
  const pacmanRef = useRef({ x: 9, y: 13, dx: 0, dy: 0, mouth: 0.2, mouthDir: 0.04 });
  const ghostsRef = useRef([
    { x: 9, y: 7, dx: 1, dy: 0, color: '#ef4444', scared: 0 }, // Blinky (Red)
    { x: 9, y: 9, dx: -1, dy: 0, color: '#ec4899', scared: 0 }, // Pinky (Pink)
    { x: 8, y: 8, dx: 0, dy: 1, color: '#06b6d4', scared: 0 }   // Inky (Cyan)
  ]);
  const scoreRef = useRef(0);

  const resetGame = () => {
    mapRef.current = JSON.parse(JSON.stringify(initialMap));
    pacmanRef.current = { x: 9, y: 13, dx: 0, dy: 0, mouth: 0.2, mouthDir: 0.04 };
    ghostsRef.current = [
      { x: 9, y: 7, dx: 1, dy: 0, color: '#ef4444', scared: 0 },
      { x: 9, y: 9, dx: -1, dy: 0, color: '#ec4899', scared: 0 },
      { x: 8, y: 8, dx: 0, dy: 1, color: '#06b6d4', scared: 0 }
    ];
    scoreRef.current = 0;
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsStarted(true);
    playSound('start');
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { key } = e;
      const pac = pacmanRef.current;
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(key)) {
        pac.dx = 0; pac.dy = -1;
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(key)) {
        pac.dx = 0; pac.dy = 1;
      } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(key)) {
        pac.dx = -1; pac.dy = 0;
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(key)) {
        pac.dx = 1; pac.dy = 0;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Main loop
  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const interval = setInterval(() => {
      const pac = pacmanRef.current;
      const map = mapRef.current;

      // Pac-Man movement
      let nextX = pac.x + pac.dx;
      let nextY = pac.y + pac.dy;

      // Wrap around tunnel
      if (nextX < 0) nextX = COLS - 1;
      if (nextX >= COLS) nextX = 0;

      if (map[nextY] && map[nextY][nextX] !== 1) {
        pac.x = nextX;
        pac.y = nextY;

        // Eat dot
        if (map[nextY][nextX] === 0) {
          map[nextY][nextX] = 3;
          scoreRef.current += 10;
          setScore(scoreRef.current);
          playSound('eat');
        } else if (map[nextY][nextX] === 2) {
          // Power pellet
          map[nextY][nextX] = 3;
          scoreRef.current += 50;
          setScore(scoreRef.current);
          playSound('power');
          // Scare ghosts for 35 ticks (~5 seconds)
          ghostsRef.current.forEach(g => g.scared = 35);
        }
      }

      // Mouth chomp animation
      pac.mouth += pac.mouthDir;
      if (pac.mouth > 0.45 || pac.mouth < 0.05) {
        pac.mouthDir = -pac.mouthDir;
      }

      // Ghosts AI & movement
      const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
      ];

      ghostsRef.current.forEach((ghost) => {
        if (ghost.scared > 0) ghost.scared--;

        const possibleDirs = directions.filter(d => {
          const gx = ghost.x + d.dx;
          const gy = ghost.y + d.dy;
          return map[gy] && map[gy][gx] !== 1 && (d.dx !== -ghost.dx || d.dy !== -ghost.dy);
        });

        if (possibleDirs.length > 0) {
          // Simple random intersection choice
          const chosen = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
          ghost.dx = chosen.dx;
          ghost.dy = chosen.dy;
        }

        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

        // Collision with Pacman
        if (ghost.x === pac.x && ghost.y === pac.y) {
          if (ghost.scared > 0) {
            // Eat ghost
            scoreRef.current += 200;
            setScore(scoreRef.current);
            playSound('power');
            ghost.x = 9;
            ghost.y = 7;
            ghost.scared = 0;
          } else {
            // Pacman dies
            playSound('die');
            setLives(prev => {
              const remaining = prev - 1;
              if (remaining <= 0) {
                setIsGameOver(true);
                onScoreUpdate(scoreRef.current);
              } else {
                pac.x = 9;
                pac.y = 13;
                pac.dx = 0;
                pac.dy = 0;
              }
              return remaining;
            });
          }
        }
      });

      draw();
    }, 150);

    return () => clearInterval(interval);
  }, [isStarted, isGameOver]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark background for Pacman arcade feel
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const map = mapRef.current;

    // Draw Map Walls & Dots
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const val = map[r][c];
        const px = c * CELL;
        const py = r * CELL;

        if (val === 1) {
          // Wall
          ctx.fillStyle = '#1e3a8a'; // Classic Pacman blue wall
          ctx.fillRect(px, py, CELL, CELL);
          ctx.strokeStyle = '#3b82f6';
          ctx.strokeRect(px + 1, py + 1, CELL - 2, CELL - 2);
        } else if (val === 0) {
          // Code Dot
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(px + CELL / 2, py + CELL / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (val === 2) {
          // Power Pellet
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px + CELL / 2, py + CELL / 2, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw Pac-Man
    const pac = pacmanRef.current;
    const pacCenterX = pac.x * CELL + CELL / 2;
    const pacCenterY = pac.y * CELL + CELL / 2;

    ctx.fillStyle = '#facc15'; // Classic Pacman yellow
    ctx.beginPath();
    let angle = 0;
    if (pac.dx === 1) angle = 0;
    else if (pac.dx === -1) angle = Math.PI;
    else if (pac.dy === 1) angle = Math.PI / 2;
    else if (pac.dy === -1) angle = -Math.PI / 2;

    ctx.arc(pacCenterX, pacCenterY, CELL / 2 - 1, angle + pac.mouth * Math.PI, angle + (2 - pac.mouth) * Math.PI);
    ctx.lineTo(pacCenterX, pacCenterY);
    ctx.fill();

    // Draw Ghosts
    ghostsRef.current.forEach((ghost) => {
      const gx = ghost.x * CELL + CELL / 2;
      const gy = ghost.y * CELL + CELL / 2;

      ctx.fillStyle = ghost.scared > 0 ? (ghost.scared < 10 ? '#93c5fd' : '#2563eb') : ghost.color;
      ctx.beginPath();
      ctx.arc(gx, gy - 2, CELL / 2 - 2, Math.PI, 0, false);
      ctx.lineTo(gx + CELL / 2 - 2, gy + CELL / 2 - 2);
      ctx.lineTo(gx - CELL / 2 + 2, gy + CELL / 2 - 2);
      ctx.fill();

      // Ghost Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(gx - 3, gy - 3, 2.5, 0, Math.PI * 2);
      ctx.arc(gx + 3, gy - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(gx - 3 + ghost.dx, gy - 3 + ghost.dy, 1.2, 0, Math.PI * 2);
      ctx.arc(gx + 3 + ghost.dx, gy - 3 + ghost.dy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const handleMobileDir = (dx: number, dy: number) => {
    if (!isStarted) {
      resetGame();
      return;
    }
    pacmanRef.current.dx = dx;
    pacmanRef.current.dy = dy;
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Game Bar */}
      <div className="flex items-center justify-between w-full max-w-[361px] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#161514]">Score: {score}</span>
          <span className="text-[#9c988d]">|</span>
          <span className="text-[#6e6b63]">Best: {Math.max(score, highScore)}</span>
        </div>

        <div className="flex items-center gap-1 font-mono text-[#d41514]">
          <span>Lives: {'❤️'.repeat(lives)}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl border-2 border-[#161514] bg-[#0a0a0a] shadow-md overflow-hidden">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="block"
        />

        {/* Start / Game Over Overlay */}
        {(!isStarted || isGameOver) && (
          <div className="absolute inset-0 bg-[#0a0a0a]/92 flex flex-col items-center justify-center gap-3 p-4 text-center">
            {isGameOver ? (
              <>
                <span className="text-xl font-bold text-[#d41514] font-mono">PAC-MAN CAUGHT</span>
                <span className="text-xs font-mono text-[#facc15]">Final Score: {score}</span>
              </>
            ) : (
              <>
                <span className="text-xl font-bold text-[#facc15] font-mono">🟡 DEV PAC-MAN</span>
                <span className="text-xs font-mono text-[#d5d1c5] max-w-[220px]">
                  Chomp code dots, grab white power pellets, and avoid the bug ghosts!
                </span>
              </>
            )}

            <button
              onClick={resetGame}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-[#161514] font-mono text-xs font-bold shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isGameOver ? 'Play Again' : 'Start Pac-Man'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch D-Pad */}
      <div className="flex flex-col items-center gap-1 mt-1 sm:hidden">
        <button
          onClick={() => handleMobileDir(0, -1)}
          className="w-11 h-10 rounded-lg bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514] shadow-xs"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleMobileDir(-1, 0)}
            className="w-11 h-10 rounded-lg bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514] shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMobileDir(0, 1)}
            className="w-11 h-10 rounded-lg bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514] shadow-xs"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMobileDir(1, 0)}
            className="w-11 h-10 rounded-lg bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514] shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
