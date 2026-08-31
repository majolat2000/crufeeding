import { prisma } from '../../config/db.pg.js';

/**
 * ActivityLog — chronological audit for every admin action.
 * Web portal reads this for Activity Logs page; mobile never writes here.
 */
export async function logActivity(params: { actorId: string; actorEmail: string; action: string; target?: string; metadata?: any; ip?: string }) {
  try {
    await prisma.activityLog.create({ data: params });
  } catch (e) {
    console.warn('[activityLog] failed', e);
    // fallback: console only during PG migration
  }
}

export async function listActivityLogs(limit = 50) {
  try {
    return await prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  } catch {
    return [];
  }
}
