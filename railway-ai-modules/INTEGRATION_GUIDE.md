# 🚆 Indian Railways AI Block Planning & Smart Notification System
## Integration Guide for the 3 AI Features

This package provides the complete, modular code files to integrate the three requested AI capabilities into your **Indian Railways Automatic Block Planning & Notification Application**:

1. **Feature 1:** **AI Route Rethink & Exact Accident Notifications** (`accident_detector.py`)
2. **Feature 2:** **Planner Mega Block Circular AI Scanner & Passenger Matcher** (`megablock_scanner.py`)
3. **Feature 3:** **Smart Dynamic Alternative Route Engine** (`route_optimizer.py`)

---

## 📁 Package File Structure

```
railway-ai-modules/
├── backend/
│   ├── models/
│   │   └── schemas.py              # Pydantic data schemas for Accidents, Blocks, PNRs, Routes
│   ├── ai_engine/
│   │   ├── accident_detector.py    # Journey-accident intersect & exact notification generator
│   │   ├── megablock_scanner.py    # NLP circular document parser & passenger matcher
│   │   └── route_optimizer.py      # NetworkX railway graph solver & multi-strategy rerouter
│   ├── services/
│   │   └── notification_service.py # Alert dispatcher (Push, SMS, WebSocket)
│   ├── api/
│   │   └── app.py                  # FastAPI server with all endpoints
│   └── requirements.txt            # Python dependencies
├── database/
│   └── schema.sql                  # PostgreSQL / MySQL tables, indexes & Indian Railways seed data
├── frontend/
│   ├── components/
│   │   ├── AccidentRerouteAdvisor.jsx  # UI for exact accident alerts & 1-click rerouting
│   │   ├── MegaBlockUploader.jsx       # Planner document upload & AI extraction preview
│   │   └── PersonalizedAlertCard.jsx   # Passenger customized real-time alert card
│   └── services/
│       └── railwayApi.js               # Frontend API client service
└── INTEGRATION_GUIDE.md            # This integration guide
```

---

## ⚙️ Step-by-Step Integration

### 1. Database Setup (PostgreSQL / MySQL)
Run the SQL migration script located at `database/schema.sql` against your database:
```bash
psql -U your_user -d your_db -f database/schema.sql
```
This creates:
- `stations` and `track_sections` (Railway network topology)
- `trains` and `train_schedule_stops` (Train schedules)
- `passenger_bookings` (PNR records)
- `accidents` (Accident tracking)
- `mega_blocks` (Planned maintenance blocks)
- `disruption_notifications` (Smart alert logs)
- `reroute_proposals` (Dynamic alternative route proposals)

---

### 2. Backend Setup (Python / FastAPI / Django / Flask)

#### Install Dependencies
```bash
pip install -r backend/requirements.txt
```

#### Run the FastAPI Server
```bash
cd backend
uvicorn api.app:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

---

## 🚀 How the 3 Features Work & API Reference

### Feature 1: AI Route Rethink & Exact Accident Notifications
When a track accident is reported, the system:
1. Locates the affected track segment $(From \leftrightarrow To)$.
2. Scans active passenger itineraries to find whose remaining journey passes through the accident point.
3. Generates **exact, non-generic notifications** detailing:
   - Nature of accident (e.g. Derailment of Goods Train BTPN).
   - Exact location (Division, Section, Km marker).
   - Track impact (UP & DOWN Main lines blocked).
   - Expected clearance hours & delay on user's specific train.
   - Relief train dispatch status and emergency helpline numbers.

#### Endpoint:
`POST /api/v1/accidents/report`
```json
{
  "accident_id": "ACC-2026-0822-01",
  "train_number": "12951",
  "accident_type": "DERAILMENT",
  "severity": "SEVERE",
  "division": "Agra Division (NCR)",
  "section_code": "AGC-MTJ",
  "from_station": "AGC",
  "to_station": "MTJ",
  "kilometer_marker": "Km 1342/12",
  "lines_affected": "BOTH_MAIN",
  "details": "Rear 3 coaches of Goods Train BTPN derailed near Farah. UP and DOWN lines blocked.",
  "estimated_clearance_hours": 4.5,
  "helpline_numbers": ["139", "0562-2421204", "1072"]
}
```

---

### Feature 2: Planner Mega Block Circular AI Scanner
Railway block planners upload unstructured press releases or maintenance notices. The AI engine:
1. Parses Zone, Division, Section, Track Lines (Slow/Fast/Harbor), Time Window, and Train Regulations.
2. Cross-references passenger tickets to find passengers scheduled to travel through the corridor during the block window.
3. Dispatches personalized advisory notices.

#### Endpoint:
`POST /api/v1/megablocks/scan-circular`
```json
{
  "raw_circular_text": "CENTRAL RAILWAY PRESS RELEASE: MEGA BLOCK ON 23.08.2026. Central Railway's Mumbai Division will operate Mega Block between THANE and KALYAN from 10.30 AM to 3.30 PM on UP & DOWN FAST LINES. Fast local services will be diverted to slow line. Train Nos. 12137 and 11057 delayed by 20 mins.",
  "uploaded_by_planner_id": "PLN_MUMBAI_01"
}
```

---

### Feature 3: Smart Dynamic Alternative Route Engine
When an accident or mega-block is detected, the AI graph optimizer calculates 3 coordinated rerouting options:
1. **Direct Rail Diversion via Chord Bypass** (Train diverts via chord corridor e.g. Sawai Madhopur $\to$ Jaipur $\to$ Rewari $\to$ Delhi Cantt without passenger deboarding).
2. **Multi-Hop Connecting Train Transfer** (Transfer at nearest junction to connecting High-Speed / Vande Bharat service).
3. **Intermodal Emergency Shuttle** (Express bus link bypassing the blocked track segment to join the onward train).

#### Endpoint:
`POST /api/v1/routes/rethink`
```json
{
  "current_station": "KOTA",
  "destination_station": "NDLS",
  "blocked_sections": ["AGC-MTJ"]
}
```

---

## 💻 Frontend React Integration

Import the provided React components into your dashboard:

```jsx
import React, { useState, useEffect } from 'react';
import AccidentRerouteAdvisor from './components/AccidentRerouteAdvisor';
import MegaBlockUploader from './components/MegaBlockUploader';
import PersonalizedAlertCard from './components/PersonalizedAlertCard';
import railwayApi from './services/railwayApi';

export default function RailwayApp() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch live alerts for passenger PNR 8421984210
    railwayApi.getPassengerStatus('8421984210').then(res => {
      setAlerts(res.active_alerts);
    });
  }, []);

  return (
    <div style={{ background: '#020617', minHeight: '100vh', padding: '24px' }}>
      {/* 1. Passenger Alert View */}
      {alerts.map(notif => (
        <PersonalizedAlertCard 
          key={notif.notification_id} 
          notification={notif} 
          onExploreReroute={() => alert("Exploring AI Reroute Options")}
        />
      ))}

      {/* 2. AI Reroute & Accident Visualizer */}
      <AccidentRerouteAdvisor />

      {/* 3. Planner Mega Block Scanner */}
      <MegaBlockUploader />
    </div>
  );
}
```
