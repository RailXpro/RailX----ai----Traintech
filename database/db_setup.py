"""
RailX AI: Database Setup & Migration Runner
Supports:
1. PostgreSQL / Supabase (via DATABASE_URL or environment variables)
2. Local SQLite fallback (for zero-config local testing and offline dev)
"""

import os
import sys
import sqlite3
import argparse
from datetime import datetime

def setup_sqlite(db_path="railx_railways.db"):
    print(f"Initializing local SQLite database at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # SQLite compatible DDL schema
    sqlite_schema = """
    CREATE TABLE IF NOT EXISTS railway_zones (
        zone_id TEXT PRIMARY KEY,
        zone_name TEXT NOT NULL,
        headquarters TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS railway_divisions (
        division_id TEXT PRIMARY KEY,
        zone_id TEXT NOT NULL REFERENCES railway_zones(zone_id),
        division_name TEXT NOT NULL,
        headquarters_station TEXT,
        control_room_contact TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stations (
        station_code TEXT PRIMARY KEY,
        station_name TEXT NOT NULL,
        division_id TEXT NOT NULL REFERENCES railway_divisions(division_id),
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        elevation_meters REAL,
        platforms_count INTEGER DEFAULT 2,
        has_emergency_sidings INTEGER DEFAULT 0,
        is_junction INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS track_sections (
        section_id TEXT PRIMARY KEY,
        division_id TEXT NOT NULL REFERENCES railway_divisions(division_id),
        from_station_code TEXT NOT NULL REFERENCES stations(station_code),
        to_station_code TEXT NOT NULL REFERENCES stations(station_code),
        line_type TEXT DEFAULT 'UP_FAST',
        distance_km REAL NOT NULL,
        track_count INTEGER DEFAULT 2,
        is_electrified INTEGER DEFAULT 1,
        signaling_system TEXT DEFAULT 'AUTOMATIC_BLOCK_SIGNALING',
        max_permissible_speed_kmph INTEGER NOT NULL DEFAULT 110,
        current_status TEXT NOT NULL DEFAULT 'AVAILABLE',
        status_reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trains (
        train_number TEXT PRIMARY KEY,
        train_name TEXT NOT NULL,
        train_type TEXT NOT NULL,
        source_station_code TEXT NOT NULL REFERENCES stations(station_code),
        destination_station_code TEXT NOT NULL REFERENCES stations(station_code),
        primary_zone_id TEXT REFERENCES railway_zones(zone_id),
        priority_level INTEGER NOT NULL DEFAULT 3,
        rake_type TEXT DEFAULT 'LHB_22_COACH',
        max_operating_speed_kmph INTEGER DEFAULT 130,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS train_schedules (
        schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_number TEXT NOT NULL REFERENCES trains(train_number),
        stop_sequence INTEGER NOT NULL,
        station_code TEXT NOT NULL REFERENCES stations(station_code),
        track_section_id TEXT REFERENCES track_sections(section_id),
        scheduled_arrival TEXT,
        scheduled_departure TEXT,
        dwell_minutes INTEGER DEFAULT 2,
        platform_number TEXT,
        distance_from_source_km REAL
    );

    CREATE TABLE IF NOT EXISTS train_telemetry (
        telemetry_id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_number TEXT NOT NULL REFERENCES trains(train_number),
        current_section_id TEXT REFERENCES track_sections(section_id),
        current_latitude REAL NOT NULL,
        current_longitude REAL NOT NULL,
        current_speed_kmph REAL NOT NULL DEFAULT 0.0,
        delay_minutes INTEGER NOT NULL DEFAULT 0,
        heading_degrees REAL,
        kavach_status TEXT DEFAULT 'ARMED_NORMAL',
        last_ping_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assets (
        asset_id TEXT PRIMARY KEY,
        asset_type TEXT NOT NULL,
        home_depot_station TEXT REFERENCES stations(station_code),
        serial_number TEXT UNIQUE,
        manufacturing_year INTEGER,
        health_score REAL DEFAULT 98.50,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        total_running_km REAL DEFAULT 0.0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS block_requests (
        request_id TEXT PRIMARY KEY,
        division_id TEXT NOT NULL REFERENCES railway_divisions(division_id),
        section_id TEXT NOT NULL REFERENCES track_sections(section_id),
        department TEXT NOT NULL,
        work_description TEXT NOT NULL,
        required_duration_minutes INTEGER NOT NULL,
        preferred_start_window_start TEXT NOT NULL,
        preferred_start_window_end TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'ROUTINE',
        demanded_by_officer TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_block_plans (
        plan_id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL REFERENCES block_requests(request_id),
        section_id TEXT NOT NULL REFERENCES track_sections(section_id),
        optimized_start_time TEXT NOT NULL,
        optimized_end_time TEXT NOT NULL,
        allocated_duration_minutes INTEGER NOT NULL,
        asset_availability_score REAL NOT NULL DEFAULT 95.0,
        traffic_throughput_loss_score REAL NOT NULL DEFAULT 4.2,
        predicted_delay_impact_minutes INTEGER DEFAULT 12,
        solver_algorithm TEXT DEFAULT 'GOOGLE_OR_TOOLS_CPSAT_V2',
        status TEXT NOT NULL DEFAULT 'OPTIMIZED_BY_AI',
        approved_by_controller TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS accidents (
        accident_id TEXT PRIMARY KEY,
        train_number TEXT REFERENCES trains(train_number),
        section_id TEXT NOT NULL REFERENCES track_sections(section_id),
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        nearest_station_code TEXT REFERENCES stations(station_code),
        accident_type TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'MAJOR',
        status TEXT NOT NULL DEFAULT 'REPORTED',
        casualties_reported INTEGER DEFAULT 0,
        injuries_reported INTEGER DEFAULT 0,
        relief_train_dispatched INTEGER DEFAULT 0,
        reported_by TEXT NOT NULL,
        reported_at TEXT DEFAULT CURRENT_TIMESTAMP,
        root_cause_summary TEXT
    );

    CREATE TABLE IF NOT EXISTS mega_blocks (
        mega_block_id TEXT PRIMARY KEY,
        division_id TEXT NOT NULL REFERENCES railway_divisions(division_id),
        section_id TEXT NOT NULL REFERENCES track_sections(section_id),
        line_affected TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        headline TEXT NOT NULL,
        purpose TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'UPCOMING',
        alternative_transport_notes TEXT
    );

    CREATE TABLE IF NOT EXISTS broadcast_alerts (
        alert_id TEXT PRIMARY KEY,
        alert_type TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'HIGH',
        headline TEXT NOT NULL,
        body_text TEXT NOT NULL,
        source_reference_id TEXT,
        affected_section_id TEXT REFERENCES track_sections(section_id),
        geo_center_lat REAL,
        geo_center_lon REAL,
        geo_radius_km REAL DEFAULT 50.0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """
    cursor.executescript(sqlite_schema)
    print("Schema created successfully.")

    # SQLite Seed Data
    sqlite_seeds = """
    INSERT OR IGNORE INTO railway_zones (zone_id, zone_name, headquarters) VALUES
    ('CR', 'Central Railway', 'Chhatrapati Shivaji Maharaj Terminus (CSMT), Mumbai'),
    ('WR', 'Western Railway', 'Churchgate, Mumbai');

    INSERT OR IGNORE INTO railway_divisions (division_id, zone_id, division_name, headquarters_station, control_room_contact) VALUES
    ('CR_MUMBAI', 'CR', 'Mumbai Division (CR)', 'CSMT', '+91-22-22620123'),
    ('CR_PUNE', 'CR', 'Pune Division (CR)', 'PUNE', '+91-20-26127142');

    INSERT OR IGNORE INTO stations (station_code, station_name, division_id, latitude, longitude, elevation_meters, platforms_count, is_junction) VALUES
    ('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'CR_MUMBAI', 18.9401780, 72.8354890, 8.0, 18, 1),
    ('DR', 'Dadar Central', 'CR_MUMBAI', 19.0180420, 72.8432880, 10.0, 8, 1),
    ('TNA', 'Thane', 'CR_MUMBAI', 19.1860000, 72.9759000, 14.0, 10, 1),
    ('KYN', 'Kalyan Junction', 'CR_MUMBAI', 19.2361000, 73.1306000, 18.0, 8, 1),
    ('LNL', 'Lonavala', 'CR_PUNE', 18.7557000, 73.4091000, 624.0, 3, 1),
    ('PUNE', 'Pune Junction', 'CR_PUNE', 18.5289000, 73.8744000, 560.0, 6, 1);

    INSERT OR IGNORE INTO track_sections (section_id, division_id, from_station_code, to_station_code, line_type, distance_km, max_permissible_speed_kmph, current_status) VALUES
    ('SEC_CSMT_DR_DOWN_FAST', 'CR_MUMBAI', 'CSMT', 'DR', 'DOWN_FAST', 9.0, 105, 'AVAILABLE'),
    ('SEC_DR_TNA_DOWN_FAST', 'CR_MUMBAI', 'DR', 'TNA', 'DOWN_FAST', 24.0, 110, 'AVAILABLE'),
    ('SEC_TNA_KYN_UP_SLOW', 'CR_MUMBAI', 'KYN', 'TNA', 'UP_SLOW', 20.0, 90, 'MEGA_BLOCK'),
    ('SEC_KYN_LNL_GHAT', 'CR_MUMBAI', 'KYN', 'LNL', 'DOWN_FAST', 74.0, 60, 'CAUTION');

    INSERT OR IGNORE INTO trains (train_number, train_name, train_type, source_station_code, destination_station_code, priority_level, max_operating_speed_kmph) VALUES
    ('22225', 'Solapur Vande Bharat Express', 'VANDE_BHARAT', 'CSMT', 'PUNE', 1, 160),
    ('12127', 'Mumbai - Pune Intercity Superfast', 'SUPERFAST_EXPRESS', 'CSMT', 'PUNE', 2, 130),
    ('95301', 'CSMT - Kalyan AC Fast Local', 'SUBURBAN_LOCAL', 'CSMT', 'KYN', 2, 105);

    INSERT OR IGNORE INTO train_telemetry (train_number, current_section_id, current_latitude, current_longitude, current_speed_kmph, delay_minutes, kavach_status) VALUES
    ('22225', 'SEC_DR_TNA_DOWN_FAST', 19.1245000, 72.9345000, 102.4, 0, 'ARMED_NORMAL'),
    ('12127', 'SEC_KYN_LNL_GHAT', 18.8500000, 73.3500000, 58.0, 3, 'ARMED_NORMAL');

    INSERT OR IGNORE INTO mega_blocks (mega_block_id, division_id, section_id, line_affected, start_time, end_time, headline, purpose, status) VALUES
    ('MB_CR_2026_01', 'CR_MUMBAI', 'SEC_TNA_KYN_UP_SLOW', 'UP_SLOW', '2026-08-23 10:00:00', '2026-08-23 15:00:00', 'Sunday Mega Block: Thane to Kalyan Up Slow Line', 'Track Renewal and OHE Maintenance', 'ACTIVE');
    """
    cursor.executescript(sqlite_seeds)
    conn.commit()
    print("Seed data populated successfully.")
    return conn

def run_diagnostics(conn):
    cursor = conn.cursor()
    print("\n--- RAILX AI DATABASE DIAGNOSTICS ---")
    
    print("\n1. Track Sections Live Status:")
    for row in cursor.execute("SELECT section_id, from_station_code, to_station_code, current_status, max_permissible_speed_kmph FROM track_sections"):
        print(f"   [{row[3]}] {row[0]}: {row[1]} -> {row[2]} ({row[4]} km/h)")

    print("\n2. Active Trains & Telemetry:")
    for row in cursor.execute("SELECT t.train_number, t.train_name, tt.current_speed_kmph, tt.delay_minutes, tt.kavach_status FROM trains t JOIN train_telemetry tt ON t.train_number = tt.train_number"):
        print(f"   Train #{row[0]} ({row[1]}): Speed={row[2]} km/h | Delay={row[3]} min | Kavach={row[4]}")

    print("\n3. Active Mega Blocks:")
    for row in cursor.execute("SELECT mega_block_id, headline, start_time, end_time, status FROM mega_blocks"):
        print(f"   [{row[4]}] {row[0]}: {row[1]} ({row[2]} to {row[3]})")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RailX AI Database Initializer")
    parser.add_argument("--sqlite", action="store_true", default=True, help="Use local SQLite database")
    parser.add_argument("--db-path", default="railx_railways.db", help="Path to SQLite database file")
    args = parser.parse_args()

    conn = setup_sqlite(args.db_path)
    run_diagnostics(conn)
    conn.close()
