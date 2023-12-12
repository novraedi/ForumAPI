const AddCommentLike = require('../AddCommentLike');

describe('AddCommentLike', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new AddCommentLike(payload)).toThrowError('ADD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: true,
    };

    // Action and Assert
    expect(() => new AddCommentLike(payload)).toThrowError('ADD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddCommentLike object correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // Action
    const AddComment = new AddCommentLike(payload);

    // Assert
    expect(AddComment).toBeInstanceOf(AddCommentLike);
    expect(AddComment.userId).toEqual(payload.userId);
    expect(AddComment.commentId).toEqual(payload.commentId);
    expect(AddComment.threadId).toEqual(payload.threadId);
  });
});
