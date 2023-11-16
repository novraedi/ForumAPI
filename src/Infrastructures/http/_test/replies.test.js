const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('replies endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should throw error with statusCode 404 when thread or comment doesnt exist', async () => {
      // Assert
      const bodyRequest = {
        content: 'animeIsekai',
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threadId-x/comments/commentId-x/replies',
        payload: bodyRequest,
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

    it('should throw error with statusCode 400 when bodyRequest not meet data type specification', async () => {
      const bodyRequest = {
        content: true,
      };

      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await UsersTableTestHelper.addUser({ username: 'anos' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: bodyRequest,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai');
    });

    it('should throw error with statusCode 400 when bodyRequest not contain needed property', async () => {
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await UsersTableTestHelper.addUser({ username: 'anos' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    });

    it('should add reply on comment correctly', async () => {
      // Arrange
      const bodyRequest = {
        content: 'animeIsekai',
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await UsersTableTestHelper.addUser({ username: 'anos' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should throw error when not owner deleted reply', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await UsersTableTestHelper.addUser({ username: 'anos' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses reply ini');
    });

    it('should throw error with statusCode 404 when thread, comment, or reply doesnt exist', async () => {
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/threadId-x/comments/commentId-x/replies/replyId-x',
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

    it('should delete reply correctly', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken, id } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      await UsersTableTestHelper.addUser({ username: 'anos' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ owner: id });

      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
