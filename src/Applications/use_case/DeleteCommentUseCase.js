class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, owner) {
    await this._commentRepository
      .checkCommentIsExist(useCasePayload);
    await this._commentRepository
      .verifyCommentAccess({ commentId: useCasePayload.commentId, owner });
    await this._commentRepository
      .deleteCommentById(useCasePayload.commentId);
  }
}

module.exports = DeleteCommentUseCase;
