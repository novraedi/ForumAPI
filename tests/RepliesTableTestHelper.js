/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', commentId = 'comment-123', content = 'test', date = '2023', owner = 'user-123', isDeleted = false,
  }) {
    await pool.query({
      text: 'INSERT INTO replies VALUES($1,$2,$3,$4,$5,$6)',
      values: [id, commentId, content, owner, date, isDeleted],
    });
  },

  async findReplyById(id) {
    const result = await pool.query({
      text: 'SELECT * from replies WHERE id=$1',
      values: [id],
    });
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },

  async deleteReplyById(id) {
    await pool.query({
      text: 'UPDATE replies SET is_deleted=TRUE WHERE id=$1',
      values: [id],
    });
  },
};

module.exports = RepliesTableTestHelper;
