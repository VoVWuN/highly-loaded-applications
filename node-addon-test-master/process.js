const { exec, execFile, spawn, fork } = require("child_process");
const os = require("os");

// exec =================================================================

// exec("node -v", (error, stdout, stderr) => {
//   if (error) {
//     console.log(stderr);
//   } else {
//     console.log(stdout);
//   }
// });

// const someProcess = exec('"/path/test_file/some.sh" arg1 arg2', {});
//
// exec("cat *.js | wc -l", (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });

// execFile =================================================================

// execFile("node", ["-v"], (error, stdout, stderr) => {
//   if (error) {
//     throw error;
//   }
//   console.log(stdout);
// });

// spawn =================================================================

// const ls = spawn("ls", ["-lh", "/usr"]);
//
// ls.stdout.on("data", (data) => {
//   console.log(`stdout: ${data}`);
// });
//
// ls.stderr.on("data", (data) => {
//   console.error(`stderr: ${data}`);
// });
//
// ls.on("close", (code) => {
//   console.log("finish result:", code);
// });

// fork =================================================================

// if (process.argv[2] === "child") {
//   setTimeout(() => {
//     console.log(`Запущен процесс ${process.argv[2]}!`);
//   }, 1_000);
// } else {
//   const controller = new AbortController();
//   const { signal } = controller;
//   const child = fork("index.ts", ["child"], { signal });
//
//   child.on("error", (err) => {
//     console.log(err);
//   });
// }

const numCPUs = os.cpus().length;

console.log(numCPUs);