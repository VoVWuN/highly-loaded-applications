const socket = io("http://localhost:4201");
const form = document.querySelector("#send-form");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const userPreview = document.getElementById("userList");
const msgPreview = document.getElementById("messages");
const notePreview = document.getElementById("notifications");
const block = document.getElementById("block");

// const roomId = socket.id.split("").reverse().join("").slice(0, 5);

socket.on("connect", () => {
  const roomId = "testRoom";
  const username = socket.id.slice(0, 5);
  console.log("user connected: user:", username);

  document.getElementById("login").addEventListener("click", () => {
    axios.post("/login", { username }).then((response) => {
      console.log(response);
      return response.data;
    });
  });

  socket.emit("auth", username);
});

// // Авторизация

// // передача номера комнаты
// socket.emit("join", roomId);

//   const submitHandler = (event) => {
//     event.preventDefault();
//     const msg = event.target.elements.input.value;
//
//     socket.emit("writeYourself", msg);
//     // socket.emit("chatMessage", { message: msg, roomId: roomId });
//     event.target.elements.input.value = "";
//   };
//
//   // Отправка сообщения
//   form?.addEventListener("submit", submitHandler);
// });

// // Обработка сообщения
// socket.on("message", ({ message }) => {
//   addMessage(message);
// });

// // Событие отключения
// socket.on("disconnect", () => {
//   console.log("User disconnected");
// });

// Событие уведомления
// socket.on("notification", ({ msg }) => {
//   console.log("notification", msg);
//   const msgSpan = (document.createElement("span").innerHTML = msg);
//   notePreview?.append(msgSpan);
//   notePreview?.append(document.createElement("br"));
// });

const addMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message", "border", "p-2", "inline-block");

  div.innerHTML = `
  <p class="meta">
    <span> User</span>
   <span> 10 pm</span> 
  </p>
  <p class="text">
    ${message}
  </p>
  `;
  msgPreview?.appendChild(div);
};