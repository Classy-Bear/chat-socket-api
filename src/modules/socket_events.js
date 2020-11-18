const apiFetcher = require('./api_fetcher');

/** @module socket_events */

/**
 * Saves the incomming message to the database and emits and event with the
 * receiver id.
 *
 * The Socket client should listen to its own ID. The incoming data will be
 * all messages from the listener ID. The customer will receive the message if
 * its is online, if not, the message will remain saved in the database until
 * the client ask for it again.
 * @see askForMessage
 * @param {Object} data - Incomming message.
 * @param {Object} io - Socket instance.
 */
const onSave = async (data, io) => {
  await apiFetcher.sendMessage(
    data.message,
    data.sender,
    data.receiver,
  );
  io.emit(data.receiver);
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
  const messages = await apiFetcher.getMessagesFromSenderToReceiver(
    data.sender, data.receiver
  );
	if(messages) {
		io.emit(data.receiver, messages);
	}
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
  await apiFetcher.deleteRequest('messages', data);
};
/**
 * Broadcasts to all users that an user has connected.
 * @see {@link https://socket.io/docs/v3/server-api/index.html#Flag-‘broadcast’|Flag:’broadcast’}
 * @param {Object} data - User that connected.
 * @param {Object} socket - Socket connection with client.
 */
const connected = async (data, socket) => {
  const user = await apiFetcher.getById('users', data);
  socket.broadcast.emit('user connected', user.user);
};
/**
 * Broadcasts to all users that an user has disconnected.
 * @see {@link https://socket.io/docs/v3/server-api/index.html#Flag-‘broadcast’|Flag:’broadcast’}
 * @param {Object} data - User that disconnected.
 * @param {Object} socket - Socket connection with client.
 */
const disconnected = async (data, socket) => {
  const user = await apiFetcher.getById('users', data);
  socket.broadcast.emit('user disconnected', user.user);
};

module.exports = {
  onSave,
  askForMessage,
  ack,
  connected,
  disconnected,
};
