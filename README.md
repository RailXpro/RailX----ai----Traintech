# 🚉 RailX.ai (TrainTech): Indian Railways AI Block Planning & Emergency Disruption Management System

[![CI - Build and Typecheck](https://github.com/RailXpro/RailX----ai----Traintech/actions/workflows/ci.yml/badge.svg)](https://github.com/RailXpro/RailX----ai----Traintech/actions)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688.svg)](https://fastapi.tiangolo.com)
[![PuLP MILP Solver](https://img.shields.io/badge/Constraint_Solver-PuLP_MILP-blue.svg)](https://coin-or.github.io/pulp/)
[![Scikit-Learn ML](https://img.shields.io/badge/ML_Engine-Scikit--Learn_RF-f97316.svg)](https://scikit-learn.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **RailX.ai (TrainTech)** is an enterprise-grade railway operations command system and passenger disruption management platform tailored for **Indian Railways (CRIS / IR-KAVACH)**. It maximizes track asset availability, automates maintenance block allocation, eliminates timetable clashes, estimates downtime through machine learning, and coordinates real-time emergency disaster re-routing with instant passenger/crew broadcast notifications.

---

## 🌟 Key Features & Capabilities

### 1. 🎛️ Operations Controller & Dispatcher Command Console
- **Corridor Track Availability Radar**: Real-time track occupancy (🟢 Clear, 🟡 Mega Block / Maintenance, 🔴 Emergency / Cordoned, 🔵 Speed Restrictions) with interactive section inspector.
- **AI Auto-Block Optimization Engine & Solver Studio**: Multi-objective constraint solver using Mixed-Integer Linear Programming (`PuLP` MILP) with customizable penalty weights, before/after KPI benchmarks (Asset utilization boosted to 95.8%, delays reduced by 89%), and 24-Hour Gantt possession timelines.
- **Mega Block Possession Manager**: Schedule and authorize track possessions (Tamping, OHE wire maintenance, Bridge girders, Kavach EI upgrades), manage assigned machinery, and auto-dispatch passenger advisories.
- **Accident & Emergency Incident Center**: Rapid SOS incident intake with automatic signal lockdown (Red), Accident Relief Train (ART/SP-ARME) dispatch tracker, emergency siren chimes, and public safety broadcast generator.
- **ML Downtime & Delay Propagation Forecaster**: Random Forest Regressor and Gradient Boosted models estimating actual downtime and delay cascade risk.

### 2. 🚆 Passenger & Commuter Live Portal (रेल यात्री साथी - Rail Yatri Saathi)
- **Sunday Mega Block Bulletins**: Suburban & express corridor disruption alerts with alternate train halts and municipal feeder bus options (BEST, DTC).
- **Emergency Safety Advisories**: Transparent incident notifications with direct 24x7 helpline links (**139 RailMadad**, **1512 GRP**, **182 Women Safety**).
- **AI Smart Disruption-Aware Journey Planner**: Route finder that intelligently circumvents active mega blocks with multimodal transit connections.

### 3. 🧪 Interactive Scenario Sandbox
- One-click triggers in the top bar to **Simulate an Incident (OHE Snap)**, **Simulate Sunday Mega Block**, **Execute AI Constraint Solver** (with celebratory confetti), or **Reset Network State**.

---

## 🏛️ System Architecture

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

---

## 📁 Repository Structure

```
RailX----ai----Traintech/
├── .github/workflows/ci.yml     # Automated GitHub Actions CI workflow
├── src/                         # React 18 + TypeScript + Vite Frontend
│   ├── components/              # Command console, passenger portal, track maps
│   ├── context/                 # Railway state engine & solver context
│   ├── data/                    # Mock data models & topology
│   └── styles/                  # BookMyShow & obsidian theme tokens
├── backend/                     # Core Python AI Engine (PuLP MILP Solver & ML Predictor)
│   ├── engine/                  # Database telemetry, optimizer & ML models
│   └── main.py                  # FastAPI application
├── frontend/                    # Vanilla JS/CSS Command Center UI
├── backend_api/                 # FastAPI Microservice & WebSocket Hub
├── database/                    # PostgreSQL / Supabase Schema, Seeds & Triggers
├── rail-kavach-ai/              # React + Vite Standalone Frontend Module
├── railway-ai-modules/          # Python AI Engine Modules & Tests
├── server.py                    # Root Python AI server runner
├── server.js & db.js            # Node.js / Express MySQL Backend Service
├── tests/                       # Python automated test suite
├── package.json                 # Node/Frontend dependencies
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. React + TypeScript Web Frontend
```bash
npm install
npm run dev
```
Accessible at `http://localhost:3000`.

### 2. Python FastAPI AI Engine & Command Center
```bash
pip install -r requirements.txt
python server.py
```
Accessible at `http://localhost:8000`.

### 3. FastAPI Microservice & WebSockets
```bash
cd backend_api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation: `http://localhost:8000/docs`

### 4. Node.js Express Backend
```bash
npm install
cp .env.example .env
npm start
```
Accessible at `http://localhost:5000`.

---

## 🧪 Testing & Validation

- **Frontend Typecheck & Build:**
  ```bash
  npm run typecheck
  npm run build
  ```
- **Python Unit Tests:**
  ```bash
  python -m unittest discover -s tests -p "test_*.py"
  ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

**Built with pride for Indian Railways (भारतीय रेल) & Centre for Railway Information Systems (CRIS).**
