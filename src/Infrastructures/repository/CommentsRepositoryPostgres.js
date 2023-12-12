const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator, DateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._DateGenerator = DateGenerator;
  }

  async addComment({ content, owner, threadId }) {
    const id = `comment-${this._idGenerator(16)}`;
    const date = new this._DateGenerator().toISOString();
    const result = await this._pool.query({
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,$5) RETURNING id, content, owner',
      values: [id, threadId, content, owner, date],
    });
    return new AddedComment({ ...result.rows[0] });
  }

  async checkCommentIsExist({ threadId, commentId }) {
    const result = await this._pool.query({
      text: 'SELECT 1 FROM comments WHERE thread_id=$1 AND id=$2',
      values: [threadId, commentId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async getAllCommentByThreadId(threadId) {
    const result = await this._pool.query({
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted FROM comments
        INNER JOIN users ON comments.owner=users.id
        WHERE comments.thread_id=$1
        ORDER BY comments.date ASC`,
      values: [threadId],
    });
    return result.rows;
  }

  async verifyCommentAccess({ owner, commentId }) {
    const result = await this._pool.query({
      text: 'SELECT 1 FROM comments WHERE owner=$1 AND id=$2',
      values: [owner, commentId],
    });

    if (!result.rowCount) {
      throw new AuthorizationError('akses tidak didapatkan');
    }
  }

  async deleteCommentById(commentId) {
    const result = await this._pool.query({
      text: 'UPDATE comments SET is_deleted=true WHERE id=$1 RETURNING id',
      values: [commentId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ada');
    }
  }
}

module.exports = CommentRepositoryPostgres;
