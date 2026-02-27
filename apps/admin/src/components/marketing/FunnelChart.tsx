'use client';

import type { FunnelStep } from '@gyp/shared';

type Props = {
  steps: FunnelStep[];
  loading?: boolean;
};

export function FunnelChart({ steps, loading }: Props) {
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-muted">
        No funnel data available
      </div>
    );
  }

  const maxValue = Math.max(...steps.map((s) => s.value));

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const widthPercent = maxValue > 0 ? (step.value / maxValue) * 100 : 0;

        return (
          <div key={step.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-text">{step.label}</span>
              <span className="text-text-muted">
                {step.value.toLocaleString()}
                {step.conversionFromPrevious !== undefined && i > 0 && (
                  <span className="ml-2 text-xs text-primary">
                    ({step.conversionFromPrevious.toFixed(1)}% from prev)
                  </span>
                )}
              </span>
            </div>
            <div className="h-8 w-full overflow-hidden rounded bg-background">
              <div
                className="h-full rounded bg-primary transition-all"
                style={{
                  width: `${widthPercent}%`,
                  opacity: 1 - i * 0.15,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
