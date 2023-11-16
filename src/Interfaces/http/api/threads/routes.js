const routes = (handler) => ([
    {
      method: 'POST',
      path: '/threads',
      handler: handler.postThreadHandler,
      options: {
        auth: 'forumapi_jwt',
      },
    },
    {
      method: 'GET',
      path: '/threads/{threadId}',
      handler: handler.getDetailThreadByIdHandler,
    },
  ]);
  
  module.exports = routes;
  