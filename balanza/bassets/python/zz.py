import asyncio
import websockets
import socket
import threading
import datetime
import os
import time


# nssm start ServicioBalanza
# nssm stop ServicioBalanza
# nssm restart ServicioBalanza
# -------------------------------
# WebSocket (puerto 8765)
# -------------------------------

clientes = set()

async def ws_handler(websocket):
    # print("Cliente navegador conectado")
    clientes.add(websocket)

    try:
        await websocket.send("0")

        async for mensaje in websocket:
            # print("Mensaje desde navegador:", mensaje)
            pass
    except:
        pass

    finally:
        # print("Cliente navegador desconectado")
        clientes.discard(websocket)


async def enviar_a_clientes(mensaje):
    """Enviar mensaje a todos los navegadores conectados."""
    if clientes:
        await asyncio.gather(
            *(ws.send(mensaje) for ws in clientes),
            return_exceptions=True
        )


# -------------------------------
# Archivo de log
# -------------------------------

def obtener_nombre_archivo():
    fecha = datetime.date.today().strftime("%m-%d")
    return f"log/peso_{fecha}.txt"


def escribir_dato(texto):
    os.makedirs("log", exist_ok=True)
    nombre = obtener_nombre_archivo()
    time_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(nombre, "a", encoding="utf-8") as f:
        f.write(f"{time_str} {texto}\n")


# -------------------------------
# Servidor TCP de la balanza (en hilo)
# -------------------------------

IP = "0.0.0.0"
PORT = 3000

balanza_conectada = False   # <<< ESTADO GLOBAL DEL SOCKET TCP >>>

async def procesar_peso(texto):
    """Procesa cada peso recibido: guardar + enviar por WebSocket."""
    escribir_dato(texto)
    await enviar_a_clientes(texto)


def hilo_tcp(loop):
    """Hilo que gestiona la balanza TCP (bloqueante)."""
    global balanza_conectada

    while True:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s.bind((IP, PORT))
            s.listen(1)

            conn, addr = s.accept()
            # print("Balanza conectada desde:", addr)
            balanza_conectada = True   # <<< se conectó >>>

            while True:
                data = conn.recv(1024)

                # Desconexión REAL (socket cerrado)
                if not data:
                    # print("Balanza desconectada. Esperando reconexión...")
                    balanza_conectada = False   # <<< se desconectó >>>
                    break

                texto = "".join(chr(b) for b in data if 32 <= b <= 126)
                # print("Peso recibido:", texto)

                asyncio.run_coroutine_threadsafe(
                    procesar_peso(texto),
                    loop
                )

            conn.close()
            s.close()

        except Exception as e:
            # print("Error TCP:", e)
            balanza_conectada = False   # <<< si hay error, está desconectada >>>
            time.sleep(2)


# -------------------------------
# Enviar estado cada 22 segundos
# -------------------------------

def estado_periodico(loop):
    global balanza_conectada

    while True:
        mensaje = "BALANZA_CONECTADA" if balanza_conectada else "BALANZA_DESCONECTADA"

        asyncio.run_coroutine_threadsafe(
            enviar_a_clientes(mensaje),
            loop
        )

        time.sleep(22)


# -------------------------------
# Bucle principal asyncio
# -------------------------------

async def main():
    # Iniciar WebSocket
    async with websockets.serve(ws_handler, "0.0.0.0", 8765):
        # print("WebSocket escuchando en ws://0.0.0.0:8765")

        loop = asyncio.get_running_loop()

        # Iniciar hilo TCP
        threading.Thread(target=hilo_tcp, args=(loop,), daemon=True).start()

        # Iniciar hilo que envía el estado cada 22 segundos
        threading.Thread(target=estado_periodico, args=(loop,), daemon=True).start()

        # Mantener vivo el servidor
        while True:
            await asyncio.sleep(1)


asyncio.run(main())
