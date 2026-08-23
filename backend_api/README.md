# 🚆 RailX AI: Backend API & AI Optimization Engine

Production-grade asynchronous backend service for **AI-Powered Automatic Block Planning and Safety Notification System for Indian Railways**.

---

## ⚡ Key Features

1. **🧠 AI Corridor Block Optimizer (`/api/v1/blocks/optimize`)**:
   - Multi-objective constraint solver scheduling maintenance possessions.
   - Maximizes asset availability (Tamping machines, OHE cars).
   - Minimizes train delays on high-priority routes (Vande Bharat / Rajdhani Express).
   - Provides before vs after optimization metrics (`% asset utilization gain`, `delay hours mitigated`).

2. **🚨 Safety & Accident Emergency Hub (`/api/v1/accidents`)**:
   - Real-time incident reporting with GPS coordinates and casualty tracking.
   - Automatically switches track section availability to `EMERGENCY_CLOSURE`.
   - Dispatches instant alerts to passengers and control rooms via WebSockets.

3. **🚧 Mega Block Passenger Management (`/api/v1/mega-blocks`)**:
   - CRUD management for Sunday and scheduled engineering blocks.
   - Tracks train cancellations, diversions, and alternative transport arrangements.

4. **🛰️ Live Train Operations & Telemetry (`/api/v1/trains`)**:
   - Ingests real-time GPS telemetry, speed, delay minutes, and Kavach anti-collision status.

5. **🗺️ Track Network GIS (`/api/v1/tracks`)**:
   - Real-time section statuses color-coded for interactive GIS visual map rendering:
     - 🟢 `AVAILABLE` (`#22C55E`)
     - 🟡 `CAUTION` (`#EAB308`)
     - 🟠 `BLOCKED` (`#F97316`)
     - 🟣 `MEGA_BLOCK` (`#A855F7`)
     - 🔴 `EMERGENCY_CLOSURE` (`#EF4444`)

6. **📡 Live WebSocket Stream (`/ws/live-feed`)**:
   - Push updates for telemetry pings, accident bulletins, and mega block advisories.

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
pip install -r backend_api/requirements.txt
```

### 2. Start the Server
```bash
uvicorn backend_api.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Interactive Documentation
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Endpoint**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🧪 Running Automated Integration Tests

```bash
pytest backend_api/tests/test_api.py -v
```

---

## 🌐 Database Configuration

- **Default Local**: Zero-config SQLite database (`railx_railways.db`).
- **Production Supabase / PostgreSQL**: Set `DATABASE_URL` in `.env`:
  ```env
  DATABASE_URL=postgresql://postgres.vicszwwamhnrdqlzxegp:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
  ```
