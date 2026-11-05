import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from '@/components/EmptyState/EmptyState';

describe('EmptyState', () => {
  it('giữ bề mặt card cho biến thể mặc định', () => {
    const { container } = render(<EmptyState description="No content yet" />);

    expect(container.firstChild).toHaveClass('glass-card');
    expect(container.firstChild).not.toHaveClass('empty-state--compact');
    expect(screen.getByText('No content yet')).toBeInTheDocument();
  });

  it('render biến thể compact mà không tạo bề mặt card lồng nhau', () => {
    const { container } = render(
      <EmptyState variant="compact" icon="chat_bubble_outline" description="No comments yet" />
    );

    expect(container.firstChild).toHaveClass('empty-state--compact');
    expect(container.firstChild).not.toHaveClass('glass-card');
    expect(screen.getByText('chat_bubble_outline')).toBeInTheDocument();
    expect(screen.getByText('No comments yet')).toBeInTheDocument();
  });
});
