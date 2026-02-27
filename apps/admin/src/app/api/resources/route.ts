import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const moduleId = request.nextUrl.searchParams.get('moduleId');

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: 'desc' },
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
    ...(moduleId && {
      where: { lesson: { moduleId } },
    }),
  });

  return NextResponse.json(resources);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, fileName, fileUrl, fileType, lessonId } = body;

  if (!title || !fileName || !fileUrl || !fileType || !lessonId) {
    return NextResponse.json(
      { error: 'title, fileName, fileUrl, fileType, and lessonId are required' },
      { status: 400 },
    );
  }

  const resource = await prisma.resource.create({
    data: {
      title,
      description: description || null,
      fileName,
      fileUrl,
      fileType,
      lessonId,
    },
  });

  return NextResponse.json(resource, { status: 201 });
}
