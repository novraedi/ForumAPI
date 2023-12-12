const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (request) => handler.putCommentLikeHandler(request),
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
