const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUnlikeUseCase = require('../LikeUnlikeUseCase');

describe('LikeUnlikeUseCase', () => {
  it('should orchestrating the like action correctly', async () => {
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyAvailableCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await likeUnlikeUseCase.execute(payload);

    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(payload);
    expect(mockLikeRepository.verifyAvailableCommentLike).toBeCalledWith(payload);
    expect(mockLikeRepository.likeComment).toBeCalledWith(payload);
  });

  it('should orchestrating the unlike action correctly', async () => {
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyAvailableCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.unlikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await likeUnlikeUseCase.execute(payload);

    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(payload);
    expect(mockLikeRepository.verifyAvailableCommentLike).toBeCalledWith(payload);
    expect(mockLikeRepository.unlikeComment).toBeCalledWith(payload);
  });
});
