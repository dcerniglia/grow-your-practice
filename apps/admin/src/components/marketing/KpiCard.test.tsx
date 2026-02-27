import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiCard, KpiCardGrid } from './KpiCard';
import type { KpiMetric } from '@gyp/shared';

// Mock recharts to avoid SVG rendering issues in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Area: () => <div />,
}));

describe('KpiCard', () => {
  it('renders metric value and label', () => {
    const metric: KpiMetric = { label: 'Revenue', value: 1500, format: 'currency' };
    render(<KpiCard metric={metric} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,500')).toBeInTheDocument();
  });

  it('renders percentage format', () => {
    const metric: KpiMetric = { label: 'Rate', value: 45.7, format: 'percent' };
    render(<KpiCard metric={metric} />);
    expect(screen.getByText('45.7%')).toBeInTheDocument();
  });

  it('renders number format with commas', () => {
    const metric: KpiMetric = { label: 'Users', value: 12345, format: 'number' };
    render(<KpiCard metric={metric} />);
    expect(screen.getByText('12,345')).toBeInTheDocument();
  });

  it('shows positive delta with up arrow', () => {
    const metric: KpiMetric = { label: 'Test', value: 100, deltaPercent: 15.3 };
    render(<KpiCard metric={metric} />);
    expect(screen.getByText('↑ 15.3%')).toBeInTheDocument();
  });

  it('shows negative delta with down arrow', () => {
    const metric: KpiMetric = { label: 'Test', value: 100, deltaPercent: -8.2 };
    render(<KpiCard metric={metric} />);
    expect(screen.getByText('↓ 8.2%')).toBeInTheDocument();
  });

  it('shows loading skeleton', () => {
    const metric: KpiMetric = { label: 'Test', value: 0 };
    const { container } = render(<KpiCard metric={metric} loading />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows "Not connected" when unavailable', () => {
    const metric: KpiMetric = { label: 'Revenue', value: 0 };
    render(<KpiCard metric={metric} unavailable />);
    expect(screen.getByText('Not connected')).toBeInTheDocument();
  });

  it('renders string values directly', () => {
    const metric: KpiMetric = { label: 'Status', value: 'N/A' };
    render(<KpiCard metric={metric} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});

describe('KpiCardGrid', () => {
  it('renders children in a grid', () => {
    const { container } = render(
      <KpiCardGrid>
        <div>Card 1</div>
        <div>Card 2</div>
      </KpiCardGrid>,
    );
    expect(container.querySelector('.grid')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });
});
