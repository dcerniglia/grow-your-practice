import { ChartContainer } from '../../../components/marketing';

export default function TrafficPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl text-primary">Traffic</h1>
      <p className="text-sm text-text-muted">Plausible analytics deep-dive — visitors, sources, and variant performance.</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer title="Traffic by Source" unavailable />
        <ChartContainer title="Variant Comparison (A/B/C)" unavailable />
      </div>

      <ChartContainer title="Visitors Over Time" unavailable />
    </div>
  );
}
