import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { csv } = body;

  if (!csv || typeof csv !== 'string') {
    return NextResponse.json({ error: 'csv string is required' }, { status: 400 });
  }

  const lines = csv
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0);

  const results = { created: 0, skipped: 0, errors: [] as string[] };

  for (const line of lines) {
    // Support tab or comma separated
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');
    const keyword = parts[0]?.trim();
    if (!keyword) continue;

    // Skip header rows
    if (keyword.toLowerCase() === 'keyword') continue;

    const monthlyVolume = parts[1] ? parseInt(parts[1].trim().replace(/,/g, ''), 10) : null;
    const cpc = parts[2] ? parseFloat(parts[2].trim().replace(/[$,]/g, '')) : null;

    try {
      await prisma.keyword.upsert({
        where: { keyword },
        create: {
          keyword,
          monthlyVolume: monthlyVolume && !isNaN(monthlyVolume) ? monthlyVolume : null,
          cpc: cpc && !isNaN(cpc) ? cpc : null,
        },
        update: {
          monthlyVolume: monthlyVolume && !isNaN(monthlyVolume) ? monthlyVolume : undefined,
          cpc: cpc && !isNaN(cpc) ? cpc : undefined,
        },
      });
      results.created++;
    } catch (e) {
      results.skipped++;
      results.errors.push(`Failed: ${keyword}`);
    }
  }

  return NextResponse.json(results, { status: 201 });
}
