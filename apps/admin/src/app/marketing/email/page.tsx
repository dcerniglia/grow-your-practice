import { ChartContainer } from '../../../components/marketing';

export default function EmailPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl text-primary">Email</h1>
      <p className="text-sm text-text-muted">ConvertKit subscriber metrics, open rates, and sequence performance.</p>

      <ChartContainer title="Email Performance (Open Rate / Click Rate)" unavailable />
      <ChartContainer title="Subscriber Growth" unavailable />
      <ChartContainer title="Tag Breakdown" unavailable />
    </div>
  );
}
