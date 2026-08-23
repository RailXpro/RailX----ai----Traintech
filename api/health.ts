import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'healthy',
    system: 'RailX.ai (TrainTech) Full-Stack Core API',
    deployment: 'Vercel Serverless',
    timestamp: new Date().toISOString(),
    zonesSupported: ['Central Railway (CR)', 'Western Railway (WR)', 'Northern Railway (NR)', 'Eastern Railway (ER)', 'Southern Railway (SR)'],
    version: '2.0.0',
    capabilities: [
      'PuLP Mixed-Integer Linear Optimizer (MILP)',
      'Random Forest ML Downtime & Risk Predictor',
      'AI NLP Mega Block Circular Parser',
      'Multi-Modal Route Rethink Graph Solver',
      'Real-Time Track Availability Radar',
      'Accident SOS & ART Dispatch Interlock'
    ]
  });
}
