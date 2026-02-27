import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, fileName, fileUrl, fileType, lessonId } = body;

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(fileName !== undefined && { fileName }),
      ...(fileUrl !== undefined && { fileUrl }),
      ...(fileType !== undefined && { fileType }),
      ...(lessonId !== undefined && { lessonId }),
    },
  });

  return NextResponse.json(resource);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await prisma.resourceDownload.deleteMany({ where: { resourceId: id } });
  await prisma.resource.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
