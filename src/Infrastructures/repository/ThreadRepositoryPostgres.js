const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, IdGenerator, DateGenerator) {
    super();
    this._pool = pool;
    this._IdGenerator = IdGenerator;
    this._DateGenerator = DateGenerator;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._IdGenerator(16)}`;
    const date = new this._DateGenerator().toISOString();

    const result = await this._pool.query({
      text: 'INSERT INTO threads VALUES($1,$2,$3,$4,$5) RETURNING id, title, owner',
      values: [id, title, owner, body, date],
    });

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const thread = await this._pool.query({
      text: `SELECT threads.id, threads.title, threads.body, 
        threads.date, users.username
        FROM threads 
        INNER JOIN users ON threads.owner=users.id  
        WHERE threads.id = $1`,
      values: [threadId],
    });
    if (!thread.rowCount) {
      throw new NotFoundError('thread tidak dapat ditemukan');
    }
    return thread.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
