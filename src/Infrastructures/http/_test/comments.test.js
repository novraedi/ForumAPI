const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('comment endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should throw error with statusCode 404 when thread not exist', async () => {
      // Arrange
      const bodyRequest = {
        content: 'animeIsekai',
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-x/comments',
        payload: bodyRequest,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak dapat ditemukan');
    });

    it('should throw error with statusCode 400 when bodyRequest not meet data type specification', async () => {
      const bodyRequest = {
        content: true,
      };

      const server = await createServer(container);

      const { accessToken, id } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await ThreadsTableTestHelper.addThread({ owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: bodyRequest,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should add comment on thread correctly', async () => {
      // Arrange
      const bodyRequest = {
        content: 'animeIsekai',
      };
      const server = await createServer(container);
      const { accessToken, id } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await ThreadsTableTestHelper.addThread({ owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: bodyRequest,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should throw error if not owner deleted the comment', async () => {
      const server = await createServer(container);

      const { accessToken, id } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await UsersTableTestHelper.addUser({ username: 'anos' });
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({});

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('akses tidak didapatkan');
    });

    it('should throw error when thread or comment doesnt exist', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-x/comments/comment-x',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response with statusCode 200 when delete success', async () => {
      const server = await createServer(container);

      const { accessToken, id } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await UsersTableTestHelper.addUser({ username: 'anos' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ owner: id });

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
