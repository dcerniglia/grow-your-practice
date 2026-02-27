import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const mod = await prisma.module.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: 'asc' } },
      _count: { select: { lessons: true } },
    },
  });

  if (!mod) {
    return NextResponse.json({ error: 'Module not found' }, { status: 404 });
  }

  return NextResponse.json(mod);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { title, slug, description, iconEmoji, isGated } = body;

  const mod = await prisma.module.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(iconEmoji !== undefined && { iconEmoji }),
      ...(isGated !== undefined && { isGated }),
    },
  });

  return NextResponse.json(mod);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Delete in dependency order
  const lessons = await prisma.lesson.findMany({
    where: { moduleId: id },
    select: { id: true },
  });
  const lessonIds = lessons.map((l: { id: string }) => l.id);

  if (lessonIds.length > 0) {
    await prisma.resourceDownload.deleteMany({
      where: { resource: { lessonId: { in: lessonIds } } },
    });
    await prisma.resource.deleteMany({
      where: { lessonId: { in: lessonIds } },
    });
    await prisma.lessonProgress.deleteMany({
      where: { lessonId: { in: lessonIds } },
    });
    await prisma.lesson.deleteMany({
      where: { moduleId: id },
    });
  }

  await prisma.moduleProgress.deleteMany({ where: { moduleId: id } });
  await prisma.module.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
