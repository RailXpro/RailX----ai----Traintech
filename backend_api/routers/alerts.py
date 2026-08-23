import uuid
from fastapi import APIRouter, HTTPException
from typing import List
from backend_api.database import db
from backend_api.models.schemas import BroadcastAlertResponse, AlertSubscriptionCreate

router = APIRouter(prefix="/alerts", tags=["Notifications, Subscriptions & Broadcasts"])

@router.get("/broadcasts", response_model=List[BroadcastAlertResponse])
async def list_broadcast_alerts():
    """List all emergency bulletins, mega block warnings, and safety announcements."""
    query = "SELECT * FROM broadcast_alerts ORDER BY created_at DESC LIMIT 50"
    rows = await db.fetch_all(query)
    return [
        BroadcastAlertResponse(
            alert_id=r["alert_id"],
            alert_type=r["alert_type"],
            severity=r["severity"],
            headline=r["headline"],
            body_text=r["body_text"],
            affected_section_id=r.get("affected_section_id"),
            geo_center_lat=float(r["geo_center_lat"]) if r.get("geo_center_lat") else None,
            geo_center_lon=float(r["geo_center_lon"]) if r.get("geo_center_lon") else None,
            created_at=str(r.get("created_at", ""))
        ) for r in rows
    ]

@router.post("/subscribe")
async def subscribe_to_alerts(sub: AlertSubscriptionCreate):
    """
    Subscribe a passenger or staff member for targeted notifications
    (by PNR, train number, local railway section, or GPS proximity radius).
    """
    user_id = f"USR_{sub.phone_number[-6:]}"
    # Upsert user
    user_query = "INSERT OR IGNORE INTO app_users (user_id, phone_number, full_name) VALUES ($1, $2, $3)"
    await db.execute(user_query, user_id, sub.phone_number, sub.full_name)

    # Insert subscription
    sub_query = """
    INSERT INTO user_subscriptions (user_id, pnr_number, subscribed_train_number, 
                                   subscribed_section_id, alert_on_accidents, alert_on_mega_blocks, proximity_radius_km)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    """
    await db.execute(
        sub_query,
        user_id, sub.pnr_number, sub.subscribed_train_number,
        sub.subscribed_section_id, int(sub.alert_on_accidents),
        int(sub.alert_on_mega_blocks), sub.proximity_radius_km
    )

    return {
        "status": "subscribed",
        "user_id": user_id,
        "phone_number": sub.phone_number,
        "subscribed_train": sub.subscribed_train_number,
        "proximity_radius_km": sub.proximity_radius_km
    }
