const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
  it('should throw error when invoke abstract repository', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Assert
    await expect(() => threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => threadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
