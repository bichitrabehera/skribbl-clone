import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("server running for skribbl clone yahhhh ");
});

export default app;
