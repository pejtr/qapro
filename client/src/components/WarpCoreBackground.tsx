import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export function WarpCoreBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      hue: 180 + Math.random() * 40, // Cyan to blue range
    }));

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      timeRef.current += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw warp core plasma waves
      drawWarpCore(ctx, canvas.width, canvas.height, timeRef.current);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with cyan/blue glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 5
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 50%, ${particle.opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 40%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const avgHue = (p1.hue + p2.hue) / 2;
            ctx.strokeStyle = `hsla(${avgHue}, 70%, 50%, ${(1 - distance / 140) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Warp core plasma drawing function
  const drawWarpCore = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const layers = 4;
    
    for (let layer = 0; layer < layers; layer++) {
      ctx.beginPath();
      
      const yOffset = height * 0.4 + layer * 60;
      const amplitude = 50 + layer * 15;
      const frequency = 0.004 - layer * 0.0006;
      const speed = 1.2 + layer * 0.4;
      
      // Create wavy plasma path
      for (let x = 0; x <= width; x += 4) {
        const y = yOffset + 
          Math.sin(x * frequency + time * speed) * amplitude +
          Math.sin(x * frequency * 2.5 - time * speed * 0.8) * (amplitude * 0.4) +
          Math.cos(x * frequency * 0.7 + time * speed * 0.6) * (amplitude * 0.25);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Complete the path
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      // Create gradient for warp core plasma colors
      const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude * 2);
      
      // Cyan to blue plasma with pulsing
      const pulse = Math.sin(time * 0.8) * 0.5 + 0.5;
      const hue1 = 180 + layer * 10 + pulse * 15; // Cyan
      const hue2 = 200 + layer * 8 + pulse * 10;  // Blue
      
      gradient.addColorStop(0, `hsla(${hue1}, 75%, 55%, ${0.12 - layer * 0.02})`);
      gradient.addColorStop(0.3, `hsla(${hue1}, 85%, 50%, ${0.22 - layer * 0.04})`);
      gradient.addColorStop(0.6, `hsla(${hue2}, 80%, 45%, ${0.18 - layer * 0.03})`);
      gradient.addColorStop(1, `hsla(${hue2}, 75%, 40%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 35 + layer * 8;
      ctx.shadowColor = `hsla(${hue1}, 85%, 55%, ${0.35 - layer * 0.08})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Add central warp core beam
    const beamGradient = ctx.createLinearGradient(width / 2 - 100, 0, width / 2 + 100, 0);
    beamGradient.addColorStop(0, 'hsla(180, 80%, 60%, 0)');
    beamGradient.addColorStop(0.5, `hsla(190, 90%, 65%, ${0.15 + Math.sin(time * 2) * 0.05})`);
    beamGradient.addColorStop(1, 'hsla(180, 80%, 60%, 0)');
    
    ctx.fillStyle = beamGradient;
    ctx.fillRect(width / 2 - 100, 0, 200, height);
  };

  return (
    <>
      {/* Base gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950/10 to-slate-950" />
      </div>

      {/* Warp core canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Vignette overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-radial from-transparent via-transparent to-slate-950/70" />
      
      {/* Subtle grid pattern */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0h1v60H0zM0 0h60v1H0z' fill='%2300bcd4' fill-opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
