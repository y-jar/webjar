// floating particles background
// draws small amber dots that drift slowly across the viewport
// clicking spawns a burst of particles that fade out

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w, h;
const particles = [];
const COUNT = 40;

// resize canvas to fill the window
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// create ambient particles with random position, size, speed, and opacity
for (let i = 0; i < COUNT; i++) {
    particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.15 + 0.1,
    });
}

// spawn a burst of particles at (cx, cy)
function burst(cx, cy) {
    const n = 12 + Math.floor(Math.random() * 6);
    for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.5;
        particles.push({
            x: cx,
            y: cy,
            r: Math.random() * 2 + 1,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            o: Math.random() * 0.3 + 0.25,
            life: 1,
            decay: 0.008 + Math.random() * 0.012, // ~1-2s at 60fps
        });
    }
}

document.addEventListener("click", (e) => burst(e.clientX, e.clientY));

// animation loop — clear, move, draw each particle
function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // drift
        p.x += p.dx;
        p.y += p.dy;

        // fade burst particles
        if (p.life !== undefined) {
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
        }

        // wrap ambient particles around edges (burst particles don't wrap)
        if (p.life === undefined) {
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;
        }

        // draw dot
        const alpha = p.life !== undefined ? p.o * p.life : p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,153,33,${alpha})`;
        ctx.fill();
    }
    requestAnimationFrame(draw);
}
draw();
