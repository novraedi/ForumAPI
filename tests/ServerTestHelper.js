/* istanbul ignore file */

const ServerTestHelper = {
    async getAccessTokenAndUserId({ server }) {
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding Indonesia',
      };
  
      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
  
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: userPayload,
      });
  
      const { id } = (JSON.parse(responseUser.payload)).data.addedUser;
      const { accessToken } = (JSON.parse(responseAuth.payload)).data;
      return { id, accessToken };
    },
  };
  
  module.exports = ServerTestHelper;
  