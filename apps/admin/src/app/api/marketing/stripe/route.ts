import { NextRequest, NextResponse } from 'next/server';
import { getStripeMetrics, getRevenueSeries } from '../../../../lib/services/stripe';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json(
      { error: 'Missing required query params: from, to' },
      { status: 400 },
    );
  }

  const [metrics, series] = await Promise.all([
    getStripeMetrics(from, to),
    getRevenueSeries(from, to),
  ]);

  return NextResponse.json({ metrics, series });
}
