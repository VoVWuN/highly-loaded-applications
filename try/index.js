import express from "express";
import path from "path";
import session from "express-session";
import { Server } from "socket.io";

import { createServer } from "http";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import bodyParser from "express";

const PORT = 4201;
const HOST = "localhost";
const __dirname = process.cwd();

const pubClient = createClient();
pubClient.connect().catch(console.error);

const subClient = pubClient.duplicate();
subClient.connect().catch(console.error);

const sessionMiddleware = session({
  store: new RedisStore({ client: pubClient }),
  secret: "keyboard cat",
  saveUninitialized: true,
  resave: true,
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

(async () => {
  runApp();
})();

async function runApp() {
  app.use(sessionMiddleware);
  app.use("/", express.static(path.join(__dirname, "public")));

  // app.post("/login", async (req, res) => {
  //   // req.session.aithentifacted = true;
  //   // const { name } = req.body;
  //   console.log(req.body);
  //
  //   return res.status(201).json();
  // });

  // app.use(bodyParser.json());
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(sessionMiddleware));
  //
  // io.use((socket, next) => {
  //
  // });

  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("auth", (username) => {
      console.log(username);
    });
  });

  io.adapter(createAdapter(pubClient, subClient));
  httpServer.listen(PORT, () => {
    console.log("Server listening at http://%s:%s", HOST, PORT);
  });
}