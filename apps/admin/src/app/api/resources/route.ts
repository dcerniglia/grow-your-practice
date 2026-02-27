import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { supabase, RESOURCE_BUCKET } from '../../../lib/supabase';

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
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const lessonId = formData.get('lessonId') as string;

  if (!title || !lessonId || !file) {
    return NextResponse.json(
      { error: 'title, lessonId, and file are required' },
      { status: 400 },
    );
  }

  const fileName = file.name;
  const fileType = fileName.split('.').pop()?.toUpperCase() || 'FILE';
  const storagePath = `${Date.now()}-${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(RESOURCE_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 },
    );
  }

  const { data: urlData } = supabase.storage
    .from(RESOURCE_BUCKET)
    .getPublicUrl(storagePath);

  const resource = await prisma.resource.create({
    data: {
      title,
      description: description || null,
      fileName,
      fileUrl: urlData.publicUrl,
      fileType,
      lessonId,
    },
  });

  return NextResponse.json(resource, { status: 201 });
}
