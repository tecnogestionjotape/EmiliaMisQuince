document.addEventListener("DOMContentLoaded", () => {
  // 1. Splash, Audio y Animación de Frase
  const splash = document.getElementById("splash");
  const btnIngresar = document.getElementById("btn-ingresar");
  const audio = document.getElementById("musica");
  const btnMusica = document.getElementById("btn-musica");
  const fraseBienvenida = document.getElementById("frase-bienvenida");

  btnIngresar.addEventListener("click", () => {
    audio.play().catch((err) => console.warn("Autoplay bloqueado:", err));
    splash.classList.add("oculto");

    setTimeout(() => {
      fraseBienvenida.classList.add("visible");
    }, 400);

    lanzarFuegosIniciales();
  });

  btnMusica.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btnMusica.style.opacity = "1";
    } else {
      audio.pause();
      btnMusica.style.opacity = "0.5";
    }
  });

  // 2. Temporizador (28 de Noviembre de 2026, 21:30 hs)
  const fechaFiesta = new Date("2026-11-28T21:30:00").getTime();

  function actualizarContador() {
    const ahora = new Date().getTime();
    const diferencia = fechaFiesta - ahora;

    if (diferencia <= 0) {
      document.getElementById("dias").innerText = "00";
      document.getElementById("horas").innerText = "00";
      document.getElementById("minutos").innerText = "00";
      document.getElementById("segundos").innerText = "00";
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById("dias").innerText = String(dias).padStart(2, "0");
    document.getElementById("horas").innerText = String(horas).padStart(2, "0");
    document.getElementById("minutos").innerText = String(minutos).padStart(
      2,
      "0",
    );
    document.getElementById("segundos").innerText = String(segundos).padStart(
      2,
      "0",
    );
  }

  actualizarContador();
  setInterval(actualizarContador, 1000);

  // 3. Sistema de Destellos y Fuegos Artificiales
  const canvas = document.getElementById("canvas-fuegos");
  const ctx = canvas.getContext("2d");

  function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  redimensionarCanvas();
  window.addEventListener("resize", redimensionarCanvas);

  let particulas = [];
  const paletaColores = [
    "#2ecc71", // Verde esmeralda
    "#27ae60", // Verde botánico
    "#f1c40f", // Dorado
    "#e67e22", // Oro viejo
    "#e91e63", // Rosa
    "#9b59b6", // Violeta
    "#00cec9", // Turquesa
    "#ffffff", // Blanco destello
  ];

  class Particula {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angulo = Math.random() * Math.PI * 2;
      const velocidad = Math.random() * 4.5 + 1.5;
      this.vx = Math.cos(angulo) * velocidad;
      this.vy = Math.sin(angulo) * velocidad;
      this.alfa = 1;
      this.friccion = 0.96;
      this.gravedad = 0.05;
      this.radio = Math.random() * 2.2 + 1.2;
      this.desvanecimiento = Math.random() * 0.015 + 0.008;
    }

    actualizar() {
      this.vx *= this.friccion;
      this.vy *= this.friccion;
      this.vy += this.gravedad;
      this.x += this.vx;
      this.y += this.vy;
      this.alfa -= this.desvanecimiento;
    }

    dibujar() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alfa, 0);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function crearExplosion(x, y, cantidad = 36) {
    for (let i = 0; i < cantidad; i++) {
      const color =
        paletaColores[Math.floor(Math.random() * paletaColores.length)];
      particulas.push(new Particula(x, y, color));
    }
  }

  function animarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particulas.length - 1; i >= 0; i--) {
      particulas[i].actualizar();
      particulas[i].dibujar();
      if (particulas[i].alfa <= 0) {
        particulas.splice(i, 1);
      }
    }
    requestAnimationFrame(animarCanvas);
  }
  animarCanvas();

  function lanzarFuegosIniciales() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    crearExplosion(w * 0.25, h * 0.3, 40);
    setTimeout(() => crearExplosion(w * 0.75, h * 0.25, 40), 300);
    setTimeout(() => crearExplosion(w * 0.5, h * 0.45, 45), 600);
    setTimeout(() => crearExplosion(w * 0.3, h * 0.6, 35), 900);
  }

  setInterval(() => {
    if (!splash.classList.contains("oculto")) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x =
      Math.random() > 0.5
        ? w * (Math.random() * 0.2 + 0.05)
        : w * (Math.random() * 0.2 + 0.75);
    const y = h * (Math.random() * 0.6 + 0.15);
    crearExplosion(x, y, 20);
  }, 2600);
});
