# 🛡️ Rail Kavach AI: Emergency Disruption & Smart Detour Management

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Oxlint](https://img.shields.io/badge/Lint-Oxlint-cyan.svg)](https://oxc.rs)

**Rail Kavach AI** is a specialized subsystem within the **RailX.ai** ecosystem designed for automatic disaster interception, circular scanning, real-time timetable disruption mitigation, and personalized passenger notifications for Indian Railways.

---

## 🚀 Key Modules

- **AI Circular Scanner (`megaBlockParser.js`)**: Parses unstructured Railway Board maintenance circular text into structured block data.
- **Accident & Incident Interception (`NotificationEngine.js`)**: Automatically triggers emergency alerts, red-aspect locks, and broadcasts to affected train crew & passengers.
- **Smart Detour Solver (`routeSolver.js`)**: Synthesizes alternate route corridors avoiding active block possessions and accident cordons.
- **Dual Persona Console**: Switch between **Controller/Planner** and **Passenger (Rail Yatri Saathi)** views with live simulation controls.

---

## 🛠️ Quick Start

```bash
# Navigate to the module directory
cd rail-kavach-ai

# Install dependencies
npm install

# Run the development server
npm run dev

# Run oxlint
npm run lint
```
Open `http://localhost:5173` in your browser.

