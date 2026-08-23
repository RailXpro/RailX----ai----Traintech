import type { VercelRequest, VercelResponse } from '@vercel/node';

let alerts = [
  {
    id: 'ALT-9901',
    type: 'EMERGENCY_INCIDENT',
    priority: 'CRITICAL',
    title: '🚨 OHE Wire Snapped at Kurla-Thane Section',
    message: 'Train #12137 Punjab Mail reported OHE entanglement. ART dispatched. Down Fast line traffic diverted.',
    targetAudience: 'ALL_PASSENGERS_AND_CREW',
    timestamp: new Date().toISOString(),
    helplines: ['139 RailMadad', '1512 GRP Emergency', '182 Women Safety']
  },
  {
    id: 'ALT-9902',
    type: 'SUNDAY_MEGA_BLOCK',
    priority: 'HIGH',
    title: '🟡 Sunday Mega Block Possession: Byculla - Dadar',
    message: 'Fast line maintenance in effect 11:05 to 16:05 hrs. All suburban locals diverted over Slow corridor.',
    targetAudience: 'SUBURBAN_COMMUTERS',
    timestamp: new Date().toISOString(),
    helplines: ['139 RailMadad']
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const newAlert = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      ...req.body
    };
    alerts.unshift(newAlert);
    return res.status(201).json({
      success: true,
      message: 'Alert broadcasted to station PA, FCM, and SMS gateways',
      alert: newAlert
    });
  }

  return res.status(200).json({
    success: true,
    count: alerts.length,
    alerts
  });
}
