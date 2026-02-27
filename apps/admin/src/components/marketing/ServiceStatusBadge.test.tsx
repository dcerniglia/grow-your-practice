import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServiceStatusBadge } from './ServiceStatusBadge';

describe('ServiceStatusBadge', () => {
  it('shows green dot when connected', () => {
    const { container } = render(<ServiceStatusBadge name="Stripe" connected />);
    expect(screen.getByText('Stripe')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
  });

  it('shows gray dot when not connected', () => {
    const { container } = render(<ServiceStatusBadge name="Stripe" connected={false} />);
    expect(container.querySelector('.bg-gray-400')).toBeInTheDocument();
  });
});
