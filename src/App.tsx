import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="w-full h-screen bg-black text-[#0ff] font-vt323 overflow-hidden flex flex-col relative crt-flicker">
      <div className="scanlines"></div>
      <div className="bg-noise"></div>
      
      {/* Top Navigation / Header */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 border-b-4 border-[#f0f] bg-black flex-shrink-0 shadow-[0_4px_20px_rgba(255,0,255,0.3)]">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-2xl sm:text-4xl font-bold tracking-widest text-[#f0f] glitch-text" data-text="SERPENT_PROTOCOL_v1.0">
            SERPENT_PROTOCOL_v1.0
          </div>
        </div>
        <div className="hidden sm:flex gap-8 text-xl opacity-90">
          <div className="flex flex-col items-end">
             <span className="text-[#f0f]">UPLINK:</span>
             <span className="animate-pulse text-[#0ff]">ESTABLISHED</span>
          </div>
          <div className="flex flex-col items-end border-l-4 border-[#0ff] pl-4">
             <span className="text-[#f0f]">SYS_STATUS:</span>
             <span className="text-black bg-[#0ff] px-2 font-bold animate-pulse">DEGRADED</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto w-full p-4 sm:p-8 flex items-center justify-center pb-40">
        <SnakeGame />
      </main>

      <MusicPlayer />
    </div>
  );
}
