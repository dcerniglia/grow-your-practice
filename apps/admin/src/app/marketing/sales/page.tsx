import { ChartContainer } from '../../../components/marketing';

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl text-primary">Sales</h1>
      <p className="text-sm text-text-muted">Stripe revenue, purchases, refunds, and payment analytics.</p>

      <ChartContainer title="Revenue Over Time" unavailable />
      <ChartContainer title="Purchase Details" unavailable />
    </div>
  );
}
