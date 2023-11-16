const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentsRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentsRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('', () => {
    it('should add Comments correctly to database', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'wangy',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      // Fake id generator and Date
      const fakeIdGenerator = () => '123';
      function fakeDateGenerator() {
        this.toISOString = () => '2023';
      }

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toBeDefined();
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'wangy',
        owner: 'user-123',
      }));
    });
  });

  describe('checkCommentIsExist', () => {
    it('should throw error when comment not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await expect(commentRepositoryPostgres.checkCommentIsExist('comment-x')).rejects.toThrowError();
    });

    it('should not throw error when comment exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await CommentsTableTestHelper.addComment({});

      await expect(commentRepositoryPostgres.checkCommentIsExist({ threadId: 'thread-123', commentId: 'comment-123' })).resolves.not.toThrowError();
    });
  });

  describe('getAllCommentByThreadId', () => {
    it('should get all comments', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await CommentsTableTestHelper.addComment({ date: '2022' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1234' });

      const { owner: ownerA, thread_id: threadA, ...commentA } = await CommentsTableTestHelper.findCommentById('comment-123');

      const { owner: ownerB, thread_id: threadB, ...commentB } = await CommentsTableTestHelper.findCommentById('comment-1234');

      const expectedComments = [{ ...commentA, username: 'dicoding' }, { ...commentB, username: 'dicoding' }];

      // Action
      const comments = await commentRepositoryPostgres.getAllCommentByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments).toStrictEqual(expectedComments);
    });
  });

  describe('verifyCommentAccess', () => {
    it('should throw error when access not granted', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await CommentsTableTestHelper.addComment({});

      await expect(commentRepositoryPostgres.verifyCommentAccess({
        owner: 'user-x',
        commentId: 'comment-123',
      })).rejects.toThrowError('akses tidak didapatkan');
    });

    it('should grant Access correctl;y', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await CommentsTableTestHelper.addComment({});

      await expect(commentRepositoryPostgres.verifyCommentAccess({
        owner: 'user-123',
        commentId: 'comment-123',
      })).resolves.toBeUndefined();
    });
  });

  describe('deleteCommentById', () => {
    it('should not throw error when delete success', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await CommentsTableTestHelper.addComment({});

      await expect(commentRepositoryPostgres.deleteCommentById('comment-123')).resolves.toBeUndefined();
    });

    it('is_deleted column should be true in database', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await CommentsTableTestHelper.addComment({});
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment.is_deleted).toEqual(true);
    });

    it('should throw error when comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await expect(commentRepositoryPostgres.deleteCommentById('comment-123')).rejects.toThrowError('comment tidak ada')
    });
  });
});
