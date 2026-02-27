import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      progress: {
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              order: true,
              module: { select: { id: true, title: true, order: true } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
      moduleProgress: {
        include: {
          module: { select: { id: true, title: true, order: true } },
        },
        orderBy: { module: { order: 'asc' } },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
