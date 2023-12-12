const ReplyRepository = require('../RepliesRepository');

describe('ReplyRepository', () => {
  it('should throw error when invoke abstract object', async () => {
    const replyRepository = new ReplyRepository();

    await expect(() => replyRepository.addReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replyRepository.verifyReplyAccess({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replyRepository.getRepliesByThreadId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replyRepository.checkReplyIsExist({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replyRepository.deleteReplyById('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
