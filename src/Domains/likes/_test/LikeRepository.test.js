const LikeRepository = require('../LikeRepository');

describe('LikeRepository', () => {
  it('should throw error when invoke abstract object', async () => {
    const likeRepository = new LikeRepository();

    await expect(() => likeRepository.likeComment('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.unlikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.verifyAvailableCommentLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.getCommentLikesCountByThreadId({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
