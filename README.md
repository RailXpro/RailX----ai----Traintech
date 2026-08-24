# 🚉 RailX.ai (TrainTech): Indian Railways AI Block Planning & Emergency Disruption Management System

[![CI - Build and Typecheck](https://github.com/RailXpro/RailX----ai----Traintech/actions/workflows/ci.yml/badge.svg)](https://github.com/RailXpro/RailX----ai----Traintech/actions)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688.svg)](https://fastapi.tiangolo.com)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000.svg?logo=express)](https://expressjs.com)
[![PuLP MILP Solver](https://img.shields.io/badge/Constraint_Solver-PuLP_MILP-blue.svg)](https://coin-or.github.io/pulp/)
[![Scikit-Learn ML](https://img.shields.io/badge/ML_Engine-Scikit--Learn_RF-f97316.svg)](https://scikit-learn.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRailXpro%2FRailX----ai----Traintech)

> **RailX.ai (TrainTech)** is a mission-critical operations command system and passenger disruption management platform tailored for **Indian Railways (CRIS / IR-KAVACH)**. It maximizes track asset availability, automates maintenance block allocation, eliminates timetable clashes, estimates downtime through machine learning, and coordinates real-time emergency disaster re-routing with instant passenger/crew broadcast notifications.

🚀 **1-Click Live Deployment:** Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRailXpro%2FRailX----ai----Traintech)** button above to launch your live instance with zero configuration.

---

## 🌟 Key Features & Capabilities

### 1. 🎛️ Operations Controller & Dispatcher Command Console
- **Corridor Track Availability Radar**: Real-time track occupancy (🟢 Clear, 🟡 Mega Block / Maintenance, 🔴 Emergency / Cordoned, 🔵 Speed Restrictions) with interactive section inspector.
- **Interactive SVG Topological Track & Network Maps**:
  - Full corridor topological schematic with live train position indicators and signal status.
  - Dedicated **Mumbai Suburban Network Map** (Western, Central, Harbour Lines) with line-by-line filtering, zoom/pan controls, and active block overlays.
  - Visual circle route map for loop lines and bypass corridors.
- **AI Auto-Block Optimization Engine & Solver Studio**:
  - Multi-objective constraint solver using Mixed-Integer Linear Programming (`PuLP` MILP) and heuristic optimizers.
  - Real-time penalty weight tuning (Punctuality vs. Maintenance Urgency vs. Asset Longevity).
  - Before/After KPI comparative benchmarks (Asset utilization boosted up to 95.8%, delay propagation reduced by 89%).
  - 24-Hour Gantt possession timeline and conflict clash matrix.
- **Mega Block Possession Manager**:
  - Schedule and authorize track possessions (Tamping, OHE wire replacement, Bridge girder overhaul, Kavach Electronic Interlocking upgrades).
  - Manage track machinery, manpower, and safety speed limits.
  - Automated circular & maintenance notice PDF scanner with OCR extraction.
- **Accident & Emergency Incident Center**:
  - Rapid SOS incident intake with automatic signal lockdown (Red aspect).
  - Accident Relief Train (ART / SP-ARME) and NDRF dispatch tracking.
  - Emergency siren alerts, audio cues, and instant safety broadcast generation.
- **Asset Analytics & Health Dashboard**:
  - Live health score tracking across track sections, overhead equipment (OHE), and signaling assets.
  - Machine learning degradation prediction and scheduled maintenance recommendations.
- **Kavach AI 4.0 Collision Avoidance Modal**:
  - Real-time telemetry inspect tool for Train-to-Trackside radio communication and automatic brake application (SPAD prevention).

### 2. 🚆 Passenger & Commuter Live Portal (रेल यात्री साथी - Rail Yatri Saathi)
- **Sunday Mega Block & Disruption Bulletins**: Real-time alerts across suburban and trunk lines with alternate train halts and municipal feeder bus options (BEST, DTC, etc.).
- **Smart Disruption-Aware Trip Planner**: Multi-modal journey planner that dynamically avoids active maintenance blocks and emergency closures.
- **Personalized PNR / Train Watcher**: Real-time status, platform shifts, delay warnings, and detour suggestions.
- **Accident Reroute Advisor**: Interactive detour comparison comparing regular vs. diverted routes with time delta calculations.
- **Emergency Safety Helpline Directory**: Quick access to 24x7 railway helplines (**139 RailMadad**, **1512 GRP**, **182 Women Safety**, **112 National Emergency**).

### 3. 🧪 Interactive Scenario Simulation Sandbox
- **One-Click Sandbox Controls**:
  - ⚡ **Simulate OHE Snap**: Instant emergency lockdown on high-density corridors.
  - 🚧 **Simulate Sunday Mega Block**: Multi-track possession schedule on suburban networks.
  - 🧠 **Run AI Constraint Solver**: Solves conflicts with visual confetti animations and performance telemetry.
  - 🔄 **Reset Network State**: Restores clean operational schedules.

---

## 🏛️ System Architecture

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │        IR-Command Center & Rail Yatri Saathi (React 18 + TS + Vite)    │
 │    (Modern Glassmorphism UI, IRCTC Dark Ops Theme, Real-time Visuals)  │
 └───────┬──────────────────────┬──────────────────────┬──────────────────┘
         │                      │                      │
 ┌───────▼──────────────┐┌──────▼───────────────┐┌─────▼──────────────────┐
 │ Optimization Panel   ││ Track Corridor View  ││ Disaster & Mega Blocks │
 │ • Solver Weight Tune ││ • Multi-Track Matrix ││ • Active Alerts & FCM  │
 │ • ILP / Heuristic    ││ • Suburban Network   ││ • Auto-Reroute Engine  │
 │ • Telemetry Log      ││ • Dynamic Block Slot ││ • Clash Matrix Table   │
 └───────┬──────────────┘└──────┬───────────────┘└─────┬──────────────────┘
         │                      │                      │
 ┌───────▼──────────────────────▼──────────────────────▼──────────────────┐
 │                     Unified Backend Architecture                       │
 ├──────────────────────┬──────────────────────┬──────────────────────────┤
 │ Vercel Serverless    │ Python AI Engine     │ Node.js Express API      │
 │ (Zero-Config APIs)   │ (FastAPI + PuLP)     │ (REST + MySQL/Supabase)  │
 │ • /api/optimize      │ • MILP Optimizer     │ • CRUD Track Operations  │
 │ • /api/accidents     │ • ML Downtime Regr.  │ • Possession Management  │
 │ • /api/mega-blocks   │ • Delay Forecaster   │ • Real-time WebSockets   │
 └──────────────────────┴──────────────────────┴──────────────────────────┘
```

---

## 📁 Repository Structure

```
RailX----ai----Traintech/
├── .github/workflows/ci.yml     # Automated GitHub Actions CI workflow
├── api/                         # Vercel Serverless Function Endpoints
│   ├── accidents.ts             # Emergency incident & ART dispatch API
│   ├── alerts.ts                # Real-time passenger & crew alerts
│   ├── circular-scanner.ts      # OCR & maintenance notice scanner
│   ├── health.ts                # System status & asset health
│   ├── mega-blocks.ts           # Mega block possession management
│   ├── optimize.ts              # Constraint optimization engine endpoint
│   ├── predict-downtime.ts      # ML downtime estimation
│   ├── route-solver.ts          # Disruption-aware trip routing
│   ├── tracks.ts                # Track corridor occupancy & topology
│   └── trains.ts                # Real-time train schedules & telemetry
├── src/                         # React 18 + TypeScript + Vite Frontend
│   ├── components/              # Command console, maps, modals, passenger portal
│   │   ├── auth/                # Authentication & role-based access
│   │   ├── notifications/       # Alert toasts & broadcast modals
│   │   ├── passenger/           # Rail Yatri Saathi portal & detour advisor
│   │   ├── planner/             # Track radars, solver studio, Mumbai map, Kavach
│   │   ├── search/              # Search bars & filter widgets
│   │   └── settings/            # Theme, solver weights & notification prefs
│   ├── context/                 # Railway state engine & solver context
│   ├── data/                    # Mock topology, trains, and historical datasets
│   └── styles/                  # Tailwind-compatible CSS design tokens
├── backend/                     # Python AI Engine (PuLP MILP & ML Models)
│   ├── engine/                  # Solver algorithms, database telemetry & models
│   └── main.py                  # FastAPI server
├── backend_api/                 # FastAPI Microservice & WebSocket Hub
├── database/                    # PostgreSQL / Supabase Schema, Seeds & Triggers
├── rail-kavach-ai/              # Dedicated Rail Kavach AI Subsystem
├── railway-ai-modules/          # Python AI Modules & Unit Test Suites
├── server.py                    # Root Python AI server runner
├── server.js & db.js            # Node.js / Express MySQL Backend Service
├── tests/                       # Automated test suites
├── package.json                 # Node dependencies & project scripts
├── requirements.txt             # Python dependencies
├── vercel.json                  # Vercel deployment configuration
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**
- **Python**: 3.9+ (optional for local Python AI backend)

### 1. React + TypeScript Web Frontend (Recommended)
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

### 2. Python FastAPI AI Engine & Constraint Solver
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
python server.py
# or: uvicorn backend.main:app --reload --port 8000
```
Interactive Swagger API documentation: `http://localhost:8000/docs`

### 3. Node.js Express Backend Service
```bash
# Set up environment variables
cp .env.example .env

# Run the Express server
npm run server
```
Accessible at `http://localhost:5000`.

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/optimize` | `POST` | Executes AI block optimization using MILP constraint solver |
| `/api/accidents` | `GET`, `POST` | Logs incidents, triggers red signal locks & dispatches ART |
| `/api/mega-blocks` | `GET`, `POST` | Schedules and manages track possession windows |
| `/api/tracks` | `GET`, `PUT` | Fetches corridor occupancy and updates track statuses |
| `/api/trains` | `GET` | Returns live train positions and timetable telemetry |
| `/api/predict-downtime`| `POST` | Predicts restoration downtime via Random Forest ML |
| `/api/route-solver` | `POST` | Computes alternative passenger routes avoiding blocks |
| `/api/alerts` | `GET`, `POST` | Dispatches SMS/FCM and public safety broadcasts |
| `/api/circular-scanner`| `POST` | Parses railway maintenance circular documents |
| `/api/health` | `GET` | Returns system health, database & engine status |

---

## 🧪 Testing & Quality Assurance

```bash
# Run TypeScript Typecheck
npm run typecheck

# Build Production Frontend Bundle
npm run build

# Run Python Automated Tests
python -m unittest discover -s tests -p "test_*.py"
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Built with pride for Indian Railways (भारतीय रेल) & Centre for Railway Information Systems (CRIS).**
