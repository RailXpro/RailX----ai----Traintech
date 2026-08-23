# 🚉 RailX AI: Automatic Block Planning & Optimization Hub for Indian Railways

[![Indian Railways AI Ops](https://img.shields.io/badge/Indian_Railways-AI_Block_Planning-1e3a8a.svg)](https://indianrailways.gov.in)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688.svg)](https://fastapi.tiangolo.com)
[![PuLP MILP Solver](https://img.shields.io/badge/Constraint_Solver-PuLP_MILP-blue.svg)](https://coin-or.github.io/pulp/)
[![Scikit-Learn ML](https://img.shields.io/badge/ML_Engine-Scikit--Learn_RF-f97316.svg)](https://scikit-learn.org)
[![UI Integration](https://img.shields.io/badge/UI_Integration-Docs-purple.svg)](UI_INTEGRATION_README.md)
[![Status](https://img.shields.io/badge/System_Status-Operational_Online-10b981.svg)]()

> **RailX AI** is a full-stack, enterprise-grade AI optimization and decision-support command center engineered for **Indian Railways (IR)**. It maximizes track asset availability, automates maintenance block allocation, eliminates timetable clashes, estimates downtime through machine learning, and coordinates real-time emergency disaster re-routing with instant passenger/crew broadcast notifications.
>
> 📖 For a deep dive into frontend modules and visual components, check out the [UI Integration Guide](UI_INTEGRATION_README.md).

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

### 1. ⚡ AI Optimization Engine (Mixed-Integer Linear Programming)
- **Constraint Solver**: Uses `PuLP` Mixed-Integer Linear Optimizer (MILP) with spatio-temporal conflict graph resolution.
- **Multi-Objective Formulation**:
  $$\max \text{Score} = W_{\text{asset}} \cdot (\text{Open Track Hours}) - W_{\text{pax}} \cdot \sum (P_k \cdot D_k) - W_{\text{clash}} \cdot C - W_{\text{reroute}} \cdot R$$
  where $P_k$ represents train priority weights (Platinum: Vande Bharat / Rajdhani = 10x, Gold: Express = 6x, Silver: Freight = 3x, Bronze: Suburban = 4x).
- **Safety & Capacity Constraints**: Enforces minimum safe headway (Automatic Block Signaling 180s), 25kV AC OHE power block isolation, and emergency quarantine zones.
- **Traffic Valley Extraction**: Automatically migrates heavy maintenance blocks (OHE wire overhaul, Track tamping) into low-density night valleys (01:00 - 05:00 AM) and mid-day lulls (11:30 - 14:00).

### 2. 🧠 ML Downtime & Delay Propagation Forecaster
- **Predictive Model**: Random Forest Regressor & Gradient Boosted Classifier trained on 1,200 domain-calibrated historical maintenance logs.
- **Dynamic Feature Extraction**: Evaluates work type, corridor traffic density (trains/day), track age, weather conditions (Monsoon downpours, dense fog, extreme heat), crew size, and machinery automation (CSM-09 Tamper / BCM-350).
- **Outputs**:
  - Predicted Actual Downtime Duration with **95% Confidence Interval**.
  - Maintenance Overrun Probability & Delay Cascade Risk Index.
  - Recommended AI Timetable Padding Buffer & Passenger Delay Prevention metrics.

### 3. 🚨 Disaster Hub & Real-Time Accident Re-Routing
- **Emergency Incident Ledger**: Real-time reporting for OHE wire entanglements, rail fractures, derailments, and signal failures.
- **Automated Corridor Lockdown & Rerouting**: Instantly marks affected track lines with emergency speed restrictions (0 km/h) and computes loop line bypasses and bi-directional single line working.
- **Passenger & Crew Alert Broadcast Generator**: Generates formatted emergency advisories dispatched via FCM push, SMS gateways, and station public address systems.

### 4. 📅 Mega Block Management & Automated Clash Detection
- **Multi-Division Support**: Central Railway (CR), Western Railway (WR), Northern Railway (NR), Eastern Railway (ER), Southern Railway (SR).
- **Clash Detection Matrix**: Automatically flags scheduling overlaps between high-priority passenger trains and requested maintenance windows.

### 5. 📊 Interactive Command Center UI
- **Obsidian Command Dark Theme**: IRCTC Blue (`#3b82f6`), Neon Emerald (`#10b981`), Signal Amber (`#f59e0b`), Alert Crimson (`#ef4444`), and Cyber Cyan (`#06b6d4`).
- **Interactive Multi-Line Rail Visualizer**: Renders Up/Down Fast, Slow, and Goods lines with live train nodes and hazard zones.
- **Gantt Timetable Allocator**: Visual before-vs-after comparison illustrating clash resolution.
- **Analytics & Audit Reports**: Chart.js asset availability comparisons and formal bulletin export.

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Python 3.10+** (Python 3.14 compatible)

### Setup & Run
```bash
# 1. Clone the repository
git clone https://github.com/RailXpro/RailX----ai----Traintech.git
cd RailX----ai----Traintech

# 2. Create and activate virtual environment
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the RailX AI Server
python server.py
```

Open your browser and navigate to:
👉 **`http://127.0.0.1:8000/`**

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

## 🧪 Running Unit Tests

Execute the automated test suite:
```bash
.venv\Scripts\python tests/test_all.py
```

Output:
```text
Ran 4 tests in 0.150s
OK
```

---

## 🏛️ Project Directory Structure

```
RailX----ai----Traintech/
├── backend/
│   ├── engine/
│   │   ├── database.py       # Indian Railways database & real-time telemetry store
│   │   ├── optimizer.py      # PuLP Mixed-Integer Linear Optimizer & Heuristics
│   │   └── ml_predictor.py   # Scikit-learn Random Forest Downtime Estimator
│   ├── main.py               # FastAPI application & REST routing
│   └── __init__.py
├── frontend/
│   ├── index.html            # Command center application shell
│   ├── styles.css            # Obsidian command dark styling & glassmorphism
│   └── app.js                # Interactive controller, Chart.js & solver runner
├── tests/
│   └── test_all.py           # Unit tests for solver, ML, and API models
├── server.py                 # Root server startup script
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.