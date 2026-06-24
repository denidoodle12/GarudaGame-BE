import CreateReply from '../CreateReply.js';

describe('a CreateReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      content: true,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'secret',
      owner: 'user-123',
    };

    // Action
    const { commentId, content, owner } = new CreateReply(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
