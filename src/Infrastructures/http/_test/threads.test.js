const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should throw error when body request not contain needed property', async () => {
      // Arrange
      const bodyRequest = {
        title: 'animeIsekai',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: bodyRequest,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should throw error when body request not meet data type specification', async () => {
      // Arrange
      const bodyRequest = {
        title: 'animeIsekai',
        body: true,
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: bodyRequest,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
    it('should add thread correctly to database', async () => {
      // Arrange
      const bodyRequest = {
        title: 'animeIsekai',
        body: 'arifureta',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should throw error with statusCode 404 when threads doesnt exist', async () => {
      // Arrange
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/{thread-x}',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak dapat ditemukan');
    });

    it('comment and reply content should be changed after deleted', async () => {
      // Arrange
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      await CommentsTableTestHelper.deleteCommentById('comment-123');
      await RepliesTableTestHelper.deleteReplyById('reply-123');

      const threadId = 'thread-123';
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**')
      expect(responseJson.data.thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**')
    });

    it('should get detailThread correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ date: '2022' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1234' });
      await RepliesTableTestHelper.addReply({});
      await RepliesTableTestHelper.addReply({ id: 'reply-1234' });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(2);
    });
  });
});
