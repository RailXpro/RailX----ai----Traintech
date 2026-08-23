# 🚉 RailX AI: UI Integration & Command Center Architecture

[![UI Status](https://img.shields.io/badge/UI_Integration-Complete-10b981.svg)]()
[![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI_0.141.1-009688.svg)](https://fastapi.tiangolo.com)
[![MILP Optimization](https://img.shields.io/badge/Optimization-PuLP_Solver-3b82f6.svg)](https://coin-or.github.io/pulp/)
[![ML Forecaster](https://img.shields.io/badge/ML_Engine-Scikit--Learn-f59e0b.svg)](https://scikit-learn.org)

> **RailX AI: UI Integration** connects the Indian Railways high-performance AI Optimization & ML Downtime Estimation backend directly to an interactive, real-time Obsidian Command Glassmorphism operator dashboard.

---

## 📑 Table of Contents
1. [Overview & System Architecture](#-overview--system-architecture)
2. [UI Design System & Visual Highlights](#-ui-design-system--visual-highlights)
3. [Interactive UI Modules](#-interactive-ui-modules)
4. [Backend API & Data Flow](#-backend-api--data-flow)
5. [Step-by-Step Installation & Run Guide](#-step-by-step-installation--run-guide)
6. [Testing & Quality Assurance](#-testing--quality-assurance)
7. [Directory Structure](#-directory-structure)

---

## 🏗 System Architecture

```
                                  ┌─────────────────────────────────────────┐
                                  │      RailX AI Browser Client (SPA)      │
                                  │  (Vanilla JS + CSS Glassmorphism + SVG) │
                                  └────────────────────┬────────────────────┘
                                                       │
                                  ┌────────────────────▼────────────────────┐
                                  │           HTTP REST & Telemetry         │
                                  │         (JSON Payloads & Status)        │
                                  └────────────────────┬────────────────────┘
                                                       │
                       ┌───────────────────────────────┴──────────────────────────────┐
                       │                                                              │
        ┌──────────────▼──────────────┐                                ┌──────────────▼──────────────┐
        │  FastAPI Application Core   │                                │  In-Memory / SQLite Store   │
        │      (backend/main.py)      │                                │ (backend/engine/database.py)│
        └──────────────┬──────────────┘                                └──────────────┬──────────────┘
                       │                                                              │
        ┌──────────────┴───────────────────────────────┬──────────────────────────────┘
        │                                              │
 ┌──────▼──────────────────────────────┐        ┌──────▼──────────────────────────────┐
 │     AI Block Optimization Engine    │        │       ML Downtime Forecaster        │
 │     (backend/engine/optimizer.py)   │        │     (backend/engine/ml_predictor.py)│
 │  • PuLP Mixed-Integer Linear Solver │        │  • Random Forest Regressor & Clf    │
 │  • Headway & Safety Verification    │        │  • 95% Confidence Interval & Overrun│
 └─────────────────────────────────────┘        └─────────────────────────────────────┘
```

---

## 🎨 UI Design System & Visual Highlights

The operator interface is custom-built with **Vanilla CSS & ES6 JavaScript**, avoiding heavy framework overhead while achieving a 60fps responsive command center experience.

- **Obsidian Command Palette**: Deep slate `#0B0F19` and midnight navy `#111827` backdrops.
- **Glassmorphism Layering**: `backdrop-filter: blur(16px)` with high-contrast semi-transparent border strokes (`rgba(255, 255, 255, 0.08)`).
- **Railway Signal Semantics**:
  - 🟢 **Neon Emerald** (`#10b981`): Clear Track, Optimal Punctuality, Normal Speed.
  - 🟡 **Signal Amber** (`#f59e0b`): Speed Restriction, Caution, High Density Corridor.
  - 🔴 **Alert Crimson** (`#ef4444`): Emergency Corridor Lockdown, Severe Conflict, Derailment/OHE Snag.
  - 🔵 **IRCTC Royal Blue** (`#3b82f6`): Vande Bharat / Rajdhani Priority Corridor.
  - 🟣 **Cyber Violet** (`#8b5cf6`): Freight Heavy-Haul Route.

---

## 🖥️ Interactive UI Modules

### 1. 🎛️ AI Optimizer & Block Scheduler Room
- **Real-Time MILP Weight Tuning**: Dynamic range sliders allowing controllers to balance *Track Asset Availability ($W_{\text{asset}}$)* vs *Passenger Punctuality ($W_{\text{pax}}$)* vs *Timetable Clash Penalties ($W_{\text{clash}}$)*.
- **One-Click Multi-Objective Solve**: Triggers PuLP linear solver asynchronously with visual progress telemetry.
- **Before-vs-After Visual Gantt Chart**: Compares baseline conflicting schedule against AI-optimized conflict-free block plan.
- **Key Metrics Display**: Live computation of Track Hours Unlocked, Passenger Delay Reduction %, and Total Clashes Eliminated.

### 2. 🛤️ Multi-Track Corridor Visualizer
- **Interactive Multi-Line Rail Grid**: Renders Up Fast, Down Fast, Up Slow, Down Slow, and Goods lines for key divisions (Central, Western, Northern, Eastern, Southern Railways).
- **Live Corridor Status**: Shows real-time speed restrictions (TSR), 25kV OHE power status, track maintenance status, and active train coordinates.
- **Interactive Section Details**: Click on any section (e.g., *CSMT - Dadar*, *New Delhi - Ghaziabad*) to inspect track age, curvature, density, and maintenance records.

### 3. 🧠 ML Downtime & Risk Forecaster
- **Configurable Work Parameters**:
  - Work Type (OHE Wire Replacement, Deep Track Tamping, Rail Renewal, Signal Modernization).
  - Corridor Traffic Density (Low, Medium, Super-Dense > 120 trains/day).
  - Weather Condition (Clear, Heavy Monsoon, Dense Winter Fog, Heat Wave).
  - Machinery Level (Manual Gang, CSM-09 Continuous Tamper, High-Speed BCM-350).
  - Crew Deployment Count & Section Geometry.
- **AI Prediction Gauges**:
  - Predicted Actual Downtime with $\pm$ margin (95% Confidence Interval).
  - Maintenance Overrun Probability Risk Score.
  - Delay Cascade Propagation Risk Index.
  - Recommended AI Timetable Padding Buffer.

### 4. 🚨 Disaster Hub & Accident Re-Routing
- **Emergency Reporting Console**: Log sudden derailments, OHE wire entanglements, track fractures, or signal breakdown incidents.
- **Automated Quarantine & Bypass**: Instantly locks down affected tracks, sets emergency speed restrictions, and activates single-line bi-directional working or loop bypasses.
- **Instant Broadcast Notification**: Dispatches simulated multi-channel alerts (SMS, FCM push to loco pilots, and Station Public Address bulletins).

### 5. 📊 Analytics, Audits & Bulletin Export
- **Asset Availability Chart**: Chart.js bar and line metrics comparing pre-optimization vs post-optimization capacity.
- **Official Bulletin Export**: Generates timestamped executive operational reports for Chief Operations Managers (COM) and DRM office archives.

---

## 📡 Backend API & Data Flow

The frontend connects directly to the following FastAPI REST endpoints:

| Endpoint | Method | Purpose | Input Payload / Query | Response Data |
|---|---|---|---|---|
| `/api/health` | `GET` | System heartbeat | None | Status, uptime, active modules |
| `/api/divisions` | `GET` | List IR Zones & Divisions | None | CR, WR, NR, ER, SR division metadata |
| `/api/tracks` | `GET` | Live track status & load | `?division=CR` | Section matrix, TSR, OHE status |
| `/api/trains` | `GET` | Live train timetable & delays | `?division=CR` | Train ID, category, speed, delay |
| `/api/optimize` | `POST` | Execute AI MILP Optimization | Weights `{w_asset, w_pax, w_clash}` | Optimized block schedule & KPI diff |
| `/api/predict-downtime` | `POST` | ML Downtime Prediction | Work parameters JSON | Predicted duration, overrun %, buffer |
| `/api/mega-blocks` | `GET` / `POST`| Mega block management | Block request payload | Registered blocks & clash flags |
| `/api/accidents` | `GET` / `POST`| Emergency disaster logging | Accident details payload | Rerouted corridor plan & active alerts |
| `/api/accidents/resolve/{id}` | `POST` | Resolve incident & restore | Accident ID | Normal operation status |
| `/api/alerts` | `GET` | Broadcast feed | None | List of recent passenger/crew alerts |
| `/api/analytics` | `GET` | System KPI summary | None | Before vs After performance KPIs |

---

## 🚀 Step-by-Step Installation & Run Guide

### 1. Prerequisites
- **Python 3.10+** (Tested on Python 3.11, 3.12, 3.13, 3.14)
- Modern Web Browser (Chrome, Edge, Firefox, Safari)

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/RailXpro/RailX----ai----Traintech.git
cd RailX----ai----Traintech

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install required dependencies
pip install -r requirements.txt
```

### 3. Launch the Server
```bash
python server.py
```
*Alternatively, run via Uvicorn directly:*
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Access the UI
Open your browser and navigate to:
```
http://127.0.0.1:8000/
```
Interactive Swagger API documentation is available at:
```
http://127.0.0.1:8000/docs
```

---

## 🧪 Testing & Quality Assurance

Run the automated test suite to verify the optimizer, ML models, and API endpoints:

```bash
# Activate environment and run tests
python tests/test_all.py
```

Expected output:
```text
test_accident_and_reroute (__main__.TestRailXBackend.test_accident_and_reroute) ... ok
test_health_endpoint (__main__.TestRailXBackend.test_health_endpoint) ... ok
test_ml_downtime_predictor (__main__.TestRailXBackend.test_ml_downtime_predictor) ... ok
test_optimizer_solver (__main__.TestRailXBackend.test_optimizer_solver) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.152s

OK
```

---

## 📁 Directory Structure

```text
RailX----ai----Traintech/
├── backend/
│   ├── engine/
│   │   ├── __init__.py
│   │   ├── database.py       # Indian Railways corridor models & in-memory telemetry
│   │   ├── optimizer.py      # PuLP Mixed-Integer Linear Optimizer & clash resolver
│   │   └── ml_predictor.py   # Scikit-learn Random Forest Downtime & Overrun Model
│   ├── __init__.py
│   └── main.py               # FastAPI router, CORS setup & static file mounts
├── frontend/
│   ├── index.html            # Obsidian Dark glassmorphism operator dashboard
│   ├── styles.css            # Complete CSS design system & dynamic animations
│   └── app.js                # ES6 UI controller, Chart.js integrations & API calls
├── tests/
│   └── test_all.py           # Comprehensive unit tests
├── server.py                 # Application launcher
├── requirements.txt          # Python dependencies
├── UI_INTEGRATION_README.md  # Detailed UI integration guide
└── README.md                 # Main project documentation
```

---

## 👥 Contributors & Maintainers
- **RailX AI Development Team** (`RailXpro`)
- Designed for Indian Railways Modernization & Digital Operational Excellence.
