const UserCommentLikesTableTestHelper = require('../../../../tests/UserCommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await UserCommentLikesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('likeComment function', () => {
    it('should added the like successfully', async () => {
      await CommentsTableTestHelper.addComment({});

      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      const fakeIdGenerator = () => '123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.likeComment(payload);

      const like = await UserCommentLikesTableTestHelper.findLikeById('like-123');

      expect(like).toHaveLength(1);
      expect(like[0].user_id).toEqual(payload.userId);
      expect(like[0].comment_id).toEqual(payload.commentId);
    });
  });

  describe('unlikeComment function', () => {
    it('should delete like successfully', async () => {
      await CommentsTableTestHelper.addComment({});
      await UserCommentLikesTableTestHelper.addLike({});

      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.unlikeComment(payload);

      const like = await UserCommentLikesTableTestHelper.findLikeById('like-123');

      expect(like).toHaveLength(0);
    });
  });

  describe('verifyAvailableCommentLike function', () => {
    it('should return true when the like is found', async () => {
      await CommentsTableTestHelper.addComment({});
      await UserCommentLikesTableTestHelper.addLike({});

      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.verifyAvailableCommentLike(payload))
        .resolves.toEqual(true);
    });
    it('should return false when the like is not found', async () => {
      await CommentsTableTestHelper.addComment({});

      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.verifyAvailableCommentLike(payload))
        .resolves.toEqual(false);
    });
  });

  describe('getCommentLikesCountByThreadId', () => {
    it('should return an empty array when thread has no comment', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const result = await likeRepositoryPostgres
        .getCommentLikesCountByThreadId('thread-123');

      expect(result).toStrictEqual([]);
    });
    it('should return all the comment likes', async () => {
      await CommentsTableTestHelper.addComment({});
      await UserCommentLikesTableTestHelper.addLike({});

      const expectedResult = [{
        likes: 1,
        comment_id: 'comment-123',
      }];

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const result = await likeRepositoryPostgres.getCommentLikesCountByThreadId('thread-123');

      expect(result).toStrictEqual(expectedResult);
    });

    it('should return all the comments with no like', async () => {
      await CommentsTableTestHelper.addComment({});

      const expectedResult = [
        {
          likes: 0,
          comment_id: 'comment-123',
        },
      ];

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const result = await likeRepositoryPostgres
        .getCommentLikesCountByThreadId('thread-123');

      expect(result).toStrictEqual(expectedResult);
    });
  });
});
