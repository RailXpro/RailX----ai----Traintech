# 🚉 RailX AI: Indian Railways Automatic Block Planning & Disruption Management System

[![Indian Railways AI Ops](https://img.shields.io/badge/Indian_Railways-AI_Block_Planning-1e3a8a.svg)](https://indianrailways.gov.in)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688.svg)](https://fastapi.tiangolo.com)
[![PuLP MILP Solver](https://img.shields.io/badge/Constraint_Solver-PuLP_MILP-blue.svg)](https://coin-or.github.io/pulp/)
[![Scikit-Learn ML](https://img.shields.io/badge/ML_Engine-Scikit--Learn_RF-f97316.svg)](https://scikit-learn.org)
[![React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite-61dafb.svg)](https://react.dev)
[![Status](https://img.shields.io/badge/System_Status-Operational_Online-10b981.svg)]()

> **RailX AI** is an enterprise-grade AI optimization and decision-support command center engineered for **Indian Railways (IR)**. It maximizes track asset availability, automates maintenance block allocation, eliminates timetable clashes, estimates downtime through machine learning, and coordinates real-time emergency disaster re-routing with instant passenger/crew broadcast notifications.

---

## 🎯 Core Capabilities & Architecture

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │        IR-Command Center: AI Optimization & Block Planning Panel       │
 │   (Modern Glassmorphism UI, IRCTC Dark Ops Theme, Real-time Visuals)   │
 └───────┬──────────────────────┬──────────────────────┬──────────────────┘
         │                      │                      │
 ┌───────▼──────────────┐┌──────▼───────────────┐┌─────▼──────────────────┐
 │ Optimization Panel   ││ Track Corridor View  ││ Disaster & Mega Blocks │
 │ • Solver Weight Tune ││ • Multi-Track Matrix ││ • Active Alerts & FCM  │
 │ • ILP / Heuristic    ││ • Section Load & OHE ││ • Auto-Reroute Engine  │
 │ • Live Telemetry Log ││ • Dynamic Block Slot ││ • Clash Matrix Table   │
 └───────┬──────────────┘└──────┬───────────────┘└─────┬──────────────────┘
         │                      │                      │
 ┌───────▼──────────────────────▼──────────────────────▼──────────────────┐
 │             FastAPI Backend Services & Real-Time Engine                │
 ├──────────────────────┬──────────────────────┬──────────────────────────┤
 │ Optimization Engine  │ ML Downtime Engine   │ Disaster & Block API     │
 │ • PuLP ILP Solver    │ • Random Forest /    │ • Dynamic Clash Resolver │
 │ • Track Headway Lock │   Gradient Estimator │ • Broadcast Notification │
 │ • Speed / OHE Safety │ • Delay Cascade Calc │ • SSE Telemetry Stream   │
 └──────────────────────┴──────────────────────┴──────────────────────────┘
```

1. **⚡ AI Optimization Engine (Mixed-Integer Linear Programming)**
   - Constraint solver using `PuLP` MILP with spatio-temporal conflict graph resolution.
   - Traffic valley extraction migrating maintenance into low-density windows (01:00 - 05:00 AM / mid-day).
2. **🧠 ML Downtime & Delay Propagation Forecaster**
   - Random Forest Regressor & Gradient Boosted Classifier for actual duration & delay cascade risk.
3. **🚨 Disaster Hub & Real-Time Accident Re-Routing**
   - Automated track lockdown, bi-directional single line working, and passenger advisory broadcasts.
4. **📅 Mega Block Management & NLP Circular Scanner**
   - NLP parsing of circulars and multi-division clash matrix detection.
5. **📊 Interactive Command Center & Passenger Portals**
   - Interactive multi-line rail visualizer, Gantt timetable allocator, and dual-role planner/passenger dashboards.

---

## 📁 Repository Structure

```
RailX----ai----Traintech/
├── backend/                    # Core AI Engine (PuLP MILP Solver & ML Predictor)
│   ├── engine/                 # Database telemetry, optimizer & ML models
│   └── main.py                 # FastAPI application
├── frontend/                   # Obsidian Dark Command Center UI (Vanilla JS/CSS)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── backend_api/                # FastAPI Microservice & WebSocket Hub
│   ├── routers/                # Endpoints for blocks, trains, tracks, accidents, alerts, mega-blocks
│   ├── services/               # AI optimizer & WebSocket manager
│   └── models/                 # Pydantic schemas
├── database/                   # PostgreSQL / Supabase Schema, Seeds & Triggers
│   ├── schema.sql              # Core relational schema
│   ├── seeds.sql               # Indian Railways seed datasets
│   └── triggers_and_views.sql  # Real-time analytics triggers & views
├── rail-kavach-ai/             # React + Vite Interactive Web Frontend
├── railway-ai-modules/         # Python AI Engine Modules & Tests
├── server.py                   # Root Python AI server runner
├── server.js & db.js           # Node.js / Express MySQL Backend Service
├── tests/                      # Python automated test suite
└── README.md
```

---

## 🚀 Quickstart & Installation

### Option 1: RailX AI Command Center (Python + FastAPI)
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the server
python server.py
```
Command Center UI: `http://localhost:8000/`

### Option 2: React + Vite Frontend (rail-kavach-ai)
```bash
cd rail-kavach-ai
npm install
npm run dev
```

### Option 3: Backend API Microservice (FastAPI + WebSockets)
```bash
cd backend_api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation: `http://localhost:8000/docs`

### Option 4: Node.js Express Backend
```bash
npm install
cp .env.example .env
npm start
```
Server: `http://localhost:5000`

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & system status |
| `GET` | `/api/divisions` | List of supported Indian Railways zones & divisions |
| `GET` | `/api/tracks` | Real-time track corridor sections, geometry, and load |
| `GET` | `/api/trains` | Live train schedule, priority tiers, and delays |
| `POST` | `/api/optimize` | Run AI constraint optimizer with custom weights |
| `POST` | `/api/predict-downtime` | Run ML downtime & overrun risk forecast |
| `GET` | `/api/mega-blocks` | Upcoming mega blocks & clash detection feed |
| `POST` | `/api/mega-blocks` | Schedule a new planned maintenance mega block |
| `GET` | `/api/accidents` | Active emergency accidents & disruptions |
| `POST` | `/api/accidents` | Register an emergency accident & trigger dynamic reroute |
| `POST` | `/api/accidents/resolve/{id}` | Resolve incident & restore normal track operations |
| `GET` | `/api/alerts` | Broadcast notifications log (FCM / SMS / Station PA) |
| `GET` | `/api/analytics` | Before vs After optimization KPI comparison |

---

## 🧪 Running Automated Tests

```bash
python -m unittest discover -s tests -p "test_*.py"
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
