const api_fetcher = require("./api_fetcher");

class SocketsEvents {
  constructor() {}

  async onSave(data, io) {
    await api_fetcher.sendMessage(
      data["message"],
      data["sender"],
      data["receiver"]
    );
    io.emit(data["receiver"]);
  }

  async askForMessage(data, io) {
    const messages = await api_fetcher.getById(
      "messages/sender_receiver",
      `${data["sender"]}&${data["receiver"]}`
    );
    io.emit(data["receiver"], messages);
  }

  async ack(data) {
    await api_fetcher.delete("messages", data);
  }

  async connected(data, socket) {
    const user = await api_fetcher.getById("users", data);
    socket.broadcast.emit("user connected", user["user"]);
  }

  async disconnected(data, socket) {
    const user = await api_fetcher.getById("users", data);
    socket.broadcast.emit("user disconnected", user["user"]);
  }
}

module.exports = SocketsEvents;
