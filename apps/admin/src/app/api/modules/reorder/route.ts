import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { order } = body as { order: { id: string; order: number }[] };

  if (!Array.isArray(order)) {
    return NextResponse.json(
      { error: 'order must be an array of { id, order }' },
      { status: 400 },
    );
  }

  await prisma.$transaction(
    order.map((item) =>
      prisma.module.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
