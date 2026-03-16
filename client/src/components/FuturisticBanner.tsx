import { useEffect, useRef, useState } from "react";

export function FuturisticBanner() {
  const [gallifreyanRotation, setGallifreyanRotation] = useState(0);
  const [energyPulse, setEnergyPulse] = useState(0);
  const [timeRotorPhase, setTimeRotorPhase] = useState(0);

  // KITT scanner state
  const [kittPos, setKittPos] = useState(0);       // 0–100 % of banner width
  const kittDir = useRef(1);                        // 1 = right, -1 = left
  const kittSpeed = 0.6;                            // % per frame

  useEffect(() => {
    const gallifreyanInterval = setInterval(() => {
      setGallifreyanRotation((prev) => (prev + 0.5) % 360);
    }, 50);

    const pulseInterval = setInterval(() => {
      setEnergyPulse((prev) => (prev + 1) % 100);
    }, 40);

    const rotorInterval = setInterval(() => {
      setTimeRotorPhase((prev) => (prev + 1) % 360);
    }, 30);

    // KITT scanner – bounce between 5 % and 95 %
    const kittInterval = setInterval(() => {
      setKittPos((prev) => {
        let next = prev + kittDir.current * kittSpeed;
        if (next >= 95) { next = 95; kittDir.current = -1; }
        if (next <= 5)  { next = 5;  kittDir.current =  1; }
        return next;
      });
    }, 16); // ~60 fps

    return () => {
      clearInterval(gallifreyanInterval);
      clearInterval(pulseInterval);
      clearInterval(rotorInterval);
      clearInterval(kittInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-amber-950/40 overflow-hidden border-t-2 border-amber-600/40">

      {/* Hexagonal console pattern background */}
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l20 11.55v23.09L40 46.18 20 34.64V11.55z' fill='none' stroke='%23d97706' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px'
      }} />

      {/* Ambient glow overlays */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(217, 119, 6, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 50%, rgba(217, 119, 6, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.2) 0%, transparent 40%)`,
      }} />

      {/* ── KITT SCANNER ──────────────────────────────────────────────── */}
      {/* Outer wide soft halo */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: `${kittPos}%`,
          width: "120px",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse 60px 100% at 50% 50%, rgba(255,80,0,0.18) 0%, transparent 100%)",
          filter: "blur(6px)",
        }}
      />
      {/* Mid glow */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: `${kittPos}%`,
          width: "40px",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse 20px 100% at 50% 50%, rgba(255,100,0,0.55) 0%, transparent 100%)",
          filter: "blur(3px)",
        }}
      />
      {/* Sharp core beam */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: `${kittPos}%`,
          width: "4px",
          transform: "translateX(-50%)",
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,140,0,0.9) 20%, #ff6a00 50%, rgba(255,140,0,0.9) 80%, transparent 100%)",
          boxShadow: "0 0 12px 4px rgba(255,100,0,0.8), 0 0 24px 8px rgba(255,60,0,0.4)",
        }}
      />
      {/* Trailing fade left */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: `${kittPos}%`,
          width: "80px",
          transform: kittDir.current === 1 ? "translateX(-100%)" : "translateX(0%)",
          background: `linear-gradient(to ${kittDir.current === 1 ? "right" : "left"}, transparent 0%, rgba(255,80,0,0.12) 100%)`,
          filter: "blur(2px)",
        }}
      />
      {/* ────────────────────────────────────────────────────────────────── */}

      {/* Time rotor energy column (center) */}
      <div className="absolute left-1/2 top-0 bottom-0 w-16 -translate-x-1/2">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent"
          style={{
            transform: `translateY(${Math.sin(timeRotorPhase * Math.PI / 180) * 20}px)`,
            filter: 'blur(8px)',
            opacity: 0.6 + Math.sin(timeRotorPhase * Math.PI / 180) * 0.4
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-amber-400/20 via-orange-500/40 to-amber-400/20"
          style={{
            transform: `translateY(${-Math.sin(timeRotorPhase * Math.PI / 180) * 15}px) scaleY(${1 + Math.sin(timeRotorPhase * Math.PI / 180) * 0.2})`,
            filter: 'blur(4px)'
          }}
        />
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        {/* Left Gallifreyan symbol */}
        <div className="flex flex-col items-center gap-2">
          <svg width="80" height="80" viewBox="0 0 100 100"
            style={{ transform: `rotate(${gallifreyanRotation}deg)` }}
            className="transition-transform duration-100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(217,119,6)" strokeWidth="1.5" opacity="0.6" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgb(245,158,11)" strokeWidth="1" opacity="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="rgb(217,119,6)" strokeWidth="1.5" opacity="0.7" />
            <path d="M 50 5 A 45 45 0 0 1 95 50" fill="none" stroke="rgb(245,158,11)" strokeWidth="2" opacity="0.4" />
            <path d="M 95 50 A 45 45 0 0 1 50 95" fill="none" stroke="rgb(217,119,6)" strokeWidth="2" opacity="0.4" />
            <path d="M 50 95 A 45 45 0 0 1 5 50" fill="none" stroke="rgb(245,158,11)" strokeWidth="2" opacity="0.4" />
            <path d="M 5 50 A 45 45 0 0 1 50 5" fill="none" stroke="rgb(217,119,6)" strokeWidth="2" opacity="0.4" />
            <circle cx="50" cy="20" r="3" fill="rgb(245,158,11)" opacity="0.8" />
            <circle cx="80" cy="50" r="3" fill="rgb(217,119,6)" opacity="0.8" />
            <circle cx="50" cy="80" r="3" fill="rgb(245,158,11)" opacity="0.8" />
            <circle cx="20" cy="50" r="3" fill="rgb(217,119,6)" opacity="0.8" />
            <circle cx="50" cy="50" r="8" fill="none" stroke="rgb(251,191,36)" strokeWidth="2" opacity="0.9" />
            <circle cx="50" cy="50" r="3" fill="rgb(251,191,36)" opacity="0.9" />
          </svg>
          <div className="text-xs font-mono text-amber-500/70 tracking-widest">TEMPORAL</div>
        </div>

        {/* Center readout */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 font-mono tracking-widest">
            QA AUTOMATION
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500/80">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>TIME VORTEX STABLE</span>
            </div>
            <span className="text-amber-600/50">|</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span>AUTOMATION MATRIX ONLINE</span>
            </div>
          </div>
          <div className="text-xs font-mono text-amber-600/60 mt-1">
            PROTOCOL: GALLIFREYAN v2.1.9
          </div>
        </div>

        {/* Right Gallifreyan symbol */}
        <div className="flex flex-col items-center gap-2">
          <svg width="80" height="80" viewBox="0 0 100 100"
            style={{ transform: `rotate(${-gallifreyanRotation * 0.7}deg)` }}
            className="transition-transform duration-100">
            <path d="M 50 10 L 80 30 L 80 70 L 50 90 L 20 70 L 20 30 Z" fill="none" stroke="rgb(217,119,6)" strokeWidth="1.5" opacity="0.6" />
            <path d="M 50 20 L 70 35 L 70 65 L 50 80 L 30 65 L 30 35 Z" fill="none" stroke="rgb(245,158,11)" strokeWidth="1" opacity="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="rgb(217,119,6)" strokeWidth="1.5" opacity="0.7" />
            <circle cx="50" cy="50" r="8" fill="none" stroke="rgb(251,191,36)" strokeWidth="2" opacity="0.9" />
            <line x1="50" y1="10" x2="50" y2="35" stroke="rgb(245,158,11)" strokeWidth="1" opacity="0.4" />
            <line x1="80" y1="30" x2="65" y2="43" stroke="rgb(245,158,11)" strokeWidth="1" opacity="0.4" />
            <line x1="80" y1="70" x2="65" y2="57" stroke="rgb(245,158,11)" strokeWidth="1" opacity="0.4" />
            <line x1="50" y1="90" x2="50" y2="65" stroke="rgb(245,158,11)" strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="70" x2="35" y2="57" stroke="rgb(245,158,11)" strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="30" x2="35" y2="43" stroke="rgb(245,158,11)" strokeWidth="1" opacity="0.4" />
            <circle cx="50" cy="50" r="4" fill="rgb(251,191,36)" opacity="0.9" />
          </svg>
          <div className="text-xs font-mono text-amber-500/70 tracking-widest">SPATIAL</div>
        </div>
      </div>

      {/* Floating energy particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: i % 2 === 0 ? 'rgb(245,158,11)' : 'rgb(217,119,6)',
              left: `${i * 6.67}%`,
              top: `${30 + (i % 4) * 15}%`,
              opacity: 0.3 + Math.sin((energyPulse + i * 10) * Math.PI / 180) * 0.3,
              animation: `tardisFloat ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
              boxShadow: `0 0 ${4 + (i % 3) * 2}px ${i % 2 === 0 ? 'rgba(245,158,11,0.6)' : 'rgba(217,119,6,0.6)'}`
            }}
          />
        ))}
      </div>

      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500/60 to-transparent" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-amber-500/60 to-transparent" />
      </div>
      <div className="absolute top-2 right-2 w-10 h-10">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-amber-500/60 to-transparent" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-amber-500/60 to-transparent" />
      </div>
      <div className="absolute bottom-2 left-2 w-10 h-10">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-amber-500/60 to-transparent" />
      </div>
      <div className="absolute bottom-2 right-2 w-10 h-10">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-amber-500/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-amber-500/60 to-transparent" />
      </div>

      {/* Pulsing energy rings */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-amber-500/20"
        style={{
          transform: `translate(-50%, -50%) scale(${0.8 + Math.sin(energyPulse * Math.PI / 50) * 0.3})`,
          opacity: 0.3 - Math.sin(energyPulse * Math.PI / 50) * 0.2
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-orange-500/10"
        style={{
          transform: `translate(-50%, -50%) scale(${0.6 + Math.sin((energyPulse + 25) * Math.PI / 50) * 0.4})`,
          opacity: 0.2 - Math.sin((energyPulse + 25) * Math.PI / 50) * 0.15
        }}
      />

      <style>{`
        @keyframes tardisFloat {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25%       { transform: translateY(-15px) translateX(8px) scale(1.1); }
          50%       { transform: translateY(-8px) translateX(-5px) scale(0.9); }
          75%       { transform: translateY(-20px) translateX(12px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
