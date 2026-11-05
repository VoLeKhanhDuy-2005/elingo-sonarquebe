import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PostCardCommentItem from '@/modules/community/components/PostCard/PostCardCommentItem/PostCardCommentItem';
import { tr } from '../../../utils/i18n';

const comment = {
  id: 12,
  content: 'A helpful comment',
  createdAt: '2026-11-03T10:00:00',
  author: {
    id: 7,
    fullName: 'Learner',
  },
};

describe('PostCardCommentItem', () => {
  it('allows the current user to edit a comment and keeps delete disabled', async () => {
    const user = userEvent.setup();
    const onUpdateComment = vi.fn().mockResolvedValue(true);

    render(
      <PostCardCommentItem comment={comment} currentUserId="7" onUpdateComment={onUpdateComment} />
    );

    await user.click(screen.getByText('more_horiz'));

    const editButton = screen.getByText(tr('community:comments.edit')).closest('button');
    expect(screen.getByText(tr('community:comments.delete')).closest('button')).toBeDisabled();
    await user.click(editButton);

    const commentInput = screen.getByRole('textbox', { name: tr('community:comments.edit') });
    expect(commentInput).toHaveValue(comment.content);

    await user.clear(commentInput);
    await user.type(commentInput, 'Updated comment');
    await user.click(screen.getByRole('button', { name: tr('community:comments.save') }));

    expect(onUpdateComment).toHaveBeenCalledWith(comment.id, {
      content: 'Updated comment',
      imageUrl: undefined,
    });
  });

  it('does not show the options button for another user comment', () => {
    render(<PostCardCommentItem comment={comment} currentUserId={8} />);

    expect(screen.queryByText('more_horiz')).not.toBeInTheDocument();
  });

  it('loads the next replies page with one click', async () => {
    const user = userEvent.setup();
    const onLoadReplies = vi.fn();
    const replyState = {
      items: [{ ...comment, id: 13, content: 'A reply' }],
      page: 1,
      hasMore: true,
      isLoaded: true,
    };

    render(
      <PostCardCommentItem
        comment={{ ...comment, replyCount: 1 }}
        currentUserId={8}
        replyState={replyState}
        onLoadReplies={onLoadReplies}
        onCreateReply={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: tr('community:comments.viewReplies', { count: 1 }),
      })
    );

    const repliesList = document.querySelector('.post-card-comment-item__replies-list');
    Object.defineProperties(repliesList, {
      scrollHeight: { configurable: true, value: 500 },
      clientHeight: { configurable: true, value: 240 },
      scrollTop: { configurable: true, value: 260 },
    });
    fireEvent.scroll(repliesList);

    await user.click(screen.getByRole('button', { name: tr('community:comments.loadMoreReplies') }));

    expect(onLoadReplies).toHaveBeenCalledTimes(1);
    expect(onLoadReplies).toHaveBeenCalledWith(comment.id, undefined, true);
  });
});
