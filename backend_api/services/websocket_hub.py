"""
RailX AI: Real-time WebSocket Connection Hub & Broadcaster
Streams live GPS telemetry, sudden block closures, and emergency alerts.
"""

import json
from typing import List
from fastapi import WebSocket

class WebSocketHub:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[WebSocketHub] Client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"[WebSocketHub] Client disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast(self, event_type: str, data: dict):
        if not self.active_connections:
            return
        payload = json.dumps({
            "event": event_type,
            "data": data
        })
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                disconnected.append(connection)
        
        for dead_conn in disconnected:
            self.disconnect(dead_conn)

ws_hub = WebSocketHub()
