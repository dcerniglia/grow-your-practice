import { NextRequest, NextResponse } from 'next/server';
import { getAdMetrics, getCampaigns } from '../../../../lib/services/meta-ads';

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

  const [metrics, campaigns] = await Promise.all([
    getAdMetrics(from, to),
    getCampaigns(from, to),
  ]);

  return NextResponse.json({ metrics, campaigns });
}
