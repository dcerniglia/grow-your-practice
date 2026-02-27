import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FunnelChart } from './FunnelChart';
import type { FunnelStep } from '@gyp/shared';

describe('FunnelChart', () => {
  it('renders all funnel steps', () => {
    const steps: FunnelStep[] = [
      { label: 'Visitors', value: 1000 },
      { label: 'Signups', value: 200, conversionFromPrevious: 20 },
      { label: 'Purchases', value: 10, conversionFromPrevious: 5 },
    ];
    render(<FunnelChart steps={steps} />);
    expect(screen.getByText('Visitors')).toBeInTheDocument();
    expect(screen.getByText('Signups')).toBeInTheDocument();
    expect(screen.getByText('Purchases')).toBeInTheDocument();
  });

  it('shows conversion percentages', () => {
    const steps: FunnelStep[] = [
      { label: 'Visitors', value: 1000 },
      { label: 'Signups', value: 200, conversionFromPrevious: 20 },
    ];
    render(<FunnelChart steps={steps} />);
    expect(screen.getByText('(20.0% from prev)')).toBeInTheDocument();
  });

  it('shows empty state when no steps', () => {
    render(<FunnelChart steps={[]} />);
    expect(screen.getByText('No funnel data available')).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    const { container } = render(<FunnelChart steps={[]} loading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
