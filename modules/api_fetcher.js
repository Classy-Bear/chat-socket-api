const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
});

const apiFetcher = {
  getAll: (route) => instance
    .get(`/${route}`)
    .then((res) => res.data)
    .catch((error) => error),
  getById: (route, id) => instance
    .get(`/${route}/${id}`)
    .then((res) => res.data)
    .catch((error) => error),
  createUser: (user) => instance
    .post('/users', { user })
    .then((res) => res.data)
    .catch((error) => error),
  sendMessage: (message, sender, receiver) => instance
    .post('/messages', { message, sender, receiver })
    .then((res) => res.data)
    .catch((error) => error),
  updateUser: (id, newUser) => instance
    .put('/users', { id, newUser })
    .then((res) => res.data)
    .catch((error) => error),
  delete: (route, id) => instance
    .delete(`/${route}/${id}`)
    .then((res) => res.data)
    .catch((error) => error),
};

module.exports = apiFetcher;
