import { Router } from "express";
import { db } from "../db/database.js";

export const roomsRouter = Router();

roomsRouter.get("/", (req, res) => {
  const rooms = db.prepare("SELECT * FROM rooms").all();
  res.json(rooms);
});

roomsRouter.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const room = db.prepare("SELECT * FROM rooms WHERE id = ?").get(roomId);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json(room);
});
