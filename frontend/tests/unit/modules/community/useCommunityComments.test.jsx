import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../../mocks/server';
import useCommunityComments from '@/modules/community/hooks/useCommunityComments';

describe('useCommunityComments', () => {
  it('loads the next replies page on the first load-more request', async () => {
    const requestedPages = [];
    const firstPage = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      content: `Reply ${index + 1}`,
    }));

    server.use(
      http.get('*/comments/12/replies', ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page'));
        requestedPages.push(page);
        return HttpResponse.json({
          success: true,
          data: {
            content: page === 1 ? firstPage : [{ id: 21, content: 'Reply 21' }],
            isLast: page === 2,
          },
        });
      })
    );

    const { result } = renderHook(() => useCommunityComments({ postId: 5 }));
    await act(async () => {
      await result.current.handleLoadReplies(12);
    });
    await act(async () => {
      await result.current.handleLoadReplies(12, undefined, true);
    });

    expect(requestedPages).toEqual([1, 2]);
    expect(result.current.repliesByCommentId[12].items).toHaveLength(21);
    expect(result.current.repliesByCommentId[12].items[20]).toMatchObject({
      id: 21,
      content: 'Reply 21',
    });
  });

  it('uses one-indexed pages when loading comments', async () => {
    const requestedPages = [];
    server.use(
      http.get('*/posts/5/comments', ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page'));
        requestedPages.push(page);
        return HttpResponse.json({
          success: true,
          data: {
            content: [{ id: page, content: `Comment page ${page}` }],
            isLast: page === 2,
          },
        });
      })
    );

    const { result } = renderHook(() => useCommunityComments({ postId: 5 }));
    await act(async () => {
      await result.current.handleLoadComments();
    });
    await act(async () => {
      await result.current.handleLoadMoreComments();
    });

    expect(requestedPages).toEqual([1, 2]);
    expect(result.current.comments).toHaveLength(2);
  });

  it('updates a comment through the API and refreshes the local comment', async () => {
    const updatedRequest = vi.fn();
    const originalComment = {
      id: 12,
      content: 'Original comment',
      imageUrl: 'https://example.com/comment.png',
      author: { id: 7, fullName: 'Learner' },
    };

    server.use(
      http.get('*/posts/5/comments', () =>
        HttpResponse.json({
          success: true,
          data: { content: [originalComment], isLast: true },
        })
      ),
      http.put('*/comments/12', async ({ request }) => {
        updatedRequest(await request.json());
        return HttpResponse.json({
          success: true,
          data: { id: 12, content: 'Updated comment' },
        });
      })
    );

    const { result } = renderHook(() => useCommunityComments({ postId: 5 }));
    await act(async () => {
      await result.current.handleLoadComments();
    });

    let updateResult;
    await act(async () => {
      updateResult = await result.current.handleUpdateComment(12, {
        content: 'Updated comment',
        imageUrl: originalComment.imageUrl,
      });
    });

    expect(updateResult).toBe(true);
    expect(updatedRequest).toHaveBeenCalledWith({
      content: 'Updated comment',
      imageUrl: originalComment.imageUrl,
    });
    expect(result.current.comments[0]).toMatchObject({
      ...originalComment,
      content: 'Updated comment',
    });
  });
});
