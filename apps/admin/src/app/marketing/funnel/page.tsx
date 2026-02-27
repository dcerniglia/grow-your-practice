import { ChartContainer } from '../../../components/marketing';

export default function FunnelPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl text-primary">Funnel</h1>
      <p className="text-sm text-text-muted">Full-funnel view from visitors to purchases with conversion rates at each step.</p>

      <ChartContainer title="Full Funnel (Visitors → Signups → Purchases)" unavailable />
      <ChartContainer title="Weekly Report" unavailable />
    </div>
  );
}
