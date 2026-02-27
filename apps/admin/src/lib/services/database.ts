import type { ServiceResult } from '@gyp/shared';
import { getCached, setCache, TTL } from '../cache';

type DatabaseMetrics = {
  totalUsers: number;
  purchasedUsers: number;
  averageProgress: number;
  completionRate: number;
};

export async function getDatabaseMetrics(): Promise<ServiceResult<DatabaseMetrics>> {
  const cacheKey = 'database:metrics';
  const cached = getCached<DatabaseMetrics>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const { PrismaClient } = await import('@gyp/database');
    const prisma = new PrismaClient();

    const [totalUsers, purchasedUsers, progressRecords] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { purchasedAt: { not: null } } }),
      prisma.lessonProgress.findMany({
        where: { completed: true },
        select: { userId: true },
      }),
    ]);

    const totalLessons = await prisma.lesson.count();
    const userCompletions = new Map<string, number>();
    for (const record of progressRecords) {
      userCompletions.set(record.userId, (userCompletions.get(record.userId) ?? 0) + 1);
    }

    let averageProgress = 0;
    let completionRate = 0;
    if (purchasedUsers > 0 && totalLessons > 0) {
      let totalProgress = 0;
      let completedUsers = 0;
      for (const [, count] of userCompletions) {
        totalProgress += count / totalLessons;
        if (count >= totalLessons) completedUsers++;
      }
      averageProgress = (totalProgress / purchasedUsers) * 100;
      completionRate = (completedUsers / purchasedUsers) * 100;
    }

    const data: DatabaseMetrics = {
      totalUsers,
      purchasedUsers,
      averageProgress,
      completionRate,
    };

    setCache(cacheKey, data, TTL.DATABASE);
    return { status: 'ok', data };
  } catch (error) {
    return {
      status: 'unavailable',
      error: error instanceof Error ? error.message : 'Database unavailable',
    };
  }
}
