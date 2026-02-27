import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const moduleId = request.nextUrl.searchParams.get('moduleId');

  if (!moduleId) {
    return NextResponse.json(
      { error: 'moduleId query param is required' },
      { status: 400 },
    );
  }

  const lessons = await prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { order: 'asc' },
    include: { _count: { select: { resources: true } } },
  });

  return NextResponse.json(lessons);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, slug, description, moduleId, content, videoId } = body;

  if (!title || !slug || !moduleId) {
    return NextResponse.json(
      { error: 'title, slug, and moduleId are required' },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.lesson.aggregate({
    where: { moduleId },
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const lesson = await prisma.lesson.create({
    data: {
      title,
      slug,
      description: description || null,
      moduleId,
      content: content || '',
      videoId: videoId || null,
      order: nextOrder,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}
