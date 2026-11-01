import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

export const HeroEmbeddedArcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'snake' | 'pacman' | 'tetris'>('snake');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScores, setHighScores] = useState({ snake: 0, pacman: 0, tetris: 0 });

  // Web Audio Context for zero-dependency procedural retro sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = (type: 'eat' | 'power' | 'die' | 'start' | 'line') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'eat') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'power' || type === 'line') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.12);
        osc.frequency.linearRampToValueAtTime(950, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'die') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    try {
      const s = localStorage.getItem('gk_hero_snake_hs');
      const p = localStorage.getItem('gk_hero_pac_hs');
      const t = localStorage.getItem('gk_hero_tetris_hs');
      setHighScores({
        snake: s ? parseInt(s, 10) : 0,
        pacman: p ? parseInt(p, 10) : 0,
        tetris: t ? parseInt(t, 10) : 0
      });
    } catch {
      // Storage failover
    }
  }, []);

  const handleUpdateHighScore = (game: 'snake' | 'pacman' | 'tetris', score: number) => {
    if (score > highScores[game]) {
      const updated = { ...highScores, [game]: score };
      setHighScores(updated);
      try {
        localStorage.setItem(`gk_hero_${game}_hs`, score.toString());
      } catch {
        // Storage failover
      }
    }
  };

  return (
    <div className="w-full max-w-[340px] bg-[#ffffff] border-2 border-[#161514] rounded-2xl shadow-[4px_4px_0px_#161514] p-3 sm:p-3.5 flex flex-col gap-2.5 text-left select-none relative z-20">
      
      {/* Top Header of the Embedded Box */}
      <div className="flex items-center justify-between border-b border-[#e6e3da] pb-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping"></span>
          <span className="font-bold text-[#161514]">PLAY IN-PLACE</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-[#6e6b63]">
            <Trophy className="w-3 h-3 text-[#eab308]" />
            <span>High: {highScores[activeGame]}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded text-[#6e6b63] hover:text-[#161514] hover:bg-[#f0ede6]"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#9c988d]" />}
          </button>
        </div>
      </div>

      {/* Game Selector Tabs with (Recommended) badge on Snake */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-[#f0ede6] rounded-xl text-xs font-mono">
        {/* Snake (Recommended) */}
        <button
          onClick={() => setActiveGame('snake')}
          className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            activeGame === 'snake'
              ? 'bg-[#161514] text-white font-bold shadow-xs'
              : 'text-[#6e6b63] hover:text-[#161514] hover:bg-[#e6e3da]'
          }`}
        >
          <span className="text-xs">🐍 Snake</span>
          <span className={`text-[8px] uppercase tracking-wider px-1 rounded font-bold mt-0.5 ${
            activeGame === 'snake' ? 'bg-[#16a34a] text-white' : 'bg-[#16a34a]/20 text-[#166534]'
          }`}>
            Recommended
          </span>
        </button>

        {/* Pac-Man */}
        <button
          onClick={() => setActiveGame('pacman')}
          className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeGame === 'pacman'
              ? 'bg-[#161514] text-white font-bold shadow-xs'
              : 'text-[#6e6b63] hover:text-[#161514] hover:bg-[#e6e3da]'
          }`}
        >
          <span className="text-xs">🟡 Pac-Man</span>
          <span className="text-[8px] text-[#9c988d] mt-0.5 font-mono">Retro Maze</span>
        </button>

        {/* Tetris / Blocks */}
        <button
          onClick={() => setActiveGame('tetris')}
          className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeGame === 'tetris'
              ? 'bg-[#161514] text-white font-bold shadow-xs'
              : 'text-[#6e6b63] hover:text-[#161514] hover:bg-[#e6e3da]'
          }`}
        >
          <span className="text-xs">🧱 Tetris</span>
          <span className="text-[8px] text-[#9c988d] mt-0.5 font-mono">Block Game</span>
        </button>
      </div>

      {/* Embedded Active Game Canvas Frame */}
      <div className="relative w-full flex items-center justify-center bg-[#f9f8f5] rounded-xl overflow-hidden border border-[#d5d1c5]">
        {activeGame === 'snake' && (
          <EmbeddedSnake
            playSound={playSound}
            onScore={(s) => handleUpdateHighScore('snake', s)}
          />
        )}
        {activeGame === 'pacman' && (
          <EmbeddedPacman
            playSound={playSound}
            onScore={(s) => handleUpdateHighScore('pacman', s)}
          />
        )}
        {activeGame === 'tetris' && (
          <EmbeddedTetris
            playSound={playSound}
            onScore={(s) => handleUpdateHighScore('tetris', s)}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#6e6b63] pt-1">
        <span>Desktop: Arrow Keys / WASD</span>
        <span className="text-[#16a34a] font-semibold">● Live Playable</span>
      </div>

    </div>
  );
};

/* =========================================================================
   EMBEDDED SNAKE GAME
   ========================================================================= */
const EmbeddedSnake: React.FC<{
  playSound: (type: 'eat' | 'power' | 'die' | 'start') => void;
  onScore: (score: number) => void;
}> = ({ playSound, onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const GRID = 16;
  const CELL = 17; // 272 x 272

  const snakeRef = useRef([
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 8, y: 10 }
  ]);
  const dirRef = useRef({ x: 0, y: -1 });
  const nextDirRef = useRef({ x: 0, y: -1 });
  const foodRef = useRef({ x: 4, y: 4, isStar: false });
  const scoreRef = useRef(0);

  const spawnFood = () => {
    const x = Math.floor(Math.random() * GRID);
    const y = Math.floor(Math.random() * GRID);
    foodRef.current = { x, y, isStar: Math.random() < 0.25 };
  };

  const startGame = () => {
    snakeRef.current = [
      { x: 8, y: 8 },
      { x: 8, y: 9 },
      { x: 8, y: 10 }
    ];
    dirRef.current = { x: 0, y: -1 };
    nextDirRef.current = { x: 0, y: -1 };
    scoreRef.current = 0;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    spawnFood();
    playSound('start');
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { key } = e;
      const cur = dirRef.current;
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(key)) {
        if (cur.y === 0) { nextDirRef.current = { x: 0, y: -1 }; e.preventDefault(); }
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(key)) {
        if (cur.y === 0) { nextDirRef.current = { x: 0, y: 1 }; e.preventDefault(); }
      } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(key)) {
        if (cur.x === 0) { nextDirRef.current = { x: -1, y: 0 }; e.preventDefault(); }
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(key)) {
        if (cur.x === 0) { nextDirRef.current = { x: 1, y: 0 }; e.preventDefault(); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      const snake = snakeRef.current;
      const head = { ...snake[0] };
      const nextDir = nextDirRef.current;
      dirRef.current = nextDir;

      head.x += nextDir.x;
      head.y += nextDir.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
        setIsGameOver(true);
        playSound('die');
        onScore(scoreRef.current);
        return;
      }

      // Self collision
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          setIsGameOver(true);
          playSound('die');
          onScore(scoreRef.current);
          return;
        }
      }

      snake.unshift(head);

      const food = foodRef.current;
      if (head.x === food.x && head.y === food.y) {
        scoreRef.current += food.isStar ? 30 : 10;
        setScore(scoreRef.current);
        playSound(food.isStar ? 'power' : 'eat');
        spawnFood();
        // Prevent snake from growing very big: cap length at max 5 segments
        if (snake.length > 5) {
          snake.pop();
        }
      } else {
        snake.pop();
      }

      renderCanvas();
    }, 125);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(canvas.width, i * CELL);
      ctx.stroke();
    }

    // Food
    const food = foodRef.current;
    if (food.isStar) {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Snake
    snakeRef.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#161514' : i % 2 === 0 ? '#383633' : '#52504b';
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  };

  const handleMobileInput = (dx: number, dy: number) => {
    if (!isPlaying) {
      startGame();
      return;
    }
    const cur = dirRef.current;
    if (dx !== 0 && cur.x === 0) nextDirRef.current = { x: dx, y: 0 };
    else if (dy !== 0 && cur.y === 0) nextDirRef.current = { x: 0, y: dy };
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <div className="flex items-center justify-between w-full px-1 text-[11px] font-mono">
        <span className="font-bold text-[#161514]">Score: {score}</span>
        <span className="text-[#6e6b63]">🐍 Snake Active</span>
      </div>

      <div className="relative rounded-lg border border-[#161514] bg-[#ffffff] overflow-hidden">
        <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} className="block" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-[#ffffff]/92 backdrop-blur-2xs flex flex-col items-center justify-center gap-2 text-center p-3">
            <span className="font-mono font-bold text-sm text-[#161514]">
              {isGameOver ? 'SNAKE CRASHED' : '🐍 CYBER SNAKE'}
            </span>
            <span className="text-[10px] font-mono text-[#6e6b63]">
              {isGameOver ? `Score: ${score}` : 'Eat commits & stars'}
            </span>
            <button
              onClick={startGame}
              className="mt-1 px-3 py-1.5 rounded-lg bg-[#161514] hover:bg-[#333] text-white text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isGameOver ? 'Play Again' : 'Start Play'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mini Touch D-pad */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <button
          onClick={() => handleMobileInput(0, -1)}
          className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <div className="flex gap-1.5">
          <button
            onClick={() => handleMobileInput(-1, 0)}
            className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleMobileInput(0, 1)}
            className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleMobileInput(1, 0)}
            className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   EMBEDDED PAC-MAN GAME
   ========================================================================= */
const EmbeddedPacman: React.FC<{
  playSound: (type: 'eat' | 'power' | 'die' | 'start') => void;
  onScore: (score: number) => void;
}> = ({ playSound, onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const COLS = 15;
  const ROWS = 15;
  const CELL = 18; // 270 x 270

  const initialMaze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,1,1,1,0,0,0,0,2,1],
    [1,0,1,1,0,0,0,0,0,0,1,1,0,0,1],
    [1,0,1,1,0,1,1,0,1,0,1,1,0,1,1],
    [1,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,0,1,0,0,3,3,0,0,1,0,1,1,1],
    [3,1,0,1,1,0,3,3,0,1,1,0,1,3,3],
    [1,1,0,0,0,0,1,1,0,0,0,0,1,1,1],
    [3,1,0,1,1,0,0,0,0,1,1,0,1,3,3],
    [1,1,0,1,0,0,3,3,0,0,1,0,1,1,1],
    [1,0,0,0,0,1,1,1,1,0,0,0,0,0,1],
    [1,0,1,1,0,0,0,0,0,0,1,1,0,1,1],
    [1,0,0,1,0,1,1,0,1,0,1,0,0,0,1],
    [1,2,0,0,0,0,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  const mazeRef = useRef<number[][]>(JSON.parse(JSON.stringify(initialMaze)));
  const pacRef = useRef({ x: 7, y: 11, dx: 0, dy: 0, mouth: 0.2, mouthDir: 0.05 });
  const ghostsRef = useRef([
    { x: 7, y: 5, dx: 1, dy: 0, color: '#ef4444', scared: 0 },
    { x: 6, y: 6, dx: -1, dy: 0, color: '#06b6d4', scared: 0 }
  ]);
  const scoreRef = useRef(0);

  const startPacman = () => {
    mazeRef.current = JSON.parse(JSON.stringify(initialMaze));
    pacRef.current = { x: 7, y: 11, dx: 0, dy: 0, mouth: 0.2, mouthDir: 0.05 };
    ghostsRef.current = [
      { x: 7, y: 5, dx: 1, dy: 0, color: '#ef4444', scared: 0 },
      { x: 6, y: 6, dx: -1, dy: 0, color: '#06b6d4', scared: 0 }
    ];
    scoreRef.current = 0;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    playSound('start');
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { key } = e;
      const pac = pacRef.current;
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(key)) {
        pac.dx = 0; pac.dy = -1; e.preventDefault();
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(key)) {
        pac.dx = 0; pac.dy = 1; e.preventDefault();
      } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(key)) {
        pac.dx = -1; pac.dy = 0; e.preventDefault();
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(key)) {
        pac.dx = 1; pac.dy = 0; e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      const pac = pacRef.current;
      const map = mazeRef.current;

      let nx = pac.x + pac.dx;
      let ny = pac.y + pac.dy;

      if (nx < 0) nx = COLS - 1;
      if (nx >= COLS) nx = 0;

      if (map[ny] && map[ny][nx] !== 1) {
        pac.x = nx;
        pac.y = ny;

        if (map[ny][nx] === 0) {
          map[ny][nx] = 3;
          scoreRef.current += 10;
          setScore(scoreRef.current);
          playSound('eat');
        } else if (map[ny][nx] === 2) {
          map[ny][nx] = 3;
          scoreRef.current += 50;
          setScore(scoreRef.current);
          playSound('power');
          ghostsRef.current.forEach(g => g.scared = 30);
        }
      }

      pac.mouth += pac.mouthDir;
      if (pac.mouth > 0.45 || pac.mouth < 0.05) pac.mouthDir = -pac.mouthDir;

      // Ghosts
      const dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
      ghostsRef.current.forEach((g) => {
        if (g.scared > 0) g.scared--;
        const valid = dirs.filter(d => map[g.y + d.dy] && map[g.y + d.dy][g.x + d.dx] !== 1);
        if (valid.length > 0) {
          const c = valid[Math.floor(Math.random() * valid.length)];
          g.dx = c.dx; g.dy = c.dy;
        }
        g.x += g.dx;
        g.y += g.dy;

        if (g.x === pac.x && g.y === pac.y) {
          if (g.scared > 0) {
            scoreRef.current += 150;
            setScore(scoreRef.current);
            playSound('power');
            g.x = 7; g.y = 5; g.scared = 0;
          } else {
            setIsGameOver(true);
            playSound('die');
            onScore(scoreRef.current);
          }
        }
      });

      render();
    }, 140);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const map = mazeRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = map[r][c];
        const px = c * CELL;
        const py = r * CELL;
        if (v === 1) {
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(px, py, CELL, CELL);
          ctx.strokeStyle = '#3b82f6';
          ctx.strokeRect(px + 1, py + 1, CELL - 2, CELL - 2);
        } else if (v === 0) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(px + CELL / 2, py + CELL / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (v === 2) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px + CELL / 2, py + CELL / 2, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Pacman
    const pac = pacRef.current;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    let ang = 0;
    if (pac.dx === 1) ang = 0;
    else if (pac.dx === -1) ang = Math.PI;
    else if (pac.dy === 1) ang = Math.PI / 2;
    else if (pac.dy === -1) ang = -Math.PI / 2;
    ctx.arc(pac.x * CELL + CELL / 2, pac.y * CELL + CELL / 2, CELL / 2 - 1, ang + pac.mouth * Math.PI, ang + (2 - pac.mouth) * Math.PI);
    ctx.lineTo(pac.x * CELL + CELL / 2, pac.y * CELL + CELL / 2);
    ctx.fill();

    // Ghosts
    ghostsRef.current.forEach(g => {
      ctx.fillStyle = g.scared > 0 ? '#3b82f6' : g.color;
      ctx.fillRect(g.x * CELL + 2, g.y * CELL + 2, CELL - 4, CELL - 4);
    });
  };

  const handleMobileInput = (dx: number, dy: number) => {
    if (!isPlaying) {
      startPacman();
      return;
    }
    pacRef.current.dx = dx;
    pacRef.current.dy = dy;
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <div className="flex items-center justify-between w-full px-1 text-[11px] font-mono">
        <span className="font-bold text-[#161514]">Score: {score}</span>
        <span className="text-[#6e6b63]">🟡 Pac-Man Active</span>
      </div>

      <div className="relative rounded-lg border border-[#161514] bg-[#0a0a0a] overflow-hidden">
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="block" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-[#0a0a0a]/92 flex flex-col items-center justify-center gap-2 text-center p-3">
            <span className="font-mono font-bold text-sm text-[#facc15]">
              {isGameOver ? 'PAC-MAN CAUGHT' : '🟡 DEV PAC-MAN'}
            </span>
            <span className="text-[10px] font-mono text-[#d5d1c5]">
              {isGameOver ? `Final Score: ${score}` : 'Chomp dots & avoid ghosts'}
            </span>
            <button
              onClick={startPacman}
              className="mt-1 px-3 py-1.5 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-[#161514] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isGameOver ? 'Play Again' : 'Start Pac-Man'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mini Touch D-pad */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <button
          onClick={() => handleMobileInput(0, -1)}
          className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <div className="flex gap-1.5">
          <button
            onClick={() => handleMobileInput(-1, 0)}
            className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleMobileInput(0, 1)}
            className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleMobileInput(1, 0)}
            className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   EMBEDDED TETRIS (BLOCK GAME)
   ========================================================================= */
const EmbeddedTetris: React.FC<{
  playSound: (type: 'eat' | 'power' | 'die' | 'start' | 'line') => void;
  onScore: (score: number) => void;
}> = ({ playSound, onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const COLS = 10;
  const ROWS = 16;
  const CELL = 17; // 170 x 272

  const TETROS = [
    { shape: [[1,1,1,1]], color: '#06b6d4' }, // I Cyan
    { shape: [[1,1],[1,1]], color: '#facc15' }, // O Yellow
    { shape: [[0,1,0],[1,1,1]], color: '#a855f7' }, // T Purple
    { shape: [[1,0,0],[1,1,1]], color: '#3b82f6' }, // J Blue
    { shape: [[0,0,1],[1,1,1]], color: '#f97316' }, // L Orange
    { shape: [[0,1,1],[1,1,0]], color: '#22c55e' }, // S Green
    { shape: [[1,1,0],[0,1,1]], color: '#ef4444' }  // Z Red
  ];

  const boardRef = useRef<string[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
  const currentRef = useRef({
    shape: TETROS[0].shape,
    color: TETROS[0].color,
    x: 3,
    y: 0
  });
  const scoreRef = useRef(0);

  const spawnTetro = () => {
    const t = TETROS[Math.floor(Math.random() * TETROS.length)];
    currentRef.current = {
      shape: t.shape,
      color: t.color,
      x: 3,
      y: 0
    };
    // If collision on spawn => game over
    if (checkCollision(3, 0, t.shape)) {
      setIsGameOver(true);
      playSound('die');
      onScore(scoreRef.current);
    }
  };

  const checkCollision = (cx: number, cy: number, shape: number[][]) => {
    const board = boardRef.current;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 1) {
          const nx = cx + c;
          const ny = cy + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
          if (ny >= 0 && board[ny][nx] !== '') return true;
        }
      }
    }
    return false;
  };

  const rotateShape = (shape: number[][]) => {
    const rotated = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
    return rotated;
  };

  const startTetris = () => {
    boardRef.current = Array(ROWS).fill(null).map(() => Array(COLS).fill(''));
    scoreRef.current = 0;
    setScore(0);
    setLines(0);
    setIsGameOver(false);
    setIsPlaying(true);
    spawnTetro();
    playSound('start');
  };

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { key } = e;
      const cur = currentRef.current;
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(key)) {
        if (!checkCollision(cur.x - 1, cur.y, cur.shape)) cur.x--;
        e.preventDefault();
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(key)) {
        if (!checkCollision(cur.x + 1, cur.y, cur.shape)) cur.x++;
        e.preventDefault();
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(key)) {
        if (!checkCollision(cur.x, cur.y + 1, cur.shape)) cur.y++;
        e.preventDefault();
      } else if (['ArrowUp', 'KeyW', 'w', 'W'].includes(key)) {
        const rot = rotateShape(cur.shape);
        if (!checkCollision(cur.x, cur.y, rot)) cur.shape = rot;
        e.preventDefault();
      }
      render();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Tick loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      const cur = currentRef.current;
      if (!checkCollision(cur.x, cur.y + 1, cur.shape)) {
        cur.y++;
      } else {
        // Lock shape to board
        const board = boardRef.current;
        for (let r = 0; r < cur.shape.length; r++) {
          for (let c = 0; c < cur.shape[r].length; c++) {
            if (cur.shape[r][c] === 1) {
              if (cur.y + r >= 0 && cur.y + r < ROWS) {
                board[cur.y + r][cur.x + c] = cur.color;
              }
            }
          }
        }

        // Clear full lines
        let cleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
          if (board[r].every(cell => cell !== '')) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(''));
            cleared++;
            r++; // re-check row
          }
        }

        if (cleared > 0) {
          playSound('line');
          setLines(l => l + cleared);
          scoreRef.current += cleared * 100;
          setScore(scoreRef.current);
        } else {
          playSound('eat');
        }

        spawnTetro();
      }
      render();
    }, 450);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#161514';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Board grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    for (let c = 0; c < COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, canvas.height);
      ctx.stroke();
    }
    for (let r = 0; r < ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(canvas.width, r * CELL);
      ctx.stroke();
    }

    // Locked pieces
    const board = boardRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] !== '') {
          ctx.fillStyle = board[r][c];
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    }

    // Current piece
    const cur = currentRef.current;
    ctx.fillStyle = cur.color;
    for (let r = 0; r < cur.shape.length; r++) {
      for (let c = 0; c < cur.shape[r].length; c++) {
        if (cur.shape[r][c] === 1) {
          ctx.fillRect((cur.x + c) * CELL + 1, (cur.y + r) * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    }
  };

  const handleMobileMove = (action: 'left' | 'right' | 'down' | 'rotate') => {
    if (!isPlaying) {
      startTetris();
      return;
    }
    const cur = currentRef.current;
    if (action === 'left' && !checkCollision(cur.x - 1, cur.y, cur.shape)) cur.x--;
    else if (action === 'right' && !checkCollision(cur.x + 1, cur.y, cur.shape)) cur.x++;
    else if (action === 'down' && !checkCollision(cur.x, cur.y + 1, cur.shape)) cur.y++;
    else if (action === 'rotate') {
      const rot = rotateShape(cur.shape);
      if (!checkCollision(cur.x, cur.y, rot)) cur.shape = rot;
    }
    render();
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <div className="flex items-center justify-between w-full px-1 text-[11px] font-mono">
        <span className="font-bold text-[#161514]">Score: {score}</span>
        <span className="text-[#6e6b63]">Lines: {lines}</span>
      </div>

      <div className="relative rounded-lg border border-[#161514] bg-[#161514] overflow-hidden">
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="block" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-[#161514]/92 flex flex-col items-center justify-center gap-2 text-center p-3">
            <span className="font-mono font-bold text-sm text-[#06b6d4]">
              {isGameOver ? 'STACK OVERFLOW' : '🧱 TETRIS BLOCK GAME'}
            </span>
            <span className="text-[10px] font-mono text-[#d5d1c5]">
              {isGameOver ? `Score: ${score}` : 'Rotate & clear full lines'}
            </span>
            <button
              onClick={startTetris}
              className="mt-1 px-3 py-1.5 rounded-lg bg-[#06b6d4] hover:bg-[#0891b2] text-[#161514] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isGameOver ? 'Play Again' : 'Drop Blocks'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mini Touch D-pad for Tetris */}
      <div className="flex items-center gap-1.5 mt-1">
        <button
          onClick={() => handleMobileMove('left')}
          className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleMobileMove('rotate')}
          className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
          title="Rotate"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleMobileMove('down')}
          className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleMobileMove('right')}
          className="w-8 h-7 rounded bg-[#ffffff] border border-[#d5d1c5] active:bg-[#e6e3da] flex items-center justify-center text-[#161514]"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
