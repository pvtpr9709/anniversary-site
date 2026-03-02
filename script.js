let current = 0;
const pages = document.querySelectorAll(".page");
const music = document.getElementById("bgMusic");

function unlock() {
  const ans = document.getElementById("answer").value.toLowerCase();
  if (ans.includes("doremon")) {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("story").classList.remove("hidden");
  } else {
    alert("Wrong 😜 Try again");
  }
}

function next() {
  pages[current].classList.remove("active");
  current++;

  pages[current].classList.add("active");

  // 🎆 AUTO FIREWORKS + MUSIC on FINAL PAGE
  if (pages[current].classList.contains("finale")) {
    music.play();
    startFireworks();
  }
}

/* =========================
   🎆 FIREWORKS ENGINE
   ========================= */

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
resize();

window.addEventListener("resize", resize);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let fireworks = [];

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height * 0.4;
    this.color = `hsl(${Math.random() * 360},100%,70%)`;
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.y -= 8;
      if (this.y <= this.targetY) {
        this.explode();
      }
    } else {
      this.particles.forEach(p => p.update());
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      this.particles.forEach(p => p.draw());
    }
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < 40; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 2;
    this.life = 60;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 6 + 2;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life--;
  }

  draw() {
    ctx.globalAlpha = this.life / 60;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function startFireworks() {
  setInterval(() => {
    fireworks.push(new Firework());
  }, 600);

  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw();
    if (fw.exploded && fw.particles.every(p => p.life <= 0)) {
      fireworks.splice(i, 1);
    }
  });

  requestAnimationFrame(animate);
}