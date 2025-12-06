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
            agregarPesoAutomatico(laPesada); 
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
    contadorPesos++;

    const idCampo = "peso_auto_" + contadorPesos;

    const html = `
        <div>
            <br> 
            <label class="block size18 mt-1">
                Peso recibido (automático) ${contadorPesos}
            </label>
            <div class="flex items-center gap-2 mt-1">
                <input id="${idCampo}"
                       class="w-full rounded-md border border-gray-300 px-3 py-2 size18 focus:ring-indigo-500 focus:border-indigo-500"
                       type="text" value="${laPesada}">
                <button onclick="borrarPeso('${idCampo}')" class="text-red-500 text-lg hover:text-red-700">✖</button>
            </div>
        </div>
    `;

    document.getElementById("inputs_automaticos").insertAdjacentHTML("beforeend", html);
}

function borrarPeso(idCampo) {
    const input = document.getElementById(idCampo);
    if (!input) return;

    const bloque = input.closest("div").parentElement;
    bloque.remove();
}
