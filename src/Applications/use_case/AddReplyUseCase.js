const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    await this._commentRepository.checkCommentIsExist(useCaseParam);
    return this._replyRepository.addReply(
      new NewReply({ ...useCasePayload, commentId: useCaseParam.commentId, owner }),
    );
  }
}

module.exports = AddReplyUseCase;
