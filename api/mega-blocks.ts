import type { VercelRequest, VercelResponse } from '@vercel/node';

let megaBlocks = [
  {
    id: 'BLK-2026-08-30-01',
    division: 'Mumbai CR',
    sectionId: 'SEC-CR-02',
    sectionName: 'Byculla - Dadar Fast Section',
    linesAffected: 'Up & Down Fast Lines',
    startTime: '11:05',
    endTime: '16:05',
    date: '2026-08-30 (Sunday)',
    reason: 'Track Relaying & Tamping',
    status: 'active',
    assignedMachinery: ['CSM-09 Tamper', 'BCM-350 Ballast Cleaner'],
    gangCount: 36,
    publicAdvisory: 'Fast line trains diverted to Slow line between Byculla and Dadar. 15 mins delay.',
    alternativeBusServices: 'Special BEST AC feeder shuttle between Byculla and Dadar station forecourt.'
  },
  {
    id: 'BLK-2026-08-30-02',
    division: 'Mumbai CR',
    sectionId: 'SEC-CR-04',
    sectionName: 'Kurla - Thane Express Section',
    linesAffected: '5th & 6th Lines',
    startTime: '00:30',
    endTime: '05:30',
    date: '2026-08-30 (Sunday Night)',
    reason: 'OHE Wire Inspection & Overhaul',
    status: 'scheduled',
    assignedMachinery: ['Tower Wagon TW-04', 'Wiring Train'],
    gangCount: 22,
    publicAdvisory: 'Mail/Express traffic re-routed over fast corridor with cautionary speed (45 kmph).',
    alternativeBusServices: 'None required (Night valley execution).'
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const newBlock = {
      id: `BLK-${Date.now()}`,
      status: 'scheduled',
      ...req.body
    };
    megaBlocks.unshift(newBlock);
    return res.status(201).json({
      success: true,
      message: 'Mega block scheduled successfully',
      block: newBlock
    });
  }

  return res.status(200).json({
    success: true,
    count: megaBlocks.length,
    megaBlocks
  });
}
