const LikeUnlikeUseCase = require('../../../../Applications/use_case/LikeUnlikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putCommentLikeHandler(request) {
    const { threadId, commentId } = request.params;
    const likeUnlikeUseCase = this._container.getInstance(LikeUnlikeUseCase.name);
    const payload = {
      userId: request.auth.credentials.id,
      commentId,
      threadId,
    };

    await likeUnlikeUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
