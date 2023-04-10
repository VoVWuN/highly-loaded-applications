import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import {
  createPrivateRoom,
  createUser,
  deleteUser,
  getPrivateRoomId,
} from "./utils.js";
import moment from "moment/moment.js";
import { createAdapter } from "@socket.io/redis-adapter";
import bodyParser from "body-parser";
import path from "path";

const PORT = 4200;
const HOST = "localhost";
const __dirname = process.cwd();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "src/public")));

export const pubClient = createClient({ url: "redis://127.0.0.1:6379" });
export const subClient = pubClient.duplicate();

pubClient.on("ready", () => {
  console.log("Publisher connected to redis and ready to use");
  pubClient.flushAll();
});
subClient.on("ready", () => {
  console.log("Subscriber connected to redis and ready to use");
});

// =================================================================

let users = [];
let otherUsers = [];
const rooms = {};
let currentRoom = 0;

// =================================================================
io.on("connection", async (socket) => {
  const id = socket.id;
  const username = socket.id.slice(0, 5);
  console.log(`New connection user: ${username}`);

  socket.broadcast.emit("notification", {
    msg: `user ${username} connected.`,
  });

  // Для чего вообще это делается я так и не понял

  // subClient.on("chatMessage", (channel, message) => {
  //   console.log(channel, message);
  //   // io.to(channel).emit("message", message);
  // });

  let UID = null;
  // Авторизация пользователя
  socket.on("auth", async (username) => {
    UID = username;

    // Создание пользователей
    const user = await createUser(UID, pubClient);
    users.push(user);
    // console.log("all users online:", users);

    await subClient.subscribe(UID, (message, channel) => {
      // console.log("subscribe:", message, channel);
    });

    // Создание комнат с парами юзеров
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      otherUsers = users.filter((x) => x.id !== user.id);

      for (let index = 0; index < otherUsers.length; index++) {
        const otherUser = otherUsers[index];
        let privateRoomId = getPrivateRoomId(user.id, otherUser.id);
        let room = rooms[privateRoomId];
        if (room === undefined) {
          const res = await createPrivateRoom(user.id, otherUser.id);
          room = res[0];
          rooms[privateRoomId] = room;
        }
      }
    }

    // Передача клиенту списка комнат
    const groups = await pubClient.sMembers(`user:${user.id}:rooms`);
    socket.emit("getGroups", groups);

    await socket.join(UID);
    await socket.join(currentRoom);
  });

  socket.on("getRoom", (room) => {
    currentRoom = room;
  });

  socket.on("join", async (roomId) => {
    console.log("join to room", roomId);

    let messages = [];
    const roomKey = `room:${roomId}`;
    const roomExists = await pubClient.exists(roomKey);
    if (roomExists) {
      messages = await pubClient.zRange(roomKey, 0, 50);
    }

    socket.emit("getMessages", messages);

    await subClient.subscribe(roomId, (message, channel) => {
      // console.log("subscribe:", message, channel);
    });

    socket.join(roomId);
  });

  socket.on(
    "chatMessage",
    async ({ message, roomId, username }, timestamp = moment().unix()) => {
      const sendMessage = {
        message: message,
        username: username,
        date: timestamp,
        roomId,
      };
      const messageString = JSON.stringify(sendMessage);
      const roomKey = `room:${sendMessage.roomId}`;

      await pubClient.zAdd(roomKey, {
        score: `${sendMessage.date}`,
        value: messageString,
      });

      await pubClient.publish(roomId, JSON.stringify(message));
      io.to(roomId).emit("message", sendMessage);
    }
  );

  socket.on("disconnect", async () => {
    console.log("user disconnected");

    const user = await deleteUser(username, pubClient);

    const newClients = users.filter(
      (client) => client.username !== user.username
    );
    users = newClients;

    socket.broadcast.emit("notification", {
      msg: `user ${username} left.`,
    });
  });
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  httpServer.listen(PORT, HOST, () => {
    console.log("Server listening at http://%s:%s", HOST, PORT);
  });
});