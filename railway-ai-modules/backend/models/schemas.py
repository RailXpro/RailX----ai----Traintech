"""
schemas.py - Data Models & Schemas for AI Railway Block Planning & Notification System
Defines Pydantic models with graceful dataclass fallback for Accidents, Mega Blocks, Passenger PNRs, Routes, and Notifications.
"""

from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

try:
    from pydantic import BaseModel, Field
    HAS_PYDANTIC = True
except ImportError:
    HAS_PYDANTIC = False
    # Fallback class for environments without pydantic
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def dict(self):
            return self.__dict__
        def model_dump(self):
            return self.__dict__
    def Field(default=None, **kwargs):
        return default


class AccidentSeverity(str, Enum):
    MINOR = "MINOR"         # Minor derailment in yard, signal failure, no casualties
    MODERATE = "MODERATE"   # OHE snap, single track blocked, speed restriction
    SEVERE = "SEVERE"       # Main line blocked, multi-coach derailment
    CRITICAL = "CRITICAL"   # Both UP & DOWN lines blocked, major collision


class AccidentType(str, Enum):
    DERAILMENT = "DERAILMENT"
    COLLISION = "COLLISION"
    OHE_FAILURE = "OHE_FAILURE"
    SIGNAL_FAILURE = "SIGNAL_FAILURE"
    TRACK_FRACTURE = "TRACK_FRACTURE"
    LANDSLIDE = "LANDSLIDE"
    FIRE = "FIRE"
    BOULDER_FALL = "BOULDER_FALL"


class TrackLineType(str, Enum):
    UP_MAIN = "UP_MAIN"
    DOWN_MAIN = "DOWN_MAIN"
    UP_SLOW = "UP_SLOW"
    DOWN_SLOW = "DOWN_SLOW"
    BOTH_MAIN = "BOTH_MAIN"
    ALL_LINES = "ALL_LINES"
    CHORD_LINE = "CHORD_LINE"


class DisruptionStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INVESTIGATING = "INVESTIGATING"
    RESTORATION_IN_PROGRESS = "RESTORATION_IN_PROGRESS"
    RESOLVED = "RESOLVED"


# ==========================================
# 1. ACCIDENT SCHEMAS
# ==========================================

class AccidentReport(BaseModel):
    accident_id: str = Field(..., example="ACC-2026-0822-01")
    train_number: Optional[str] = Field(None, example="12951")
    train_name: Optional[str] = Field(None, example="Mumbai Tejas Rajdhani Express")
    accident_type: AccidentType = Field(..., example=AccidentType.DERAILMENT)
    severity: AccidentSeverity = Field(..., example=AccidentSeverity.SEVERE)
    division: str = Field(..., example="Agra Division (NCR)")
    section_code: str = Field(..., example="AGC-MTJ")
    from_station: str = Field(..., example="AGC")
    to_station: str = Field(..., example="MTJ")
    kilometer_marker: Optional[str] = Field(None, example="Km 1342/12")
    lines_affected: TrackLineType = Field(..., example=TrackLineType.BOTH_MAIN)
    casualties_reported: int = Field(0, example=0)
    injuries_reported: int = Field(0, example=0)
    details: str = Field(..., example="Rear 3 coaches of Goods Train BTPN derailed near Farah. UP and DOWN lines blocked.")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    relief_train_dispatched: bool = Field(True)
    helpline_numbers: List[str] = Field(default=["0562-2421204", "139", "1072"])
    estimated_clearance_hours: float = Field(..., example=4.5)


# ==========================================
# 2. MEGA BLOCK SCHEMAS (CIRCULAR SCANNING)
# ==========================================

class MegaBlockUploadRequest(BaseModel):
    raw_circular_text: Optional[str] = None
    document_title: Optional[str] = Field(None, example="Central Railway Press Release - Mega Block on 23.08.2026")
    uploaded_by_planner_id: str = Field(..., example="PLN_CR_MUMBAI_04")


class ExtractedMegaBlock(BaseModel):
    block_id: str = Field(..., example="MB-CR-20260823-01")
    railway_zone: str = Field(..., example="Central Railway (CR)")
    division: str = Field(..., example="Mumbai Division")
    section: str = Field(..., example="Thane - Kalyan")
    from_station: str = Field(..., example="TNA")
    to_station: str = Field(..., example="KYN")
    affected_lines: List[str] = Field(default=["UP Fast", "DOWN Fast"])
    start_time: str = Field(..., example="2026-08-23T10:30:00")
    end_time: str = Field(..., example="2026-08-23T15:30:00")
    duration_hours: float = Field(..., example=5.0)
    maintenance_type: str = Field(..., example="Track Renewal & Overhaul of Overhead Equipment (OHE)")
    train_impacts: List[str] = Field(
        default=["Fast locals diverted to Slow line", "Mail/Express trains delayed by 15-20 mins"]
    )
    cancelled_trains: List[str] = Field(default=[])
    diverted_trains: List[str] = Field(default=["12137", "11057", "12163"])
    speed_restrictions_kmph: Optional[int] = Field(30, example=30)
    confidence_score: float = Field(0.95, example=0.95)


# ==========================================
# 3. PASSENGER & JOURNEY SCHEMAS
# ==========================================

class PassengerJourney(BaseModel):
    pnr: str = Field(..., example="8421984210")
    passenger_name: str = Field(..., example="Aarav Sharma")
    phone_number: str = Field(..., example="+919876543210")
    train_number: str = Field(..., example="12951")
    train_name: str = Field(..., example="Mumbai Rajdhani Express")
    origin: str = Field(..., example="BCT")
    destination: str = Field(..., example="NDLS")
    scheduled_departure: str = Field(..., example="2026-08-22T17:00:00")
    scheduled_arrival: str = Field(..., example="2026-08-23T08:32:00")
    route_stations: List[str] = Field(
        default=["BCT", "ST", "BRC", "RTM", "KOTA", "SWM", "MTJ", "NZM", "NDLS"]
    )
    current_station_code: Optional[str] = Field("KOTA", example="KOTA")
    current_station_index: int = Field(4, example=4)


# ==========================================
# 4. NOTIFICATION & ALERT SCHEMAS
# ==========================================

class NotificationPriority(str, Enum):
    CRITICAL_EMERGENCY = "CRITICAL_EMERGENCY"
    HIGH_DISRUPTION = "HIGH_DISRUPTION"
    MEDIUM_ADVISORY = "MEDIUM_ADVISORY"
    INFO = "INFO"


class SmartNotification(BaseModel):
    notification_id: str = Field(..., example="NOTIF-8421984210-ACC")
    pnr: str = Field(..., example="8421984210")
    passenger_name: str = Field(..., example="Aarav Sharma")
    train_number: str = Field(..., example="12951")
    priority: NotificationPriority = Field(..., example=NotificationPriority.CRITICAL_EMERGENCY)
    headline: str = Field(..., example="🚨 EMERGENCY TRACK ADVISORY: Accident ahead on your train route")
    exact_incident_details: str = Field(
        ...,
        example="Accident: Derailment of Goods Train at Km 1342/12 between Agra Cantt (AGC) & Mathura Jn (MTJ). Both UP & DOWN main lines blocked."
    )
    impact_on_journey: str = Field(
        ...,
        example="Your train #12951 is approaching this section. Expected delay: ~3.5 hrs. Train will be diverted via Alwar-Rewari bypass."
    )
    actionable_alternatives: List[str] = Field(
        default=["View AI Alternative Reroute", "Request Emergency Meal/Water Assistance", "Call IR Helpline 139"]
    )
    helpline_contacts: List[str] = Field(default=["139", "0562-2421204", "1072"])
    has_reroute_available: bool = Field(True)
    generated_at: datetime = Field(default_factory=datetime.utcnow)


# ==========================================
# 5. DYNAMIC REROUTE SCHEMAS
# ==========================================

class RerouteRequest(BaseModel):
    pnr: Optional[str] = Field(None, example="8421984210")
    train_number: Optional[str] = Field(None, example="12951")
    current_station: str = Field(..., example="KOTA")
    destination_station: str = Field(..., example="NDLS")
    blocked_sections: List[str] = Field(default=["AGC-MTJ", "MTJ-NZM"], example=["AGC-MTJ"])


class AlternativeRouteOption(BaseModel):
    option_id: str = Field(..., example="REROUTE-OPT-1")
    strategy_type: str = Field(..., example="RAIL_DIVERSION_CHORD_BYPASS")
    title: str = Field(..., example="Direct Railway Diversion via Sawai Madhopur - Jaipur - Rewari")
    path_stations: List[str] = Field(default=["KOTA", "SWM", "JP", "RE", "DEC", "NDLS"])
    bypassed_blocked_stations: List[str] = Field(default=["AGC", "MTJ", "NZM"])
    additional_distance_km: float = Field(42.0, example=42.0)
    revised_eta: str = Field(..., example="2026-08-23T11:45:00")
    delay_minutes: int = Field(190, example=190)
    comfort_score: float = Field(0.92, example=0.92)
    feasibility_status: str = Field("HIGHLY_FEASIBLE", example="HIGHLY_FEASIBLE")
    reasoning: str = Field(
        ...,
        example="Double-electrified line via Jaipur-Rewari cord has available slot capacity with minimum speed penalty."
    )


class RerouteResponse(BaseModel):
    success: bool = True
    incident_type: str = Field(..., example="ACCIDENT_BLOCKADE")
    blocked_section: str = Field(..., example="AGC-MTJ")
    options: List[AlternativeRouteOption] = []
    recommended_option_id: str = Field(..., example="REROUTE-OPT-1")
    generated_at: datetime = Field(default_factory=datetime.utcnow)
