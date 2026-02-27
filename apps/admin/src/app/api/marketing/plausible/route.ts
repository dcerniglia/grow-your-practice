import { NextRequest, NextResponse } from 'next/server';
import {
  getTrafficMetrics,
  getTrafficSources,
  getVariantData,
} from '../../../../lib/services/plausible';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json(
      { error: 'Missing required query params: from, to' },
      { status: 400 }
    );
  }

  const [metrics, sources, variants] = await Promise.all([
    getTrafficMetrics(from, to),
    getTrafficSources(from, to),
    getVariantData(from, to),
  ]);

  return NextResponse.json({ metrics, sources, variants });
}
