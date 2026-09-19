import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import CommentLikeRepository from '../../../Domains/likes/CommentLikeRepository.js';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';

describe('ToggleCommentLikeUseCase', () => {
  const payload = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    owner: 'user-123',
  };

  const createDependencies = (isLiked) => {
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const commentLikeRepository = new CommentLikeRepository();

    threadRepository.verifyThreadExists = vi.fn().mockResolvedValue();
    commentRepository.verifyCommentExists = vi.fn().mockResolvedValue();
    commentLikeRepository.isLiked = vi.fn().mockResolvedValue(isLiked);
    commentLikeRepository.addLike = vi.fn().mockResolvedValue();
    commentLikeRepository.deleteLike = vi.fn().mockResolvedValue();

    return { threadRepository, commentRepository, commentLikeRepository };
  };

  it('should add like when user has not liked the comment', async () => {
    const dependencies = createDependencies(false);
    const useCase = new ToggleCommentLikeUseCase(dependencies);

    await useCase.execute(payload);

    expect(dependencies.threadRepository.verifyThreadExists).toHaveBeenCalledWith(payload.threadId);
    expect(dependencies.commentRepository.verifyCommentExists)
      .toHaveBeenCalledWith(payload.commentId, payload.threadId);
    expect(dependencies.commentLikeRepository.isLiked)
      .toHaveBeenCalledWith(payload.commentId, payload.owner);
    expect(dependencies.commentLikeRepository.addLike)
      .toHaveBeenCalledWith(payload.commentId, payload.owner);
    expect(dependencies.commentLikeRepository.deleteLike).not.toHaveBeenCalled();
  });

  it('should delete like when user has liked the comment', async () => {
    const dependencies = createDependencies(true);
    const useCase = new ToggleCommentLikeUseCase(dependencies);

    await useCase.execute(payload);

    expect(dependencies.commentLikeRepository.deleteLike)
      .toHaveBeenCalledWith(payload.commentId, payload.owner);
    expect(dependencies.commentLikeRepository.addLike).not.toHaveBeenCalled();
  });
});
