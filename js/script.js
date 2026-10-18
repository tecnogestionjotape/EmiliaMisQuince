document.addEventListener("DOMContentLoaded", () => {
  // En celulares mantenemos wa.me (abre la aplicación).
  // En computadoras abrimos el chat directamente en WhatsApp Web,
  // sin depender de que WhatsApp Escritorio esté instalado.
  const agente = navigator.userAgent || "";
  const esIpad = /Macintosh/i.test(agente) && navigator.maxTouchPoints > 1;
  const esMovil =
    /Android|iPhone|iPad|iPod|Mobile/i.test(agente) ||
    navigator.userAgentData?.mobile === true ||
    esIpad;

  if (!esMovil) {
    document.querySelectorAll('a.contacto[href^="https://wa.me/"]').forEach((enlace) => {
      const origen = new URL(enlace.href);
      const numero = origen.pathname.replace(/^\/+|\/+$/g, "");
      if (!/^\d{10,15}$/.test(numero)) return;

      const destino = new URL("https://web.whatsapp.com/send");
      destino.searchParams.set("phone", numero);
      const mensaje = origen.searchParams.get("text");
      if (mensaje !== null) destino.searchParams.set("text", mensaje);
      enlace.href = destino.toString();
    });
  }
  const splash = document.getElementById("splash");
  const btnIngresar = document.getElementById("btn-ingresar");
  const audio = document.getElementById("musica");
  const btnMusica = document.getElementById("btn-musica");
  const estadoMusica = document.getElementById("estado-musica");
  const frase = document.getElementById("frase-bienvenida");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function actualizarEstadoMusica() {
    const sonando = !audio.paused;
    btnMusica.setAttribute("aria-pressed", String(sonando));
    btnMusica.setAttribute(
      "aria-label",
      sonando ? "Pausar música" : "Reproducir música",
    );
    estadoMusica.textContent = sonando ? "Música sonando" : "Música pausada";
  }
  audio.addEventListener("play", actualizarEstadoMusica);
  audio.addEventListener("pause", actualizarEstadoMusica);
  audio.addEventListener("ended", actualizarEstadoMusica);

  btnIngresar.addEventListener("click", () => {
    splash.classList.add("oculto");
    splash.setAttribute("aria-hidden", "true");
    document.body.classList.remove("inicio-bloqueado");
    btnIngresar.blur();
    btnMusica.focus({ preventScroll: true });
    audio.play().catch(() => actualizarEstadoMusica());
    window.setTimeout(() => frase.classList.add("visible"), 250);
    if (!reduceMotion) lanzarDestellosIniciales();
  });

  btnMusica.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => actualizarEstadoMusica());
    } else {
      audio.pause();
    }
  });
  actualizarEstadoMusica();

  // Hora oficial Argentina (UTC-03:00), 28/11/2026 a las 21:00.
  const fechaFiesta = new Date("2026-11-28T21:00:00-03:00").getTime();
  const elementos = {
    dias: document.getElementById("dias"),
    horas: document.getElementById("horas"),
    minutos: document.getElementById("minutos"),
    segundos: document.getElementById("segundos"),
  };
  function actualizarContador() {
    let restante = Math.max(0, fechaFiesta - Date.now());
    const dias = Math.floor(restante / 86400000);
    restante %= 86400000;
    const horas = Math.floor(restante / 3600000);
    restante %= 3600000;
    const minutos = Math.floor(restante / 60000);
    restante %= 60000;
    const segundos = Math.floor(restante / 1000);
    for (const [clave, valor] of Object.entries({
      dias,
      horas,
      minutos,
      segundos,
    })) {
      elementos[clave].textContent = String(valor).padStart(2, "0");
    }
  }
  actualizarContador();
  window.setInterval(actualizarContador, 1000);

  // Destellos elegantes en tonos verde, champagne y marfil.
  const canvas = document.getElementById("canvas-fuegos");
  const ctx = canvas.getContext("2d");
  if (!ctx || reduceMotion) return;
  const colores = ["#e8d4a4", "#c4a779", "#f8f3e7", "#8cae92"];
  let particulas = [];
  function redimensionarCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  redimensionarCanvas();
  window.addEventListener("resize", redimensionarCanvas, { passive: true });
  function explosion(x, y, cantidad = 20) {
    for (let i = 0; i < cantidad; i++) {
      const angulo = Math.random() * Math.PI * 2;
      const velocidad = 1 + Math.random() * 2.5;
      particulas.push({
        x,
        y,
        vx: Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad,
        alfa: 1,
        radio: 1 + Math.random() * 1.6,
        color: colores[Math.floor(Math.random() * colores.length)],
      });
    }
  }
  function animar() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = particulas.length - 1; i >= 0; i--) {
      const p = particulas[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.986;
      p.vy = p.vy * 0.986 + 0.018;
      p.alfa -= 0.012;
      if (p.alfa <= 0) {
        particulas.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, p.alfa);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    window.requestAnimationFrame(animar);
  }
  animar();
  function lanzarDestellosIniciales() {
    explosion(window.innerWidth * 0.22, window.innerHeight * 0.33, 30);
    setTimeout(
      () => explosion(window.innerWidth * 0.75, window.innerHeight * 0.27, 30),
      370,
    );
    setTimeout(
      () => explosion(window.innerWidth * 0.42, window.innerHeight * 0.55, 24),
      720,
    );
  }
  window.setInterval(() => {
    if (splash.classList.contains("oculto") && !document.hidden) {
      explosion(
        window.innerWidth * (Math.random() < 0.5 ? 0.12 : 0.88),
        window.innerHeight * (0.2 + 0.6 * Math.random()),
        9,
      );
    }
  }, 4200);
});
