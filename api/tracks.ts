import type { VercelRequest, VercelResponse } from '@vercel/node';

const TRACK_SECTIONS = [
  {
    id: 'SEC-CR-01',
    name: 'CSMT - Byculla Corridor',
    division: 'Mumbai CR',
    lineType: 'Up/Down Fast & Slow',
    lengthKm: 4.8,
    speedLimitKmph: 105,
    oheVoltageKv: 25,
    status: 'clear',
    activeTrainsCount: 4,
    coordinates: { start: '18.9400, 72.8353', end: '18.9750, 72.8330' }
  },
  {
    id: 'SEC-CR-02',
    name: 'Byculla - Dadar Fast Section',
    division: 'Mumbai CR',
    lineType: 'Up/Down Fast',
    lengthKm: 4.2,
    speedLimitKmph: 110,
    oheVoltageKv: 25,
    status: 'mega_block',
    blockReason: 'Track Tamping & OHE Overhaul (Sunday Possession)',
    activeTrainsCount: 0,
    coordinates: { start: '18.9750, 72.8330', end: '19.0178, 72.8478' }
  },
  {
    id: 'SEC-CR-03',
    name: 'Dadar - Kurla Junction',
    division: 'Mumbai CR',
    lineType: 'Quad Line (Fast + Slow + Goods)',
    lengthKm: 5.6,
    speedLimitKmph: 95,
    oheVoltageKv: 25,
    status: 'clear',
    activeTrainsCount: 6,
    coordinates: { start: '19.0178, 72.8478', end: '19.0657, 72.8797' }
  },
  {
    id: 'SEC-CR-04',
    name: 'Kurla - Thane Express Section',
    division: 'Mumbai CR',
    lineType: '5th & 6th Long Distance Lines',
    lengthKm: 18.2,
    speedLimitKmph: 120,
    oheVoltageKv: 25,
    status: 'speed_restriction',
    speedRestrictionKmph: 45,
    blockReason: 'Cordoned: Kavach EI Interlocking Upgrade',
    activeTrainsCount: 5,
    coordinates: { start: '19.0657, 72.8797', end: '19.1860, 72.9759' }
  },
  {
    id: 'SEC-CR-05',
    name: 'Thane - Kalyan Junction Core',
    division: 'Mumbai CR',
    lineType: '6-Line Trunk Corridor',
    lengthKm: 19.8,
    speedLimitKmph: 130,
    oheVoltageKv: 25,
    status: 'clear',
    activeTrainsCount: 9,
    coordinates: { start: '19.1860, 72.9759', end: '19.2437, 73.1355' }
  },
  {
    id: 'SEC-WR-01',
    name: 'Churchgate - Mumbai Central',
    division: 'Mumbai WR',
    lineType: 'Up/Down Local',
    lengthKm: 4.5,
    speedLimitKmph: 100,
    oheVoltageKv: 25,
    status: 'clear',
    activeTrainsCount: 3,
    coordinates: { start: '18.9322, 72.8264', end: '18.9696, 72.8194' }
  },
  {
    id: 'SEC-WR-02',
    name: 'Mumbai Central - Bandra Sub-Harbour',
    division: 'Mumbai WR',
    lineType: 'Quad Line Fast/Slow',
    lengthKm: 10.1,
    speedLimitKmph: 110,
    oheVoltageKv: 25,
    status: 'clear',
    activeTrainsCount: 5,
    coordinates: { start: '18.9696, 72.8194', end: '19.0544, 72.8402' }
  },
  {
    id: 'SEC-NR-01',
    name: 'New Delhi - Ghaziabad Mainline',
    division: 'Delhi NR',
    lineType: 'Electrified Triple Trunk',
    lengthKm: 24.5,
    speedLimitKmph: 130,
    oheVoltageKv: 25,
    status: 'clear',
    activeTrainsCount: 8,
    coordinates: { start: '28.6429, 77.2195', end: '28.6692, 77.4538' }
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const division = req.query.division as string;
  let result = TRACK_SECTIONS;
  if (division && division !== 'All') {
    result = result.filter(s => s.division.toLowerCase().includes(division.toLowerCase()));
  }

  return res.status(200).json({
    success: true,
    count: result.length,
    sections: result
  });
}
