const axios = require('axios');

/** @module api_fetcher */

/**
 * Creating a new instance of axios with a custom config.
 * @private
 */
const instance = axios.create({
	baseURL: process.env.URL || 'http://10.0.0.41:5000',
  timeout: 5000,
});

/**
 * Handle incomming HTTP response.
 * @private
 */
async function api(request) {
  let data;
	try {
		const res = await request;
		data = res.data;
	} catch {
		data = null;
	}
  return data;
}

/**
 * Get all the users or messages. This depends on the name of the
 * route parameter.
 *
 * @param {String} route - It can be 'user' or 'message'.
 */
const getAll = (route) => api(instance.get(`/${route}`));
/**
 * Get a user or message by id. This depends on the name of the route
 * parameter.
 *
 * @param {String} route - It can be 'user' or 'message'.
 * @param {String} id - ID of message to get.
 */
const getById = (route, id) => api(instance.get(`/${route}/${id}`));
/**
 * Get all the messages from a sender to a receiver.
 *
 * @param {String} sender
 * @param {String} receiver
 */
const getMessagesFromSenderToReceiver = (sender, receiver) => api(instance.get(`/messages/senderToReceiver/${sender}&${receiver}`));
/**
 * Creates a user.
 *
 * @param user {Object}
 */
const createUser = (user) => api(instance.post('/users', { user }));
/**
 * Creates a message.
 *
 * @param message {String}
 * @param sender {String}
 * @param receiver {String}
 */
const sendMessage = (message, sender, receiver, sendDate, dateOffset) => api(instance.post('/messages', { message, sender, receiver, sendDate, dateOffset }));
/**
 * Updates a user.
 *
 * @param id {String}
 * @param newUser {String}
 */
const updateUser = (id, newUser) => api(instance.put('/users', { id, newUser }));
/**
 * Deletes a user or message. This depends on the name of the route parameter.
 *
 * @param route {String}
 * @param id {String}
 */
const deleteRequest = (route, id) => api(instance.delete(`/${route}/${id}`));

module.exports = {
  getAll,
  getById,
	getMessagesFromSenderToReceiver,
  createUser,
  sendMessage,
  updateUser,
  deleteRequest,
};
