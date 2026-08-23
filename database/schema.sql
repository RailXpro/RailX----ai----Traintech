-- ==============================================================================
-- RAILX AI: AI-Powered Automatic Block Planning for Indian Railways
-- Database Schema Definition (PostgreSQL & Supabase Compatible)
-- ==============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUM TYPES
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE track_section_status AS ENUM ('AVAILABLE', 'CAUTION', 'BLOCKED', 'MEGA_BLOCK', 'EMERGENCY_CLOSURE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE train_type AS ENUM ('VANDE_BHARAT', 'RAJDHANI', 'SHATABDI', 'SUPERFAST_EXPRESS', 'MAIL_EXPRESS', 'SUBURBAN_LOCAL', 'FREIGHT_CONTAINER', 'FREIGHT_BULK');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE asset_type AS ENUM ('LOCOMOTIVE_WAP7', 'LOCOMOTIVE_WAG9', 'LOCOMOTIVE_WAG12', 'RAKE_LHB', 'RAKE_TRAIN18', 'RAKE_EMU', 'TRACK_RELAYING_MACHINE', 'TAMPING_MACHINE', 'OHE_TOWER_CAR', 'CREW_PILOT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE asset_status AS ENUM ('ACTIVE', 'ASSIGNED', 'MAINTENANCE_DUE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE block_request_priority AS ENUM ('EMERGENCY', 'CRITICAL', 'HIGH', 'ROUTINE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE block_plan_status AS ENUM ('DRAFT', 'OPTIMIZED_BY_AI', 'PENDING_APPROVAL', 'APPROVED', 'EXECUTING', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE accident_severity AS ENUM ('CRITICAL', 'MAJOR', 'MODERATE', 'MINOR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE accident_status AS ENUM ('REPORTED', 'RESCUE_IN_PROGRESS', 'TRACK_RESTORATION', 'CLEARED_REOPENED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE mega_block_status AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'POSTPONED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE line_type AS ENUM ('UP_SLOW', 'DOWN_SLOW', 'UP_FAST', 'DOWN_FAST', 'HARBOUR_UP', 'HARBOUR_DOWN', '5TH_LINE', '6TH_LINE', 'GOODS_CORRIDOR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('PASSENGER', 'LOCO_PILOT', 'STATION_MASTER', 'SECTION_CONTROLLER', 'SAFETY_OFFICER', 'MAINTENANCE_ENGINEER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 2. INFRASTRUCTURE & TOPOLOGY DOMAIN
-- ==============================================================================

-- Railway Zones (e.g., Central Railway, Western Railway, Northern Railway)
CREATE TABLE IF NOT EXISTS railway_zones (
    zone_id VARCHAR(10) PRIMARY KEY, -- e.g., 'CR', 'WR', 'NR'
    zone_name VARCHAR(100) NOT NULL,
    headquarters VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Railway Divisions (e.g., Mumbai CSMT, Pune, Bhusawal, Delhi)
CREATE TABLE IF NOT EXISTS railway_divisions (
    division_id VARCHAR(20) PRIMARY KEY, -- e.g., 'CR_MUMBAI', 'CR_PUNE'
    zone_id VARCHAR(10) NOT NULL REFERENCES railway_zones(zone_id) ON DELETE CASCADE,
    division_name VARCHAR(100) NOT NULL,
    headquarters_station VARCHAR(50),
    control_room_contact VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Stations with GPS Coordinates
CREATE TABLE IF NOT EXISTS stations (
    station_code VARCHAR(10) PRIMARY KEY, -- e.g., 'CSMT', 'DR', 'TNA', 'KYN', 'PUNE'
    station_name VARCHAR(150) NOT NULL,
    division_id VARCHAR(20) NOT NULL REFERENCES railway_divisions(division_id) ON DELETE CASCADE,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    elevation_meters DECIMAL(7, 2),
    platforms_count INTEGER DEFAULT 2,
    has_emergency_sidings BOOLEAN DEFAULT FALSE,
    is_junction BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Track Sections between Stations
CREATE TABLE IF NOT EXISTS track_sections (
    section_id VARCHAR(50) PRIMARY KEY, -- e.g., 'SEC_CSMT_DR_UP_FAST'
    division_id VARCHAR(20) NOT NULL REFERENCES railway_divisions(division_id) ON DELETE CASCADE,
    from_station_code VARCHAR(10) NOT NULL REFERENCES stations(station_code),
    to_station_code VARCHAR(10) NOT NULL REFERENCES stations(station_code),
    line_type line_type NOT NULL DEFAULT 'UP_FAST',
    distance_km DECIMAL(6, 2) NOT NULL,
    track_count INTEGER DEFAULT 2,
    is_electrified BOOLEAN DEFAULT TRUE,
    electrification_voltage VARCHAR(30) DEFAULT '25kV AC 50Hz',
    signaling_system VARCHAR(50) DEFAULT 'AUTOMATIC_BLOCK_SIGNALING', -- ABS, MACLS, KAVACH
    max_permissible_speed_kmph INTEGER NOT NULL DEFAULT 110,
    gradient_ratio VARCHAR(30), -- e.g., '1:100' in Bhor Ghat
    current_status track_section_status NOT NULL DEFAULT 'AVAILABLE',
    status_reason TEXT,
    last_inspected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. TRAINS & SCHEDULES DOMAIN
-- ==============================================================================

-- Trains Registry
CREATE TABLE IF NOT EXISTS trains (
    train_number VARCHAR(10) PRIMARY KEY, -- e.g., '22221', '12127', '95301'
    train_name VARCHAR(150) NOT NULL,
    train_type train_type NOT NULL,
    source_station_code VARCHAR(10) NOT NULL REFERENCES stations(station_code),
    destination_station_code VARCHAR(10) NOT NULL REFERENCES stations(station_code),
    primary_zone_id VARCHAR(10) REFERENCES railway_zones(zone_id),
    priority_level INTEGER NOT NULL DEFAULT 3, -- 1 = Highest (Vande Bharat/Rajdhani), 5 = Goods
    rake_type VARCHAR(50) DEFAULT 'LHB_22_COACH',
    max_operating_speed_kmph INTEGER DEFAULT 130,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Train Detailed Route Schedules (Stoppages and Times)
CREATE TABLE IF NOT EXISTS train_schedules (
    schedule_id BIGSERIAL PRIMARY KEY,
    train_number VARCHAR(10) NOT NULL REFERENCES trains(train_number) ON DELETE CASCADE,
    stop_sequence INTEGER NOT NULL,
    station_code VARCHAR(10) NOT NULL REFERENCES stations(station_code),
    track_section_id VARCHAR(50) REFERENCES track_sections(section_id),
    scheduled_arrival TIME,
    scheduled_departure TIME,
    dwell_minutes INTEGER DEFAULT 2,
    platform_number VARCHAR(5),
    distance_from_source_km DECIMAL(7, 2),
    UNIQUE(train_number, stop_sequence)
);

-- Real-time Train Telemetry & GPS Tracking
CREATE TABLE IF NOT EXISTS train_telemetry (
    telemetry_id BIGSERIAL PRIMARY KEY,
    train_number VARCHAR(10) NOT NULL REFERENCES trains(train_number) ON DELETE CASCADE,
    current_section_id VARCHAR(50) REFERENCES track_sections(section_id),
    current_latitude DECIMAL(10, 7) NOT NULL,
    current_longitude DECIMAL(10, 7) NOT NULL,
    current_speed_kmph DECIMAL(5, 2) NOT NULL DEFAULT 0.0,
    delay_minutes INTEGER NOT NULL DEFAULT 0,
    heading_degrees DECIMAL(5, 2),
    kavach_status VARCHAR(50) DEFAULT 'ARMED_NORMAL', -- Kavach Anti-Collision
    last_ping_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. ASSETS & CREW DOMAIN
-- ==============================================================================

-- Physical Assets (Locomotives, Rakes, Maintenance Machinery)
CREATE TABLE IF NOT EXISTS assets (
    asset_id VARCHAR(50) PRIMARY KEY, -- e.g., 'LOCO_WAP7_30201', 'TAMPER_BCM_401'
    asset_type asset_type NOT NULL,
    home_depot_station VARCHAR(10) REFERENCES stations(station_code),
    serial_number VARCHAR(100) UNIQUE,
    manufacturing_year INTEGER,
    health_score DECIMAL(5, 2) DEFAULT 98.50, -- 0 to 100
    status asset_status NOT NULL DEFAULT 'ACTIVE',
    total_running_km DECIMAL(10, 2) DEFAULT 0.0,
    last_overhaul_date DATE,
    next_maintenance_due DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Staff / Crew Profiles
CREATE TABLE IF NOT EXISTS crew_members (
    crew_id VARCHAR(50) PRIMARY KEY, -- e.g., 'CREW_LP_4891'
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL,
    home_division_id VARCHAR(20) REFERENCES railway_divisions(division_id),
    base_station_code VARCHAR(10) REFERENCES stations(station_code),
    phone_number VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20),
    is_on_duty BOOLEAN DEFAULT FALSE,
    consecutive_duty_hours DECIMAL(4, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Asset & Crew Allocation mapping to Trains or Maintenance Blocks
CREATE TABLE IF NOT EXISTS asset_allocations (
    allocation_id BIGSERIAL PRIMARY KEY,
    asset_id VARCHAR(50) NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    train_number VARCHAR(10) REFERENCES trains(train_number),
    crew_pilot_id VARCHAR(50) REFERENCES crew_members(crew_id),
    assigned_from TIMESTAMPTZ NOT NULL,
    assigned_to TIMESTAMPTZ NOT NULL,
    duty_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. AI-POWERED BLOCK PLANNING DOMAIN
-- ==============================================================================

-- Block Planning Maintenance Requests (Submitted by Engineering/OHE/S&T)
CREATE TABLE IF NOT EXISTS block_requests (
    request_id VARCHAR(50) PRIMARY KEY, -- e.g., 'REQ_2026_CR_0891'
    division_id VARCHAR(20) NOT NULL REFERENCES railway_divisions(division_id),
    section_id VARCHAR(50) NOT NULL REFERENCES track_sections(section_id),
    department VARCHAR(50) NOT NULL, -- 'PERMANENT_WAY', 'OHE_ELECTRICAL', 'SIGNALING_TELECOM', 'BRIDGES'
    work_description TEXT NOT NULL,
    required_duration_minutes INTEGER NOT NULL,
    preferred_start_window_start TIMESTAMPTZ NOT NULL,
    preferred_start_window_end TIMESTAMPTZ NOT NULL,
    priority block_request_priority NOT NULL DEFAULT 'ROUTINE',
    required_asset_types asset_type[] DEFAULT '{}',
    demanded_by_officer VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- AI Optimized Block Schedules (Generated by AI Optimization Engine)
CREATE TABLE IF NOT EXISTS ai_block_plans (
    plan_id VARCHAR(50) PRIMARY KEY, -- e.g., 'PLAN_OPT_20260822_001'
    request_id VARCHAR(50) NOT NULL REFERENCES block_requests(request_id) ON DELETE CASCADE,
    section_id VARCHAR(50) NOT NULL REFERENCES track_sections(section_id),
    optimized_start_time TIMESTAMPTZ NOT NULL,
    optimized_end_time TIMESTAMPTZ NOT NULL,
    allocated_duration_minutes INTEGER NOT NULL,
    asset_availability_score DECIMAL(5, 2) NOT NULL DEFAULT 95.0, -- 0-100
    traffic_throughput_loss_score DECIMAL(5, 2) NOT NULL DEFAULT 4.2, -- Lower is better
    predicted_delay_impact_minutes INTEGER DEFAULT 12,
    solver_algorithm VARCHAR(100) DEFAULT 'GOOGLE_OR_TOOLS_CPSAT_V2',
    status block_plan_status NOT NULL DEFAULT 'OPTIMIZED_BY_AI',
    approved_by_controller VARCHAR(100),
    approval_timestamp TIMESTAMPTZ,
    execution_start_actual TIMESTAMPTZ,
    execution_end_actual TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Benchmark & Optimization Efficiency Metrics (Before vs After Utilization)
CREATE TABLE IF NOT EXISTS optimization_metrics (
    metric_id BIGSERIAL PRIMARY KEY,
    batch_run_id VARCHAR(50) NOT NULL,
    division_id VARCHAR(20) NOT NULL REFERENCES railway_divisions(division_id),
    computation_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    pre_optimization_asset_utilization_pct DECIMAL(5, 2) NOT NULL, -- e.g. 62.4%
    post_optimization_asset_utilization_pct DECIMAL(5, 2) NOT NULL, -- e.g. 88.7%
    corridor_throughput_gain_pct DECIMAL(5, 2) NOT NULL, -- e.g. +26.3%
    total_passenger_delay_minutes_mitigated INTEGER NOT NULL DEFAULT 480,
    maintenance_windows_granted INTEGER NOT NULL DEFAULT 14,
    conflicts_detected_and_resolved INTEGER NOT NULL DEFAULT 6
);

-- ==============================================================================
-- 6. SAFETY, ACCIDENTS & EMERGENCY FEEDS DOMAIN
-- ==============================================================================

-- Real-time Accident & Incident Reports
CREATE TABLE IF NOT EXISTS accidents (
    accident_id VARCHAR(50) PRIMARY KEY, -- e.g., 'ACC_2026_CR_004'
    train_number VARCHAR(10) REFERENCES trains(train_number),
    section_id VARCHAR(50) NOT NULL REFERENCES track_sections(section_id),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    nearest_station_code VARCHAR(10) REFERENCES stations(station_code),
    accident_type VARCHAR(50) NOT NULL, -- 'DERAILMENT', 'COLLISION', 'OHE_SNAP', 'BOULDER_FALL', 'LEVEL_CROSSING_BREACH'
    severity accident_severity NOT NULL DEFAULT 'MAJOR',
    status accident_status NOT NULL DEFAULT 'REPORTED',
    casualties_reported INTEGER DEFAULT 0,
    injuries_reported INTEGER DEFAULT 0,
    relief_train_dispatched BOOLEAN DEFAULT FALSE,
    national_disaster_response_alerted BOOLEAN DEFAULT FALSE,
    reported_by VARCHAR(100) NOT NULL,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    restoration_completed_at TIMESTAMPTZ,
    root_cause_summary TEXT,
    incident_media_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Temporary & Permanent Speed Restrictions (TSR / PSR)
CREATE TABLE IF NOT EXISTS speed_restrictions (
    restriction_id BIGSERIAL PRIMARY KEY,
    section_id VARCHAR(50) NOT NULL REFERENCES track_sections(section_id) ON DELETE CASCADE,
    start_kilometer DECIMAL(7, 3) NOT NULL,
    end_kilometer DECIMAL(7, 3) NOT NULL,
    restricted_speed_kmph INTEGER NOT NULL,
    normal_speed_kmph INTEGER NOT NULL,
    restriction_type VARCHAR(20) DEFAULT 'TEMPORARY', -- 'TEMPORARY', 'PERMANENT'
    reason TEXT NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 7. MEGA BLOCKS & PASSENGER ADVISORY DOMAIN
-- ==============================================================================

-- Mega Blocks (Planned Major Engineering & Traffic Blocks)
CREATE TABLE IF NOT EXISTS mega_blocks (
    mega_block_id VARCHAR(50) PRIMARY KEY, -- e.g., 'MB_2026_CR_SUN_032'
    division_id VARCHAR(20) NOT NULL REFERENCES railway_divisions(division_id),
    section_id VARCHAR(50) NOT NULL REFERENCES track_sections(section_id),
    line_affected line_type NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    headline VARCHAR(200) NOT NULL,
    purpose TEXT NOT NULL, -- 'Track renewal, OHE modernization & electronic interlocking'
    status mega_block_status NOT NULL DEFAULT 'UPCOMING',
    alternative_transport_notes TEXT,
    press_release_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Train Diversions, Cancellations, Short-Terminations due to Mega Blocks / Accidents
CREATE TABLE IF NOT EXISTS train_diversions (
    diversion_id BIGSERIAL PRIMARY KEY,
    source_event_type VARCHAR(20) NOT NULL, -- 'MEGA_BLOCK', 'ACCIDENT', 'WEATHER'
    source_event_id VARCHAR(50) NOT NULL, -- mega_block_id or accident_id
    train_number VARCHAR(10) NOT NULL REFERENCES trains(train_number) ON DELETE CASCADE,
    action_type VARCHAR(30) NOT NULL, -- 'CANCELLED', 'DIVERTED', 'SHORT_TERMINATED', 'RESCHEDULED'
    original_route_summary TEXT,
    diverted_via_stations TEXT,
    revised_departure_time TIMESTAMPTZ,
    short_termination_station VARCHAR(10) REFERENCES stations(station_code),
    public_notice TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 8. USERS, SUBSCRIPTIONS & NOTIFICATIONS DOMAIN
-- ==============================================================================

-- Registered App Users (Passengers, Section Controllers, Loco Pilots)
CREATE TABLE IF NOT EXISTS app_users (
    user_id VARCHAR(100) PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150),
    full_name VARCHAR(150),
    role user_role NOT NULL DEFAULT 'PASSENGER',
    fcm_device_token TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en', -- 'en', 'hi', 'mr', 'ta'
    home_station_code VARCHAR(10) REFERENCES stations(station_code),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Geo & Route Subscriptions (For Automated Push Alerts)
CREATE TABLE IF NOT EXISTS user_subscriptions (
    subscription_id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES app_users(user_id) ON DELETE CASCADE,
    pnr_number VARCHAR(12),
    subscribed_train_number VARCHAR(10) REFERENCES trains(train_number),
    subscribed_section_id VARCHAR(50) REFERENCES track_sections(section_id),
    subscribed_division_id VARCHAR(20) REFERENCES railway_divisions(division_id),
    alert_on_accidents BOOLEAN DEFAULT TRUE,
    alert_on_mega_blocks BOOLEAN DEFAULT TRUE,
    alert_on_delays BOOLEAN DEFAULT TRUE,
    proximity_radius_km INTEGER DEFAULT 25,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Broadcast Alerts Feed (Push Notifications, Accident Bulletins, Mega Block Advisories)
CREATE TABLE IF NOT EXISTS broadcast_alerts (
    alert_id VARCHAR(50) PRIMARY KEY, -- e.g., 'ALERT_2026_0822_091'
    alert_type VARCHAR(50) NOT NULL, -- 'ACCIDENT_EMERGENCY', 'MEGA_BLOCK_ADVISORY', 'ROUTE_DIVERSION', 'SAFETY_BULLETIN'
    severity VARCHAR(20) NOT NULL DEFAULT 'HIGH', -- 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'
    headline VARCHAR(200) NOT NULL,
    body_text TEXT NOT NULL,
    source_reference_id VARCHAR(50), -- accident_id or mega_block_id
    affected_section_id VARCHAR(50) REFERENCES track_sections(section_id),
    affected_division_id VARCHAR(20) REFERENCES railway_divisions(division_id),
    geo_center_lat DECIMAL(10, 7),
    geo_center_lon DECIMAL(10, 7),
    geo_radius_km DECIMAL(6, 2) DEFAULT 50.0,
    dispatched_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Notification Delivery Audit Logs
CREATE TABLE IF NOT EXISTS notification_logs (
    log_id BIGSERIAL PRIMARY KEY,
    alert_id VARCHAR(50) NOT NULL REFERENCES broadcast_alerts(alert_id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL REFERENCES app_users(user_id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL DEFAULT 'FCM_PUSH', -- 'FCM_PUSH', 'SMS', 'WHATSAPP', 'WEBSOCKET'
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'SENT', -- 'QUEUED', 'SENT', 'DELIVERED', 'FAILED'
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT
);

-- ==============================================================================
-- 9. PERFORMANCE INDEXES
-- ==============================================================================

-- Spatial / Lat-Lon lookup indexes for Proximity and Accident Feeds
CREATE INDEX IF NOT EXISTS idx_stations_lat_lon ON stations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_accidents_lat_lon ON accidents(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_train_telemetry_lat_lon ON train_telemetry(current_latitude, current_longitude);

-- Operational lookup indexes
CREATE INDEX IF NOT EXISTS idx_track_sections_status ON track_sections(current_status);
CREATE INDEX IF NOT EXISTS idx_train_schedules_train ON train_schedules(train_number, stop_sequence);
CREATE INDEX IF NOT EXISTS idx_ai_block_plans_time ON ai_block_plans(optimized_start_time, optimized_end_time);
CREATE INDEX IF NOT EXISTS idx_ai_block_plans_status ON ai_block_plans(status);
CREATE INDEX IF NOT EXISTS idx_mega_blocks_timing ON mega_blocks(start_time, end_time, status);
CREATE INDEX IF NOT EXISTS idx_broadcast_alerts_type ON broadcast_alerts(alert_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_train ON user_subscriptions(subscribed_train_number);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_section ON user_subscriptions(subscribed_section_id);
