"""
RailX AI: End-to-End API Integration & AI Engine Test Suite
"""

import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from backend_api.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database_backend" in data

@pytest.mark.asyncio
async def test_stations_and_tracks():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Stations
        stations_res = await ac.get("/api/v1/tracks/stations")
        assert stations_res.status_code == 200
        stations = stations_res.json()
        assert len(stations) >= 5
        assert any(s["station_code"] == "CSMT" for s in stations)

        # Track Sections
        tracks_res = await ac.get("/api/v1/tracks/sections")
        assert tracks_res.status_code == 200
        tracks = tracks_res.json()
        assert len(tracks) >= 4
        assert "status_color_hex" in tracks[0]

@pytest.mark.asyncio
async def test_trains_and_telemetry():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Trains List
        trains_res = await ac.get("/api/v1/trains")
        assert trains_res.status_code == 200
        trains = trains_res.json()
        assert len(trains) >= 3

        # Update Telemetry Ping
        ping_payload = {
            "train_number": "22225",
            "current_section_id": "SEC_DR_TNA_DOWN_FAST",
            "current_latitude": 19.1450,
            "current_longitude": 72.9520,
            "current_speed_kmph": 115.5,
            "delay_minutes": 1,
            "kavach_status": "ARMED_NORMAL"
        }
        update_res = await ac.post("/api/v1/trains/telemetry/update", json=ping_payload)
        assert update_res.status_code == 200

        # Fetch Telemetry
        tel_res = await ac.get("/api/v1/trains/22225/telemetry")
        assert tel_res.status_code == 200
        tel_data = tel_res.json()
        assert tel_data["train_number"] == "22225"
        assert tel_data["current_speed_kmph"] == 115.5

@pytest.mark.asyncio
async def test_ai_block_planning_optimization():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create Block Request
        req_payload = {
            "division_id": "CR_MUMBAI",
            "section_id": "SEC_CSMT_DR_DOWN_FAST",
            "department": "PERMANENT_WAY",
            "work_description": "Turnout track inspection and rail grinding",
            "required_duration_minutes": 120,
            "preferred_start_window_start": "2026-08-23 01:00:00",
            "preferred_start_window_end": "2026-08-23 05:00:00",
            "priority": "HIGH",
            "demanded_by_officer": "Sr. DEN Mumbai"
        }
        create_res = await ac.post("/api/v1/blocks/requests", json=req_payload)
        assert create_res.status_code == 200
        req_data = create_res.json()
        assert "request_id" in req_data

        # 2. Trigger AI Optimizer
        opt_res = await ac.post("/api/v1/blocks/optimize", json={"division_id": "CR_MUMBAI"})
        assert opt_res.status_code == 200
        opt_data = opt_res.json()
        assert opt_data["status"] == "success"
        assert "optimization_metrics" in opt_data
        assert opt_data["optimization_metrics"]["post_optimization_asset_utilization_pct"] > 60

        # 3. Retrieve Plans
        plans_res = await ac.get("/api/v1/blocks/plans")
        assert plans_res.status_code == 200
        plans = plans_res.json()
        assert len(plans) >= 1

@pytest.mark.asyncio
async def test_accident_reporting_and_alerts():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Report Accident
        acc_payload = {
            "train_number": "95301",
            "section_id": "SEC_CSMT_DR_DOWN_FAST",
            "latitude": 18.9950,
            "longitude": 72.8410,
            "accident_type": "SIGNAL_FAILURE",
            "severity": "MODERATE",
            "casualties_reported": 0,
            "injuries_reported": 0,
            "reported_by": "Station Master Dadar",
            "root_cause_summary": "Point machine signaling track circuit failure"
        }
        acc_res = await ac.post("/api/v1/accidents/report", json=acc_payload)
        assert acc_res.status_code == 200
        acc_data = acc_res.json()
        assert "accident_id" in acc_data
        acc_id = acc_data["accident_id"]

        # Check Active Feed
        active_res = await ac.get("/api/v1/accidents/active")
        assert active_res.status_code == 200
        active_list = active_res.json()
        assert any(a["accident_id"] == acc_id for a in active_list)

        # Check Broadcast Alerts
        alerts_res = await ac.get("/api/v1/alerts/broadcasts")
        assert alerts_res.status_code == 200
        alerts = alerts_res.json()
        assert len(alerts) >= 1

        # Clear and Reopen
        update_res = await ac.put(f"/api/v1/accidents/{acc_id}/status", json={"status": "CLEARED_REOPENED"})
        assert update_res.status_code == 200

@pytest.mark.asyncio
async def test_mega_blocks():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        mb_res = await ac.get("/api/v1/mega-blocks/upcoming")
        assert mb_res.status_code == 200
        mb_list = mb_res.json()
        assert len(mb_list) >= 1
