from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Track & Station Schemas ---
class StationResponse(BaseModel):
    station_code: str
    station_name: str
    division_id: str
    latitude: float
    longitude: float
    elevation_meters: Optional[float] = None
    platforms_count: int = 2
    is_junction: bool = False

class TrackSectionResponse(BaseModel):
    section_id: str
    division_id: str
    from_station_code: str
    to_station_code: str
    line_type: str
    distance_km: float
    max_permissible_speed_kmph: int
    current_status: str
    status_reason: Optional[str] = None
    status_color_hex: Optional[str] = "#22C55E"

# --- Train & Telemetry Schemas ---
class TrainScheduleStop(BaseModel):
    stop_sequence: int
    station_code: str
    scheduled_arrival: Optional[str] = None
    scheduled_departure: Optional[str] = None
    dwell_minutes: int = 2
    platform_number: Optional[str] = None
    distance_from_source_km: Optional[float] = None

class TrainResponse(BaseModel):
    train_number: str
    train_name: str
    train_type: str
    source_station_code: str
    destination_station_code: str
    priority_level: int
    max_operating_speed_kmph: int
    is_active: bool = True

class TrainTelemetryPing(BaseModel):
    train_number: str
    current_section_id: Optional[str] = None
    current_latitude: float
    current_longitude: float
    current_speed_kmph: float = 0.0
    delay_minutes: int = 0
    heading_degrees: Optional[float] = None
    kavach_status: Optional[str] = "ARMED_NORMAL"

class TrainTelemetryResponse(TrainTelemetryPing):
    last_ping_at: Optional[str] = None
    delay_category: Optional[str] = "ON_TIME"

# --- AI Block Planning Schemas ---
class BlockRequestCreate(BaseModel):
    division_id: str = "CR_MUMBAI"
    section_id: str
    department: str = "PERMANENT_WAY"  # 'PERMANENT_WAY', 'OHE_ELECTRICAL', 'SIGNALING_TELECOM'
    work_description: str
    required_duration_minutes: int
    preferred_start_window_start: str
    preferred_start_window_end: str
    priority: str = "HIGH"
    demanded_by_officer: Optional[str] = None

class BlockRequestResponse(BlockRequestCreate):
    request_id: str
    created_at: Optional[str] = None

class AIOptimizeRequest(BaseModel):
    division_id: str = "CR_MUMBAI"
    target_date: Optional[str] = None
    prioritize_passenger_throughput: bool = True

class AIBlockPlanResponse(BaseModel):
    plan_id: str
    request_id: str
    section_id: str
    optimized_start_time: str
    optimized_end_time: str
    allocated_duration_minutes: int
    asset_availability_score: float
    traffic_throughput_loss_score: float
    predicted_delay_impact_minutes: int
    solver_algorithm: str
    status: str
    approved_by_controller: Optional[str] = None

class OptimizationMetricsResponse(BaseModel):
    pre_optimization_asset_utilization_pct: float
    post_optimization_asset_utilization_pct: float
    corridor_throughput_gain_pct: float
    total_passenger_delay_minutes_mitigated: int
    maintenance_windows_granted: int
    conflicts_detected_and_resolved: int

# --- Safety & Accident Schemas ---
class AccidentReportCreate(BaseModel):
    train_number: Optional[str] = None
    section_id: str
    latitude: float
    longitude: float
    nearest_station_code: Optional[str] = None
    accident_type: str = "DERAILMENT"  # DERAILMENT, COLLISION, OHE_SNAP, BOULDER_FALL
    severity: str = "MAJOR"  # CRITICAL, MAJOR, MODERATE, MINOR
    casualties_reported: int = 0
    injuries_reported: int = 0
    reported_by: str
    root_cause_summary: Optional[str] = None

class AccidentResponse(AccidentReportCreate):
    accident_id: str
    status: str = "REPORTED"
    reported_at: str
    relief_train_dispatched: bool = False

class AccidentStatusUpdate(BaseModel):
    status: str  # 'REPORTED', 'RESCUE_IN_PROGRESS', 'TRACK_RESTORATION', 'CLEARED_REOPENED'
    relief_train_dispatched: Optional[bool] = None
    restoration_notes: Optional[str] = None

# --- Mega Block Schemas ---
class MegaBlockCreate(BaseModel):
    division_id: str = "CR_MUMBAI"
    section_id: str
    line_affected: str = "UP_SLOW"
    start_time: str
    end_time: str
    headline: str
    purpose: str
    alternative_transport_notes: Optional[str] = None

class MegaBlockResponse(MegaBlockCreate):
    mega_block_id: str
    status: str = "UPCOMING"
    affected_trains_count: int = 0

class TrainDiversionResponse(BaseModel):
    diversion_id: int
    source_event_id: str
    train_number: str
    action_type: str
    original_route_summary: Optional[str] = None
    diverted_via_stations: Optional[str] = None
    public_notice: Optional[str] = None

# --- Alerts & Notifications Schemas ---
class AlertSubscriptionCreate(BaseModel):
    phone_number: str
    full_name: Optional[str] = None
    pnr_number: Optional[str] = None
    subscribed_train_number: Optional[str] = None
    subscribed_section_id: Optional[str] = None
    alert_on_accidents: bool = True
    alert_on_mega_blocks: bool = True
    proximity_radius_km: int = 25

class BroadcastAlertResponse(BaseModel):
    alert_id: str
    alert_type: str
    severity: str
    headline: str
    body_text: str
    affected_section_id: Optional[str] = None
    geo_center_lat: Optional[float] = None
    geo_center_lon: Optional[float] = None
    created_at: str
