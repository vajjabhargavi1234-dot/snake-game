import { useState, useEffect, useRef, useCallback } from 'react';

type Point = { x: number; y: number };
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const [gameState, setGameState] = useState({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    score: 0,
    gameOver: false
  });
  const [highScore, setHighScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const dirRef = useRef(INITIAL_DIRECTION);
  const lastMoveDirRef = useRef(INITIAL_DIRECTION);

  // Effect for high score
  useEffect(() => {
    if (gameState.score > highScore) setHighScore(gameState.score);
  }, [gameState.score, highScore]);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      },
      score: 0,
      gameOver: false
    });
    dirRef.current = INITIAL_DIRECTION;
    lastMoveDirRef.current = INITIAL_DIRECTION;
    setIsStarted(false);
    setIsPaused(false);
  };

  const gameTick = useCallback(() => {
    if (!isStarted || isPaused) return;

    setGameState(prevState => {
      if (prevState.gameOver) return prevState;

      const { snake, food, score } = prevState;
      const head = snake[0];
      const dir = dirRef.current;
      lastMoveDirRef.current = dir;

      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        return { ...prevState, gameOver: true };
      }

      // Self collision
      if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        return { ...prevState, gameOver: true };
      }

      const newSnake = [newHead, ...snake];
      let newFood = food;
      let newScore = score;

      if (newHead.x === food.x && newHead.y === food.y) {
        newScore += Math.floor(10 * Math.max(1, snake.length / 5));
        while (true) {
          const nx = Math.floor(Math.random() * GRID_SIZE);
          const ny = Math.floor(Math.random() * GRID_SIZE);
          if (!newSnake.some(s => s.x === nx && s.y === ny)) {
            newFood = { x: nx, y: ny };
            break;
          }
        }
      } else {
        newSnake.pop();
      }

      return { ...prevState, snake: newSnake, food: newFood, score: newScore };
    });
  }, [isStarted, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState.gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      const k = e.key.toLowerCase();
      const startKeys = ['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'];
      
      if (!isStarted && startKeys.includes(k)) {
        setIsStarted(true);
      }

      if (k === ' ' || k === 'p') {
        if (isStarted) setIsPaused(p => !p);
      }

      const lastDir = lastMoveDirRef.current;
      if ((k === 'arrowup' || k === 'w') && lastDir.y !== 1) dirRef.current = { x: 0, y: -1 };
      if ((k === 'arrowdown' || k === 's') && lastDir.y !== -1) dirRef.current = { x: 0, y: 1 };
      if ((k === 'arrowleft' || k === 'a') && lastDir.x !== 1) dirRef.current = { x: -1, y: 0 };
      if ((k === 'arrowright' || k === 'd') && lastDir.x !== -1) dirRef.current = { x: 1, y: 0 };
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, gameState.gameOver]);

  useEffect(() => {
    const speed = Math.max(50, BASE_SPEED - Math.floor(gameState.score / 100) * 10);
    const interval = setInterval(gameTick, speed);
    return () => clearInterval(interval);
  }, [gameTick, gameState.score]);

  return (
    <div className="flex flex-col items-center w-full min-w-[320px] max-w-[500px] font-vt323 crt-flicker">
      {/* Header Stats */}
      <div className="flex gap-4 sm:gap-6 justify-between w-full mb-6">
        <div className="flex-1 p-4 sm:p-6 bg-black border-2 border-[#0ff] shadow-[inset_0_0_20px_rgba(0,255,255,0.2),0_0_15px_rgba(0,255,255,0.4)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#0ff] opacity-50 crt-flicker pointer-events-none"></div>
          <h2 className="text-sm uppercase tracking-widest mb-2 sm:mb-4 text-[#0ff] font-bold glitch-text" data-text="CURRENT_YIELD">CURRENT_YIELD</h2>
          <div className="flex justify-between items-end">
            <span className="text-xl text-[#f0f]">UNITS</span>
            <span className="text-4xl sm:text-5xl font-bold leading-none text-white drop-shadow-[0_0_10px_#f0f] animate-pulse">{gameState.score}</span>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6 bg-black border-2 border-[#f0f] shadow-[inset_0_0_20px_rgba(255,0,255,0.2),0_0_15px_rgba(255,0,255,0.4)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#f0f] opacity-50 crt-flicker pointer-events-none"></div>
          <h2 className="text-sm uppercase tracking-widest mb-2 sm:mb-4 text-[#f0f] font-bold glitch-text" data-text="MAXIMUM_YIELD">MAXIMUM_YIELD</h2>
          <div className="flex justify-between items-end">
            <span className="text-xl text-[#0ff]">UNITS</span>
            <span className="text-3xl font-bold leading-none text-white drop-shadow-[0_0_8px_#0ff]">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative w-full aspect-square max-h-[500px] border-4 border-[#0ff] bg-black shadow-[0_0_30px_rgba(0,255,255,0.3)] outline-none overflow-hidden"
        tabIndex={0}
      >
         <div className="absolute top-2 left-2 text-sm uppercase font-bold tracking-widest text-[#f0f] z-20 pointer-events-none crt-flicker">SIMULATION_AREA_04</div>
         
         <div className="w-full h-full relative">
           {/* Terminal Grid Lines */}
           <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)', backgroundSize: '5% 5%' }}></div>

           <div 
             className="absolute inset-0 grid z-10 p-1"
             style={{
               gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
               gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
             }}
           >
             {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
               const x = i % GRID_SIZE;
               const y = Math.floor(i / GRID_SIZE);
               const indexInSnake = gameState.snake.findIndex(s => s.x === x && s.y === y);
               const isSnake = indexInSnake !== -1;
               const isHead = indexInSnake === 0;
               const isFood = gameState.food.x === x && gameState.food.y === y;

               return (
                 <div key={i} className="w-full h-full flex items-center justify-center relative">
                   {isHead && (
                     <div className="w-[95%] h-[95%] bg-white border-2 border-[#0ff] shadow-[0_0_15px_#0ff] relative z-20 crt-flicker">
                       {/* Snake Head Eyes */}
                       <div className="absolute top-[20%] left-[20%] w-[20%] h-[20%] bg-black"></div>
                       <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-black"></div>
                     </div>
                   )}
                   {!isHead && isSnake && (
                     <div 
                        className="w-[90%] h-[90%] bg-transparent border-2 border-[#0ff] shadow-[inset_0_0_10px_#0ff] z-10"
                        style={{ opacity: Math.max(0.3, 1 - indexInSnake * 0.05) }}
                     />
                   )}
                   {isFood && (
                     <div className="w-[80%] h-[80%] bg-transparent border-2 border-[#f0f] shadow-[inset_0_0_15px_#f0f,0_0_10px_#f0f] animate-pulse z-0 rotate-45" />
                   )}
                 </div>
               );
             })}
           </div>
         </div>

         {/* Overlays */}
         {!isStarted && !gameState.gameOver && (
           <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 z-30 border-4 border-[#f0f] m-2 crt-flicker">
             <h2 className="text-[#f0f] text-4xl font-bold tracking-widest uppercase mb-4 drop-shadow-[0_0_10px_#f0f] glitch-text" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
             <p className="text-[#0ff] text-xl font-vt323 tracking-widest uppercase animate-pulse">CLICK_TO_INITIALIZE_OVERRIDE</p>
             <p className="text-white text-lg mt-4">[ USE_WASD_OR_ARROWS ]</p>
           </div>
         )}

         {isPaused && isStarted && !gameState.gameOver && (
           <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 border-4 border-[#ff0] m-2">
             <h2 className="text-[#ff0] text-5xl font-bold tracking-widest drop-shadow-[0_0_15px_#ff0] glitch-text" data-text="SYSTEM_PAUSED">SYSTEM_PAUSED</h2>
           </div>
         )}

         {gameState.gameOver && (
           <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-6 z-30 border-4 border-red-600 m-2">
             <div className="scanlines"></div>
             <h2 className="text-red-500 text-5xl font-black tracking-widest mb-2 drop-shadow-[0_0_20px_red] glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
             <p className="text-[#0ff] text-2xl mb-8 font-vt323 tracking-widest">FINAL_YIELD // {gameState.score}</p>
             <button 
               onClick={resetGame}
               className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-bold shadow-[0_0_15px_red,inset_0_0_10px_red] transition-all uppercase tracking-widest cursor-pointer text-2xl"
             >
               REBOOT_SIMULATION
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
