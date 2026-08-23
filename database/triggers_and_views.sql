-- ==============================================================================
-- RAILX AI: Triggers, Automated Event Handlers & Real-time Analytics Views
-- ==============================================================================

-- ==============================================================================
-- 1. AUTOMATIC TIMESTAMP UPDATERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_track_sections ON track_sections;
CREATE TRIGGER set_timestamp_track_sections
BEFORE UPDATE ON track_sections
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_assets ON assets;
CREATE TRIGGER set_timestamp_assets
BEFORE UPDATE ON assets
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_ai_block_plans ON ai_block_plans;
CREATE TRIGGER set_timestamp_ai_block_plans
BEFORE UPDATE ON ai_block_plans
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_accidents ON accidents;
CREATE TRIGGER set_timestamp_accidents
BEFORE UPDATE ON accidents
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_mega_blocks ON mega_blocks;
CREATE TRIGGER set_timestamp_mega_blocks
BEFORE UPDATE ON mega_blocks
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_app_users ON app_users;
CREATE TRIGGER set_timestamp_app_users
BEFORE UPDATE ON app_users
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ==============================================================================
-- 2. AUTOMATIC ACCIDENT EVENT HANDLER & BROADCAST TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION handle_accident_event()
RETURNS TRIGGER AS $$
DECLARE
    v_nearest_station_name VARCHAR(150);
    v_train_name VARCHAR(150);
    v_alert_id VARCHAR(50);
BEGIN
    -- 1. Update Track Section Status
    IF NEW.status IN ('REPORTED', 'RESCUE_IN_PROGRESS', 'TRACK_RESTORATION') THEN
        UPDATE track_sections 
        SET current_status = 'EMERGENCY_CLOSURE',
            status_reason = CONCAT('Accident reported: ', NEW.accident_type, ' (ID: ', NEW.accident_id, ')')
        WHERE section_id = NEW.section_id;
    ELSIF NEW.status = 'CLEARED_REOPENED' THEN
        UPDATE track_sections 
        SET current_status = 'AVAILABLE',
            status_reason = 'Section cleared and track fit certified.'
        WHERE section_id = NEW.section_id;
    END IF;

    -- 2. Fetch Helper Context
    SELECT station_name INTO v_nearest_station_name FROM stations WHERE station_code = NEW.nearest_station_code;
    SELECT train_name INTO v_train_name FROM trains WHERE train_number = NEW.train_number;

    -- 3. Automatically generate broadcast alert on insert
    IF (TG_OP = 'INSERT') THEN
        v_alert_id := 'ALERT_' || TO_CHAR(NOW(), 'YYYYMMDD_HH24MISS') || '_' || SUBSTRING(NEW.accident_id, 1, 8);
        
        INSERT INTO broadcast_alerts (
            alert_id,
            alert_type,
            severity,
            headline,
            body_text,
            source_reference_id,
            affected_section_id,
            geo_center_lat,
            geo_center_lon,
            geo_radius_km,
            expires_at
        ) VALUES (
            v_alert_id,
            'ACCIDENT_EMERGENCY',
            'CRITICAL',
            CONCAT('EMERGENCY: Accident reported near ', COALESCE(v_nearest_station_name, 'section'), ' involving train ', COALESCE(NEW.train_number, 'N/A')),
            CONCAT('Accident type: ', NEW.accident_type, '. Rescue & restoration teams deployed. Section is closed. Passengers in the area are advised to check diverted routes.'),
            NEW.accident_id,
            NEW.section_id,
            NEW.latitude,
            NEW.longitude,
            40.0,
            NOW() + INTERVAL '12 hours'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_handle_accident ON accidents;
CREATE TRIGGER trigger_handle_accident
AFTER INSERT OR UPDATE OF status ON accidents
FOR EACH ROW EXECUTE FUNCTION handle_accident_event();

-- ==============================================================================
-- 3. AUTOMATIC MEGA BLOCK TRACK STATUS TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION handle_mega_block_event()
RETURNS TRIGGER AS $$
DECLARE
    v_alert_id VARCHAR(50);
BEGIN
    IF (NEW.status = 'ACTIVE') THEN
        UPDATE track_sections
        SET current_status = 'MEGA_BLOCK',
            status_reason = CONCAT('Active Mega Block: ', NEW.headline)
        WHERE section_id = NEW.section_id;
    ELSIF (NEW.status = 'COMPLETED') THEN
        UPDATE track_sections
        SET current_status = 'AVAILABLE',
            status_reason = 'Mega block maintenance work completed.'
        WHERE section_id = NEW.section_id;
    END IF;

    -- Broadcast when upcoming mega block is registered
    IF (TG_OP = 'INSERT') THEN
        v_alert_id := 'MB_ALERT_' || TO_CHAR(NOW(), 'YYYYMMDD_HH24MISS') || '_' || SUBSTRING(NEW.mega_block_id, 1, 8);
        
        INSERT INTO broadcast_alerts (
            alert_id,
            alert_type,
            severity,
            headline,
            body_text,
            source_reference_id,
            affected_section_id,
            affected_division_id,
            expires_at
        ) VALUES (
            v_alert_id,
            'MEGA_BLOCK_ADVISORY',
            'HIGH',
            NEW.headline,
            CONCAT('Planned Mega Block between ', NEW.start_time, ' and ', NEW.end_time, '. Purpose: ', NEW.purpose, '. Plan your journey accordingly.'),
            NEW.mega_block_id,
            NEW.section_id,
            NEW.division_id,
            NEW.end_time
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_handle_mega_block ON mega_blocks;
CREATE TRIGGER trigger_handle_mega_block
AFTER INSERT OR UPDATE OF status ON mega_blocks
FOR EACH ROW EXECUTE FUNCTION handle_mega_block_event();

-- ==============================================================================
-- 4. ANALYTICS & INTERACTIVE DASHBOARD VIEWS
-- ==============================================================================

-- Live Track Network Map Status (For GIS/Interactive Visual Map View)
CREATE OR REPLACE VIEW v_track_network_live_status AS
SELECT 
    ts.section_id,
    ts.division_id,
    rd.division_name,
    ts.from_station_code,
    s1.station_name AS from_station_name,
    s1.latitude AS from_lat,
    s1.longitude AS from_lon,
    ts.to_station_code,
    s2.station_name AS to_station_name,
    s2.latitude AS to_lat,
    s2.longitude AS to_lon,
    ts.line_type,
    ts.distance_km,
    ts.max_permissible_speed_kmph,
    ts.current_status,
    CASE 
        WHEN ts.current_status = 'AVAILABLE' THEN '#22C55E' -- Green
        WHEN ts.current_status = 'CAUTION' THEN '#EAB308'   -- Yellow
        WHEN ts.current_status = 'BLOCKED' THEN '#F97316'   -- Orange
        WHEN ts.current_status = 'MEGA_BLOCK' THEN '#A855F7' -- Purple
        WHEN ts.current_status = 'EMERGENCY_CLOSURE' THEN '#EF4444' -- Red
        ELSE '#6B7280'
    END AS status_color_hex,
    ts.status_reason,
    (SELECT COUNT(*) FROM speed_restrictions sr WHERE sr.section_id = ts.section_id AND sr.is_active = TRUE) AS active_speed_restrictions_count
FROM track_sections ts
JOIN railway_divisions rd ON ts.division_id = rd.division_id
JOIN stations s1 ON ts.from_station_code = s1.station_code
JOIN stations s2 ON ts.to_station_code = s2.station_code;

-- Real-time Accident Feed & Safety Dashboard
CREATE OR REPLACE VIEW v_active_accidents_feed AS
SELECT 
    a.accident_id,
    a.train_number,
    t.train_name,
    t.train_type,
    a.section_id,
    ts.from_station_code || ' - ' || ts.to_station_code AS corridor,
    a.nearest_station_code,
    s.station_name AS nearest_station_name,
    a.latitude,
    a.longitude,
    a.accident_type,
    a.severity,
    a.status,
    a.casualties_reported,
    a.injuries_reported,
    a.relief_train_dispatched,
    a.national_disaster_response_alerted,
    a.reported_by,
    a.reported_at,
    AGE(NOW(), a.reported_at) AS active_duration,
    a.root_cause_summary
FROM accidents a
LEFT JOIN trains t ON a.train_number = t.train_number
JOIN track_sections ts ON a.section_id = ts.section_id
LEFT JOIN stations s ON a.nearest_station_code = s.station_code
WHERE a.status != 'CLEARED_REOPENED'
ORDER BY a.reported_at DESC;

-- Live Train Telemetry and Delay Monitor
CREATE OR REPLACE VIEW v_train_live_status AS
SELECT 
    t.train_number,
    t.train_name,
    t.train_type,
    t.priority_level,
    t.source_station_code,
    s_src.station_name AS source_station_name,
    t.destination_station_code,
    s_dst.station_name AS destination_station_name,
    tt.current_section_id,
    tt.current_latitude,
    tt.current_longitude,
    tt.current_speed_kmph,
    tt.delay_minutes,
    CASE 
        WHEN tt.delay_minutes <= 5 THEN 'ON_TIME'
        WHEN tt.delay_minutes <= 20 THEN 'SLIGHT_DELAY'
        ELSE 'HEAVY_DELAY'
    END AS delay_category,
    tt.kavach_status,
    tt.last_ping_at
FROM trains t
LEFT JOIN train_telemetry tt ON t.train_number = tt.train_number
JOIN stations s_src ON t.source_station_code = s_src.station_code
JOIN stations s_dst ON t.destination_station_code = s_dst.station_code
WHERE t.is_active = TRUE;

-- AI Optimization Performance Comparison (Before vs After)
CREATE OR REPLACE VIEW v_ai_optimization_dashboard AS
SELECT 
    p.plan_id,
    p.request_id,
    r.department,
    r.work_description,
    p.section_id,
    p.optimized_start_time,
    p.optimized_end_time,
    p.allocated_duration_minutes,
    p.asset_availability_score,
    p.traffic_throughput_loss_score,
    p.predicted_delay_impact_minutes,
    p.solver_algorithm,
    p.status,
    p.approved_by_controller,
    p.approval_timestamp
FROM ai_block_plans p
JOIN block_requests r ON p.request_id = r.request_id
ORDER BY p.optimized_start_time ASC;

-- Upcoming & Active Mega Block Passenger Guide
CREATE OR REPLACE VIEW v_upcoming_mega_blocks AS
SELECT 
    mb.mega_block_id,
    mb.division_id,
    rd.division_name,
    mb.section_id,
    ts.from_station_code || ' to ' || ts.to_station_code AS corridor,
    mb.line_affected,
    mb.start_time,
    mb.end_time,
    ROUND(EXTRACT(EPOCH FROM (mb.end_time - mb.start_time)) / 3600.0, 1) AS block_duration_hours,
    mb.headline,
    mb.purpose,
    mb.status,
    mb.alternative_transport_notes,
    (SELECT COUNT(*) FROM train_diversions td WHERE td.source_event_id = mb.mega_block_id) AS affected_trains_count
FROM mega_blocks mb
JOIN railway_divisions rd ON mb.division_id = rd.division_id
JOIN track_sections ts ON mb.section_id = ts.section_id
WHERE mb.status IN ('UPCOMING', 'ACTIVE')
ORDER BY mb.start_time ASC;
