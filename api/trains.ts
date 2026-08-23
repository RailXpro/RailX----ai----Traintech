import type { VercelRequest, VercelResponse } from '@vercel/node';

const TRAINS = [
  {
    trainNumber: '22221',
    trainName: 'CSMT Hazrat Nizamuddin Rajdhani Express',
    type: 'Rajdhani',
    priorityScore: 10,
    currentSectionId: 'SEC-CR-01',
    direction: 'Up',
    status: 'on_time',
    delayMinutes: 0,
    origin: 'CSMT Mumbai',
    destination: 'Hazrat Nizamuddin (NZM)',
    scheduledDep: '16:00',
    scheduledArr: '09:55'
  },
  {
    trainNumber: '20103',
    trainName: 'CSMT Gorakhpur Vande Bharat Express',
    type: 'Vande Bharat',
    priorityScore: 10,
    currentSectionId: 'SEC-CR-03',
    direction: 'Up',
    status: 'delayed',
    delayMinutes: 12,
    origin: 'CSMT Mumbai',
    destination: 'Gorakhpur Junction (GKP)',
    scheduledDep: '06:05',
    scheduledArr: '20:30'
  },
  {
    trainNumber: '12137',
    trainName: 'Punjab Mail',
    type: 'Superfast Express',
    priorityScore: 7,
    currentSectionId: 'SEC-CR-04',
    direction: 'Up',
    status: 'on_time',
    delayMinutes: 0,
    origin: 'CSMT Mumbai',
    destination: 'Firozpur Cantt (FZR)',
    scheduledDep: '19:35',
    scheduledArr: '05:10'
  },
  {
    trainNumber: '97109',
    trainName: 'Kalyan Fast Suburban Local',
    type: 'Suburban Local',
    priorityScore: 5,
    currentSectionId: 'SEC-CR-02',
    direction: 'Down',
    status: 'delayed',
    delayMinutes: 22,
    origin: 'CSMT Mumbai',
    destination: 'Kalyan Junction',
    scheduledDep: '11:15',
    scheduledArr: '12:24'
  },
  {
    trainNumber: 'BND-CONTAINER-09',
    trainName: 'JNPT Port Heavy Freight / Container Rake',
    type: 'Freight Rake',
    priorityScore: 3,
    currentSectionId: 'SEC-CR-05',
    direction: 'Down',
    status: 'regulated',
    delayMinutes: 45,
    origin: 'JNPT Panvel',
    destination: 'Tughlakabad Container Depot',
    scheduledDep: '10:00',
    scheduledArr: '04:00'
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const search = req.query.q as string;
  let result = TRAINS;
  if (search) {
    result = result.filter(
      t =>
        t.trainNumber.includes(search) ||
        t.trainName.toLowerCase().includes(search.toLowerCase()) ||
        t.type.toLowerCase().includes(search.toLowerCase())
    );
  }

  return res.status(200).json({
    success: true,
    count: result.length,
    trains: result
  });
}
