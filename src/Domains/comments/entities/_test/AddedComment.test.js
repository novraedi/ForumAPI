const AddedComment = require('../AddedComment');

describe('AddedComment', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'baksoEnak',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'baksoEnak',
      owner: [],
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedcomment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'baksoEnak',
      owner: 'user-123',
    };

    // Action
    const addedcomment = new AddedComment(payload);

    // Assert
    expect(addedcomment).toBeInstanceOf(AddedComment);
    expect(addedcomment.id).toEqual(payload.id);
    expect(addedcomment.content).toEqual(payload.content);
    expect(addedcomment.owner).toEqual(payload.owner);
  });
});
