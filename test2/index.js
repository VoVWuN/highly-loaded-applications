import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const io = new Server();
const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

io.emit("hello", "to all clients");

io.on("connection", (socket) => {
  console.log("New connection");
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  io.listen(4200);
});