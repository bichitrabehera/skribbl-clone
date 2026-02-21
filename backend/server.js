import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./src/app.js";
import { gameSocket } from "./src/socket/gameSocket.js";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

gameSocket(io);

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});