"""
notification_service.py - Alert Dispatcher & Passenger Coordination Service
Manages real-time alert broadcasts (WebSocket/Push/SMS), logs notifications,
and pairs accident & mega-block events with active passenger journeys.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import logging

try:
    from backend.models.schemas import (
        SmartNotification,
        AccidentReport,
        ExtractedMegaBlock,
        PassengerJourney,
        NotificationPriority
    )
except ImportError:
    from models.schemas import (
        SmartNotification,
        AccidentReport,
        ExtractedMegaBlock,
        PassengerJourney,
        NotificationPriority
    )

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Real-time Notification Manager for Indian Railways Passengers and Planners.
    Maintains an in-memory alert log, simulated push broadcast channels,
    and queryable notification history.
    """

    def __init__(self):
        self._notification_history: List[SmartNotification] = []
        self._active_listeners: Dict[str, Any] = {}  # e.g., websocket connections by PNR/Train

    def log_and_dispatch(self, notification: SmartNotification) -> Dict[str, Any]:
        """
        Stores notification and dispatches to live passenger channel.
        """
        self._notification_history.insert(0, notification)
        
        # Format payload for Push / SMS / WebSocket
        payload = {
            "event": "TRACK_ALERT",
            "notification_id": notification.notification_id,
            "pnr": notification.pnr,
            "passenger": notification.passenger_name,
            "train": notification.train_number,
            "priority": notification.priority.value,
            "title": notification.headline,
            "details": notification.exact_incident_details,
            "impact": notification.impact_on_journey,
            "actions": notification.actionable_alternatives,
            "helplines": notification.helpline_contacts,
            "timestamp": notification.generated_at.isoformat()
        }

        logger.info(f"⚡ [DISPATCHED ALERT] To PNR {notification.pnr} ({notification.passenger_name}) -> {notification.headline}")
        return {
            "status": "DELIVERED",
            "pnr": notification.pnr,
            "notification_id": notification.notification_id,
            "channel": "SMS_PUSH_WEBSOCKET",
            "payload": payload
        }

    def dispatch_batch(self, notifications: List[SmartNotification]) -> List[Dict[str, Any]]:
        """
        Dispatches a list of notifications and returns delivery receipts.
        """
        receipts = []
        for notif in notifications:
            receipt = self.log_and_dispatch(notif)
            receipts.append(receipt)
        return receipts

    def get_notifications_for_pnr(self, pnr: str) -> List[SmartNotification]:
        """
        Retrieves all notifications targeted at a specific passenger PNR.
        """
        return [n for n in self._notification_history if n.pnr == pnr]

    def get_all_active_alerts(self) -> List[SmartNotification]:
        """
        Retrieves recent high-priority alerts across the entire railway system.
        """
        return self._notification_history[:50]
