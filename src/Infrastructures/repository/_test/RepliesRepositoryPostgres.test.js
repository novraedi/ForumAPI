const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');
const AddedReplies = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      username: 'anos',
      password: 'secret',
      fullname: 'anos voldigoad',
    });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-1234' });
  });
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add reply to database', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'kuat',
        owner: 'user-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123';
      function fakeDateGenerator() {
        this.toISOString = () => '2023';
      }

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedReply = await repliesRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(addedReply.id);
      expect(addedReply).toStrictEqual(new AddedReplies({
        id: 'reply-123',
        content: 'kuat',
        owner: 'user-123',
      }));
      expect(reply).toBeDefined();
    });
  });

  describe('verifyReplyAccess function', () => {
    it('should throw error if access not granted', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await RepliesTableTestHelper.addReply({});

      // Assert
      await expect(repliesRepositoryPostgres.verifyReplyAccess({
        owner: 'user-x',
        replyId: 'reply-123',
      })).rejects.toThrowError('anda tidak berhak mengakses reply ini');
    });

    it('should grant access correctly', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await RepliesTableTestHelper.addReply({});

      await expect(repliesRepositoryPostgres.verifyReplyAccess({
        owner: 'user-123',
        replyId: 'reply-123',
      })).resolves.toBeUndefined();
    });
  });

  describe('getRepliesByThreadId', () => {
    it('should return all replies on thread', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await RepliesTableTestHelper.addReply({ id: 'reply-123', date: '2022' });
      await RepliesTableTestHelper.addReply({ id: 'reply-1234', date: '2023' });

      // removing owner for expectedReplies
      const { owner: ownerA, ...replyA } = await RepliesTableTestHelper.findReplyById('reply-123');
      const { owner: ownerB, ...replyB } = await RepliesTableTestHelper.findReplyById('reply-1234');

      const expectedReplies = [{ ...replyA, username: 'anos' }, { ...replyB, username: 'anos' }];

      // Action
      const replies = await repliesRepositoryPostgres.getRepliesByThreadId('thread-123');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies).toStrictEqual(expectedReplies);
    });
  });

  describe('checkReplyIsExist', () => {
    it('should throw error when reply does not exist', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await expect(repliesRepositoryPostgres.checkReplyIsExist({ threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-123' })).rejects.toThrowError('reply tidak ada');
    });

    it('should not throw error when reply exist', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      // Adding reply
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      await expect(repliesRepositoryPostgres.checkReplyIsExist({ threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-123' })).resolves.not.toThrowError();
    });
  });

  describe('deleteReplyById function', () => {
    it('should not throw error when reply deleted successfully', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await RepliesTableTestHelper.addReply({});

      await expect(repliesRepositoryPostgres.deleteReplyById('reply-123')).resolves.toBeUndefined();
    });

    it('is_deleted column should be true in database', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await RepliesTableTestHelper.addReply({});
      await repliesRepositoryPostgres.deleteReplyById('reply-123');

      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply.is_deleted).toEqual(true);
    });

    it('should throw error when reply does nto exist', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await expect(repliesRepositoryPostgres.deleteReplyById('reply-123')).rejects.toThrowError('reply tidak ada');
    });
  });
});
