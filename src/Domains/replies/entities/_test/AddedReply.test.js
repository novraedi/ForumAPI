const AddedReply = require('../AddedReply');

describe('AddedReply', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'Replies-123',
      content: 'Kenyang',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'replies-123',
      content: 'Mantap',
      owner: true,
    };

    /// Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'replies-123',
      content: 'Mantap',
      owner: 'user-123',
    };

    // Action
    const addedReplies = new AddedReply(payload);

    // Assert
    expect(addedReplies).toBeInstanceOf(AddedReply);
    expect(addedReplies.id).toEqual(payload.id);
    expect(addedReplies.content).toEqual(payload.content);
    expect(addedReplies.owner).toEqual(payload.owner);
  });
});
