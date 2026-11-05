import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OptionsMenu from '@/components/OptionsMenu/OptionsMenu';

describe('OptionsMenu', () => {
  it('calls onClick when the options button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<OptionsMenu onClick={onClick} />);

    await user.click(screen.getByText('more_horiz'));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
