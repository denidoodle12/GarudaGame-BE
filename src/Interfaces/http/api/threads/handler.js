import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';
import ToggleCommentLikeUseCase from '../../../../Applications/use_case/ToggleCommentLikeUseCase.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
      const useCasePayload = {
        title: req.body?.title,
        body: req.body?.body,
        owner: req.auth.credentials.id,
      };
      const addedThread = await addThreadUseCase.execute(useCasePayload);

      res.status(201).json({
        status: 'success',
        data: {
          addedThread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getThreadByIdHandler(req, res, next) {
    try {
      const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
      const useCasePayload = {
        threadId: req.params.threadId,
      };
      const thread = await getThreadDetailUseCase.execute(useCasePayload);

      res.status(200).json({
        status: 'success',
        data: {
          thread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async postCommentHandler(req, res, next) {
    try {
      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const useCasePayload = {
        content: req.body?.content,
        threadId: req.params.threadId,
        owner: req.auth.credentials.id,
      };
      const addedComment = await addCommentUseCase.execute(useCasePayload);

      res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
      const useCasePayload = {
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        owner: req.auth.credentials.id,
      };
      await deleteCommentUseCase.execute(useCasePayload);

      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  async postReplyHandler(req, res, next) {
    try {
      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
      const useCasePayload = {
        content: req.body?.content,
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        owner: req.auth.credentials.id,
      };
      const addedReply = await addReplyUseCase.execute(useCasePayload);

      res.status(201).json({
        status: 'success',
        data: {
          addedReply,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
      const useCasePayload = {
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        replyId: req.params.replyId,
        owner: req.auth.credentials.id,
      };
      await deleteReplyUseCase.execute(useCasePayload);

      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  async putCommentLikeHandler(req, res, next) {
    try {
      const toggleCommentLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);
      const useCasePayload = {
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        owner: req.auth.credentials.id,
      };
      await toggleCommentLikeUseCase.execute(useCasePayload);

      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ThreadsHandler;
