import os
import socket
import json
from typing import List, Set
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PORT = int(os.environ.get("PORT", 8000))

# Active WebSocket connections
active_connections: Set[WebSocket] = set()
messages_history: List[str] = []

def get_lan_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    # Send existing history to new client
    for msg in messages_history:
        await websocket.send_text(msg)

    try:
        while True:
            text = await websocket.receive_text()
            if text == "__CLEAR__":
                messages_history.clear()
                for conn in list(active_connections):
                    try:
                        await conn.send_text("__CLEAR__")
                    except Exception:
                        active_connections.discard(conn)
            elif text.strip():
                messages_history.append(text)
                if len(messages_history) > 100:
                    messages_history.pop(0)

                # Broadcast to all connected clients
                for conn in list(active_connections):
                    try:
                        await conn.send_text(text)
                    except Exception:
                        active_connections.discard(conn)
    except WebSocketDisconnect:
        active_connections.discard(websocket)
    except Exception:
        active_connections.discard(websocket)

@app.post("/api/clear")
async def clear_chat_api():
    messages_history.clear()
    for conn in list(active_connections):
        try:
            await conn.send_text("__CLEAR__")
        except Exception:
            active_connections.discard(conn)
    return {"status": "cleared"}

os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def get_index():
    return FileResponse(
        "static/index.html",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

if __name__ == "__main__":
    ip = get_lan_ip()
    print("\n" + "=" * 50)
    print("SIMPLE BIDIRECTIONAL CHAT RUNNING")
    print("=" * 50)
    print(f"Computer:  http://localhost:{PORT}")
    print(f"Phone/LAN: http://{ip}:{PORT}")
    print("=" * 50 + "\n")

    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
