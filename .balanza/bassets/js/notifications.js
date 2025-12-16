/* ------------------------------------------
   SONIDO DE PESADA - VERSIÓN INDUSTRIAL
------------------------------------------ */

// Desbloqueo necesario para Chrome (solo 1 vez)
let audioUnlocked = false;

function unlockAudio() {
    if (!audioUnlocked) {
        const silent = new Audio();
        silent.play().catch(() => {});
        audioUnlocked = true;
    }
}
document.addEventListener("click", unlockAudio, { once: true });

// Función industrial para reproducir sonido
function sonarPesada() {

    // Crear un audio efímero (sin mantener objetos en memoria)
    const snd = document.createElement("audio");
    snd.src = "/balanza/bassets/sound/1.mp3";   // ← tu archivo
    snd.volume = 1.0;
    snd.autoplay = true;

    // Eliminar el elemento en cuanto termine
    snd.onended = () => snd.remove();

    // Prevenir errores silenciosos
    snd.onerror = () => snd.remove();

    // Insertar sin ocupar espacio
    snd.style.display = "none";
    document.body.appendChild(snd);
}

// Test opcional
// sonarPesada();

/* ------------------------------------------
   NOTIFICACIÓN DE PESADA (opcional)
------------------------------------------ */
