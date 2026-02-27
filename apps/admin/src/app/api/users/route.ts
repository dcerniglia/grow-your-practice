import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search') || '';
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
  const pageSize = 50;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [users, total, purchasedCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: { select: { progress: true } },
        progress: { where: { completed: true }, select: { id: true } },
      },
    }),
    prisma.user.count({ where }),
    prisma.user.count({ where: { purchasedAt: { not: null } } }),
  ]);

  const totalLessons = await prisma.lesson.count();

  const usersWithProgress = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    purchasedAt: u.purchasedAt,
    onboardingComplete: u.onboardingComplete,
    createdAt: u.createdAt,
    completedLessons: u.progress.length,
    totalLessons,
    progressPercent: totalLessons > 0 ? Math.round((u.progress.length / totalLessons) * 100) : 0,
  }));

  return NextResponse.json({
    users: usersWithProgress,
    total,
    purchasedCount,
    totalLessons,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
