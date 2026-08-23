# RailX - Indian Railways AI Block Planning & Disruption Management System

An intelligent, multi-tier platform for Indian Railways that combines AI-driven mega block planning, real-time track accident localization, passenger-specific dynamic alerts, smart multi-modal route rethink, and comprehensive database/API architecture.

---

## 🌟 Core Features

1. **AI Route Rethink & Exact Accident Notifications**
   - Precise localization of track disruptions (Division, Section, Km marker, line blockage).
   - Real-time scanning of passenger journeys passing through the affected corridor.
   - Exact, actionable notification dispatch with estimated clearance and emergency contacts.

2. **Mega Block Circular AI Scanner & Passenger Matcher**
   - Natural Language Processing (NLP) of unstructured maintenance press releases and divisional circulars.
   - Automatic extraction of affected lines (Slow/Fast/Harbor), time windows, and regulated train numbers.
   - Passenger cohort cross-referencing for preemptive disruption advisories.

3. **Smart Dynamic Alternative Route Engine**
   - Multi-strategy graph solver (Chord corridor bypass, multi-hop junction transfers, intermodal emergency shuttles).
   - Delay minimization and asset availability maximization.

4. **Dual Role Interactive Dashboard**
   - **Planner View:** Block scheduler, track section heatmaps, asset fleet availability, circular scanner.
   - **Passenger View:** Real-time journey tracking, customized disruption cards, 1-click alternative journey selector.

---

## 📁 Repository Structure

```
├── backend_api/                # FastAPI Microservice & AI Block Optimizer
│   ├── routers/                # Endpoints for blocks, trains, tracks, accidents, alerts, mega-blocks
│   ├── services/               # AI optimizer & WebSocket hub
│   └── models/                 # Pydantic schemas
├── database/                   # PostgreSQL / Supabase Schema, Seeds & Triggers
│   ├── schema.sql              # Core relational schema
│   ├── seeds.sql               # Indian Railways seed datasets
│   └── triggers_and_views.sql  # Real-time analytics triggers & views
├── rail-kavach-ai/             # React + Vite Interactive Web Frontend
│   ├── src/                    # Components, map visualization, solver client
│   └── package.json
├── railway-ai-modules/         # Python AI Engine, Backend APIs & Database
│   ├── backend/                # Accident detector, Megablock scanner, Route optimizer
│   └── database/               # Secondary relational definitions & documentation
├── db.js & server.js           # Node.js / Express MySQL Backend Service
└── README.md
```

---

## 🚀 Quick Start

### 1. Python FastAPI Backend & AI Optimizer
```bash
cd backend_api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation: `http://localhost:8000/docs`

### 2. React + Vite Frontend (rail-kavach-ai)
```bash
cd rail-kavach-ai
npm install
npm run dev
```

### 3. Node.js Express Backend
```bash
npm install
cp .env.example .env
npm start
```
The server will run on `http://localhost:5000`.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Lucide Icons, Modern CSS Design System
- **Backend:** Python 3.11, FastAPI, Pydantic, NetworkX, Uvicorn, Node.js & Express
- **Database:** PostgreSQL (Supabase) / MySQL
- **Real-Time:** WebSockets for live track & block status updates
