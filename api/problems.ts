import type { VercelRequest, VercelResponse } from '@vercel/node';

// ---------------------------------------------------------------------------
// In-memory store (resets on cold-start, good enough for demo / early-stage)
// ---------------------------------------------------------------------------

interface ProblemReport {
  id: string;
  referenceId: string;
  category: string;
  severity: string;
  status: string;
  title: string;
  description: string;
  trainNumber?: string;
  coachNumber?: string;
  stationOrKm?: string;
  contactPhone?: string;
  contactEmail?: string;
  latitude?: number;
  longitude?: number;
  photoBase64?: string;
  submittedAt: string;
  updatedAt: string;
  aiPriorityScore: number;
  assignedTo?: string;
  resolution?: string;
}

const problems: ProblemReport[] = [];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateReferenceId(): string {
  const prefix = 'RM';
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${year}${rand}`;
}

/** Rough AI priority score 0-100 based on category + severity */
function computeAIPriority(category: string, severity: string): number {
  const severityWeight: Record<string, number> = {
    critical: 90,
    high: 70,
    medium: 45,
    low: 20,
  };
  const categoryBonus: Record<string, number> = {
    safety: 10,
    accident: 10,
    derailment: 10,
    medical: 8,
    fire: 10,
    electrical: 6,
    security: 7,
    cleanliness: 2,
    amenity: 2,
    food: 1,
    ticketing: 3,
    other: 0,
  };
  const base = severityWeight[severity.toLowerCase()] ?? 30;
  const bonus = categoryBonus[category.toLowerCase()] ?? 0;
  return Math.min(100, base + bonus + Math.floor(Math.random() * 5));
}

function cors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // GET /api/problems – return all problems (newest first)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: problems.length,
      problems: [...problems].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ),
    });
  }

  // POST /api/problems – submit a new problem report
  if (req.method === 'POST') {
    const body = req.body as Partial<ProblemReport>;

    if (!body.category || !body.severity || !body.description) {
      return res.status(400).json({
        success: false,
        error: 'category, severity and description are required',
      });
    }

    const now = new Date().toISOString();
    const report: ProblemReport = {
      id: `pr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceId: body.referenceId ?? generateReferenceId(),
      category: body.category,
      severity: body.severity,
      status: 'submitted',
      title: body.title ?? `${body.category} issue reported`,
      description: body.description,
      trainNumber: body.trainNumber,
      coachNumber: body.coachNumber,
      stationOrKm: body.stationOrKm,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      latitude: body.latitude,
      longitude: body.longitude,
      submittedAt: now,
      updatedAt: now,
      aiPriorityScore: computeAIPriority(body.category, body.severity),
    };

    problems.unshift(report);

    return res.status(201).json({
      success: true,
      message: 'Problem report submitted successfully',
      referenceId: report.referenceId,
      aiPriorityScore: report.aiPriorityScore,
      report,
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
