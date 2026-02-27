import { NextRequest, NextResponse } from 'next/server';
import { getStripeMetrics, getRevenueSeries } from '../../../../lib/services/stripe';
import { getTrafficMetrics, getVariantData } from '../../../../lib/services/plausible';
import { getEmailMetrics } from '../../../../lib/services/convertkit';
import { getAdMetrics } from '../../../../lib/services/meta-ads';
import { getDatabaseMetrics } from '../../../../lib/services/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'from and to params required' }, { status: 400 });
  }

  const [stripe, revenueSeries, traffic, variants, email, ads, database] = await Promise.all([
    getStripeMetrics(from, to),
    getRevenueSeries(from, to),
    getTrafficMetrics(from, to),
    getVariantData(from, to),
    getEmailMetrics(from, to),
    getAdMetrics(from, to),
    getDatabaseMetrics(),
  ]);

  return NextResponse.json({
    stripe,
    revenueSeries,
    traffic,
    variants,
    email,
    ads,
    database,
  });
}
