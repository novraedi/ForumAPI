const AddCommentLike = require('../../Domains/likes/entities/AddCommentLike');

class LikeUnlikeUseCase {
  constructor({ commentRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(payload) {
    const useCasePayload = new AddCommentLike(payload);
    await this._commentRepository.checkCommentIsExist(useCasePayload);
    const isExist = await this._likeRepository.verifyAvailableCommentLike(useCasePayload);

    if (isExist) {
      return this._likeRepository.unlikeComment(useCasePayload);
    }

    return this._likeRepository.likeComment(useCasePayload);
  }
}

module.exports = LikeUnlikeUseCase;
