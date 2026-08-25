import { Router } from "express";
import { db } from "../db/database.js";
import bcrypt from "bcrypt";
import { normalizeString } from "../utils.js";

export const authRouter = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterRequest"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Invalid registration data or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedName = normalizeString(name);

  if (!normalizedName) {
    return res
      .status(400)
      .json({ error: "Name cannot be empty and must be a string." });
  }
  const normalizedEmail = normalizeString(email).toLowerCase();

  if (!normalizedEmail) {
    return res
      .status(400)
      .json({ error: "Email cannot be empty and must be a string." });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be a string with at least 8 characters." });
  }

  const existingUser = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(normalizedEmail);

  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with that email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(normalizedName, normalizedEmail, hashedPassword);

  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "User registered successfully.",
  });
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in and create a server-side session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly cinema session cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Email or password is missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Session could not be created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = normalizeString(email).toLowerCase();

  if (!normalizedEmail || typeof password !== "string" || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Store user information in the session
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to regenerate session." });
    }

    req.session.userId = user.id;

    res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
});

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log out and destroy the current session
 *     security:
 *       - cinemaSession: []
 *     responses:
 *       204:
 *         description: Session destroyed successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Session could not be destroyed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
authRouter.post("/logout", requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to destroy session." });
    }

    res.clearCookie("cinema-session", {
      path: "/",
    });

    return res.sendStatus(204); // No Content
  });
});

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get the current authenticated user
 *     security:
 *       - cinemaSession: []
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *               required:
 *                 - user
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Session user no longer exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
authRouter.get("/me", requireAuth, (req, res) => {
  const user = db
    .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
    .get(req.session.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json({ user });
});

export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  next();
}
