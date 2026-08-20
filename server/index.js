import express from "express";
import session from "express-session";
import { bookingsRouter } from "./routes/bookings.js";
import { moviesRouter } from "./routes/movies.js";
import { screeningsRouter } from "./routes/screenings.js";
import { roomsRouter } from "./routes/rooms.js";
import { sessionStore } from "./sessionStore.js";
import { authRouter } from "./routes/auth.js";
import dotenv from "dotenv";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

dotenv.config();

const app = express();
const port = 3000;
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is not set.");
}

app.use(express.json());
app.use(
  session({
    name: "cinema-session",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/",
    },
  }),
);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/movies", moviesRouter);
app.use("/api/screenings", screeningsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
