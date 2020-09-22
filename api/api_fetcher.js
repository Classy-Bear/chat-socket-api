const axios = require("axios");

const _instance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
});

const api_fetcher = {
  getAll: (route) =>
    _instance
      .get(`/${route}`)
      .then((res) => res.data)
      .catch((error) => error),
  getById: (route, id) =>
    _instance
      .get(`/${route}/${id}`)
      .then((res) => res.data)
      .catch((error) => error),
  createUser: (user) =>
    _instance
      .post("/users", { user })
      .then((res) => res.data)
      .catch((error) => error),
  sendMessage: (message, sender, receiver) =>
    _instance
      .post("/messages", { message, sender, receiver })
      .then((res) => res.data)
      .catch((error) => error),
  updateUser: (uuid, newUser) =>
    _instance
      .put("/users", { uuid, newUser })
      .then((res) => res.data)
      .catch((error) => error),
  delete: (route, uuid) =>
    _instance
      .delete(`/${route}/${uuid}`)
      .then((res) => res.data)
      .catch((error) => error),
};

module.exports = api_fetcher;

