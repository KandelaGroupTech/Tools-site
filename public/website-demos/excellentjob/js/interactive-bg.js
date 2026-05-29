// Interactive Canvas Background
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];
    
    // Config
    const spacing = 40;
    const dotRadius = 1.5;
    const baseColor = 'rgba(0, 0, 0, 0.05)';
    const activeColor = 'rgba(211, 47, 47, 0.6)'; // Red accent
    const interactionRadius = 150;
    
    let mouse = { x: -1000, y: -1000 };
    
    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        dots = [];
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                dots.push({ x, y, baseSize: dotRadius });
            }
        }
    }
    
    window.addEventListener('resize', init);
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        dots.forEach(dot => {
            const dx = mouse.x - dot.x;
            const dy = mouse.y - dot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            ctx.beginPath();
            
            if (dist < interactionRadius) {
                const intensity = 1 - (dist / interactionRadius);
                ctx.arc(dot.x, dot.y, dot.baseSize + (intensity * 2), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(211, 47, 47, ${0.1 + (intensity * 0.5)})`;
                
                // Optional: Draw connecting lines to mouse if very close
                if (dist < interactionRadius * 0.5) {
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(211, 47, 47, ${intensity * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.beginPath(); // reset path for the arc
                }
            } else {
                ctx.arc(dot.x, dot.y, dot.baseSize, 0, Math.PI * 2);
                ctx.fillStyle = baseColor;
            }
            
            ctx.fill();
        });
        
        requestAnimationFrame(draw);
    }
    
    init();
    draw();
});
