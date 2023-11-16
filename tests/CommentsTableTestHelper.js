/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', threadId = 'thread-123', content = 'test', owner = 'user-123', date = '2023', isDeleted = false,
  }) {
    await pool.query({
      text: 'INSERT into comments VALUES($1,$2,$3,$4,$5,$6)',
      values: [id, threadId, content, owner, date, isDeleted],
    });
  },

  async findCommentById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [id],
    });
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

  async deleteCommentById(id) {
    await pool.query({
      text: 'UPDATE comments SET is_deleted=true WHERE id=$1',
      values: [id],
    });
  },
};

module.exports = CommentsTableTestHelper;
