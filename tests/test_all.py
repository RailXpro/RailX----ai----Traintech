"""
Unit test suite for RailX AI Block Optimization Engine
"""

import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from engine.database import db
from engine.optimizer import optimizer
from engine.ml_predictor import predictor

class TestRailXBackend(unittest.TestCase):
    def test_database_loads(self):
        tracks = db.get_tracks()
        trains = db.get_trains()
        mega_blocks = db.get_mega_blocks()
        self.assertGreaterEqual(len(tracks), 5)
        self.assertGreaterEqual(len(trains), 5)
        self.assertGreaterEqual(len(mega_blocks), 2)

    def test_optimizer_execution(self):
        result = optimizer.solve(strategy="balanced")
        self.assertEqual(result["status"], "SUCCESS")
        self.assertIn("after_metrics", result)
        self.assertIn("kpi_improvements", result)
        self.assertGreater(result["after_metrics"]["asset_availability_pct"], 75.0)

    def test_ml_predictor(self):
        pred = predictor.predict(
            base_duration_hrs=4.0,
            work_type="Track Relaying & Tamping",
            traffic_density_tpd=180.0,
            track_age_years=14.0,
            weather="Monsoon / Heavy Rain"
        )
        self.assertGreater(pred["predicted_downtime_hrs"], 1.0)
        self.assertIn("confidence_interval_95", pred)
        self.assertIn("overrun_risk_pct", pred)

    def test_accident_lifecycle(self):
        initial_accidents_count = len(db.get_accidents())
        new_inc = db.add_accident({
            "section_id": "SEC-CR-01",
            "corridor": "Mumbai CSMT - Dadar",
            "affected_line": "Up Fast",
            "incident_type": "Signal Failure at Sandhurst Road",
            "severity": "Moderate",
            "affected_train_number": "EMU-SUB-F12"
        })
        self.assertEqual(len(db.get_accidents()), initial_accidents_count + 1)
        self.assertTrue(new_inc["incident_id"].startswith("INC-2026-"))

if __name__ == "__main__":
    unittest.main()
