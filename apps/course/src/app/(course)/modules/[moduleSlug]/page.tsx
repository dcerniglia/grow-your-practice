export default function ModuleOverviewPage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">Module Overview</h1>
      <p className="mt-2 text-text-muted">Module page placeholder.</p>
    </div>
  );
}
