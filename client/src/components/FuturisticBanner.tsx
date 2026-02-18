import { useEffect, useState } from "react";

export function FuturisticBanner() {
  const [scanProgress, setScanProgress] = useState(0);
  const [activeGrid, setActiveGrid] = useState(0);

  useEffect(() => {
    // Scanning animation
    const scanInterval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    // Grid rotation
    const gridInterval = setInterval(() => {
      setActiveGrid((prev) => (prev + 1) % 4);
    }, 2000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(gridInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-slate-950 via-blue-950/30 to-slate-950 overflow-hidden border-t border-cyan-500/30">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, 0.2) 25%, rgba(6, 182, 212, 0.2) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.2) 75%, rgba(6, 182, 212, 0.2) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.2) 25%, rgba(6, 182, 212, 0.2) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.2) 75%, rgba(6, 182, 212, 0.2) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Scanning line effect */}
      <div 
        className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.8)]"
        style={{
          left: `${scanProgress}%`,
          transition: 'left 0.05s linear'
        }}
      />

      {/* Holographic panels */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        {/* Left panel - System status */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            <span className="text-xs font-mono text-cyan-300 tracking-wider">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
            <span className="text-xs font-mono text-cyan-300 tracking-wider">AUTOMATION READY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
            <span className="text-xs font-mono text-cyan-300 tracking-wider">NEURAL LINK ACTIVE</span>
          </div>
        </div>

        {/* Center - Tech readout */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-mono tracking-widest animate-pulse">
            QA AUTOMATION
          </div>
          <div className="flex gap-4 text-xs font-mono text-cyan-400/70">
            <span>v2.1.9</span>
            <span>|</span>
            <span>PROTOCOL: ACTIVE</span>
            <span>|</span>
            <span>GRID: {activeGrid + 1}/4</span>
          </div>
        </div>

        {/* Right panel - Metrics */}
        <div className="flex flex-col gap-2 items-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-300 tracking-wider">EFFICIENCY</span>
            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" style={{ width: '87%' }} />
            </div>
            <span className="text-xs font-mono text-green-400">87%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-300 tracking-wider">POWER</span>
            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" style={{ width: '92%' }} />
            </div>
            <span className="text-xs font-mono text-blue-400">92%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-300 tracking-wider">UPTIME</span>
            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: '99%' }} />
            </div>
            <span className="text-xs font-mono text-purple-400">99%</span>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${(i * 8.33)}%`,
              top: `${20 + (i % 3) * 20}%`,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Hexagon pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
