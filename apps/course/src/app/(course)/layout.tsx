export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder — will be built in Issue #5 */}
      <aside className="hidden w-64 border-r border-border bg-surface lg:block">
        <div className="p-6">
          <h2 className="font-heading text-lg text-primary">Grow Your Practice</h2>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
