/* eslint-disable no-param-reassign */
const DetailCommentLike = require('../../Domains/likes/entities/DetailCommentLike');

class GetDetailThread {
  constructor({
    threadRepository, commentRepository, repliesRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParam) {
    const thread = await this._threadRepository.getThreadById(useCaseParam);
    const threadComments = await this._commentRepository.getAllCommentByThreadId(useCaseParam);
    const threadReplies = await this._repliesRepository.getRepliesByThreadId(useCaseParam);
    const threadLikes = await this._likeRepository.getCommentLikesCountByThreadId(useCaseParam);
    this._addLikesToComment(threadComments, threadLikes);
    this._filterDeletedComment(threadComments);
    this._filterDeletedReplies(threadReplies);
    this._addRepliesToComment(threadComments, threadReplies);
    thread.comments = threadComments;
    return thread;
  }

  _filterDeletedComment(comments) {
    comments.forEach((comment) => {
      comment.content = comment.is_deleted ? '**komentar telah dihapus**' : comment.content;
      delete comment.is_deleted;
    });
  }

  _filterDeletedReplies(replies) {
    replies.forEach((reply) => {
      reply.content = reply.is_deleted ? '**balasan telah dihapus**' : reply.content;
      delete reply.is_deleted;
    });
  }

  _addLikesToComment(threadComments, threadLikes) {
    threadComments.forEach((comment) => {
      comment.likeCount = new DetailCommentLike(
        threadLikes.filter((like) => like.comment_id === comment.id)[0],
      ).likes;
    });
  }

  _addRepliesToComment(threadComments, threadReplies) {
    threadComments.forEach((comment) => {
      comment.replies = [];
      threadReplies.forEach((reply) => {
        if (reply.comment_id === comment.id) {
          comment.replies.push(reply);
        }
        delete reply.comment_id;
      });
    });
  }
}

module.exports = GetDetailThread;
