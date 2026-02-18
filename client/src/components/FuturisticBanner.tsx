import { useEffect, useState } from "react";

export function FuturisticBanner() {
  const [timeRotorPhase, setTimeRotorPhase] = useState(0);
  const [gallifreyanRotation, setGallifreyanRotation] = useState(0);
  const [energyPulse, setEnergyPulse] = useState(0);

  useEffect(() => {
    // Time rotor pulsing animation
    const rotorInterval = setInterval(() => {
      setTimeRotorPhase((prev) => (prev + 1) % 360);
    }, 30);

    // Gallifreyan symbols rotation
    const gallifreyanInterval = setInterval(() => {
      setGallifreyanRotation((prev) => (prev + 0.5) % 360);
    }, 50);

    // Energy pulse effect
    const pulseInterval = setInterval(() => {
      setEnergyPulse((prev) => (prev + 1) % 100);
    }, 40);

    return () => {
      clearInterval(rotorInterval);
      clearInterval(gallifreyanInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-amber-950/40 overflow-hidden border-t-2 border-amber-600/40">
      {/* Hexagonal console pattern background */}
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l20 11.55v23.09L40 46.18 20 34.64V11.55z' fill='none' stroke='%23d97706' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px'
      }} />

      {/* Coral/crystalline structure overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(217, 119, 6, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 50%, rgba(217, 119, 6, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.2) 0%, transparent 40%)`,
      }} />

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

      {/* Main content container */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        {/* Left - Gallifreyan symbols */}
        <div className="flex flex-col items-center gap-2">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 100 100"
            style={{ transform: `rotate(${gallifreyanRotation}deg)` }}
            className="transition-transform duration-100"
          >
            {/* Outer circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(217, 119, 6)" strokeWidth="1.5" opacity="0.6" />
            
            {/* Inner circles - Gallifreyan style */}
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgb(245, 158, 11)" strokeWidth="1" opacity="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="rgb(217, 119, 6)" strokeWidth="1.5" opacity="0.7" />
            
            {/* Decorative arcs */}
            <path d="M 50 5 A 45 45 0 0 1 95 50" fill="none" stroke="rgb(245, 158, 11)" strokeWidth="2" opacity="0.4" />
            <path d="M 95 50 A 45 45 0 0 1 50 95" fill="none" stroke="rgb(217, 119, 6)" strokeWidth="2" opacity="0.4" />
            <path d="M 50 95 A 45 45 0 0 1 5 50" fill="none" stroke="rgb(245, 158, 11)" strokeWidth="2" opacity="0.4" />
            <path d="M 5 50 A 45 45 0 0 1 50 5" fill="none" stroke="rgb(217, 119, 6)" strokeWidth="2" opacity="0.4" />
            
            {/* Inner dots */}
            <circle cx="50" cy="20" r="3" fill="rgb(245, 158, 11)" opacity="0.8" />
            <circle cx="80" cy="50" r="3" fill="rgb(217, 119, 6)" opacity="0.8" />
            <circle cx="50" cy="80" r="3" fill="rgb(245, 158, 11)" opacity="0.8" />
            <circle cx="20" cy="50" r="3" fill="rgb(217, 119, 6)" opacity="0.8" />
            
            {/* Center symbol */}
            <circle cx="50" cy="50" r="8" fill="none" stroke="rgb(251, 191, 36)" strokeWidth="2" opacity="0.9" />
            <circle cx="50" cy="50" r="3" fill="rgb(251, 191, 36)" opacity="0.9" />
          </svg>
          <div className="text-xs font-mono text-amber-500/70 tracking-widest">TEMPORAL</div>
        </div>

        {/* Center - TARDIS console readout */}
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

        {/* Right - Another Gallifreyan symbol (counter-rotating) */}
        <div className="flex flex-col items-center gap-2">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 100 100"
            style={{ transform: `rotate(${-gallifreyanRotation * 0.7}deg)` }}
            className="transition-transform duration-100"
          >
            {/* Hexagonal pattern */}
            <path d="M 50 10 L 80 30 L 80 70 L 50 90 L 20 70 L 20 30 Z" fill="none" stroke="rgb(217, 119, 6)" strokeWidth="1.5" opacity="0.6" />
            <path d="M 50 20 L 70 35 L 70 65 L 50 80 L 30 65 L 30 35 Z" fill="none" stroke="rgb(245, 158, 11)" strokeWidth="1" opacity="0.5" />
            
            {/* Inner circles */}
            <circle cx="50" cy="50" r="15" fill="none" stroke="rgb(217, 119, 6)" strokeWidth="1.5" opacity="0.7" />
            <circle cx="50" cy="50" r="8" fill="none" stroke="rgb(251, 191, 36)" strokeWidth="2" opacity="0.9" />
            
            {/* Connection lines */}
            <line x1="50" y1="10" x2="50" y2="35" stroke="rgb(245, 158, 11)" strokeWidth="1" opacity="0.4" />
            <line x1="80" y1="30" x2="65" y2="43" stroke="rgb(245, 158, 11)" strokeWidth="1" opacity="0.4" />
            <line x1="80" y1="70" x2="65" y2="57" stroke="rgb(245, 158, 11)" strokeWidth="1" opacity="0.4" />
            <line x1="50" y1="90" x2="50" y2="65" stroke="rgb(245, 158, 11)" strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="70" x2="35" y2="57" stroke="rgb(245, 158, 11)" strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="30" x2="35" y2="43" stroke="rgb(245, 158, 11)" strokeWidth="1" opacity="0.4" />
            
            {/* Center glow */}
            <circle cx="50" cy="50" r="4" fill="rgb(251, 191, 36)" opacity="0.9" />
          </svg>
          <div className="text-xs font-mono text-amber-500/70 tracking-widest">SPATIAL</div>
        </div>
      </div>

      {/* Energy particles floating */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: i % 2 === 0 ? 'rgb(245, 158, 11)' : 'rgb(217, 119, 6)',
              left: `${(i * 6.67)}%`,
              top: `${30 + (i % 4) * 15}%`,
              opacity: 0.3 + (Math.sin((energyPulse + i * 10) * Math.PI / 180) * 0.3),
              animation: `tardisFloat ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
              boxShadow: `0 0 ${4 + (i % 3) * 2}px ${i % 2 === 0 ? 'rgba(245, 158, 11, 0.6)' : 'rgba(217, 119, 6, 0.6)'}`
            }}
          />
        ))}
      </div>

      {/* TARDIS console corner brackets */}
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

      {/* Pulsing energy waves */}
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
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1); 
          }
          25% { 
            transform: translateY(-15px) translateX(8px) scale(1.1); 
          }
          50% { 
            transform: translateY(-8px) translateX(-5px) scale(0.9); 
          }
          75% { 
            transform: translateY(-20px) translateX(12px) scale(1.05); 
          }
        }
      `}</style>
    </div>
  );
}
