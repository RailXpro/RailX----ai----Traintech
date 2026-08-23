from fastapi import APIRouter, HTTPException
from typing import List
from backend_api.database import db
from backend_api.models.schemas import TrackSectionResponse, StationResponse

router = APIRouter(prefix="/tracks", tags=["Track Network & GIS"])

@router.get("/stations", response_model=List[StationResponse])
async def list_stations():
    """List all railway stations with coordinates, divisions, and platform counts."""
    query = "SELECT station_code, station_name, division_id, latitude, longitude, elevation_meters, platforms_count, is_junction FROM stations"
    rows = await db.fetch_all(query)
    return [
        StationResponse(
            station_code=r["station_code"],
            station_name=r["station_name"],
            division_id=r["division_id"],
            latitude=float(r["latitude"]),
            longitude=float(r["longitude"]),
            elevation_meters=float(r["elevation_meters"]) if r.get("elevation_meters") else None,
            platforms_count=r.get("platforms_count", 2),
            is_junction=bool(r.get("is_junction", False))
        ) for r in rows
    ]

@router.get("/sections", response_model=List[TrackSectionResponse])
async def list_track_sections():
    """List all track sections with real-time operational status (green/yellow/purple/red)."""
    query = """
    SELECT section_id, division_id, from_station_code, to_station_code, line_type, 
           distance_km, max_permissible_speed_kmph, current_status, status_reason
    FROM track_sections
    """
    rows = await db.fetch_all(query)
    
    color_map = {
        "AVAILABLE": "#22C55E",
        "CAUTION": "#EAB308",
        "BLOCKED": "#F97316",
        "MEGA_BLOCK": "#A855F7",
        "EMERGENCY_CLOSURE": "#EF4444"
    }

    return [
        TrackSectionResponse(
            section_id=r["section_id"],
            division_id=r["division_id"],
            from_station_code=r["from_station_code"],
            to_station_code=r["to_station_code"],
            line_type=r.get("line_type", "UP_FAST"),
            distance_km=float(r["distance_km"]),
            max_permissible_speed_kmph=int(r["max_permissible_speed_kmph"]),
            current_status=r["current_status"],
            status_reason=r.get("status_reason"),
            status_color_hex=color_map.get(r["current_status"], "#6B7280")
        ) for r in rows
    ]

@router.get("/sections/{section_id}", response_model=TrackSectionResponse)
async def get_track_section(section_id: str):
    """Retrieve details and live status for a specific track section."""
    query = "SELECT * FROM track_sections WHERE section_id = $1"
    r = await db.fetch_one(query, section_id)
    if not r:
        raise HTTPException(status_code=404, detail="Track section not found")
    
    color_map = {
        "AVAILABLE": "#22C55E",
        "CAUTION": "#EAB308",
        "BLOCKED": "#F97316",
        "MEGA_BLOCK": "#A855F7",
        "EMERGENCY_CLOSURE": "#EF4444"
    }

    return TrackSectionResponse(
        section_id=r["section_id"],
        division_id=r["division_id"],
        from_station_code=r["from_station_code"],
        to_station_code=r["to_station_code"],
        line_type=r.get("line_type", "UP_FAST"),
        distance_km=float(r["distance_km"]),
        max_permissible_speed_kmph=int(r["max_permissible_speed_kmph"]),
        current_status=r["current_status"],
        status_reason=r.get("status_reason"),
        status_color_hex=color_map.get(r["current_status"], "#6B7280")
    )
