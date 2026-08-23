export const config = {
  runtime: 'edge'
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  return new Response(
    JSON.stringify({
      status: 'healthy',
      system: 'RailX.ai (TrainTech) Full-Stack Core API',
      deployment: 'Vercel Edge Serverless',
      timestamp: new Date().toISOString(),
      zonesSupported: [
        'Central Railway (CR)',
        'Western Railway (WR)',
        'Northern Railway (NR)',
        'Eastern Railway (ER)',
        'Southern Railway (SR)'
      ],
      version: '2.0.0',
      capabilities: [
        'PuLP Mixed-Integer Linear Optimizer (MILP)',
        'Random Forest ML Downtime & Risk Predictor',
        'AI NLP Mega Block Circular Parser',
        'Multi-Modal Route Rethink Graph Solver',
        'Real-Time Track Availability Radar',
        'Accident SOS & ART Dispatch Interlock'
      ]
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}
