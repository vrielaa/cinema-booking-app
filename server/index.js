import express from "express";
import { bookingsRouter } from "./routes/bookings.js";
import { moviesRouter } from "./routes/movies.js";
import { screeningsRouter } from "./routes/screenings.js";

const app = express();
const port = 3001;

app.use(express.json());

app.use("/api/movies", moviesRouter);
app.use("/api/screenings", screeningsRouter);
app.use("/api/bookings", bookingsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
