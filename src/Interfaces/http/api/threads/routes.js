import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.post('/', authMiddleware, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadByIdHandler);
  router.post('/:threadId/comments', authMiddleware, handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authMiddleware, handler.deleteCommentHandler);
  router.post('/:threadId/comments/:commentId/replies', authMiddleware, handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authMiddleware, handler.deleteReplyHandler);

  return router;
};

export default createThreadsRouter;
