import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Grid Runner', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Midnight Overdrive', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Cybernetic Dreams', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [currentTrack, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTo = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTo;
      setProgress(Number(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '00:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full z-20 h-auto sm:h-24 bg-black border-t-4 border-[#0ff] flex flex-col sm:flex-row flex-wrap sm:flex-nowrap items-center px-4 sm:px-10 py-4 sm:py-0 gap-6 sm:gap-12 mt-auto shadow-[0_-4px_20px_rgba(0,255,255,0.2)] font-vt323">
      {/* Now Playing */}
      <div className="flex items-center gap-4 min-w-[240px] w-full sm:w-auto justify-center sm:justify-start">
        <div className="w-12 h-12 bg-black border-2 border-[#f0f] shadow-[0_0_10px_#f0f] flex items-center justify-center flex-shrink-0 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-[#f0f] opacity-20 crt-flicker"></div>
          <Music className="w-6 h-6 text-[#0ff]" />
        </div>
        <div className="text-left flex flex-col">
          <p className="text-xl font-bold text-[#f0f] truncate max-w-[150px] sm:max-w-xs uppercase glitch-text" data-text={TRACKS[currentTrack].title}>
            {TRACKS[currentTrack].title}
          </p>
          <p className="text-sm text-[#0ff] tracking-widest uppercase">AUDIO_STREAM_ACTIVE</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col gap-2 w-full max-w-2xl mx-auto">
        <div className="flex justify-center items-center gap-10">
          <button onClick={handlePrev} className="text-[#0ff] hover:text-[#f0f] hover:scale-110 transition-all drop-shadow-[0_0_5px_#0ff] hover:drop-shadow-[0_0_8px_#f0f]">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button onClick={togglePlay} className="w-12 h-12 border-2 border-[#0ff] bg-black text-[#0ff] flex items-center justify-center hover:bg-[#0ff] hover:text-black transition-colors flex-shrink-0 shadow-[0_0_10px_#0ff]">
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <button onClick={handleNext} className="text-[#0ff] hover:text-[#f0f] hover:scale-110 transition-all drop-shadow-[0_0_5px_#0ff] hover:drop-shadow-[0_0_8px_#f0f]">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
        <div className="flex items-center gap-4 w-full">
          <span className="text-lg text-[#f0f] min-w-[45px] text-right">
            {formatTime((progress / 100) * (audioRef.current?.duration || 0))}
          </span>
          <div className="flex-1 h-3 bg-gray-900 border border-[#444] rounded-none relative group flex items-center overflow-hidden">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Retro progress dashes */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="absolute top-0 left-0 h-full bg-[#f0f] shadow-[0_0_10px_#f0f] pointer-events-none transition-all duration-75" style={{ width: `${progress}%` }}></div>
            <div className="absolute w-2 h-5 bg-[#0ff] pointer-events-none shadow-[0_0_8px_#0ff]" style={{ left: `calc(${progress}% - 4px)` }}></div>
          </div>
          <span className="text-lg text-[#0ff] min-w-[45px]">
            {formatTime(audioRef.current?.duration || 0)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="items-center gap-4 min-w-[150px] justify-end hidden md:flex">
         <Volume2 className="w-5 h-5 text-[#f0f] flex-shrink-0 drop-shadow-[0_0_5px_#f0f]" />
         <div className="w-24 h-3 bg-gray-900 border border-[#444] relative flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
           <div className="absolute top-0 left-0 h-full bg-[#0ff] shadow-[0_0_10px_#0ff] pointer-events-none transition-all duration-75" style={{ width: `${volume * 100}%` }}></div>
         </div>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
    </footer>
  );
}
