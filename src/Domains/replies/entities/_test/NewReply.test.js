const NewReply = require('../NewReply');

describe('NewReply', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'steakEnak',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'steakEnak',
      owner: {},
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new replies object correctly', () => {
    // Arrange
    const payload = {
      content: 'steakEnak',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const newReplies = new NewReply(payload);

    // Assert
    expect(newReplies).toBeInstanceOf(NewReply);
    expect(newReplies.content).toEqual(payload.content);
    expect(newReplies.owner).toEqual(payload.owner);
    expect(newReplies.commentId).toEqual(payload.commentId);
  });
});
