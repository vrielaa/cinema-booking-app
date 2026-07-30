import { Router } from "express";
import { db } from "../db/database.js";

export const roomsRouter = Router();

/**
 * @openapi
 * /api/rooms:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get all cinema rooms
 *     responses:
 *       200:
 *         description: A list of all cinema rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Room"
 */
roomsRouter.get("/", (req, res) => {
  const rooms = db.prepare("SELECT * FROM rooms").all();
  res.json(rooms);
});

/**
 * @openapi
 * /api/rooms/{roomId}:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get a cinema room by ID
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Cinema room details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Room"
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
roomsRouter.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const room = db.prepare("SELECT * FROM rooms WHERE id = ?").get(roomId);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json(room);
});
