class DetailCommentLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const { likes } = payload;

    this.likes = likes;
  }

  _verifyPayload({ likes }) {
    if (likes === undefined) {
      throw new Error('DETAIL_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof likes !== 'number') {
      throw new Error('DETAIL_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailCommentLike;
