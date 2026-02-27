'use client';

import { useState } from 'react';
import type { WeeklyReportData } from '@gyp/shared';

type Props = {
  data: WeeklyReportData | null;
  loading?: boolean;
};

function generateReport(data: WeeklyReportData): string {
  return `Week of: ${data.weekOf}

TRAFFIC
- Total visitors: ${data.traffic.totalVisitors.toLocaleString()}
- From Meta ads: ${data.traffic.fromMetaAds.toLocaleString()}  (spend: $${data.traffic.adSpend.toLocaleString()})
- Organic/direct: ${data.traffic.organicDirect.toLocaleString()}

CONVERSIONS
- New email signups: ${data.conversions.newEmailSignups.toLocaleString()}
- Signup rate: ${data.conversions.signupRate.toFixed(1)}%
- Best variant: ${data.conversions.bestVariant}
- Cost per signup: $${data.conversions.costPerSignup.toFixed(2)}

EMAIL
- Welcome sequence open rate: N/A%
- Newsletter open rate: N/A%
- Unsubscribes: ${data.email.unsubscribes}

SALES (when applicable)
- Course sales: ${data.sales.courseSales}
- Revenue: $${data.sales.revenue.toLocaleString()}
- CPA: $${data.sales.cpa.toFixed(2)}

NOTES / ACTIONS
- What worked: ___
- What to test next week: ___
- Blockers: ___`;
}

export function WeeklyReportCard({ data, loading }: Props) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-muted">
        Connect at least one data source to generate the weekly report.
      </div>
    );
  }

  const reportText = generateReport(data);

  async function handleCopy() {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-text-muted">
          Auto-generated from live data. Edit the notes section after copying.
        </p>
        <button
          onClick={handleCopy}
          className="rounded-button bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap rounded-card border border-border bg-background p-4 text-xs leading-relaxed text-text">
        {reportText}
      </pre>
    </div>
  );
}
