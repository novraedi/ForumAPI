const ReplyRepository = require('../../../Domains/replies/RepliesRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReply', () => {
  it('should orchestrating delete reply action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const useCaseOwner = {
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    // mocking
    mockReplyRepository.checkReplyIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    // creating use case
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCaseParam, useCaseOwner.owner);

    // Assert
    expect(mockReplyRepository.checkReplyIsExist)
      .toBeCalledWith(useCaseParam);
    expect(mockReplyRepository.verifyReplyAccess)
      .toBeCalledWith({ replyId: useCaseParam.replyId, owner: useCaseOwner.owner });
    expect(mockReplyRepository.deleteReplyById)
      .toBeCalledWith(useCaseParam.replyId);
  });
});
