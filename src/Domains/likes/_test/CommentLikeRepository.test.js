import CommentLikeRepository from '../CommentLikeRepository.js';

describe('CommentLikeRepository interface', () => {
  it('should throw error when abstract methods are invoked', async () => {
    const repository = new CommentLikeRepository();

    await expect(repository.addLike()).rejects
      .toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repository.deleteLike()).rejects
      .toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repository.isLiked()).rejects
      .toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repository.getLikeCountsByCommentIds()).rejects
      .toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
