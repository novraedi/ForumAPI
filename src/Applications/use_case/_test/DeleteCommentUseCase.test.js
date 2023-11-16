const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      treadId: 'thread-123',
      commentId: 'comment-123',
    };

    const useCaseOwner = {
      owner: 'user-123'
    }

    const mockCommentRepository = new CommentRepository();

    // Mocking

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository
      .verifyCommentAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    // Action
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload, useCaseOwner.owner);

    // Assert
    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith({ ...useCasePayload });
    expect(mockCommentRepository.verifyCommentAccess)
      .toBeCalledWith({ commentId: useCasePayload.commentId, owner: 'user-123' });
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCasePayload.commentId);
  });
});
