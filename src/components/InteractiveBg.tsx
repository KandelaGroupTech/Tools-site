import { useEffect, useRef } from 'react';

export default function InteractiveBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; baseSize: number }[] = [];
    let animationFrameId: number;

    const spacing = 40;
    const dotRadius = 1.5;
    const baseColor = 'rgba(0, 0, 0, 0.05)';
    const interactionRadius = 150;

    const mouse = { x: -1000, y: -1000 };

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      dots = [];
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          dots.push({ x, y, baseSize: dotRadius });
        }
      }
    };

    const onResize = () => {
      init();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        ctx.beginPath();

        if (dist < interactionRadius) {
          const intensity = 1 - dist / interactionRadius;
          ctx.arc(dot.x, dot.y, dot.baseSize + intensity * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(211, 47, 47, ${0.1 + intensity * 0.5})`;

          // Draw connecting line to mouse if very close (same as original excellentjob)
          if (dist < interactionRadius * 0.5) {
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(211, 47, 47, ${intensity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.beginPath();
          }
        } else {
          ctx.arc(dot.x, dot.y, dot.baseSize, 0, Math.PI * 2);
          ctx.fillStyle = baseColor;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
