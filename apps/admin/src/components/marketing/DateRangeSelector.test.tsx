import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeSelector, getDateRange } from './DateRangeSelector';

describe('getDateRange', () => {
  it('returns today for "today" preset', () => {
    const range = getDateRange('today');
    expect(range.label).toBe('today');
    expect(range.from).toBe(range.to);
  });

  it('returns 7 day range for "7d" preset', () => {
    const range = getDateRange('7d');
    const from = new Date(range.from);
    const to = new Date(range.to);
    const diff = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    expect(diff).toBe(7);
  });

  it('returns 30 day range for "30d" preset', () => {
    const range = getDateRange('30d');
    const from = new Date(range.from);
    const to = new Date(range.to);
    const diff = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    expect(diff).toBe(30);
  });
});

describe('DateRangeSelector', () => {
  it('renders all preset buttons', () => {
    render(<DateRangeSelector value="30d" onChange={() => {}} />);
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('30 days')).toBeInTheDocument();
    expect(screen.getByText('90 days')).toBeInTheDocument();
  });

  it('highlights the active preset', () => {
    render(<DateRangeSelector value="7d" onChange={() => {}} />);
    const btn = screen.getByText('7 days');
    expect(btn.className).toContain('bg-primary');
  });

  it('calls onChange when a button is clicked', () => {
    const onChange = vi.fn();
    render(<DateRangeSelector value="30d" onChange={onChange} />);
    fireEvent.click(screen.getByText('7 days'));
    expect(onChange).toHaveBeenCalledWith('7d', expect.objectContaining({ label: '7d' }));
  });
});
