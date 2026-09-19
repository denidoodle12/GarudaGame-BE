import CommentLikeRepository from '../../Domains/likes/CommentLikeRepository.js';

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addLike(commentId, owner) {
    const query = {
      text: 'INSERT INTO comment_likes (comment_id, owner) VALUES ($1, $2)',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async isLiked(commentId, owner) {
    const query = {
      text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getLikeCountsByCommentIds(commentIds) {
    const query = {
      text: `SELECT comment_id, COUNT(*)::INTEGER AS like_count
             FROM comment_likes
             WHERE comment_id = ANY($1::VARCHAR[])
             GROUP BY comment_id`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default CommentLikeRepositoryPostgres;
