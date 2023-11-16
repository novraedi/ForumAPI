class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam, owner) {
    await this._replyRepository.checkReplyIsExist(useCaseParam);
    await this._replyRepository.verifyReplyAccess({ replyId: useCaseParam.replyId, owner });
    await this._replyRepository.deleteReplyById(useCaseParam.replyId);
  }
}

module.exports = DeleteReplyUseCase;
