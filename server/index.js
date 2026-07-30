import express from "express";
import { bookingsRouter } from "./routes/bookings.js";
import { moviesRouter } from "./routes/movies.js";
import { screeningsRouter } from "./routes/screenings.js";
import { roomsRouter } from "./routes/rooms.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/movies", moviesRouter);
app.use("/api/screenings", screeningsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/rooms", roomsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
