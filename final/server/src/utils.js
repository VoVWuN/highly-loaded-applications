import { pubClient } from "./server-final.js";

const users = [];

export const makeUsernameKey = (username) => {
  const usernameKey = `username:${username}`;
  return usernameKey;
};
export const createUser = async (username) => {
  const usernameKey = makeUsernameKey(username);
  const nextId = await pubClient.incr("total_users");
  const userKey = `user:${nextId}`;
  await pubClient.set(usernameKey, userKey);
  await pubClient.hSet(userKey, ["username", username, "userId", nextId]);
  await pubClient.sAdd(`${userKey}:rooms`, `${0}`);
  await pubClient.sAdd(`${userKey}:rooms`, `${username}`);

  return {
    username,
    id: nextId,
  };
};
export const deleteUser = async (username, client) => {
  const usernameKey = makeUsernameKey(username);

  if (!usernameKey) return;
  const userKey = await client.get(usernameKey);
  const userId = userKey.split(":")[1];

  await client.del(userKey);
  await client.del(usernameKey);
  await client.del(`${userKey}:rooms`);

  return {
    username,
    userId,
  };
};

export const getPrivateRoomId = (user1, user2) => {
  if (isNaN(user1) || isNaN(user2) || user1 === user2) {
    return null;
  }
  const minUserId = user1 > user2 ? user2 : user1;
  const maxUserId = user1 > user2 ? user1 : user2;
  return `${minUserId}:${maxUserId}`;
};

export const createPrivateRoom = async (user1, user2) => {
  const roomId = getPrivateRoomId(user1, user2);

  if (roomId === null) {
    return [null, true];
  }

  console.log(user1, user2);

  await pubClient.sAdd(`user:${user1}:rooms`, `${roomId}`);
  await pubClient.sAdd(`user:${user2}:rooms`, `${roomId}`);

  return [
    {
      id: roomId,
      names: [
        await pubClient.hmGet(`user:${user1}`, "username"),
        await pubClient.hmGet(`user:${user2}`, "username"),
      ],
    },
    false,
  ];
};