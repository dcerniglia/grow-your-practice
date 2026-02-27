import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartContainer } from './ChartContainer';

describe('ChartContainer', () => {
  it('renders title and children', () => {
    render(
      <ChartContainer title="Test Chart">
        <div>Chart content</div>
      </ChartContainer>,
    );
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByText('Chart content')).toBeInTheDocument();
  });

  it('shows unavailable message when unavailable', () => {
    render(<ChartContainer title="Test" unavailable />);
    expect(screen.getByText('Not connected — add API keys to enable')).toBeInTheDocument();
  });

  it('renders children when not unavailable even if no children provided', () => {
    const { container } = render(<ChartContainer title="Empty" />);
    expect(container.querySelector('.rounded-card')).toBeInTheDocument();
  });
});
