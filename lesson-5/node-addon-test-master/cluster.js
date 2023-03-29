const express = require("express");
const os = require("os");
const cluster = require("cluster");

const app = express();
const host = "localhost";
const port = 7000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (cluster.isMaster) {
  console.log("master");
  let numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    let worker = cluster.fork();
    console.log(`Forking process number ${i}...`);

    worker.send({ message: "Data" });
  }
} else {
  app.listen(port, host, () => {
    console.log(
      `Worker ${cluster.worker.id} is running at http://${host}:${port}`
    );
  });
}