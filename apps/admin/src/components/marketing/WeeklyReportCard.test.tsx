import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeeklyReportCard } from './WeeklyReportCard';
import type { WeeklyReportData } from '@gyp/shared';

const sampleData: WeeklyReportData = {
  weekOf: '2026-02-20',
  traffic: { totalVisitors: 500, fromMetaAds: 300, adSpend: 150, organicDirect: 200 },
  conversions: { newEmailSignups: 50, signupRate: 10, bestVariant: 'A', costPerSignup: 3 },
  email: { welcomeOpenRate: 0, newsletterOpenRate: 0, unsubscribes: 2 },
  sales: { courseSales: 3, revenue: 891, cpa: 50 },
};

describe('WeeklyReportCard', () => {
  it('renders report text with data', () => {
    render(<WeeklyReportCard data={sampleData} />);
    expect(screen.getByText(/Week of: 2026-02-20/)).toBeInTheDocument();
    expect(screen.getByText(/Total visitors: 500/)).toBeInTheDocument();
    expect(screen.getByText(/Course sales: 3/)).toBeInTheDocument();
    expect(screen.getByText(/Revenue: \$891/)).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<WeeklyReportCard data={null} />);
    expect(screen.getByText(/Connect at least one data source/)).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    const { container } = render(<WeeklyReportCard data={null} loading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('copies report text to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<WeeklyReportCard data={sampleData} />);
    fireEvent.click(screen.getByText('Copy to clipboard'));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Week of: 2026-02-20'));
  });
});
