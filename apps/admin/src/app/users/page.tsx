'use client';

import { useCallback, useEffect, useState } from 'react';

type UserSummary = {
  id: string;
  email: string;
  name: string | null;
  purchasedAt: string | null;
  onboardingComplete: boolean;
  createdAt: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
};

type UserDetail = {
  id: string;
  email: string;
  name: string | null;
  purchasedAt: string | null;
  onboardingComplete: boolean;
  createdAt: string;
  techComfortLevel: string | null;
  progress: {
    id: string;
    completed: boolean;
    videoWatchedPercent: number;
    completedAt: string | null;
    lesson: {
      id: string;
      title: string;
      order: number;
      module: { id: string; title: string; order: number };
    };
  }[];
  moduleProgress: {
    id: string;
    completed: boolean;
    completedAt: string | null;
    module: { id: string; title: string; order: number };
  }[];
};

type UsersResponse = {
  users: UserSummary[];
  total: number;
  purchasedCount: number;
  totalLessons: number;
  page: number;
  totalPages: number;
};

export default function UsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set('search', search);
    const res = await fetch(`/api/users?${params}`);
    setData(await res.json());
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function viewUser(id: string) {
    setLoadingDetail(true);
    const res = await fetch(`/api/users/${id}`);
    setSelectedUser(await res.json());
    setLoadingDetail(false);
  }

  // Group progress by module for detail view
  const progressByModule = selectedUser
    ? selectedUser.progress.reduce(
        (acc, p) => {
          const key = p.lesson.module.id;
          if (!acc[key]) {
            acc[key] = {
              module: p.lesson.module,
              lessons: [],
            };
          }
          acc[key].lessons.push(p);
          return acc;
        },
        {} as Record<string, { module: { id: string; title: string; order: number }; lessons: typeof selectedUser.progress }>,
      )
    : {};

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-primary">Users</h1>
        <input
          className="w-64 rounded-input border border-border bg-background px-3 py-2 text-sm"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Summary stats */}
      {data && (
        <div className="mb-6 grid grid-cols-4 gap-4">
          <StatCard label="Total Users" value={data.total} />
          <StatCard label="Purchased" value={data.purchasedCount} />
          <StatCard
            label="Conversion"
            value={
              data.total > 0
                ? `${Math.round((data.purchasedCount / data.total) * 100)}%`
                : '0%'
            }
          />
          <StatCard label="Total Lessons" value={data.totalLessons} />
        </div>
      )}

      {/* User detail panel */}
      {selectedUser && (
        <div className="mb-6 rounded-card border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg">
                {selectedUser.name || selectedUser.email}
              </h2>
              <p className="text-sm text-text-muted">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm text-text-muted hover:text-text"
            >
              Close
            </button>
          </div>

          <div className="mb-4 flex gap-4 text-sm">
            <span>
              Purchased:{' '}
              {selectedUser.purchasedAt
                ? new Date(selectedUser.purchasedAt).toLocaleDateString()
                : 'No'}
            </span>
            <span>
              Onboarding: {selectedUser.onboardingComplete ? 'Complete' : 'Incomplete'}
            </span>
            {selectedUser.techComfortLevel && (
              <span>Tech comfort: {selectedUser.techComfortLevel}</span>
            )}
          </div>

          {/* Module progress */}
          <h3 className="mb-2 text-sm font-medium">Module Progress</h3>
          {selectedUser.moduleProgress.length === 0 ? (
            <p className="text-sm text-text-muted">No progress yet.</p>
          ) : (
            <div className="mb-4 space-y-1">
              {selectedUser.moduleProgress
                .sort((a, b) => a.module.order - b.module.order)
                .map((mp) => (
                  <div
                    key={mp.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${mp.completed ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span>
                      M{mp.module.order}: {mp.module.title}
                    </span>
                    {mp.completedAt && (
                      <span className="text-xs text-text-muted">
                        {new Date(mp.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Lesson progress by module */}
          <h3 className="mb-2 text-sm font-medium">Lesson Progress</h3>
          {Object.values(progressByModule).length === 0 ? (
            <p className="text-sm text-text-muted">No lesson progress yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.values(progressByModule)
                .sort((a, b) => a.module.order - b.module.order)
                .map((group) => (
                  <div key={group.module.id}>
                    <p className="text-xs font-medium text-text-muted">
                      M{group.module.order}: {group.module.title}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {group.lessons
                        .sort((a, b) => a.lesson.order - b.lesson.order)
                        .map((lp) => (
                          <div
                            key={lp.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span
                              className={`inline-block h-2 w-2 rounded-full ${lp.completed ? 'bg-green-500' : 'bg-amber-400'}`}
                            />
                            <span>
                              L{lp.lesson.order}: {lp.lesson.title}
                            </span>
                            {lp.videoWatchedPercent > 0 && (
                              <span className="text-xs text-text-muted">
                                {Math.round(lp.videoWatchedPercent)}% watched
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* User table */}
      {loading ? (
        <p className="text-text-muted">Loading...</p>
      ) : !data || data.users.length === 0 ? (
        <p className="text-text-muted">No users found.</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Purchased</th>
                <th className="pb-2 font-medium">Progress</th>
                <th className="pb-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => viewUser(user.id)}
                  className="cursor-pointer border-b border-border hover:bg-background"
                >
                  <td className="py-2 font-medium">
                    {user.name || '—'}
                  </td>
                  <td className="py-2 text-text-muted">{user.email}</td>
                  <td className="py-2">
                    {user.purchasedAt ? (
                      <span className="text-green-600">
                        {new Date(user.purchasedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${user.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted">
                        {user.progressPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2 text-text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-button border border-border px-3 py-1 text-sm disabled:opacity-50"
              >
                ← Prev
              </button>
              <span className="text-sm text-text-muted">
                Page {data.page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="rounded-button border border-border px-3 py-1 text-sm disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <p className="rounded-card bg-surface p-4 shadow text-text-muted">Loading user details...</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
  );
}
