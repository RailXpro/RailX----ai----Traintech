"""
RailX AI: AI-Powered Automatic Block Planning for Indian Railways
FastAPI Backend Application Entrypoint
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend_api.config import settings
from backend_api.database import db
from backend_api.services.websocket_hub import ws_hub

# Routers
from backend_api.routers.tracks import router as tracks_router
from backend_api.routers.trains import router as trains_router
from backend_api.routers.blocks import router as blocks_router
from backend_api.routers.accidents import router as accidents_router
from backend_api.routers.mega_blocks import router as mega_blocks_router
from backend_api.routers.alerts import router as alerts_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB
    print("[RailX Engine] Initializing database backend...")
    await db.connect()
    print("[RailX Engine] Backend server ready.")
    yield
    # Shutdown: Disconnect
    print("[RailX Engine] Shutting down database connections...")
    await db.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    🚉 **RailX AI Backend API** — Intelligent Block Planning and Safety System for Indian Railways.
    
    ### 🎯 Key Capabilities:
    * **AI Corridor Block Optimizer**: Solves track maintenance possession demands while minimizing passenger delays on high-priority routes (Vande Bharat / Rajdhani).
    * **Real-time Accident Notification Feed**: Emergency incident ingestion with automatic track section closures.
    * **Mega Block Manager**: Passenger train cancellations, diversions, and Sunday engineering block timetables.
    * **Live GIS Track & Train Telemetry**: Green/Yellow/Red section availability map feed and GPS speed monitoring.
    * **WebSocket Stream**: Instant bidirectional pushes at `/ws/live-feed`.
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under API v1 prefix
app.include_router(tracks_router, prefix=settings.API_V1_STR)
app.include_router(trains_router, prefix=settings.API_V1_STR)
app.include_router(blocks_router, prefix=settings.API_V1_STR)
app.include_router(accidents_router, prefix=settings.API_V1_STR)
app.include_router(mega_blocks_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
async def health_check():
    """System health check and database status."""
    return {
        "status": "healthy",
        "service": "RailX AI Backend API",
        "version": "1.0.0",
        "database_backend": "PostgreSQL (Supabase)" if db.use_postgres else "SQLite Local Fallback"
    }

@app.websocket("/ws/live-feed")
async def websocket_live_feed(websocket: WebSocket):
    """
    WebSocket endpoint for real-time streaming of train GPS telemetry,
    emergency accident broadcasts, and mega block advisory pushes.
    """
    await ws_hub.connect(websocket)
    try:
        while True:
            # Keep socket alive and receive any client-sent events
            data = await websocket.receive_text()
            # Echo or handle incoming messages if needed
            await websocket.send_text(f'{{"ack": true, "received": "{data[:30]}"}}')
    except WebSocketDisconnect:
        ws_hub.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend_api.main:app", host="0.0.0.0", port=8000, reload=True)
