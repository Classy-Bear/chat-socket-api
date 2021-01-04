const apiFetcher = require('./api_fetcher');
const chalk = require('chalk');

/** @module socket_events */

/**
 * Saves the incomming message to the database and emits and event with the
 * receiver id.
 *
 * If the receiver id is not listening to its own id then it will not receive
 * the message, if the receiver is not connected then the message will be kept
 * stored in the database so it can be asked again for it later.
 * @param {Object} data - Incomming message.
 * @param {Object} io - Socket instance.
 */
const createdMessage = async (data, io) => {
	console.log(chalk.blue('createdMessage'));
	console.log(data);
  const response = await apiFetcher.sendMessage(
    data.message,
    data.sender,
    data.receiver,
    data.sendDate,
    data.dateOffset,
  );
  io.emit(data.receiver);
};
/**
 * Emits a user that has been created so users that are logged in can chat with
 * him.
 *
 * @param {Object} data - Created user.
 * @param {Object} io - Socket instance.
 */
const createdUser = (data, socket) => {
	console.log(chalk.blue('createdUser'));
	console.log(chalk.bgBlue(data));
	const { id, user } = data;
  socket.broadcast.emit('onCreatedUser', { id, user });
};
/**
 * Deletes a user from the database and emits the user id to let know everyone
 * the user has been deleted.
 *
 * @param {Object} data - User id.
 */
const deletedUser = async (data, socket) => {
	console.log(chalk.blue('deletedUser'));
	console.log(chalk.bgBlue(data));
  socket.broadcast.emit('onDeletedUser', data);
};
/**
 * Updates an user from the database and emits the user object to let know
 * everyone the user has been updated.
 *
 * @param {Object} data - Message to be deleted.
 */
const updatedUser = async (data, socket) => {
  socket.broadcast.emit('onUpdatedUser', data);
	console.log(chalk.blue('updatedUser'));
  await apiFetcher.updateUser(data.id, data.user);
	console.log(chalk.bgBlue(data));
};
/**
 * Emits all received messages from a sender.
 *
 * This method should be trigger if the user is online/connected (socket event)
 * , never when is offline/disconnected (socket event).
 * @see {@link https://socket.io/docs/v3/client-api/index.html#socket-connected|socket.connected}
 * @see {@link https://socket.io/docs/v3/client-api/index.html#socket-disconnected|socket.disconnected}
 * @param {Object} data - Contains the receiver and sender ID.
 * @param {Object} io - Socket instance.
 */
const askForMessage = async (data, io) => {
	const users = await apiFetcher.getAll('users');
	users.forEach(async (user) => {
  	const messages = await apiFetcher.getMessagesFromSenderToReceiver(
    	user.id, data
  	);
		console.log(chalk.blue('askForMessage'));
		console.log(messages);
		if(messages) {
			messages.forEach((message) => {
				io.emit(data, messages);
			});
		}
	});
};
/**
 * Deletes a message from the database.
 *
 * Once a message is received it can be acknowledge, by the receiver. We don't
 * want to hold any data from the user. It should be deleted from the server
 * once the user receive it.
 * @param {Object} data - Message to be deleted.
 */
const ack = async (data) => {
	console.log(chalk.blue('ack'));
	console.log(chalk.bgBlue(data));
  await apiFetcher.deleteRequest('messages', data);
};

module.exports = {
  createdMessage,
	createdUser,
	deletedUser,
	updatedUser,
  askForMessage,
  ack
};
