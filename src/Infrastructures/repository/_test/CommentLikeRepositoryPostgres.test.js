import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.js';

describe('CommentLikeRepositoryPostgres', () => {
  const repository = new CommentLikeRepositoryPostgres(pool);

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should persist a comment like', async () => {
    await repository.addLike('comment-123', 'user-123');

    const likes = await CommentLikesTableTestHelper.findLike('comment-123', 'user-123');
    expect(likes).toHaveLength(1);
  });

  it('should return whether user has liked a comment', async () => {
    expect(await repository.isLiked('comment-123', 'user-123')).toBe(false);

    await CommentLikesTableTestHelper.addLike();

    expect(await repository.isLiked('comment-123', 'user-123')).toBe(true);
  });

  it('should delete a comment like', async () => {
    await CommentLikesTableTestHelper.addLike();

    await repository.deleteLike('comment-123', 'user-123');

    const likes = await CommentLikesTableTestHelper.findLike('comment-123', 'user-123');
    expect(likes).toHaveLength(0);
  });

  it('should return like counts grouped by comment', async () => {
    await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
    await CommentsTableTestHelper.addComment({
      id: 'comment-456',
      threadId: 'thread-123',
      owner: 'user-456',
    });
    await CommentLikesTableTestHelper.addLike();
    await CommentLikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-456' });
    await CommentLikesTableTestHelper.addLike({ commentId: 'comment-456', owner: 'user-123' });

    const likeCounts = await repository.getLikeCountsByCommentIds([
      'comment-123',
      'comment-456',
    ]);

    expect(likeCounts).toEqual(expect.arrayContaining([
      { 'comment_id': 'comment-123', 'like_count': 2 },
      { 'comment_id': 'comment-456', 'like_count': 1 },
    ]));
  });
});
