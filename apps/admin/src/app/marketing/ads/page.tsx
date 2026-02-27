import { ChartContainer } from '../../../components/marketing';

export default function AdsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl text-primary">Ads</h1>
      <p className="text-sm text-text-muted">Meta Ads campaign performance, spend, and ROI tracking.</p>

      <ChartContainer title="Campaign Performance Table" unavailable />
      <ChartContainer title="Spend vs. Conversions" unavailable />
    </div>
  );
}
