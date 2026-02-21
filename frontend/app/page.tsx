"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Player {
  username: string;
}

let socket: Socket;

export default function Home() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("players_update", (updatedPlayers: Player[]) => {
      const names = updatedPlayers.map((p) => p.username);
      setPlayers(names);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setJoined(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (!username || !roomId) return;

    socket.emit("join_room", { username, roomId });
    setJoined(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          🎨 Skribbl Clone
        </h1>

        {!joined ? (
          <>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={joinRoom}
              className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold"
            >
              Join Room
            </button>
          </>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-green-600/20 border border-green-500 rounded-lg text-green-400 text-sm">
              ✅ You joined room <strong>{roomId}</strong>
            </div>

            <h2 className="text-lg font-semibold mb-2">
              Players ({players.length})
            </h2>

            <ul className="space-y-2">
              {players.map((player, index) => (
                <li key={index} className="bg-gray-800 px-4 py-2 rounded-lg">
                  {player}
                  {player === username && (
                    <span className="ml-2 text-xs text-purple-400">(You)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>
    </div>
  );
}
