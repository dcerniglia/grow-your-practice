import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const modules = await prisma.module.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { lessons: true } } },
  });

  return NextResponse.json(modules);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, slug, description, iconEmoji, isGated } = body;

  if (!title || !slug || !description) {
    return NextResponse.json(
      { error: 'title, slug, and description are required' },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.module.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const module = await prisma.module.create({
    data: {
      title,
      slug,
      description,
      iconEmoji: iconEmoji || null,
      isGated: isGated ?? false,
      order: nextOrder,
    },
  });

  return NextResponse.json(module, { status: 201 });
}
