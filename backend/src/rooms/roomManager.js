const rooms = {};

export const createRoomIfNotExists = (roomId) => {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
    };
  }
};

export const addPlayerToRoom = (roomId, player) => {
  rooms[roomId].players.push(player);
};

export const getAllPlayers = (roomId) => {
  if (!rooms[roomId]) {
    return [];
  }
  return rooms[roomId].players;
};

export const removePlayerFromRoom = (socketId) => {
  for (const roomId in rooms) {
    rooms[roomId].players = rooms[roomId].players.filter(
      (player) => player.id !== socketId,
    );
  }

  if (rooms[roomId].players.length == 0) {
    delete rooms[roomId];
  }
};
