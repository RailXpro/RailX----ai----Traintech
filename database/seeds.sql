-- ==============================================================================
-- RAILX AI: Realistic Indian Railways Seed Data
-- Central Railway Mumbai - Kalyan - Pune Corridor & Intercity High-Speed Lines
-- ==============================================================================

-- 1. ZONES
INSERT INTO railway_zones (zone_id, zone_name, headquarters) VALUES
('CR', 'Central Railway', 'Chhatrapati Shivaji Maharaj Terminus (CSMT), Mumbai'),
('WR', 'Western Railway', 'Churchgate, Mumbai'),
('NR', 'Northern Railway', 'Baroda House, New Delhi')
ON CONFLICT (zone_id) DO NOTHING;

-- 2. DIVISIONS
INSERT INTO railway_divisions (division_id, zone_id, division_name, headquarters_station, control_room_contact) VALUES
('CR_MUMBAI', 'CR', 'Mumbai Division (CR)', 'CSMT', '+91-22-22620123'),
('CR_PUNE', 'CR', 'Pune Division (CR)', 'PUNE', '+91-20-26127142'),
('WR_MUMBAI', 'WR', 'Mumbai Division (WR)', 'MMCT', '+91-22-23070198'),
('NR_DELHI', 'NR', 'Delhi Division (NR)', 'NDLS', '+91-11-23340000')
ON CONFLICT (division_id) DO NOTHING;

-- 3. STATIONS
INSERT INTO stations (station_code, station_name, division_id, latitude, longitude, elevation_meters, platforms_count, has_emergency_sidings, is_junction) VALUES
('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'CR_MUMBAI', 18.9401780, 72.8354890, 8.0, 18, TRUE, TRUE),
('DR', 'Dadar Central', 'CR_MUMBAI', 19.0180420, 72.8432880, 10.0, 8, FALSE, TRUE),
('CLA', 'Kurla Junction', 'CR_MUMBAI', 19.0664420, 72.8791580, 11.0, 8, TRUE, TRUE),
('GC', 'Ghatkopar', 'CR_MUMBAI', 19.0864380, 72.9080780, 12.0, 4, FALSE, FALSE),
('TNA', 'Thane', 'CR_MUMBAI', 19.1860000, 72.9759000, 14.0, 10, TRUE, TRUE),
('DI', 'Dombivli', 'CR_MUMBAI', 19.2184000, 73.0867000, 15.0, 5, FALSE, FALSE),
('KYN', 'Kalyan Junction', 'CR_MUMBAI', 19.2361000, 73.1306000, 18.0, 8, TRUE, TRUE),
('KJT', 'Karjat Junction', 'CR_MUMBAI', 18.9108000, 73.3283000, 52.0, 3, TRUE, TRUE),
('LNL', 'Lonavala', 'CR_PUNE', 18.7557000, 73.4091000, 624.0, 3, TRUE, TRUE),
('PUNE', 'Pune Junction', 'CR_PUNE', 18.5289000, 73.8744000, 560.0, 6, TRUE, TRUE),
('PNVL', 'Panvel Junction', 'CR_MUMBAI', 18.9894000, 73.1216000, 28.0, 7, TRUE, TRUE)
ON CONFLICT (station_code) DO NOTHING;

-- 4. TRACK SECTIONS
INSERT INTO track_sections (section_id, division_id, from_station_code, to_station_code, line_type, distance_km, max_permissible_speed_kmph, signaling_system, current_status, status_reason) VALUES
('SEC_CSMT_DR_UP_FAST', 'CR_MUMBAI', 'DR', 'CSMT', 'UP_FAST', 9.0, 105, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_CSMT_DR_DOWN_FAST', 'CR_MUMBAI', 'CSMT', 'DR', 'DOWN_FAST', 9.0, 105, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_DR_TNA_UP_FAST', 'CR_MUMBAI', 'TNA', 'DR', 'UP_FAST', 24.0, 110, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_DR_TNA_DOWN_FAST', 'CR_MUMBAI', 'DR', 'TNA', 'DOWN_FAST', 24.0, 110, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_TNA_KYN_UP_SLOW', 'CR_MUMBAI', 'KYN', 'TNA', 'UP_SLOW', 20.0, 90, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_TNA_KYN_DOWN_SLOW', 'CR_MUMBAI', 'TNA', 'KYN', 'DOWN_SLOW', 20.0, 90, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_TNA_KYN_UP_FAST', 'CR_MUMBAI', 'KYN', 'TNA', 'UP_FAST', 20.0, 110, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_TNA_KYN_DOWN_FAST', 'CR_MUMBAI', 'TNA', 'KYN', 'DOWN_FAST', 20.0, 110, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_KYN_KJT_DOWN', 'CR_MUMBAI', 'KYN', 'KJT', 'DOWN_FAST', 46.0, 110, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'Normal operations'),
('SEC_KJT_LNL_GHAT', 'CR_MUMBAI', 'KJT', 'LNL', 'DOWN_FAST', 28.0, 60, 'KAVACH_MACLS', 'CAUTION', 'Bhor Ghat steep gradient section (1:37) - Banker engines required'),
('SEC_LNL_PUNE_DOWN', 'CR_PUNE', 'LNL', 'PUNE', 'DOWN_FAST', 64.0, 120, 'AUTOMATIC_BLOCK_SIGNALING', 'AVAILABLE', 'High speed track fit')
ON CONFLICT (section_id) DO NOTHING;

-- 5. TRAINS
INSERT INTO trains (train_number, train_name, train_type, source_station_code, destination_station_code, primary_zone_id, priority_level, rake_type, max_operating_speed_kmph) VALUES
('22225', 'Solapur Vande Bharat Express', 'VANDE_BHARAT', 'CSMT', 'PUNE', 'CR', 1, 'TRAIN_18_16_CAR', 160),
('22223', 'Sainagar Shirdi Vande Bharat Express', 'VANDE_BHARAT', 'CSMT', 'KYN', 'CR', 1, 'TRAIN_18_16_CAR', 160),
('12127', 'Mumbai - Pune Intercity Superfast Express', 'SUPERFAST_EXPRESS', 'CSMT', 'PUNE', 'CR', 2, 'LHB_20_COACH', 130),
('11007', 'Deccan Express', 'MAIL_EXPRESS', 'CSMT', 'PUNE', 'CR', 3, 'LHB_18_COACH', 110),
('95301', 'CSMT - Kalyan AC Fast Local', 'SUBURBAN_LOCAL', 'CSMT', 'KYN', 'CR', 2, 'EMU_12_CAR_AC', 105),
('97011', 'CSMT - Thane Slow Local', 'SUBURBAN_LOCAL', 'CSMT', 'TNA', 'CR', 3, 'EMU_12_CAR', 90),
('CONT_881', 'JNPT Container Freight Express', 'FREIGHT_CONTAINER', 'PNVL', 'KYN', 'CR', 5, 'BLCA_CONTAINER', 100)
ON CONFLICT (train_number) DO NOTHING;

-- 6. TRAIN SCHEDULES (Vande Bharat 22225)
INSERT INTO train_schedules (train_number, stop_sequence, station_code, scheduled_arrival, scheduled_departure, dwell_minutes, platform_number, distance_from_source_km) VALUES
('22225', 1, 'CSMT', NULL, '16:05:00', 0, '9', 0.0),
('22225', 2, 'DR', '16:15:00', '16:17:00', 2, '5', 9.0),
('22225', 3, 'TNA', '16:33:00', '16:35:00', 2, '5', 33.0),
('22225', 4, 'KYN', '16:53:00', '16:55:00', 2, '4', 53.0),
('22225', 5, 'LNL', '18:00:00', '18:02:00', 2, '2', 128.0),
('22225', 6, 'PUNE', '19:10:00', '19:15:00', 5, '2', 192.0)
ON CONFLICT DO NOTHING;

-- 7. LIVE TELEMETRY
INSERT INTO train_telemetry (train_number, current_section_id, current_latitude, current_longitude, current_speed_kmph, delay_minutes, heading_degrees, kavach_status) VALUES
('22225', 'SEC_DR_TNA_DOWN_FAST', 19.1245000, 72.9345000, 102.4, 0, 38.5, 'ARMED_NORMAL'),
('12127', 'SEC_KYN_KJT_DOWN', 19.0450000, 73.2100000, 88.0, 4, 125.0, 'ARMED_NORMAL'),
('95301', 'SEC_CSMT_DR_DOWN_FAST', 18.9800000, 72.8390000, 75.0, 2, 15.0, 'NOT_EQUIPPED')
ON CONFLICT DO NOTHING;

-- 8. ASSETS INVENTORY
INSERT INTO assets (asset_id, asset_type, home_depot_station, serial_number, manufacturing_year, health_score, status, total_running_km) VALUES
('LOCO_WAP7_30451', 'LOCOMOTIVE_WAP7', 'KYN', 'WAP7-CLW-2021-30451', 2021, 98.2, 'ACTIVE', 245000.0),
('LOCO_WAG9_31290', 'LOCOMOTIVE_WAG9', 'KYN', 'WAG9-CLW-2020-31290', 2020, 95.8, 'ACTIVE', 380000.0),
('RAKE_VB_04', 'RAKE_TRAIN18', 'CSMT', 'ICF-T18-2023-04', 2023, 99.5, 'ACTIVE', 120000.0),
('TAMPER_PLASSER_09', 'TAMPING_MACHINE', 'KYN', 'PLASSER-09-3X-2019', 2019, 91.0, 'ACTIVE', 14500.0),
('OHE_TOWER_CR_11', 'OHE_TOWER_CAR', 'TNA', 'CR-OHE-TC-2022-11', 2022, 96.0, 'ACTIVE', 28000.0)
ON CONFLICT (asset_id) DO NOTHING;

-- 9. CREW MEMBERS
INSERT INTO crew_members (crew_id, full_name, role, home_division_id, base_station_code, phone_number, is_on_duty) VALUES
('CREW_LP_101', 'Rajesh Sharma', 'LOCO_PILOT', 'CR_MUMBAI', 'CSMT', '+91-9820011223', TRUE),
('CREW_ALP_102', 'Vikram Deshmukh', 'LOCO_PILOT', 'CR_MUMBAI', 'KYN', '+91-9820099887', TRUE),
('CREW_SM_201', 'Anil Kumar Kulkarni', 'STATION_MASTER', 'CR_MUMBAI', 'TNA', '+91-9820033445', TRUE),
('CREW_SC_301', 'Pooja Verma', 'SECTION_CONTROLLER', 'CR_MUMBAI', 'CSMT', '+91-9820055667', TRUE)
ON CONFLICT (crew_id) DO NOTHING;

-- 10. BLOCK PLANNING REQUEST & AI OPTIMIZED PLAN
INSERT INTO block_requests (request_id, division_id, section_id, department, work_description, required_duration_minutes, preferred_start_window_start, preferred_start_window_end, priority, required_asset_types) VALUES
('REQ_CR_2026_091', 'CR_MUMBAI', 'SEC_TNA_KYN_UP_SLOW', 'PERMANENT_WAY', 'Deep track screening, ballast tamping and turnout sleeper replacements', 240, NOW() + INTERVAL '1 day' + INTERVAL '1 hour', NOW() + INTERVAL '1 day' + INTERVAL '6 hours', 'HIGH', '{TAMPING_MACHINE,TRACK_RELAYING_MACHINE}')
ON CONFLICT (request_id) DO NOTHING;

INSERT INTO ai_block_plans (plan_id, request_id, section_id, optimized_start_time, optimized_end_time, allocated_duration_minutes, asset_availability_score, traffic_throughput_loss_score, predicted_delay_impact_minutes, solver_algorithm, status, approved_by_controller, approval_timestamp) VALUES
('PLAN_OPT_20260822_001', 'REQ_CR_2026_091', 'SEC_TNA_KYN_UP_SLOW', NOW() + INTERVAL '1 day' + INTERVAL '1 hour' + INTERVAL '30 minutes', NOW() + INTERVAL '1 day' + INTERVAL '5 hours' + INTERVAL '30 minutes', 240, 97.50, 3.10, 8, 'GOOGLE_OR_TOOLS_CPSAT_V2', 'APPROVED', 'Pooja Verma (Chief Controller)', NOW())
ON CONFLICT (plan_id) DO NOTHING;

-- 11. OPTIMIZATION EFFICIENCY COMPARISON METRICS
INSERT INTO optimization_metrics (batch_run_id, division_id, pre_optimization_asset_utilization_pct, post_optimization_asset_utilization_pct, corridor_throughput_gain_pct, total_passenger_delay_minutes_mitigated, maintenance_windows_granted, conflicts_detected_and_resolved) VALUES
('BATCH_OPT_2026_08', 'CR_MUMBAI', 63.80, 89.20, 25.40, 520, 18, 9);

-- 12. MEGA BLOCK SCHEDULE & TRAIN DIVERSIONS
INSERT INTO mega_blocks (mega_block_id, division_id, section_id, line_affected, start_time, end_time, headline, purpose, status, alternative_transport_notes) VALUES
('MB_CR_2026_SUN_01', 'CR_MUMBAI', 'SEC_TNA_KYN_UP_SLOW', 'UP_SLOW', NOW() + INTERVAL '2 days' + INTERVAL '10 hours', NOW() + INTERVAL '2 days' + INTERVAL '15 hours', 'Sunday Mega Block: Thane to Kalyan Up & Down Slow Lines', 'Bridge girder inspection, OHE modern re-tensioning and track tamping', 'UPCOMING', 'Slow suburban services diverted on Up/Down Fast corridors between Mulund and Diva.')
ON CONFLICT (mega_block_id) DO NOTHING;

INSERT INTO train_diversions (source_event_type, source_event_id, train_number, action_type, original_route_summary, diverted_via_stations, public_notice) VALUES
('MEGA_BLOCK', 'MB_CR_2026_SUN_01', '97011', 'DIVERTED', 'CSMT to Thane Slow corridor', 'Diverted via Fast line between Kurla and Thane skipping minor stations', 'Passengers for Vidyavihar, Kanjurmarg requested to alight at Ghatkopar or Bhandup.')
ON CONFLICT DO NOTHING;

-- 13. SAMPLE APP USERS & SUBSCRIPTIONS
INSERT INTO app_users (user_id, phone_number, email, full_name, role, home_station_code) VALUES
('USR_PASS_001', '+919876543210', 'rahul.sharma@example.com', 'Rahul Sharma', 'PASSENGER', 'TNA'),
('USR_STAFF_002', '+919876543211', 'controller.cr@indianrailways.gov.in', 'Pooja Verma', 'SECTION_CONTROLLER', 'CSMT')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_subscriptions (user_id, pnr_number, subscribed_train_number, subscribed_section_id, alert_on_accidents, alert_on_mega_blocks) VALUES
('USR_PASS_001', '8421098765', '22225', 'SEC_DR_TNA_DOWN_FAST', TRUE, TRUE)
ON CONFLICT DO NOTHING;
