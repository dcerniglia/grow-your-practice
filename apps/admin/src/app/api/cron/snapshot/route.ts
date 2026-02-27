// Daily snapshot cron endpoint
// Schedule: hit daily at 1:00 AM UTC with a cron service (Railway cron or cron-job.org)
// Auth: Authorization: Bearer $CRON_SECRET
// Usage:
//   GET /api/cron/snapshot                           — capture yesterday's snapshot
//   GET /api/cron/snapshot?backfill=true&from=2026-02-01&to=2026-02-26 — backfill a range

import { NextRequest, NextResponse } from 'next/server';
import { captureDaily } from '../../../../lib/services/snapshot';

function yesterday(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0]!;
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

function dateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]!);
  }
  return dates;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const backfill = searchParams.get('backfill') === 'true';

  try {
    if (backfill) {
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      if (!from || !to) {
        return NextResponse.json(
          { error: 'Backfill requires from and to params (YYYY-MM-DD)' },
          { status: 400 },
        );
      }

      const dates = dateRange(from, to);
      const results = [];
      for (const date of dates) {
        const result = await captureDaily(date);
        results.push(result);
      }

      return NextResponse.json({ status: 'ok', count: results.length, results });
    }

    const date = yesterday();
    const result = await captureDaily(date);
    return NextResponse.json({ status: 'ok', ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
