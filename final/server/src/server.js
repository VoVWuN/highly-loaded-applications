import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { IMessage } from "./message-interface";
import path from "path";
import { createClient } from "redis";
import { createUser } from "./utils";
import { createAdapter } from "@socket.io/redis-adapter";
import { create } from "domain";
import session from "express-session";
import RedisStore from "connect-redis";
import bodyParser from "body-parser";

const PORT = 4201;
const HOST = "localhost";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// const sessionMiddleware = session({
//   store: new RedisStore({ client: pubClient }),
//   secret: "test",
//   saveUninitialized: true,
//   resave: true,
// });

const pubClient = createClient({ url: "redis://127.0.0.1:6379" });
const subClient = pubClient.duplicate();

const initPubSub = () => {
  subClient.on("message", (channel, message) => {
    io.emit("test", message);
  });

  subClient.subscribe("MESSAGES", (message) => {
    console.log(message);
  });
};

(async () => {
  const totalUserKeyExist = await pubClient.exists("total_users");

  if (totalUserKeyExist) {
  }
  await pubClient.set("total_users", 0);

  runApp();
})();

async function runApp() {
  app.use(bodyParser.json());

  // Static folder
  app.use("/", express.static(path.join(__dirname, "public")));

  initPubSub();

  app.use(
    session({
      store: new RedisStore({ client: pubClient }),
      secret: "test",
      saveUninitialized: true,
      resave: true,
    })
  );

  io.use((socket, next) => {
    /** @ts-ignore */
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  io.on("connection", async (socket) => {
    console.log(socket.request);
    const username = socket.id.slice(0, 5);
    console.log(`New connection user: ${username}`);

    // await createUser(username, pubClient);

    // io.emit("notification", {
    //   msg: `user ${username} connected.`,
    // });
    //
    // subClient.on("message", (channel, message) => {
    //   io.to(channel).emit("message", message);
    // });
    //
    // let UID: string | null = null;
    // // Авторизация пользователя
    // socket.on("auth", async (username: string) => {
    //   UID = username;
    //
    //   await subClient.subscribe(UID, (message, channel) => {});
    //
    //   await socket.join(UID);
    // });
    //
    // socket.on("writeYourself", (message) => {
    //   console.log(UID, message);
    //   if (UID) pubClient.publish(UID, message);
    // });
    //
    // await subClient.subscribe("messageChannel", (message, channel) => {
    //   console.log(message, channel);
    // });
    //
    // socket.on("join", (roomId: string) => {
    //   socket.join(roomId);
    // });
    //
    // socket.on("chatMessage", async (data) => {
    //   await pubClient.publish("messageChannel", JSON.stringify(data));
    // });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      io.emit("notification", {
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

  // httpServer.listen(PORT, HOST, () => {
  //   console.log("Server listening at http://%s:%s", HOST, PORT);
  // });
}