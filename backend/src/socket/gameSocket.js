import { Server } from "socket.io";

import {
  createRoomIfNotExists,
  addPlayerToRoom,
  removePlayerFromRoom,
  getAllPlayers,
  startGame,
  getRooms,
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

    socket.on("start_game", (roomId) => {
      const players = getAllPlayers(roomId);

      if (!players || players.length < 2) {
        console.log(`not enough players`);
        return;
      }

      const words = ["apple", "banana", "mango"];

      const randomWord = words[Math.floor(Math.random() * words.length)];

      startGame(roomId, randomWord);

      const room = getRooms(roomId);

      const drawer = room.players[room.currentDrawerIndex];

      io.to(drawer.id).emit("your_word", randomWord);

      io.to(roomId).emit("game_started");

      console.log(`game started`);
      console.log("Players:", players);
      console.log("Drawer index:", room.currentDrawerIndex);
      console.log("Drawer object:", drawer);
      console.log("Drawer socket id:", drawer.id);
      console.log("Random word:", randomWord);
    });

    socket.on("disconnect", () => {
      removePlayerFromRoom(socket.id);
      console.log("user disconnected:", socket.id);
    });
  });
};
