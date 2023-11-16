/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'test', body = 'mantap', owner = 'user-123', date = '2023',
  }) {
    await pool.query({
      text: 'INSERT INTO threads VALUES($1,$2,$3,$4,$5)',
      values: [id, title, owner, body, date],
    });
  },

  async findThreadById(threadId) {
    const result = await pool.query({
      text: 'SELECT * FROM threads WHERE id=$1',
      values: [threadId],
    });

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
