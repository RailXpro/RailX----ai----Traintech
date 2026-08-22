"""
app.py - FastAPI Master Application for Indian Railways AI Block Planning & Notification
Exposes RESTful endpoints for:
1. AI Route Rethink & Exact Accident Notifications
2. AI Mega Block Circular Document Scanning & Passenger Matching
3. Smart Dynamic Alternative Route Engine
"""

from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime

try:
    from backend.models.schemas import (
        AccidentReport,
        MegaBlockUploadRequest,
        ExtractedMegaBlock,
        PassengerJourney,
        SmartNotification,
        RerouteRequest,
        RerouteResponse,
        AlternativeRouteOption
    )
    from backend.ai_engine.accident_detector import AccidentDetector
    from backend.ai_engine.megablock_scanner import MegaBlockScanner
    from backend.ai_engine.route_optimizer import RailwayRouteOptimizer
    from backend.services.notification_service import NotificationService
except ImportError:
    from models.schemas import (
        AccidentReport,
        MegaBlockUploadRequest,
        ExtractedMegaBlock,
        PassengerJourney,
        SmartNotification,
        RerouteRequest,
        RerouteResponse,
        AlternativeRouteOption
    )
    from ai_engine.accident_detector import AccidentDetector
    from ai_engine.megablock_scanner import MegaBlockScanner
    from ai_engine.route_optimizer import RailwayRouteOptimizer
    from services.notification_service import NotificationService

# Initialize FastAPI App
app = FastAPI(
    title="Indian Railways AI Block Planning & Smart Notification API",
    description="Backend API combining AI Accident Sensing, Mega Block NLP Scanning, and Dynamic Network Rerouting",
    version="2.0.0"
)

# Enable CORS for React/Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Engines & Services
accident_detector = AccidentDetector()
megablock_scanner = MegaBlockScanner()
route_optimizer = RailwayRouteOptimizer()
notification_service = NotificationService()

# In-Memory Sample Railway Passenger Database
SAMPLE_PASSENGERS: List[PassengerJourney] = [
    PassengerJourney(
        pnr="8421984210",
        passenger_name="Aarav Sharma",
        phone_number="+919876543210",
        train_number="12951",
        train_name="Mumbai Tejas Rajdhani Express",
        origin="BCT",
        destination="NDLS",
        scheduled_departure="2026-08-22T17:00:00",
        scheduled_arrival="2026-08-23T08:32:00",
        route_stations=["BCT", "ST", "BRC", "RTM", "KOTA", "SWM", "MTJ", "NZM", "NDLS"],
        current_station_code="KOTA",
        current_station_index=4
    ),
    PassengerJourney(
        pnr="6512903341",
        passenger_name="Priya Deshmukh",
        phone_number="+919823456789",
        train_number="12137",
        train_name="Punjab Mail",
        origin="CSMT",
        destination="FZR",
        scheduled_departure="2026-08-23T09:30:00",
        scheduled_arrival="2026-08-24T05:10:00",
        route_stations=["CSMT", "DR", "TNA", "KYN", "NK", "MMR", "BSL", "ET", "BPL", "GWL", "AGC", "NDLS"],
        current_station_code="CSMT",
        current_station_index=0
    ),
    PassengerJourney(
        pnr="4198203912",
        passenger_name="Rohan Verma",
        phone_number="+919811223344",
        train_number="12301",
        train_name="Howrah Rajdhani Express",
        origin="HWH",
        destination="NDLS",
        scheduled_departure="2026-08-22T16:50:00",
        scheduled_arrival="2026-08-23T10:05:00",
        route_stations=["HWH", "ASN", "DHN", "GAYA", "DDU", "PRYJ", "CNB", "NDLS"],
        current_station_code="CNB",
        current_station_index=6
    ),
    PassengerJourney(
        pnr="9703411209",
        passenger_name="Sunita Patil",
        phone_number="+919833001122",
        train_number="97034",
        train_name="Kalyan - CSMT Fast Local",
        origin="KYN",
        destination="CSMT",
        scheduled_departure="2026-08-23T11:15:00",
        scheduled_arrival="2026-08-23T12:20:00",
        route_stations=["KYN", "DI", "TNA", "BND", "GC", "CLA", "DR", "BY", "CSMT"],
        current_station_code="KYN",
        current_station_index=0
    )
]


# =======================================================================
# 1. FEATURE 1: ACCIDENT SENSING & EXACT SMART NOTIFICATIONS
# =======================================================================

@app.post("/api/v1/accidents/report", summary="Report Accident, Detect Route Intersects & Issue Exact Alerts")
async def report_accident_and_notify(accident: AccidentReport):
    """
    1. Ingests track accident report.
    2. Runs AI Intersection Algorithm against active passengers.
    3. Generates exact non-generic notifications with accident details.
    4. Automatically pre-calculates smart reroutes for affected trains.
    """
    # 1. Scan passenger pool for affected journeys
    affected_notifications = accident_detector.scan_all_passengers_for_accident(
        accident=accident,
        active_passengers=SAMPLE_PASSENGERS
    )

    # 2. Dispatch notifications
    delivery_receipts = notification_service.dispatch_batch(affected_notifications)

    # 3. Pre-compute alternative routes for disrupted section
    reroute_results = route_optimizer.compute_smart_reroutes(
        origin=accident.from_station,
        destination="NDLS",
        blocked_sections=[f"{accident.from_station}-{accident.to_station}"]
    )

    return {
        "status": "ACCIDENT_LOGGED_AND_ALERTS_DISPATCHED",
        "accident_id": accident.accident_id,
        "affected_passengers_count": len(affected_notifications),
        "notifications_generated": affected_notifications,
        "delivery_receipts": delivery_receipts,
        "automated_reroute_options": reroute_results.options
    }


# =======================================================================
# 2. FEATURE 2: PLANNER MEGA BLOCK CIRCULAR AI SCANNER
# =======================================================================

@app.post("/api/v1/megablocks/scan-circular", summary="AI Scan Planner Mega Block Circular & Match Passengers")
async def scan_megablock_circular(request: MegaBlockUploadRequest):
    """
    1. Accepts raw text / circular uploaded by railway block planner.
    2. AI extracts structured division, track line, time window, and train impacts.
    3. Matches passengers traveling through the affected corridor.
    4. Dispatches personalized advisory alerts.
    """
    raw_text = request.raw_circular_text or (
        "CENTRAL RAILWAY PRESS RELEASE: MEGA BLOCK ON 23.08.2026. "
        "Central Railway's Mumbai Division will operate Mega Block on its suburban sections for carrying out "
        "track renewal, overhead equipment (OHE) maintenance, and signaling works. "
        "Between THANE and KALYAN from 10.30 AM to 3.30 PM on UP & DOWN FAST LINES. "
        "Fast local services departing CSMT will be diverted on Slow lines. "
        "Mail / Express Train Nos. 12137 (Punjab Mail), 11057 (Amritsar Express) and 12163 will be regulated/delayed by 20 mins."
    )

    # AI Extraction
    extracted_block = megablock_scanner.extract_from_raw_text(
        raw_text=raw_text,
        uploaded_by_planner_id=request.uploaded_by_planner_id
    )

    # Match Passengers
    matched_notifications = megablock_scanner.match_passengers_for_megablock(
        block=extracted_block,
        passengers=SAMPLE_PASSENGERS
    )

    # Dispatch alerts
    receipts = notification_service.dispatch_batch(matched_notifications)

    return {
        "status": "CIRCULAR_SCANNED_SUCCESSFULLY",
        "extracted_block_details": extracted_block,
        "matched_passengers_count": len(matched_notifications),
        "personalized_alerts_sent": matched_notifications,
        "delivery_receipts": receipts
    }


# =======================================================================
# 3. FEATURE 3: DYNAMIC SMART ALTERNATIVE ROUTE ENGINE
# =======================================================================

@app.post("/api/v1/routes/rethink", response_model=RerouteResponse, summary="Compute Smart Dynamic Alternative Routes")
async def calculate_alternative_routes(request: RerouteRequest):
    """
    Computes 3 coordinated alternative routing options:
    1. Continuous Rail Diversion (via chord lines/bypasses).
    2. Multi-Hop Train Connecting Transfer at nearest hub.
    3. Intermodal Rapid Express Shuttle.
    """
    try:
        response = route_optimizer.compute_smart_reroutes(
            origin=request.current_station,
            destination=request.destination_station,
            blocked_sections=request.blocked_sections
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# =======================================================================
# 4. PASSENGER & NETWORK STATUS ENDPOINTS
# =======================================================================

@app.get("/api/v1/passengers/{pnr}/live-status", summary="Get Passenger Real-Time Journey & Alert Status")
async def get_passenger_status(pnr: str):
    """
    Retrieves journey status, targeted notifications, and active rerouting options for a PNR.
    """
    passenger = next((p for p in SAMPLE_PASSENGERS if p.pnr == pnr), None)
    if not passenger:
        raise HTTPException(status_code=404, detail=f"PNR {pnr} not found in active database.")

    alerts = notification_service.get_notifications_for_pnr(pnr)

    # Check if there are active reroute recommendations
    reroute_opts = []
    if alerts and alerts[0].has_reroute_available:
        try:
            reroute_res = route_optimizer.compute_smart_reroutes(
                origin=passenger.current_station_code or passenger.origin,
                destination=passenger.destination,
                blocked_sections=["AGC-MTJ"]
            )
            reroute_opts = reroute_res.options
        except Exception:
            pass

    return {
        "passenger": passenger,
        "active_alerts": alerts,
        "has_active_disruption": len(alerts) > 0,
        "recommended_alternative_routes": reroute_opts
    }


@app.get("/api/v1/alerts/feed", summary="Get Live System-Wide Alert Feed")
async def get_live_alerts_feed():
    return {
        "total_active_alerts": len(notification_service.get_all_active_alerts()),
        "alerts": notification_service.get_all_active_alerts()
    }


@app.get("/api/v1/network/graph-status", summary="Get Railway Topology Nodes & Edges with Live Status")
async def get_network_graph():
    """
    Returns nodes (stations) and edges (corridors) with coordinates and status
    for interactive map visualization.
    """
    nodes = []
    for node, data in route_optimizer.graph.nodes(data=True):
        nodes.append({
            "id": node,
            "name": data.get("name", node),
            "zone": data.get("zone", ""),
            "lat": data.get("lat", 0.0),
            "lon": data.get("lon", 0.0)
        })

    edges = []
    for u, v, data in route_optimizer.graph.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "distance_km": data.get("distance_km", 0),
            "max_speed": data.get("max_speed", 0),
            "status": data.get("status", "NORMAL")
        })

    return {
        "nodes_count": len(nodes),
        "edges_count": len(edges),
        "nodes": nodes,
        "edges": edges
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
