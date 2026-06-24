import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const getAccessToken = async (app) => {
    await request(app).post('/users').send({
      username: 'dicoding',
      password: 'superpassword',
      fullname: 'Dicoding Indonesia',
    });

    const response = await request(app).post('/authentications').send({
      username: 'dicoding',
      password: 'superpassword',
    });

    return response.body.data.accessToken;
  };

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.title).toEqual(requestPayload.title);
    });

    it('should response 401 when no access token provided', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
      };
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      const app = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      // Action
      const response = await request(app).get('/threads/thread-123');

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.id).toEqual('thread-123');
      expect(response.body.data.thread.comments).toHaveLength(1);
      expect(response.body.data.thread.comments[0].replies).toHaveLength(1);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/threads/thread-not-found');

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);
      
      const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const { id: userId } = await authenticationTokenManager.decodePayload(accessToken);

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const requestPayload = {
        content: 'sebuah komentar',
      };

      // Action
      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment.content).toEqual(requestPayload.content);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      const requestPayload = {
        content: 'sebuah komentar',
      };

      // Action
      const response = await request(app)
        .post('/threads/thread-not-found/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and return success status', async () => {
      // Arrange
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);
      
      const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const { id: userId } = await authenticationTokenManager.decodePayload(accessToken);

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: userId });

      // Action
      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 403 when user is not the owner', async () => {
      // Arrange
      const app = await createServer(container);
      const accessToken = await getAccessToken(app); // creates user 'dicoding'
      
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-456' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-456' });

      // Action
      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);
      
      const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const { id: userId } = await authenticationTokenManager.decodePayload(accessToken);

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: userId });

      const requestPayload = {
        content: 'sebuah balasan',
      };

      // Action
      const response = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedReply).toBeDefined();
      expect(response.body.data.addedReply.content).toEqual(requestPayload.content);
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and return success status', async () => {
      // Arrange
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);
      
      const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const { id: userId } = await authenticationTokenManager.decodePayload(accessToken);

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: userId });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: userId });

      // Action
      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });
});
