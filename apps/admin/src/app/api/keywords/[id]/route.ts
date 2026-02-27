import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { keyword, monthlyVolume, cpc, intentMatch, notes, category } = body;

  const updated = await prisma.keyword.update({
    where: { id },
    data: {
      ...(keyword !== undefined && { keyword }),
      ...(monthlyVolume !== undefined && { monthlyVolume }),
      ...(cpc !== undefined && { cpc }),
      ...(intentMatch !== undefined && { intentMatch }),
      ...(notes !== undefined && { notes }),
      ...(category !== undefined && { category }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.keyword.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
