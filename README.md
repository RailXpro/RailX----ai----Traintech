# RailX----ai----Traintech
# 🚆 Indian Railways: AI-Powered Automatic Block Planning & Disruption Management System

An intelligent platform for Indian Railways that combines AI-driven mega block planning, real-time track accident localization, passenger-specific dynamic alerts, and smart multi-modal route rethink.

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
├── rail-kavach-ai/             # React + Vite Interactive Web Frontend
│   ├── src/
│   │   ├── components/         # Planner & Passenger UI Components, Map, Notifications
│   │   ├── services/           # Optimization & Solver Client Services
│   │   └── data/               # Railway topology, train schedules & PNR data
│   └── package.json
│
├── railway-ai-modules/         # Python AI Engine, Backend APIs & Database
│   ├── backend/
│   │   ├── ai_engine/          # Accident detector, Megablock scanner, Route optimizer
│   │   ├── api/                # FastAPI Application & Endpoints
│   │   ├── models/             # Pydantic data schemas
│   │   └── services/           # Notification dispatcher
│   ├── database/
│   │   └── schema.sql          # PostgreSQL/MySQL relational schema & seed data
│   └── INTEGRATION_GUIDE.md    # Comprehensive module documentation
└── README.md
```

---

## 🚀 Quick Start

### 1. Frontend (React + Vite)
```bash
cd rail-kavach-ai
npm install
npm run dev
```

### 2. Backend (FastAPI + AI Engine)
```bash
cd railway-ai-modules/backend
pip install -r requirements.txt
uvicorn api.app:app --reload --port 8000
```
API Documentation: `http://localhost:8000/docs`

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Lucide Icons, Modern CSS Design System
- **Backend:** Python 3.11, FastAPI, Pydantic, NetworkX, Uvicorn
- **Database:** PostgreSQL / MySQL
