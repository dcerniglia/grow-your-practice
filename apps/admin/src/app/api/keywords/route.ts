import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'keyword';
  const dir = (searchParams.get('dir') || 'asc') as 'asc' | 'desc';
  const intentOnly = searchParams.get('intentOnly') === 'true';
  const category = searchParams.get('category');

  const where: Record<string, unknown> = {};
  if (intentOnly) where.intentMatch = true;
  if (category) where.category = category;

  const keywords = await prisma.keyword.findMany({
    where,
    orderBy: { [sort]: dir },
  });

  return NextResponse.json(keywords);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { keyword, monthlyVolume, cpc, intentMatch, notes, category } = body;

  if (!keyword) {
    return NextResponse.json({ error: 'keyword is required' }, { status: 400 });
  }

  const created = await prisma.keyword.create({
    data: {
      keyword,
      monthlyVolume: monthlyVolume ?? null,
      cpc: cpc ?? null,
      intentMatch: intentMatch ?? false,
      notes: notes ?? null,
      category: category ?? null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
