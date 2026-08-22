# 🚉 RailX AI: Indian Railways Database Architecture

Welcome to the **RailX AI Database Layer** for the *AI-Powered Automatic Block Planning and Safety Notification System for Indian Railways*.

---

## 📁 Repository File Structure

| File | Description | Target Environment |
| :--- | :--- | :--- |
| [`database/schema.sql`](file:///c:/Users/smsso/RailX----ai----Traintech/database/schema.sql) | Complete DDL Schema (18 tables, custom ENUMs, UUIDs, Foreign Keys, Performance Indexes) | PostgreSQL / Supabase |
| [`database/triggers_and_views.sql`](file:///c:/Users/smsso/RailX----ai----Traintech/database/triggers_and_views.sql) | Automated Event Triggers (accident broadcasts, mega block status sync) & Analytical Views | PostgreSQL / Supabase |
| [`database/seeds.sql`](file:///c:/Users/smsso/RailX----ai----Traintech/database/seeds.sql) | Comprehensive seed data for Mumbai CSMT – Kalyan – Pune corridor (Vande Bharat, Suburban, Assets, Crew, Mega Blocks) | PostgreSQL / Supabase |
| [`database/db_setup.py`](file:///c:/Users/smsso/RailX----ai----Traintech/database/db_setup.py) | Python zero-config setup runner for local development and live diagnostics | SQLite / Local Dev |

---

## 🗄️ Database Tables Overview

### 1. Topology & Infrastructure
- `railway_zones`: Zonal administration (Central, Western, Northern Railways).
- `railway_divisions`: Divisional control offices (Mumbai CSMT, Pune, Delhi).
- `stations`: Geo-referenced station metadata with lat/long and platform details.
- `track_sections`: Physical railway blocks with signaling (ABS/Kavach), electrification, line type (`UP_SLOW`, `DOWN_FAST`), and live operational status (`AVAILABLE`, `CAUTION`, `BLOCKED`, `MEGA_BLOCK`, `EMERGENCY_CLOSURE`).

### 2. Train Operations & Live Telemetry
- `trains`: Train registry (Vande Bharat, Rajdhani, Suburban Local EMUs, Freight).
- `train_schedules`: Stoppages, scheduled arrival/departure, and platform sequence.
- `train_telemetry`: Real-time GPS coordinates, speed, delay tracking, and Kavach anti-collision status.

### 3. Assets & Crew
- `assets`: Locomotives (WAP-7, WAG-9, WAG-12), Rakes, Track Relaying & Tamping machines, OHE Tower Cars.
- `crew_members`: Loco Pilots, Station Masters, and Section Controllers.
- `asset_allocations`: Real-time assignment to train runs or maintenance blocks.

### 4. AI-Powered Block Planning
- `block_requests`: Departmental maintenance possession demands (Track, Electrical OHE, Signaling).
- `ai_block_plans`: Solved schedules (via OR-Tools/MILP) maximizing throughput and minimizing train delays.
- `optimization_metrics`: Comparative before/after analytics (% asset utilization gain, hours saved).

### 5. Safety, Incidents & Accidents
- `accidents`: Real-time incident reporting with GPS coordinates, casualties, relief status, and automatic section closure.
- `speed_restrictions`: Permanent and Temporary Speed Restrictions (TSR).

### 6. Mega Blocks & Advisories
- `mega_blocks`: Planned engineering blocks (e.g. Sunday Mega Blocks).
- `train_diversions`: Train cancellations, short-terminations, and diversion route details.

### 7. Users & Notifications
- `app_users`: Registered passengers and railway personnel.
- `user_subscriptions`: Geo-fenced & train-specific alert subscriptions (PNR/Train/Location).
- `broadcast_alerts`: Dispatched emergency feeds and public advisories.
- `notification_logs`: Delivery audit records across FCM Push, SMS, WhatsApp, and WebSockets.

---

## 🚀 How to Run

### Option 1: Supabase / PostgreSQL (Production)
1. Open your Supabase SQL Editor or `psql` connection.
2. Execute the files in this sequence:
   ```sql
   \i database/schema.sql
   \i database/triggers_and_views.sql
   \i database/seeds.sql
   ```

### Option 2: Local SQLite (Instant Offline Dev)
Run the automated initialization and diagnostic script:
```bash
python database/db_setup.py
```
