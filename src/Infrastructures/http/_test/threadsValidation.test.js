import { vi } from 'vitest';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import config from '../../../Commons/config.js';
import AddThreadUseCase from '../../../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../../../Applications/use_case/AddCommentUseCase.js';
import AddReplyUseCase from '../../../Applications/use_case/AddReplyUseCase.js';
import createServer from '../createServer.js';

describe('forum payload validation', () => {
  const threadRepository = {
    addThread: vi.fn(),
    verifyThreadExists: vi.fn().mockResolvedValue(),
  };
  const commentRepository = {
    addComment: vi.fn(),
    verifyCommentExists: vi.fn().mockResolvedValue(),
  };
  const replyRepository = { addReply: vi.fn() };
  const instances = {
    [AddThreadUseCase.name]: new AddThreadUseCase({ threadRepository }),
    [AddCommentUseCase.name]: new AddCommentUseCase({ threadRepository, commentRepository }),
    [AddReplyUseCase.name]: new AddReplyUseCase({ threadRepository, commentRepository, replyRepository }),
  };
  const token = jwt.sign({ id: 'user-123' }, config.auth.accessTokenKey);

  const routes = [
    { path: '/threads', invalidPayload: { title: 123, body: 'body' } },
    { path: '/threads/thread-123/comments', invalidPayload: { content: 123 } },
    { path: '/threads/thread-123/comments/comment-123/replies', invalidPayload: { content: 123 } },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each(routes)('returns 400 for missing body at $path', async ({ path }) => {
    const app = await createServer({ getInstance: (name) => instances[name] });
    const response = await request(app).post(path).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('fail');
    expect(response.body.message).toBeTruthy();
  });

  it.each(routes)('returns 400 for wrong data type at $path', async ({ path, invalidPayload }) => {
    const app = await createServer({ getInstance: (name) => instances[name] });
    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('fail');
    expect(response.body.message).toBeTruthy();
  });
});
