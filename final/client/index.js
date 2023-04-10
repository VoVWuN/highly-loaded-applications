import express from "express";
import { createServer } from "http";
import path from "path";
import cors from "cors";

const __dirname = process.cwd();

const PORT = +process.argv[2] || 4201;
const HOST = "localhost";

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    allowedHeaders: ["Access-Control-Allow-Origin", "*"],
  })
);
app.use(express.static(path.join(__dirname, "public")));

httpServer.listen(PORT, HOST, () => {
  console.log("Server listening at http://%s:%s", HOST, PORT);
});