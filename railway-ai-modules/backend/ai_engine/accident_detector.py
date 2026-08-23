"""
accident_detector.py - Feature 1: AI Route Rethink & Exact Accident Notification Engine
Detects accidents on railway sections, checks if passenger journeys intersect the affected track,
and generates smart, exact, contextual notifications with emergency actions.
"""

from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime, timedelta
import logging

try:
    from backend.models.schemas import (
        AccidentReport,
        PassengerJourney,
        SmartNotification,
        NotificationPriority,
        AccidentSeverity
    )
except ImportError:
    from models.schemas import (
        AccidentReport,
        PassengerJourney,
        SmartNotification,
        NotificationPriority,
        AccidentSeverity
    )

logger = logging.getLogger(__name__)


class AccidentDetector:
    """
    AI Accident Sensing & Passenger Journey Intersect Engine.
    Evaluates railway track accidents against active passenger journeys to pinpoint
    who is affected, generate exact contextual details, and trigger smart rerouting.
    """

    def __init__(self, station_name_map: Optional[Dict[str, str]] = None):
        self.station_name_map = station_name_map or {
            "NDLS": "New Delhi",
            "NZM": "Hazrat Nizamuddin",
            "MTJ": "Mathura Junction",
            "AGC": "Agra Cantt",
            "GWL": "Gwalior Junction",
            "VGLJ": "Virangana Lakshmibai Jhansi",
            "BPL": "Bhopal Junction",
            "ET": "Itarsi Junction",
            "NGP": "Nagpur Junction",
            "BPQ": "Balharshah",
            "KZJ": "Kazipet Junction",
            "SC": "Secunderabad Junction",
            "BZA": "Vijayawada Junction",
            "MAS": "Chennai Central",
            "BCT": "Mumbai Central",
            "BDTS": "Bandra Terminus",
            "CSMT": "Mumbai CSMT",
            "TNA": "Thane",
            "KYN": "Kalyan Junction",
            "ST": "Surat",
            "BRC": "Vadodara Junction",
            "RTM": "Ratlam Junction",
            "KOTA": "Kota Junction",
            "SWM": "Sawai Madhopur Junction",
            "JP": "Jaipur Junction",
            "RE": "Rewari Junction",
            "DEC": "Delhi Cantt",
            "CNB": "Kanpur Central",
            "PRYJ": "Prayagraj Junction",
            "DDU": "Pt. Deen Dayal Upadhyaya Junction",
            "PNBE": "Patna Junction",
            "HWH": "Howrah Junction"
        }

    def get_station_name(self, code: str) -> str:
        return self.station_name_map.get(code, code)

    def is_accident_on_passenger_path(
        self,
        journey: PassengerJourney,
        accident: AccidentReport
    ) -> Tuple[bool, int, str]:
        """
        Calculates if the accident's section (from_station <-> to_station) lies along
        the passenger's remaining itinerary (stations ahead of current position).

        Returns:
            (is_affected: bool, stations_away: int, reason: str)
        """
        route = journey.route_stations
        curr_idx = journey.current_station_index

        # Passenger already completed the journey
        if curr_idx >= len(route) - 1:
            return False, -1, "Journey already completed."

        remaining_route = route[curr_idx:]
        from_st = accident.from_station.upper()
        to_st = accident.to_station.upper()

        # Check if both or either accident stations exist in remaining stations ahead
        has_from = from_st in remaining_route
        has_to = to_st in remaining_route

        if has_from and has_to:
            idx_from = remaining_route.index(from_st)
            idx_to = remaining_route.index(to_st)
            stations_away = min(idx_from, idx_to)

            # Check consecutive segment or direct track path
            return (
                True,
                stations_away,
                f"Accident section ({from_st}-{to_st}) lies directly {stations_away} station(s) ahead on your train route."
            )
        elif has_from or has_to:
            target = from_st if has_from else to_st
            stations_away = remaining_route.index(target)
            return (
                True,
                stations_away,
                f"Accident near {self.get_station_name(target)} ({target}) impacts your train track corridor."
            )

        return False, -1, "Accident is not on your train's scheduled itinerary."

    def generate_smart_accident_notification(
        self,
        accident: AccidentReport,
        journey: PassengerJourney
    ) -> SmartNotification:
        """
        Generates an exact, high-clarity notification for the passenger,
        stating precisely what happened, the exact location, lines blocked,
        expected impact on their specific train, and relief actions.
        """
        from_name = self.get_station_name(accident.from_station)
        to_name = self.get_station_name(accident.to_station)
        km_info = f" at {accident.kilometer_marker}" if accident.kilometer_marker else ""

        # Determine priority
        if accident.severity in [AccidentSeverity.CRITICAL, AccidentSeverity.SEVERE]:
            priority = NotificationPriority.CRITICAL_EMERGENCY
            headline = f"🚨 URGENT: Track Disruption on Train #{journey.train_number} ({journey.train_name})"
        else:
            priority = NotificationPriority.HIGH_DISRUPTION
            headline = f"⚠️ Track Alert: Operational Incident Ahead on Train #{journey.train_number}"

        # Exact Incident Details
        exact_details = (
            f"Nature of Incident: {accident.accident_type.value.replace('_', ' ').title()} - {accident.details}. "
            f"Location: Between {from_name} ({accident.from_station}) and {to_name} ({accident.to_station}){km_info} "
            f"[{accident.division}]. Lines Affected: {accident.lines_affected.value.replace('_', ' ')}."
        )

        if accident.casualties_reported > 0 or accident.injuries_reported > 0:
            exact_details += f" Casualty Info: {accident.injuries_reported} injured, medical relief train on site."

        # Impact on passenger's specific journey
        est_delay = int(accident.estimated_clearance_hours * 60)
        impact = (
            f"Your Train #{journey.train_number} ({journey.origin} ➔ {journey.destination}) is approaching this section. "
            f"Current Station: {self.get_station_name(journey.current_station_code or '')}. "
            f"Estimated clearance time: ~{accident.estimated_clearance_hours} hours (~{est_delay} mins delay). "
            f"AI Route Engine is calculating alternative rail bypass routes."
        )

        actions = [
            "View AI Alternative Reroutes",
            "Live Track Status & Relief Updates",
            f"Emergency Helpline: {accident.helpline_numbers[0] if accident.helpline_numbers else '139'}"
        ]

        notification_id = f"NOTIF-{journey.pnr}-{accident.accident_id}"

        return SmartNotification(
            notification_id=notification_id,
            pnr=journey.pnr,
            passenger_name=journey.passenger_name,
            train_number=journey.train_number,
            priority=priority,
            headline=headline,
            exact_incident_details=exact_details,
            impact_on_journey=impact,
            actionable_alternatives=actions,
            helpline_contacts=accident.helpline_numbers or ["139", "1072"],
            has_reroute_available=True,
            generated_at=datetime.utcnow()
        )

    def scan_all_passengers_for_accident(
        self,
        accident: AccidentReport,
        active_passengers: List[PassengerJourney]
    ) -> List[SmartNotification]:
        """
        Scans all active passenger journeys in the database, filters affected users,
        and generates individual smart notifications.
        """
        affected_notifications: List[SmartNotification] = []

        for passenger in active_passengers:
            is_affected, _, _ = self.is_accident_on_passenger_path(passenger, accident)
            if is_affected:
                notif = self.generate_smart_accident_notification(accident, passenger)
                affected_notifications.append(notif)
                logger.info(f"Generated smart alert for PNR {passenger.pnr} on Train {passenger.train_number}")

        return affected_notifications
