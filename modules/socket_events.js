const apiFetcher = require('./api_fetcher');

const onSave = async (data, io) => {
  await apiFetcher.sendMessage(
    data.message,
    data.sender,
    data.receiver,
  );
  io.emit(data.receiver);
};
const askForMessage = async (data, io) => {
  const messages = await apiFetcher.getById(
    'messages/senderToReceiver',
    `${data.sender}&${data.receiver}`,
  );
  io.emit(data.receiver, messages);
};
const ack = async (data) => {
  await apiFetcher.delete('messages', data);
};
const connected = async (data, socket) => {
  const user = await apiFetcher.getById('users', data);
  socket.broadcast.emit('user connected', user.user);
};
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
