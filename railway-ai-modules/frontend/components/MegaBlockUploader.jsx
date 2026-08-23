/**
 * MegaBlockUploader.jsx
 * UI Component for Feature 2:
 * Railway Planner Document/Circular Scanner & Passenger Alert Broadcaster.
 */

import React, { useState } from 'react';

export default function MegaBlockUploader({ onScanComplete }) {
  const sampleCircularText = `CENTRAL RAILWAY PRESS RELEASE
MUMBAI DIVISION MEGA BLOCK ON 23.08.2026

Central Railway's Mumbai Division will operate a scheduled Mega Block on its suburban network for carrying out urgent track renewal, overhead equipment (OHE) maintenance, and signaling modernization works as under:

SECTION: BETWEEN THANE AND KALYAN
TIMING: 10:30 HRS TO 15:30 HRS (5.0 Hours)
TRACKS AFFECTED: UP & DOWN FAST LINES

REGULATION OF TRAINS:
1. All UP and DOWN Fast line suburban services departing CSMT between 10:00 AM and 3:00 PM will be diverted to UP/DOWN Slow lines between Thane and Kalyan stations, halting at all intermediate stations.
2. Mail/Express Train Nos. 12137 (Punjab Mail), 11057 (Amritsar Express) and 12163 arriving in Mumbai will be regulated and delayed by 15-25 minutes.
3. Speed restriction of 30 km/h will be enforced through the maintenance corridor.

Passengers are requested to bear with the Railway Administration for the inconvenience caused.`;

  const [rawText, setRawText] = useState(sampleCircularText);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  const handleScanCircular = () => {
    setIsScanning(true);
    setBroadcastResult(null);

    // Simulate AI parsing or call backend API
    setTimeout(() => {
      const parsed = {
        block_id: "MB-CR-20260823-01",
        railway_zone: "Central Railway (CR)",
        division: "Mumbai Division",
        section: "Thane - Kalyan",
        from_station: "TNA",
        to_station: "KYN",
        affected_lines: ["UP Fast Line", "DOWN Fast Line"],
        start_time: "2026-08-23T10:30:00",
        end_time: "2026-08-23T15:30:00",
        duration_hours: 5.0,
        maintenance_type: "Track Renewal, OHE Overhaul & Electronic Signaling Upgrade",
        speed_restrictions_kmph: 30,
        train_impacts: [
          "Fast locals diverted to Slow lines (all stations halt)",
          "Mail/Express trains delayed by 15-25 mins"
        ],
        diverted_trains: ["12137", "11057", "12163", "97034"],
        confidence_score: 0.98
      };
      setExtractedData(parsed);
      setIsScanning(false);
      if (onScanComplete) onScanComplete(parsed);
    }, 800);
  };

  const handleBroadcastAlerts = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setBroadcastResult({
        status: "DELIVERED",
        affected_passengers_count: 24,
        sample_recipients: [
          { pnr: "6512903341", name: "Priya Deshmukh", train: "12137 Punjab Mail", seat: "B2-45" },
          { pnr: "9703411209", name: "Sunita Patil", train: "97034 Fast Local", seat: "Pass" }
        ],
        channels: ["SMS Blast", "Push Notification", "IRCTC WhatsApp Alert"]
      });
      setIsBroadcasting(false);
    }, 700);
  };

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #334155',
      padding: '24px',
      maxWidth: '900px',
      margin: '20px auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#38bdf8' }}>
            📄 Planner Mega Block Circular AI Scanner
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
            Feature 2: Upload or paste railway circulars to auto-extract structured blocks and notify affected passengers.
          </p>
        </div>
        <span style={{
          backgroundColor: '#0369a1',
          color: '#e0f2fe',
          fontSize: '12px',
          fontWeight: '600',
          padding: '4px 12px',
          borderRadius: '9999px'
        }}>
          Planner Portal
        </span>
      </div>

      {/* TEXTAREA INPUT */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
          Raw Railway Circular / Press Note Text:
        </label>
        <textarea
          rows={7}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste Indian Railways mega block press release or notice here..."
          style={{
            width: '100%',
            backgroundColor: '#020617',
            color: '#e2e8f0',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '13px',
            fontFamily: 'monospace',
            lineHeight: '1.4',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* SCAN ACTION BUTTON */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={handleScanCircular}
          disabled={isScanning}
          style={{
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isScanning ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isScanning ? '🔍 AI Scanning Document...' : '✨ Run AI Circular Extraction'}
        </button>

        <button
          onClick={() => setRawText(sampleCircularText)}
          style={{
            backgroundColor: 'transparent',
            color: '#94a3b8',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Reset Sample
        </button>
      </div>

      {/* STRUCTURED EXTRACTION PREVIEW */}
      {extractedData && (
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid #38bdf8',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#38bdf8' }}>
              ✓ AI Structured Extraction Result (Confidence: {(extractedData.confidence_score * 100).toFixed(0)}%)
            </h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {extractedData.block_id}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Zone & Division</span>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>
                {extractedData.railway_zone}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{extractedData.division}</div>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Affected Section</span>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#38bdf8' }}>
                {extractedData.section} ({extractedData.from_station} - {extractedData.to_station})
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{extractedData.affected_lines.join(', ')}</div>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Block Window</span>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#fbbf24' }}>
                10:30 AM to 03:30 PM
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Duration: {extractedData.duration_hours} hrs</div>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Speed Restriction</span>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#f87171' }}>
                Max {extractedData.speed_restrictions_kmph} km/h
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Regulated Zone</div>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <strong style={{ fontSize: '13px', color: '#cbd5e1' }}>Impacted / Regulated Trains: </strong>
            <span style={{ fontSize: '13px', color: '#38bdf8' }}>
              {extractedData.diverted_trains.map(t => `#${t}`).join(', ')}
            </span>
          </div>

          {/* BROADCAST TO PASSENGERS ACTION */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #334155' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              Ready to blast personalized advisory to affected PNR bookings.
            </span>
            <button
              onClick={handleBroadcastAlerts}
              disabled={isBroadcasting}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: isBroadcasting ? 'not-allowed' : 'pointer'
              }}
            >
              {isBroadcasting ? '🚀 Broadcasting...' : '📢 Blast Personalized Alerts'}
            </button>
          </div>
        </div>
      )}

      {/* BROADCAST CONFIRMATION RECEIPT */}
      {broadcastResult && (
        <div style={{
          backgroundColor: '#064e3b',
          border: '1px solid #10b981',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>✅</span>
            <strong style={{ color: '#ecfdf5', fontSize: '15px' }}>
              Personalized Alerts Successfully Dispatched!
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#a7f3d0' }}>
            Dispatched to <strong>{broadcastResult.affected_passengers_count} passengers</strong> traveling across 
            the <strong>{extractedData?.section}</strong> corridor during the maintenance window.
          </p>
          <div style={{ fontSize: '12px', color: '#6ee7b7' }}>
            Channels: {broadcastResult.channels.join(' | ')}
          </div>
        </div>
      )}
    </div>
  );
}
