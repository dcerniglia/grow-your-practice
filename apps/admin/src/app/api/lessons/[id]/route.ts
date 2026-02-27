import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { resources: true, module: { select: { title: true, slug: true } } },
  });

  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { title, slug, description, content, videoId } = body;

  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(videoId !== undefined && { videoId }),
    },
  });

  return NextResponse.json(lesson);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await prisma.resourceDownload.deleteMany({
    where: { resource: { lessonId: id } },
  });
  await prisma.resource.deleteMany({ where: { lessonId: id } });
  await prisma.lessonProgress.deleteMany({ where: { lessonId: id } });
  await prisma.lesson.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
