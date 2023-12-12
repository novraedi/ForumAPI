const DetailCommentLike = require('../DetailCommentLike');

describe('DetailCommentLike', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new DetailCommentLike(payload)).toThrowError('DETAIL_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    // Arrange
    const payload = {
      likes: true,
    };

    // Action and Assert
    expect(() => new DetailCommentLike(payload)).toThrowError('DETAIL_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('shoudl create DetailCommentLike object correctly', () => {
    // Arrange
    const payload = {
      likes: 12,
    };

    // Action
    const detailCommentLike = new DetailCommentLike(payload);

    // Assert
    expect(detailCommentLike).toBeInstanceOf(DetailCommentLike);
    expect(detailCommentLike.likes).toEqual(payload.likes);
  });
});
