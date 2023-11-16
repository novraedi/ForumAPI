const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('addComment', () => {
  it('should orchestrating the add action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'baksoEnak',
    };

    const useCaseParam = {
      threadId: 'thread-123',
    };

    const useCaseOwner = {
      owner: 'user-12345'
    }

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'baksoEnak',
      owner: 'user-12345',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-123',
      title: 'mantap',
      body: 'mantapBet',
      date: '2023',
      username: 'dicoding',
    }));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: 'baksoEnak',
        owner: 'user-12345',
      })));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase
      .execute(useCasePayload, useCaseParam, useCaseOwner.owner);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId: useCaseParam.threadId,
      owner: expectedAddedComment.owner,
    }));
  });
});
