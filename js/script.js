document.addEventListener("DOMContentLoaded", () => {
  // 1. Control de Audio y Splash
  const splash = document.getElementById("splash");
  const btnIngresar = document.getElementById("btn-ingresar");
  const audio = document.getElementById("musica");
  const btnMusica = document.getElementById("btn-musica");

  btnIngresar.addEventListener("click", () => {
    audio
      .play()
      .then(() => {
        console.log("Audio reproduciendo.");
      })
      .catch((err) => {
        console.warn("Autoplay bloqueado:", err);
      });
    splash.classList.add("oculto");
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

  // 2. Temporizador para el 28 de Noviembre de 2026 a las 21:30 hs
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
});
