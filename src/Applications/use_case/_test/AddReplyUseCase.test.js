const ReplyRepository = require('../../../Domains/replies/RepliesRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/replies/entities/NewReply');

describe('AddRepliesUseCase', () => {
  it('should orchestrating Add replies action correctly', async () => {
    const useCasePayload = {
      content: 'mantap',
    };
    const useCaseParam = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const useCaseOwner = {
      owner: 'user-123',
    };
    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'mantap',
      owner: 'user-123',
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReply({
        id: 'reply-123',
        content: 'mantap',
        owner: 'user-123',
      })));

    // creating use case
    const addRepliesUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addRepliesUseCase
      .execute(useCasePayload, useCaseParam, useCaseOwner.owner);

    // Assert
    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCaseParam);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
      owner: expectedAddedReply.owner,
      commentId: useCaseParam.commentId,
    }));
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});
