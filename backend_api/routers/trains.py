from fastapi import APIRouter, HTTPException
from typing import List, Optional
from backend_api.database import db
from backend_api.models.schemas import TrainResponse, TrainScheduleStop, TrainTelemetryPing, TrainTelemetryResponse
from backend_api.services.websocket_hub import ws_hub

router = APIRouter(prefix="/trains", tags=["Train Operations & Telemetry"])

@router.get("", response_model=List[TrainResponse])
async def list_trains(train_type: Optional[str] = None):
    """List all registered trains (Vande Bharat, Superfast, Local EMUs, Freight)."""
    if train_type:
        query = "SELECT * FROM trains WHERE train_type = $1 AND is_active = 1"
        rows = await db.fetch_all(query, train_type)
    else:
        query = "SELECT * FROM trains WHERE is_active = 1"
        rows = await db.fetch_all(query)
    
    return [
        TrainResponse(
            train_number=r["train_number"],
            train_name=r["train_name"],
            train_type=r["train_type"],
            source_station_code=r["source_station_code"],
            destination_station_code=r["destination_station_code"],
            priority_level=int(r.get("priority_level", 3)),
            max_operating_speed_kmph=int(r.get("max_operating_speed_kmph", 110)),
            is_active=bool(r.get("is_active", True))
        ) for r in rows
    ]

@router.get("/{train_number}/schedule", response_model=List[TrainScheduleStop])
async def get_train_schedule(train_number: str):
    """Retrieve full scheduled stops and timings for a train."""
    query = "SELECT * FROM train_schedules WHERE train_number = $1 ORDER BY stop_sequence ASC"
    rows = await db.fetch_all(query, train_number)
    return [
        TrainScheduleStop(
            stop_sequence=int(r["stop_sequence"]),
            station_code=r["station_code"],
            scheduled_arrival=r.get("scheduled_arrival"),
            scheduled_departure=r.get("scheduled_departure"),
            dwell_minutes=int(r.get("dwell_minutes", 2)),
            platform_number=r.get("platform_number"),
            distance_from_source_km=float(r["distance_from_source_km"]) if r.get("distance_from_source_km") else None
        ) for r in rows
    ]

@router.get("/{train_number}/telemetry", response_model=TrainTelemetryResponse)
async def get_train_telemetry(train_number: str):
    """Fetch the latest real-time GPS telemetry, speed, delay, and Kavach status."""
    query = "SELECT * FROM train_telemetry WHERE train_number = $1"
    r = await db.fetch_one(query, train_number)
    if not r:
        raise HTTPException(status_code=404, detail="Telemetry data not found for train")
    
    delay = int(r.get("delay_minutes", 0))
    delay_cat = "ON_TIME" if delay <= 5 else ("SLIGHT_DELAY" if delay <= 20 else "HEAVY_DELAY")

    return TrainTelemetryResponse(
        train_number=r["train_number"],
        current_section_id=r.get("current_section_id"),
        current_latitude=float(r["current_latitude"]),
        current_longitude=float(r["current_longitude"]),
        current_speed_kmph=float(r.get("current_speed_kmph", 0.0)),
        delay_minutes=delay,
        heading_degrees=float(r["heading_degrees"]) if r.get("heading_degrees") else None,
        kavach_status=r.get("kavach_status", "ARMED_NORMAL"),
        last_ping_at=str(r.get("last_ping_at", "")),
        delay_category=delay_cat
    )

@router.post("/telemetry/update")
async def update_train_telemetry(ping: TrainTelemetryPing):
    """Ingest a live GPS telemetry ping from locomotive onboard computer and broadcast live."""
    # Check if telemetry record exists
    check_query = "SELECT telemetry_id FROM train_telemetry WHERE train_number = $1"
    existing = await db.fetch_one(check_query, ping.train_number)

    if existing:
        update_query = """
        UPDATE train_telemetry 
        SET current_section_id = $1, current_latitude = $2, current_longitude = $3,
            current_speed_kmph = $4, delay_minutes = $5, heading_degrees = $6, 
            kavach_status = $7, last_ping_at = CURRENT_TIMESTAMP
        WHERE train_number = $8
        """
        await db.execute(
            update_query,
            ping.current_section_id, ping.current_latitude, ping.current_longitude,
            ping.current_speed_kmph, ping.delay_minutes, ping.heading_degrees,
            ping.kavach_status, ping.train_number
        )
    else:
        insert_query = """
        INSERT INTO train_telemetry (train_number, current_section_id, current_latitude, current_longitude, current_speed_kmph, delay_minutes, heading_degrees, kavach_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """
        await db.execute(
            insert_query,
            ping.train_number, ping.current_section_id, ping.current_latitude, ping.current_longitude,
            ping.current_speed_kmph, ping.delay_minutes, ping.heading_degrees, ping.kavach_status
        )

    # Broadcast over WebSocket
    await ws_hub.broadcast("TRAIN_TELEMETRY_UPDATE", ping.model_dump())

    return {"status": "success", "train_number": ping.train_number, "delay_minutes": ping.delay_minutes}
