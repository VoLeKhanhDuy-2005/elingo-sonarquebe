import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PostCardCommentInput from '@/modules/community/components/PostCard/PostCardCommentInput/PostCardCommentInput';

describe('PostCardCommentInput', () => {
  it('submits the comment on Enter', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<PostCardCommentInput onSubmit={onSubmit} />);

    const textarea = screen.getByPlaceholderText(/viết bình luận/i);
    await user.type(textarea, '  Hello there  ');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('Hello there', null);
    expect(textarea).toHaveValue('');
  });

  it('keeps a newline on Shift+Enter without submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<PostCardCommentInput onSubmit={onSubmit} />);

    const textarea = screen.getByPlaceholderText(/viết bình luận/i);
    await user.type(textarea, 'First line');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('First line\n');
  });

  it('does not submit while an IME composition is active', () => {
    const onSubmit = vi.fn();

    render(<PostCardCommentInput onSubmit={onSubmit} />);

    const textarea = screen.getByPlaceholderText(/viết bình luận/i);
    fireEvent.change(textarea, { target: { value: 'Đang nhập' } });
    fireEvent.keyDown(textarea, {
      key: 'Enter',
      isComposing: true,
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('Đang nhập');
  });
});
