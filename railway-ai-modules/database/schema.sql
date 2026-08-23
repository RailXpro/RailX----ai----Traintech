-- ======================================================================
-- Indian Railways AI Block Planning & Smart Notification System Schema
-- PostgreSQL / MySQL Compatible Schema
-- ======================================================================

-- 1. Stations & Junctions
CREATE TABLE IF NOT EXISTS stations (
    station_code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    division VARCHAR(100) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    is_junction BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Track Sections & Availability (Corridors)
CREATE TABLE IF NOT EXISTS track_sections (
    section_id VARCHAR(50) PRIMARY KEY, -- e.g. "AGC-MTJ-MAIN-UP"
    from_station VARCHAR(10) REFERENCES stations(station_code),
    to_station VARCHAR(10) REFERENCES stations(station_code),
    distance_km DECIMAL(8, 2) NOT NULL,
    max_speed_kmph INT DEFAULT 110,
    track_line_type VARCHAR(50) DEFAULT 'BOTH_MAIN', -- UP_MAIN, DOWN_MAIN, UP_SLOW, DOWN_SLOW, CHORD_LINE
    electrification_type VARCHAR(50) DEFAULT '25KV_AC',
    capacity_trains_per_day INT DEFAULT 120,
    live_status VARCHAR(50) DEFAULT 'NORMAL', -- NORMAL, BLOCKED_ACCIDENT, SPEED_RESTRICTED, MEGA_BLOCK
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Trains Master
CREATE TABLE IF NOT EXISTS trains (
    train_number VARCHAR(10) PRIMARY KEY,
    train_name VARCHAR(150) NOT NULL,
    train_type VARCHAR(50) DEFAULT 'SUPERFAST', -- RAJDHANI, SHATABDI, VANDE_BHARAT, SUPERFAST, EXPRESS, LOCAL
    origin_station VARCHAR(10) REFERENCES stations(station_code),
    destination_station VARCHAR(10) REFERENCES stations(station_code),
    total_distance_km DECIMAL(8, 2),
    avg_speed_kmph DECIMAL(6, 2)
);

-- 4. Train Route Schedule & Station Order
CREATE TABLE IF NOT EXISTS train_schedule_stops (
    id SERIAL PRIMARY KEY,
    train_number VARCHAR(10) REFERENCES trains(train_number) ON DELETE CASCADE,
    stop_sequence INT NOT NULL,
    station_code VARCHAR(10) REFERENCES stations(station_code),
    scheduled_arrival TIME,
    scheduled_departure TIME,
    halt_duration_mins INT DEFAULT 2,
    distance_from_origin_km DECIMAL(8, 2)
);

-- 5. Passenger Bookings / PNR Database
CREATE TABLE IF NOT EXISTS passenger_bookings (
    pnr VARCHAR(15) PRIMARY KEY,
    passenger_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    train_number VARCHAR(10) REFERENCES trains(train_number),
    boarding_station VARCHAR(10) REFERENCES stations(station_code),
    destination_station VARCHAR(10) REFERENCES stations(station_code),
    travel_date DATE NOT NULL,
    seat_details VARCHAR(50),
    journey_status VARCHAR(50) DEFAULT 'CONFIRMED' -- CONFIRMED, ONBOARD, COMPLETED, CANCELLED
);

-- 6. Track Accidents Table (Feature 1)
CREATE TABLE IF NOT EXISTS accidents (
    accident_id VARCHAR(50) PRIMARY KEY,
    train_number VARCHAR(10),
    accident_type VARCHAR(50) NOT NULL, -- DERAILMENT, COLLISION, OHE_FAILURE, SIGNAL_FAILURE, TRACK_FRACTURE
    severity VARCHAR(50) NOT NULL,       -- MINOR, MODERATE, SEVERE, CRITICAL
    division VARCHAR(100) NOT NULL,
    section_code VARCHAR(50) NOT NULL,   -- e.g. "AGC-MTJ"
    from_station VARCHAR(10) REFERENCES stations(station_code),
    to_station VARCHAR(10) REFERENCES stations(station_code),
    kilometer_marker VARCHAR(50),
    lines_affected VARCHAR(50) NOT NULL,
    casualties_count INT DEFAULT 0,
    injuries_count INT DEFAULT 0,
    details TEXT NOT NULL,
    relief_train_dispatched BOOLEAN DEFAULT TRUE,
    helpline_numbers TEXT[],
    estimated_clearance_hours DECIMAL(4, 1) DEFAULT 4.0,
    disruption_status VARCHAR(50) DEFAULT 'ACTIVE',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Mega Block Circulars & Schedules (Feature 2)
CREATE TABLE IF NOT EXISTS mega_blocks (
    block_id VARCHAR(50) PRIMARY KEY,
    railway_zone VARCHAR(100) NOT NULL,
    division VARCHAR(100) NOT NULL,
    section_code VARCHAR(50) NOT NULL,
    from_station VARCHAR(10) REFERENCES stations(station_code),
    to_station VARCHAR(10) REFERENCES stations(station_code),
    affected_lines TEXT[] DEFAULT '{"UP Fast", "DOWN Fast"}',
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_hours DECIMAL(4, 1) DEFAULT 5.0,
    maintenance_type VARCHAR(200) NOT NULL,
    speed_restrictions_kmph INT DEFAULT 30,
    train_impacts TEXT[],
    raw_circular_text TEXT,
    uploaded_by_planner_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Smart Notifications History (Features 1 & 2)
CREATE TABLE IF NOT EXISTS disruption_notifications (
    notification_id VARCHAR(100) PRIMARY KEY,
    pnr VARCHAR(15) REFERENCES passenger_bookings(pnr),
    train_number VARCHAR(10),
    event_type VARCHAR(50) NOT NULL, -- ACCIDENT, MEGABLOCK, DELAY, REROUTE
    priority VARCHAR(50) NOT NULL,   -- CRITICAL_EMERGENCY, HIGH_DISRUPTION, MEDIUM_ADVISORY
    headline VARCHAR(255) NOT NULL,
    exact_incident_details TEXT NOT NULL,
    impact_on_journey TEXT NOT NULL,
    actionable_alternatives TEXT[],
    helpline_contacts TEXT[],
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. AI Reroute Proposals & Execution Plans (Feature 3)
CREATE TABLE IF NOT EXISTS reroute_proposals (
    proposal_id VARCHAR(50) PRIMARY KEY,
    train_number VARCHAR(10) REFERENCES trains(train_number),
    disruption_id VARCHAR(50),
    original_route_stations TEXT[],
    rerouted_stations TEXT[],
    strategy_type VARCHAR(100) NOT NULL, -- RAIL_DIVERSION_CHORD_BYPASS, MULTI_HOP_CONNECTING, INTERMODAL_SHUTTLE
    additional_distance_km DECIMAL(8, 2),
    estimated_delay_mins INT,
    feasibility_score DECIMAL(3, 2),
    approved_by_planner VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PROPOSED', -- PROPOSED, APPROVED, IN_EXECUTION, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================
-- INDEXES FOR FAST QUERYING
-- ======================================================================
CREATE INDEX IF NOT EXISTS idx_train_schedule_seq ON train_schedule_stops(train_number, stop_sequence);
CREATE INDEX IF NOT EXISTS idx_passenger_pnr_train ON passenger_bookings(train_number, travel_date);
CREATE INDEX IF NOT EXISTS idx_accidents_section ON accidents(section_code, disruption_status);
CREATE INDEX IF NOT EXISTS idx_notifications_pnr ON disruption_notifications(pnr);
CREATE INDEX IF NOT EXISTS idx_megablocks_time ON mega_blocks(start_time, end_time);

-- ======================================================================
-- SAMPLE SEED DATA
-- ======================================================================

INSERT INTO stations (station_code, name, division, zone, latitude, longitude, is_junction) VALUES
('NDLS', 'New Delhi', 'Delhi', 'Northern Railway', 28.6427, 77.2195, TRUE),
('NZM', 'Hazrat Nizamuddin', 'Delhi', 'Northern Railway', 28.5888, 77.2534, TRUE),
('MTJ', 'Mathura Junction', 'Agra', 'North Central Railway', 27.4924, 77.6737, TRUE),
('AGC', 'Agra Cantt', 'Agra', 'North Central Railway', 27.1583, 77.9942, TRUE),
('GWL', 'Gwalior Junction', 'Jhansi', 'North Central Railway', 26.2183, 78.1828, TRUE),
('VGLJ', 'Virangana Lakshmibai Jhansi', 'Jhansi', 'North Central Railway', 25.4484, 78.5685, TRUE),
('BPL', 'Bhopal Junction', 'Bhopal', 'West Central Railway', 23.2599, 77.4126, TRUE),
('KOTA', 'Kota Junction', 'Kota', 'West Central Railway', 25.2138, 75.8648, TRUE),
('SWM', 'Sawai Madhopur', 'Kota', 'West Central Railway', 25.9930, 76.3688, TRUE),
('JP', 'Jaipur Junction', 'Jaipur', 'North Western Railway', 26.9196, 75.7878, TRUE),
('RE', 'Rewari Junction', 'Jaipur', 'North Western Railway', 28.1969, 76.6186, TRUE),
('BCT', 'Mumbai Central', 'Mumbai', 'Western Railway', 18.9696, 72.8193, TRUE),
('CSMT', 'Mumbai CSMT', 'Mumbai', 'Central Railway', 18.9401, 72.8354, TRUE),
('TNA', 'Thane', 'Mumbai', 'Central Railway', 19.1860, 72.9759, TRUE),
('KYN', 'Kalyan Junction', 'Mumbai', 'Central Railway', 19.2437, 73.1355, TRUE)
ON CONFLICT (station_code) DO NOTHING;

INSERT INTO trains (train_number, train_name, train_type, origin_station, destination_station, total_distance_km, avg_speed_kmph) VALUES
('12951', 'Mumbai Tejas Rajdhani Express', 'RAJDHANI', 'BCT', 'NDLS', 1384.0, 88.5),
('12137', 'Punjab Mail', 'SUPERFAST', 'CSMT', 'NDLS', 1540.0, 62.0),
('97034', 'Kalyan - CSMT Fast Local', 'LOCAL', 'KYN', 'CSMT', 54.0, 48.0)
ON CONFLICT (train_number) DO NOTHING;
