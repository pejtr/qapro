import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function AnimatedBackground() {
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
    const particleCount = 60;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      timeRef.current += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw aurora waves
      drawAurora(ctx, canvas.width, canvas.height, timeRef.current);

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

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4
        );
        gradient.addColorStop(0, `rgba(168, 85, 247, ${particle.opacity})`);
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${particle.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${(1 - distance / 120) * 0.15})`;
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

  // Aurora drawing function
  const drawAurora = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const layers = 3;
    
    for (let layer = 0; layer < layers; layer++) {
      ctx.beginPath();
      
      const yOffset = height * 0.3 + layer * 80;
      const amplitude = 60 + layer * 20;
      const frequency = 0.003 - layer * 0.0005;
      const speed = 1 + layer * 0.3;
      
      // Create wavy aurora path
      for (let x = 0; x <= width; x += 5) {
        const y = yOffset + 
          Math.sin(x * frequency + time * speed) * amplitude +
          Math.sin(x * frequency * 2 - time * speed * 0.7) * (amplitude * 0.5) +
          Math.cos(x * frequency * 0.5 + time * speed * 0.5) * (amplitude * 0.3);
        
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
      
      // Create gradient for aurora colors
      const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude * 2);
      
      // Color shifts based on layer and time
      const hue1 = (270 + layer * 20 + Math.sin(time * 0.5) * 30) % 360; // Purple to blue
      const hue2 = (30 + layer * 15 + Math.cos(time * 0.3) * 20) % 360;  // Orange to yellow
      
      gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, ${0.15 - layer * 0.03})`);
      gradient.addColorStop(0.3, `hsla(${hue1}, 80%, 50%, ${0.25 - layer * 0.05})`);
      gradient.addColorStop(0.6, `hsla(${hue2}, 75%, 55%, ${0.2 - layer * 0.04})`);
      gradient.addColorStop(1, `hsla(${hue2}, 70%, 50%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 40 + layer * 10;
      ctx.shadowColor = `hsla(${hue1}, 80%, 60%, ${0.4 - layer * 0.1})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  return (
    <>
      {/* Base gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950" />
      </div>

      {/* Aurora canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Vignette overlay for depth */}
      <div className="fixed inset-0 -z-10 bg-gradient-radial from-transparent via-transparent to-slate-950/70" />
      
      {/* Subtle noise texture */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
