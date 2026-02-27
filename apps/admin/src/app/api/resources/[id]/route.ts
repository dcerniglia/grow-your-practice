import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { supabase, RESOURCE_BUCKET } from '../../../../lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, lessonId } = body;

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
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

  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Extract storage path from public URL
  const urlParts = resource.fileUrl.split(`/${RESOURCE_BUCKET}/`);
  if (urlParts.length === 2 && urlParts[1]) {
    const storagePath = urlParts[1];
    await supabase.storage.from(RESOURCE_BUCKET).remove([storagePath]);
  }

  await prisma.resourceDownload.deleteMany({ where: { resourceId: id } });
  await prisma.resource.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
