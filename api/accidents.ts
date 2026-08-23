import type { VercelRequest, VercelResponse } from '@vercel/node';

let accidents = [
  {
    id: 'INC-2026-8801',
    trainNumber: '12137',
    trainName: 'Punjab Mail',
    sectionId: 'SEC-CR-04',
    sectionName: 'Kurla - Thane Express Section',
    natureOfIncident: 'OHE Pantograph Entanglement',
    severity: 'Major',
    status: 'in_progress',
    reportedAt: '14:22',
    estimatedClearanceTime: '16:45',
    artDispatched: true,
    artTrainNumber: 'SP-ARME-KURLA-01',
    description: 'Overhead 25kV catenary wire entanglement detected at Km 24/8. Power block clamped. ART dispatched with breakdown crane.',
    emergencyActionsTaken: [
      'Immediate 25kV OHE Power isolation by Traction Power Controller (TPC)',
      'Signal lockdown: Up & Down signals clamped to Danger (Red)',
      'Accident Relief Medical Equipment (SP-ARME) dispatched from Kurla Depot',
      'Single Line Bi-directional Working authorized on Down Fast line'
    ]
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { trainNumber, sectionId, natureOfIncident, severity, description } = req.body || {};
    const newIncident = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      trainNumber: trainNumber || 'Unknown',
      trainName: `Train #${trainNumber}`,
      sectionId: sectionId || 'SEC-CR-01',
      sectionName: 'Corridor Section',
      natureOfIncident: natureOfIncident || 'Track Obstruction',
      severity: severity || 'Major',
      status: 'in_progress',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedClearanceTime: '2 hours',
      artDispatched: true,
      artTrainNumber: 'SP-ARME-EMERGENCY-01',
      description: description || 'Emergency SOS incident registered',
      emergencyActionsTaken: [
        'Automatic Red Signal Clamp activated',
        'Accident Relief Train (ART) dispatched',
        'Dynamic alternate corridor diversion activated'
      ]
    };
    accidents.unshift(newIncident);
    return res.status(201).json({
      success: true,
      message: 'Emergency incident registered and response dispatched',
      incident: newIncident
    });
  }

  return res.status(200).json({
    success: true,
    count: accidents.length,
    incidents: accidents
  });
}
