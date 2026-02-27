"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Player {
  username: string;
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isDrawer, setIsDrawer] = useState(false);
  const [word, setWord] = useState<string | null>(null);

  useEffect(() => {
    // 🔥 Make sure this port matches your backend
    socketRef.current = io("http://localhost:8080");

    socketRef.current.on("connect", () => {
      console.log("Connected:", socketRef.current?.id);
      setConnected(true);
    });

    socketRef.current.on("players_updated", (updatedPlayers: Player[]) => {
      const names = updatedPlayers.map((p) => p.username);
      setPlayers(names);
    });

    socketRef.current.on("your_word", (receivedWord: string) => {
      console.log("WORD RECEIVED:", receivedWord);
      setIsDrawer(true);
      setWord(receivedWord);
    });

    socketRef.current.on("game_started", () => {
      setIsDrawer(false);
      setWord(null);
    });

    socketRef.current.on("disconnect", () => {
      setConnected(false);
      setJoined(false);
      setPlayers([]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (!username || !roomId) return;
    socketRef.current?.emit("join_room", { username, roomId });
    setJoined(true);
  };

  const startGame = () => {
    socketRef.current?.emit("start_game", roomId);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Skribbl Clone</h1>

      {!joined ? (
        <>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <br />
          <input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <br />
          <br />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <>
          <p>
            Joined room: <strong>{roomId}</strong>
          </p>

          <h3>Players ({players.length})</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                {player} {player === username && "(You)"}
              </li>
            ))}
          </ul>

          {players.length >= 2 && (
            <>
              <br />
              <button onClick={startGame}>Start Game</button>
            </>
          )}

          <hr />

          {isDrawer && word && (
            <p>
              🎨 You are drawing. Word: <strong>{word}</strong>
            </p>
          )}

          {!isDrawer && word === null && <p>Waiting for drawing...</p>}
        </>
      )}

      <hr />
      <p>Connected: {connected ? "Yes" : "No"}</p>
    </div>
  );
}
