const socket = io("http://localhost:3000");
const form = document.querySelector("#send-form");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const userPreview = document.getElementById("userList");
const groupPreview = document.getElementById("groupslist");
const msgPreview = document.getElementById("messages");
const notePreview = document.getElementById("notifications");
const block = document.getElementById("block");
const title = document.getElementById("title");

// const roomId = socket.id.split("").reverse().join("").slice(0, 5);

let currentRoom = "0";

socket.on("connect", () => {
  const username = socket.id.slice(0, 5);
  console.log("user connected: user:", username);
  title.innerText = `List of messages: ${currentRoom}`;

  // Авторизация
  socket.emit("auth", username);

  // передача номера комнаты
  socket.emit("join", currentRoom);
});

socket.on("getMessages", async (messages) => {
  msgPreview.innerText = "";
  if (messages.length) {
    messages.forEach((message) => {
      addMessage(JSON.parse(message));
    });
  }
});

const submitHandler = (event) => {
  event.preventDefault();
  const username = socket.id.slice(0, 5);
  const msg = event.target.elements.input.value;

  // socket.emit("chatMessage", msg);
  socket.emit("chatMessage", {
    message: msg,
    roomId: currentRoom,
    username: username,
  });
  event.target.elements.input.value = "";
};

// Отправка сообщения
form?.addEventListener("submit", submitHandler);

// Обработка сообщения
socket.on("message", (sendMessage) => {
  addMessage(sendMessage);

  msgPreview.scrollTop = msgPreview.scrollHeight;
});

// Событие отключения
socket.on("disconnect", () => {
  console.log("User disconnected");
});

socket.on("getGroups", async (data) => {
  groupPreview.innerHTML = "";

  await data.forEach((group) => {
    const groupSpan = document.createElement("li");
    groupSpan.classList.add(
      "group",
      "flex",
      "border",
      "border-red-300",
      "gap-3",
      "p-2"
    );
    groupSpan.innerHTML = `
    <p class="group-name text-sm">${group}</p>
    <button class="groupButton bg-blue-500 text-white text-sm p-0.5">Выбрать активной</button>
    `;
    groupPreview.append(groupSpan);
  });

  await document.querySelectorAll(".groupButton").forEach((btn) =>
    btn.addEventListener("click", (event) => {
      const value = event.target
        .closest(".group")
        .querySelector(".group-name").innerText;
      currentRoom = value;
      title.innerText = `List of messages: ${currentRoom}`;
      socket.emit("getRoom", currentRoom);
      socket.emit("join", currentRoom);
    })
  );
});

// Событие уведомления
// socket.on("notification", ({ msg }) => {
//   console.log("notification", msg);
//   const msgSpan = (document.createElement("span").innerHTML = msg);
//   notePreview?.append(msgSpan);
//   notePreview?.append(document.createElement("br"));
// });

const addMessage = (sendMessage) => {
  const div = document.createElement("div");
  div.classList.add("message", "border", "p-2", "inline-block");

  div.innerHTML = `
  <p class="meta">
    <span>User ${sendMessage.username}</span>
   <span>${new Date(sendMessage.date).toTimeString()}</span> 
  </p>
  <p class="text">
    ${sendMessage.message}
  </p>
  `;
  msgPreview.appendChild(div);
};