/* ------------------------------------------------------
           2. WEBSOCKET CON RECONEXIÓN AUTOMÁTICA
------------------------------------------------------ */
let ws = null;
let timer = null;
let contadorPesos = 0;

let reconnectDelay = 2000;      // empieza en 2 segundos
const RECONNECT_MAX = 60000;    // máximo 60 segundos

function programarReconexion() {
    if (timer) return; // ya hay un reintento programado

    console.log(`Reintentando conexión WebSocket en ${reconnectDelay / 1000} segundos...`);

    timer = setTimeout(() => {
        timer = null;
        conectarSocket();
        // aumenta el tiempo para el próximo fallo (backoff)
        reconnectDelay = Math.min(RECONNECT_MAX, reconnectDelay * 2);
    }, reconnectDelay);
}

function conectarSocket() {
    // si ya hay un socket conectando o conectado, no crear otro
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        console.log("Ya hay un WebSocket activo, no se crea otro.");
        return;
    }

    console.log("Intentando conectar WebSocket...");

    try {
        ws = new WebSocket("ws://192.168.1.98:8765/");
    } catch (error) {
        console.error("Excepción creando WebSocket:", error);
        programarReconexion();
        return;
    }

    ws.onopen = () => {
        CON_WS_SOCKET = 1;
        console.log("WebSocket CONECTADO ✔");

        // conexión correcta: resetea backoff
        reconnectDelay = 2000;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    ws.onmessage = (event) => {
        CON_WS_SOCKET = 1;
        console.log("Trama recibida:", event.data);

        let trama = event.data;
        let msg   = trama.toLowerCase();
        if (msg.includes("balanza_conectada")) { CON_BALANZA = 1; return; }
        if (msg.includes("balanza_desconectada")) { CON_BALANZA = 0; return; }
        
        const pesoStr = trama.substring(3, 10);
        const peso    = parseInt(pesoStr) / 100;
        let laPesada  = peso.toFixed(2);
        console.log("laPesada:", laPesada);

        if (peso && peso > 0) {
            sonarPesada();
            setTimeout(() => {
                 agregarPesoAutomatico(laPesada);
            }, 100);
        }
    };

    ws.onerror = (ev) => {
        CON_WS_SOCKET = 0;
        console.warn("Error en WebSocket:", ev);
        // aquí NO llamo a programarReconexion, dejo que onclose lo haga
    };

    ws.onclose = (ev) => {
        CON_WS_SOCKET = 0;
        console.log(`WebSocket CERRADO (code=${ev.code}, reason=${ev.reason})`);
        ws = null;
        programarReconexion();
    };
}

// primera conexión
conectarSocket();


function agregarPesoAutomatico(laPesada){
    document.getElementById("peso_manual").value = laPesada;
}

