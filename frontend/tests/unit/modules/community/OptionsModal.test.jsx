import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OptionsModal from '@/components/OptionsModal/OptionsModal';
import { tr } from '../../../utils/i18n';

describe('OptionsModal', () => {
  it('renders provided options and closes after an option is selected', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSelect = vi.fn();

    render(
      <OptionsModal
        isOpen
        title={tr('community:postCard.postOptionsTitle')}
        onClose={onClose}
        options={[
          {
            id: 'copy-link',
            label: tr('community:postCard.copyPostLink'),
            icon: 'content_copy',
            onSelect,
          },
        ]}
      />
    );

    await user.click(screen.getByText(tr('community:postCard.copyPostLink')));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('keeps disabled options unavailable', () => {
    render(
      <OptionsModal
        isOpen
        title={tr('community:comments.optionsTitle')}
        options={[
          {
            id: 'edit-comment',
            label: tr('community:comments.edit'),
            icon: 'edit',
            disabled: true,
          },
        ]}
      />
    );

    expect(screen.getByText(tr('community:comments.edit')).closest('button')).toBeDisabled();
  });
});
