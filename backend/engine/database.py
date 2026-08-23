"""
Indian Railways Knowledge Base & Database Layer
Stores track sections, train schedules, asset state, mega blocks, and incident feeds.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import copy

class RailwayDatabase:
    def __init__(self):
        self.divisions = [
            {"id": "CR_MUMBAI", "name": "Central Railway - Mumbai Division", "headquarters": "CSMT, Mumbai", "zone": "Central Railway (CR)"},
            {"id": "WR_MUMBAI", "name": "Western Railway - Mumbai Division", "headquarters": "Mumbai Central", "zone": "Western Railway (WR)"},
            {"id": "NR_DELHI", "name": "Northern Railway - Delhi Division", "headquarters": "New Delhi", "zone": "Northern Railway (NR)"},
            {"id": "ER_HOWRAH", "name": "Eastern Railway - Howrah Division", "headquarters": "Howrah", "zone": "Eastern Railway (ER)"},
            {"id": "SR_CHENNAI", "name": "Southern Railway - Chennai Division", "headquarters": "Chennai Central", "zone": "Southern Railway (SR)"}
        ]

        self.tracks: List[Dict[str, Any]] = [
            {
                "section_id": "SEC-CR-01",
                "division_id": "CR_MUMBAI",
                "corridor": "Mumbai CSMT - Dadar",
                "start_station": "CSMT",
                "end_station": "Dadar (DR)",
                "length_km": 9.0,
                "lines_count": 4,
                "lines": ["Up Fast", "Down Fast", "Up Slow", "Down Slow"],
                "mps_kmph": 105,
                "signaling": "Automatic Block Signaling (ABS)",
                "kavach_enabled": True,
                "ohe_voltage_kv": 25.0,
                "status": "Operational",  # Operational, Maintenance_Block, Incident_Lockdown, Caution_Order
                "current_load_pct": 88,
                "asset_health": "Good (94%)",
                "last_tamping_days": 18,
                "coordinates": [[18.940, 72.835], [19.018, 72.843]]
            },
            {
                "section_id": "SEC-CR-02",
                "division_id": "CR_MUMBAI",
                "corridor": "Dadar - Thane",
                "start_station": "Dadar (DR)",
                "end_station": "Thane (TNA)",
                "length_km": 24.0,
                "lines_count": 6,
                "lines": ["Up Fast", "Down Fast", "Up Slow", "Down Slow", "5th Line (Goods)", "6th Line (Goods)"],
                "mps_kmph": 110,
                "signaling": "Automatic Block Signaling (ABS)",
                "kavach_enabled": True,
                "ohe_voltage_kv": 25.0,
                "status": "Operational",
                "current_load_pct": 92,
                "asset_health": "Moderate (78%)",
                "last_tamping_days": 42,
                "coordinates": [[19.018, 72.843], [19.186, 72.975]]
            },
            {
                "section_id": "SEC-CR-03",
                "division_id": "CR_MUMBAI",
                "corridor": "Thane - Kalyan Jn",
                "start_station": "Thane (TNA)",
                "end_station": "Kalyan (KYN)",
                "length_km": 20.0,
                "lines_count": 6,
                "lines": ["Up Fast", "Down Fast", "Up Slow", "Down Slow", "5th Line", "6th Line"],
                "mps_kmph": 120,
                "signaling": "Electronic Interlocking (EI) + ABS",
                "kavach_enabled": True,
                "ohe_voltage_kv": 25.0,
                "status": "Operational",
                "current_load_pct": 95,
                "asset_health": "Needs Tamping (69%)",
                "last_tamping_days": 65,
                "coordinates": [[19.186, 72.975], [19.243, 73.135]]
            },
            {
                "section_id": "SEC-CR-04",
                "division_id": "CR_MUMBAI",
                "corridor": "Kalyan - Kasara (Thall Ghat)",
                "start_station": "Kalyan (KYN)",
                "end_station": "Kasara (KSRA)",
                "length_km": 67.0,
                "lines_count": 2,
                "lines": ["Up Main", "Down Main"],
                "mps_kmph": 100,
                "signaling": "Absolute Block + Catch/Slip Sidings",
                "kavach_enabled": True,
                "ohe_voltage_kv": 25.0,
                "status": "Operational",
                "current_load_pct": 74,
                "asset_health": "Good (89%)",
                "last_tamping_days": 25,
                "coordinates": [[19.243, 73.135], [19.645, 73.483]]
            },
            {
                "section_id": "SEC-CR-05",
                "division_id": "CR_MUMBAI",
                "corridor": "Kalyan - Karjat (Bhor Ghat)",
                "start_station": "Kalyan (KYN)",
                "end_station": "Karjat (KJT)",
                "length_km": 46.0,
                "lines_count": 2,
                "lines": ["Up Main", "Down Main"],
                "mps_kmph": 110,
                "signaling": "Automatic Block Signaling (ABS)",
                "kavach_enabled": True,
                "ohe_voltage_kv": 25.0,
                "status": "Operational",
                "current_load_pct": 71,
                "asset_health": "Good (91%)",
                "last_tamping_days": 30,
                "coordinates": [[19.243, 73.135], [18.910, 73.324]]
            },
            {
                "section_id": "SEC-NR-01",
                "division_id": "NR_DELHI",
                "corridor": "New Delhi - Ghaziabad",
                "start_station": "New Delhi (NDLS)",
                "end_station": "Ghaziabad (GZB)",
                "length_km": 25.0,
                "lines_count": 4,
                "lines": ["Up Fast", "Down Fast", "Up Slow", "Down Slow"],
                "mps_kmph": 130,
                "signaling": "High-Density ABS + TCAS Kavach",
                "kavach_enabled": True,
                "ohe_voltage_kv": 25.0,
                "status": "Operational",
                "current_load_pct": 96,
                "asset_health": "Good (87%)",
                "last_tamping_days": 22,
                "coordinates": [[28.643, 77.219], [28.669, 77.438]]
            },
            {
                "section_id": "SEC-NR-02",
                "division_id": "NR_DELHI",
                "corridor": "Ghaziabad - Aligarh Jn",
                "start_station": "Ghaziabad (GZB)",
                "end_station": "Aligarh (ALJN)",
                "length_km": 106.0,
                "lines_count": 3,
                "lines": ["Up Line", "Down Line", "3rd Reversible"],
                "mps_kmph": 160,
                "signaling": "Semi-Automatic 4-Aspect + Kavach",
                "kavach_enabled": True,
                "ohe_voltage_kv": 25.0,
                "status": "Operational",
                "current_load_pct": 89,
                "asset_health": "Optimal (95%)",
                "last_tamping_days": 12,
                "coordinates": [[28.669, 77.438], [27.897, 78.088]]
            }
        ]

        self.trains: List[Dict[str, Any]] = [
            {
                "train_id": "22221",
                "train_name": "CSMT - NZM Rajdhani Express",
                "category": "Platinum",  # Platinum, Gold, Silver, Bronze
                "priority_rank": 1,
                "rake_type": "LHB Tejas Sleeper (22 Coaches)",
                "loco": "WAP-7 Twin #30245 (Electric 6000 HP)",
                "origin": "CSMT",
                "destination": "Hazrat Nizamuddin (NZM)",
                "scheduled_slot": "16:00 - 17:30",
                "assigned_section": "SEC-CR-01",
                "assigned_line": "Down Fast",
                "status": "On-Time",
                "current_speed_kmph": 95,
                "delay_minutes": 0,
                "pax_count": 1240,
                "revenue_tier": "High"
            },
            {
                "train_id": "20103",
                "train_name": "CSMT - Gorakhpur Vande Bharat Superfast",
                "category": "Platinum",
                "priority_rank": 1,
                "rake_type": "Train 18 Vande Bharat (16 Coaches)",
                "loco": "Distributed Traction EMU (12,000 HP)",
                "origin": "CSMT",
                "destination": "Gorakhpur (GKP)",
                "scheduled_slot": "06:05 - 07:15",
                "assigned_section": "SEC-CR-02",
                "assigned_line": "Down Fast",
                "status": "On-Time",
                "current_speed_kmph": 105,
                "delay_minutes": 0,
                "pax_count": 1128,
                "revenue_tier": "High"
            },
            {
                "train_id": "12137",
                "train_name": "Punjab Mail (CSMT - Firozpur)",
                "category": "Gold",
                "priority_rank": 2,
                "rake_type": "LHB Express (24 Coaches)",
                "loco": "WAP-7 #30412",
                "origin": "CSMT",
                "destination": "Firozpur Cantt (FZR)",
                "scheduled_slot": "19:35 - 20:50",
                "assigned_section": "SEC-CR-02",
                "assigned_line": "Down Fast",
                "status": "On-Time",
                "current_speed_kmph": 88,
                "delay_minutes": 4,
                "pax_count": 1850,
                "revenue_tier": "Medium"
            },
            {
                "train_id": "11019",
                "train_name": "Konark Express (CSMT - Bhubaneswar)",
                "category": "Gold",
                "priority_rank": 2,
                "rake_type": "ICF Upgraded (22 Coaches)",
                "loco": "WAP-4 #22518",
                "origin": "CSMT",
                "destination": "Bhubaneswar (BBS)",
                "scheduled_slot": "14:00 - 15:20",
                "assigned_section": "SEC-CR-03",
                "assigned_line": "Down Fast",
                "status": "Minor Delay",
                "current_speed_kmph": 65,
                "delay_minutes": 12,
                "pax_count": 1720,
                "revenue_tier": "Medium"
            },
            {
                "train_id": "12051",
                "train_name": "Jan Shatabdi Express (CSMT - Madgaon)",
                "category": "Gold",
                "priority_rank": 2,
                "rake_type": "LHB Chair Car (18 Coaches)",
                "loco": "WDP-4D #40122",
                "origin": "CSMT",
                "destination": "Madgaon (MAO)",
                "scheduled_slot": "05:10 - 06:20",
                "assigned_section": "SEC-CR-01",
                "assigned_line": "Down Fast",
                "status": "On-Time",
                "current_speed_kmph": 90,
                "delay_minutes": 0,
                "pax_count": 1350,
                "revenue_tier": "Medium"
            },
            {
                "train_id": "FR-BOXN-991",
                "train_name": "Coal Rake Heavy Haul (JNPT to Thermal Plant)",
                "category": "Silver",
                "priority_rank": 3,
                "rake_type": "BOXNHL 58 Wagons (3,800 Tonnes)",
                "loco": "WAG-9H Twin #31089 (Electric 12,000 HP)",
                "origin": "JNPT Port",
                "destination": "Koradi Power Plant",
                "scheduled_slot": "11:00 - 14:00",
                "assigned_section": "SEC-CR-03",
                "assigned_line": "5th Line (Goods)",
                "status": "Holding Loop",
                "current_speed_kmph": 35,
                "delay_minutes": 25,
                "pax_count": 0,
                "revenue_tier": "High Cargo"
            },
            {
                "train_id": "FR-BTPN-404",
                "train_name": "Petroleum Tanker Express",
                "category": "Silver",
                "priority_rank": 3,
                "rake_type": "BTPN 50 Tankers (2,600 Tonnes)",
                "loco": "WAG-12B #60021 (Alstom 12,000 HP)",
                "origin": "BPCL Refinery Trombay",
                "destination": "Manmad Depot",
                "scheduled_slot": "01:30 - 04:30",
                "assigned_section": "SEC-CR-02",
                "assigned_line": "6th Line (Goods)",
                "status": "On-Time",
                "current_speed_kmph": 75,
                "delay_minutes": 0,
                "pax_count": 0,
                "revenue_tier": "High Cargo"
            },
            {
                "train_id": "EMU-SUB-F12",
                "train_name": "Kalyan - CSMT Fast Local",
                "category": "Bronze",
                "priority_rank": 4,
                "rake_type": "Bombardier 12-Car EMU (3,600 Pax)",
                "loco": "3-Phase IGBT Traction",
                "origin": "Kalyan (KYN)",
                "destination": "CSMT",
                "scheduled_slot": "08:15 - 09:18",
                "assigned_section": "SEC-CR-02",
                "assigned_line": "Up Fast",
                "status": "On-Time",
                "current_speed_kmph": 82,
                "delay_minutes": 2,
                "pax_count": 3950,
                "revenue_tier": "Suburban Vital"
            },
            {
                "train_id": "EMU-SUB-S44",
                "train_name": "Thane - CSMT Slow Local",
                "category": "Bronze",
                "priority_rank": 4,
                "rake_type": "Medha 12-Car EMU (3,400 Pax)",
                "loco": "3-Phase Traction",
                "origin": "Thane (TNA)",
                "destination": "CSMT",
                "scheduled_slot": "09:00 - 09:55",
                "assigned_section": "SEC-CR-01",
                "assigned_line": "Up Slow",
                "status": "On-Time",
                "current_speed_kmph": 60,
                "delay_minutes": 1,
                "pax_count": 3400,
                "revenue_tier": "Suburban Vital"
            }
        ]

        self.maintenance_assets: List[Dict[str, Any]] = [
            {"asset_id": "AST-TM-01", "name": "Plasser CSM-09 High Speed Track Tamper", "type": "Track Machine", "stationed_at": "Kurla Machine Depot", "status": "Ready", "productivity": "1.8 km/hr"},
            {"asset_id": "AST-BCM-02", "name": "Ballast Cleaning Machine (BCM-350)", "type": "Track Machine", "stationed_at": "Kalyan Yard", "status": "Ready", "productivity": "0.6 km/hr"},
            {"asset_id": "AST-TW-03", "name": "8-Wheeler Self-Propelled OHE Tower Wagon", "type": "OHE Overhead", "stationed_at": "Dadar TRD Depot", "status": "In-Use", "productivity": "OHE Wire Inspection & Tensioning"},
            {"asset_id": "AST-USFD-04", "name": "Digital Double Rail Ultrasonic Tester (DRT)", "type": "Track Flaw Testing", "stationed_at": "Thane P-Way", "status": "Ready", "productivity": "Rail Internal Flaw Detection"},
            {"asset_id": "AST-CREW-A", "name": "Gang #14 Senior Section Engineer P-Way", "type": "Human Resource", "stationed_at": "Kalyan", "status": "Available (Shift 1)", "personnel_count": 28}
        ]

        self.mega_blocks: List[Dict[str, Any]] = [
            {
                "block_id": "MB-2026-081",
                "division_id": "CR_MUMBAI",
                "corridor": "Dadar - Thane",
                "section_id": "SEC-CR-02",
                "lines_affected": ["Up Fast", "Down Fast"],
                "work_type": "Track Relaying & Overhead OHE Cantilever Renewal",
                "requested_window": "Sunday 11:05 - 15:55",
                "duration_hours": 4.8,
                "reason": "Monsoon Pre-cautionary Track Packing and TRD Cable Overhaul",
                "status": "Scheduled",  # Scheduled, Active, Completed, Re-Optimized
                "clash_detected": True,
                "clash_details": "Conflicts with Train 22221 Rajdhani & Train 11019 Konark Express",
                "speed_restriction_imposed": "30 km/h post block for 24 hrs",
                "passenger_impact_rating": "High (Diversion to Slow lines required)"
            },
            {
                "block_id": "MB-2026-082",
                "division_id": "CR_MUMBAI",
                "corridor": "Thane - Kalyan Jn",
                "section_id": "SEC-CR-03",
                "lines_affected": ["5th Line (Goods)"],
                "work_type": "Point & Crossing Switch Overhaul (Tamping CSM-09)",
                "requested_window": "Saturday Night 01:00 - 05:00",
                "duration_hours": 4.0,
                "reason": "Turnout geometric correction and rail wear ultrasonic replacement",
                "status": "Scheduled",
                "clash_detected": False,
                "clash_details": "Zero Passenger Clash (Optimal Night Valley Window)",
                "speed_restriction_imposed": "None",
                "passenger_impact_rating": "Low"
            },
            {
                "block_id": "MB-2026-083",
                "division_id": "NR_DELHI",
                "corridor": "New Delhi - Ghaziabad",
                "section_id": "SEC-NR-01",
                "lines_affected": ["Down Fast"],
                "work_type": "KAVACH Track-side TCAS Transponder Installation",
                "requested_window": "Sunday 02:00 - 06:00",
                "duration_hours": 4.0,
                "reason": "High-Speed corridor signaling upgrade to 160 kmph standard",
                "status": "Scheduled",
                "clash_detected": False,
                "clash_details": "Night freight diverted via Anand Vihar bypass",
                "speed_restriction_imposed": "None",
                "passenger_impact_rating": "Low"
            }
        ]

        self.accidents: List[Dict[str, Any]] = [
            {
                "incident_id": "INC-2026-401",
                "timestamp": (datetime.now() - timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M:%S"),
                "section_id": "SEC-CR-03",
                "corridor": "Thane - Kalyan Jn",
                "affected_line": "Down Fast (KM 42/18 near Diva)",
                "incident_type": "Overhead Equipment (OHE) Wire Entanglement & Pantograph Fracture",
                "severity": "High",  # Low, Moderate, High, Critical
                "affected_train_number": "11019 (Konark Express)",
                "status": "Emergency Response Active",
                "speed_restriction": "0 km/h (Total Closure of Down Fast)",
                "tower_wagon_dispatched": True,
                "estimated_restoration_time": "120 Mins",
                "diversion_applied": True,
                "diversion_route": "Down Fast trains switched to Down Slow line from Thane to Kalyan",
                "passenger_sms_broadcasted": 3480
            }
        ]

        self.alerts_log: List[Dict[str, Any]] = [
            {
                "alert_id": "ALT-1001",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "category": "EMERGENCY_ACCIDENT",
                "title": "Down Fast Track Blocked near Diva (KM 42/18)",
                "body": "Train 11019 Pantograph OHE entanglement. Down Fast line closed. AI auto-diverting traffic to Down Slow. Expect +15 min delay on suburban locals.",
                "recipient_count": 4200,
                "channel": "FCM + SMS + Station PA Display",
                "severity": "Critical"
            },
            {
                "alert_id": "ALT-1002",
                "timestamp": (datetime.now() - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"),
                "category": "MEGA_BLOCK_NOTICE",
                "title": "Upcoming Sunday Mega Block on Dadar - Thane Fast Line",
                "body": "Central Railway Mega Block on Sunday 11:05 AM to 03:55 PM for track relaying. Fast services will run on Slow lines between Matunga and Mulund.",
                "recipient_count": 125000,
                "channel": "IRCTC App + SMS Push",
                "severity": "Warning"
            }
        ]

        self.latest_optimization_result: Optional[Dict[str, Any]] = None

    def get_tracks(self) -> List[Dict[str, Any]]:
        return copy.deepcopy(self.tracks)

    def get_trains(self) -> List[Dict[str, Any]]:
        return copy.deepcopy(self.trains)

    def get_mega_blocks(self) -> List[Dict[str, Any]]:
        return copy.deepcopy(self.mega_blocks)

    def get_accidents(self) -> List[Dict[str, Any]]:
        return copy.deepcopy(self.accidents)

    def get_alerts(self) -> List[Dict[str, Any]]:
        return copy.deepcopy(self.alerts_log)

    def get_assets(self) -> List[Dict[str, Any]]:
        return copy.deepcopy(self.maintenance_assets)

    def add_accident(self, incident: Dict[str, Any]) -> Dict[str, Any]:
        incident["incident_id"] = f"INC-2026-{len(self.accidents)+501}"
        incident["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.accidents.insert(0, incident)

        # Update track status
        for trk in self.tracks:
            if trk["section_id"] == incident.get("section_id"):
                trk["status"] = "Incident_Lockdown"
                trk["current_load_pct"] = min(100, trk["current_load_pct"] + 15)

        # Create alert
        alert = {
            "alert_id": f"ALT-{len(self.alerts_log)+1001}",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "category": "EMERGENCY_ACCIDENT",
            "title": f"🚨 EMERGENCY: {incident.get('incident_type')} at {incident.get('corridor')}",
            "body": f"Incident reported on {incident.get('affected_line')} affecting Train #{incident.get('affected_train_number')}. AI Re-router activated.",
            "recipient_count": 8900,
            "channel": "FCM + SMS + Indian Railways Control Hub",
            "severity": "Critical"
        }
        self.alerts_log.insert(0, alert)
        return incident

    def add_mega_block(self, mb: Dict[str, Any]) -> Dict[str, Any]:
        mb["block_id"] = f"MB-2026-{len(self.mega_blocks)+91}"
        self.mega_blocks.append(mb)
        return mb

# Global singleton
db = RailwayDatabase()
