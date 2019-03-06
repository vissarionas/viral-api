const fetch = require('node-fetch');

const usersResolver = async (params, accessToken) => {
  try {
    const response = await fetch(`http://127.0.0.1:3000/user?access_token=${accessToken}`, { headers: params });
    if (response.status !== 200) {
      throw (new Error(response.statusText));
    }
    return await response.json();
  } catch (err) {
    return Promise.reject(err);
  }
};

const postsResolver = async (params, accessToken) => {
  try {
    const response = await fetch(`http://127.0.0.1:3000/post?access_token=${accessToken}`, { headers: params });
    if (response.status !== 200) {
      throw (new Error(response.statusText));
    }
    return await response.json();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  usersResolver,
  postsResolver,
};
