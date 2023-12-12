const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    await this._threadRepository.getThreadById(useCaseParam.threadId);
    const newComment = new NewComment({
      ...useCasePayload,
      threadId: useCaseParam.threadId,
      owner,
    });
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
