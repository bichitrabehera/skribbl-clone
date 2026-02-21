import { Server } from "socket.io";

import {
  createRoomIfNotExists,
  addPlayerToRoom,
  removePlayerFromRoom,
  getAllPlayers,
} from "../rooms/roomManager.js";

/**
 * @param {Server} io
 */
export const gameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    socket.on("join_room", ({ username, roomId }) => {
      createRoomIfNotExists(roomId);
      console.log("JOIN EVENT RECEIVED", username, roomId);
      socket.join(roomId);

      addPlayerToRoom(roomId, {
        id: socket.id,
        username,
      });

      const players = getAllPlayers(roomId);

      io.to(roomId).emit("players_updated", players);

      console.log(`${username} joined the room ${roomId}`);
    });

    socket.on("disconnect", () => {
      removePlayerFromRoom(socket.id);
      console.log("user disconnected:", socket.id);
    });
  });
};
