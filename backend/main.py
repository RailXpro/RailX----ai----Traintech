"""
FastAPI Server & REST API for Indian Railways AI Automatic Block Planning System
Provides real-time endpoints for optimizer, ML downtime forecasting, accident feeds, and mega blocks.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import os
import sys
import uvicorn

try:
    from backend.engine.database import db
    from backend.engine.optimizer import optimizer
    from backend.engine.ml_predictor import predictor
except ImportError:
    from engine.database import db
    from engine.optimizer import optimizer
    from engine.ml_predictor import predictor

app = FastAPI(
    title="RailX AI - Automatic Block Planning Engine",
    description="Indian Railways AI-Powered Block Optimization, Asset Availability & Disaster Management Hub",
    version="3.4.0"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class OptimizeRequest(BaseModel):
    strategy: str = Field(default="balanced", description="asset_max, zero_delay, emergency_reroute, balanced")
    weights: Optional[Dict[str, float]] = None
    division_id: str = Field(default="CR_MUMBAI", description="CR_MUMBAI, WR_MUMBAI, NR_DELHI, ALL")

class MLPredictRequest(BaseModel):
    base_duration_hrs: float = 4.0
    work_type: str = "Track Relaying & Tamping"
    traffic_density_tpd: float = 180.0
    track_age_years: float = 12.0
    weather: str = "Monsoon / Heavy Rain"
    crew_count: int = 28
    machine_assisted: bool = True

class AccidentReportRequest(BaseModel):
    section_id: str
    corridor: str
    affected_line: str
    incident_type: str
    severity: str = "High"  # Low, Moderate, High, Critical
    affected_train_number: str
    diversion_route: Optional[str] = "Switch traffic to loop / parallel slow line"

class MegaBlockRequest(BaseModel):
    division_id: str = "CR_MUMBAI"
    corridor: str
    section_id: str
    lines_affected: List[str]
    work_type: str
    requested_window: str
    duration_hours: float
    reason: str

# API Endpoints
@app.get("/api/health")
def health_check():
    return {"status": "ONLINE", "system": "RailX AI Indian Railways Block Planning", "version": "3.4.0"}

@app.get("/api/divisions")
def get_divisions():
    return {"divisions": db.divisions}

@app.get("/api/tracks")
def get_tracks():
    return {"tracks": db.get_tracks()}

@app.get("/api/trains")
def get_trains():
    return {"trains": db.get_trains()}

@app.get("/api/mega-blocks")
def get_mega_blocks():
    return {"mega_blocks": db.get_mega_blocks()}

@app.post("/api/mega-blocks")
def create_mega_block(req: MegaBlockRequest):
    new_mb = db.add_mega_block(req.model_dump())
    # Perform clash check
    if any("Fast" in line for line in req.lines_affected) and "11:00" in req.requested_window:
        new_mb["clash_detected"] = True
        new_mb["clash_details"] = "Automatic Clash: Overlaps peak Rajdhani / Mail path. AI re-routing needed."
    else:
        new_mb["clash_detected"] = False
        new_mb["clash_details"] = "Optimal window verified."
    return {"message": "Mega Block Scheduled", "block": new_mb}

@app.get("/api/accidents")
def get_accidents():
    return {"accidents": db.get_accidents()}

@app.post("/api/accidents")
def report_accident(req: AccidentReportRequest):
    incident = db.add_accident(req.model_dump())
    # Auto-run emergency re-optimization
    opt_result = optimizer.solve(
        strategy="emergency_reroute",
        division_id=req.section_id.split("-")[1] if "-" in req.section_id else "CR_MUMBAI"
    )
    return {
        "message": "Emergency Incident Registered & Corridor Lockdown Enforced",
        "incident": incident,
        "auto_reroute_result": opt_result
    }

@app.post("/api/accidents/resolve/{incident_id}")
def resolve_accident(incident_id: str):
    for inc in db.accidents:
        if inc["incident_id"] == incident_id:
            inc["status"] = "Restored / Normal Operations Resumed"
            # Restore tracks
            for trk in db.tracks:
                if trk["section_id"] == inc.get("section_id"):
                    trk["status"] = "Operational"
                    trk["current_load_pct"] = max(60, trk["current_load_pct"] - 15)
            return {"message": f"Incident {incident_id} marked as resolved. Track section restored to Operational."}
    raise HTTPException(status_code=404, detail="Incident not found")

@app.get("/api/alerts")
def get_alerts():
    return {"alerts": db.get_alerts()}

@app.get("/api/assets")
def get_assets():
    return {"assets": db.get_assets()}

@app.post("/api/optimize")
def run_optimization(req: OptimizeRequest):
    result = optimizer.solve(
        strategy=req.strategy,
        weights=req.weights,
        division_id=req.division_id
    )
    return result

@app.post("/api/predict-downtime")
def predict_downtime(req: MLPredictRequest):
    result = predictor.predict(
        base_duration_hrs=req.base_duration_hrs,
        work_type=req.work_type,
        traffic_density_tpd=req.traffic_density_tpd,
        track_age_years=req.track_age_years,
        weather=req.weather,
        crew_count=req.crew_count,
        machine_assisted=req.machine_assisted
    )
    return result

@app.get("/api/analytics")
def get_analytics():
    # If optimization has been executed, return latest result, else generate fresh balanced
    if db.latest_optimization_result is None:
        db.latest_optimization_result = optimizer.solve(strategy="balanced")
    
    return {
        "kpi_improvements": db.latest_optimization_result["kpi_improvements"],
        "before_metrics": db.latest_optimization_result["before_metrics"],
        "after_metrics": db.latest_optimization_result["after_metrics"],
        "division_utilization_map": db.latest_optimization_result["division_utilization_map"]
    }

# Mount static files
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

    @app.get("/")
    def serve_index():
        return FileResponse(os.path.join(frontend_path, "index.html"))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
