import session from "express-session";
import createSqliteStore from "better-sqlite3-session-store";
import { db } from "./db/database.js";

const SqliteStore = createSqliteStore(session);

export const sessionStore = new SqliteStore({
  client: db,
  expired: {
    clear: true,
    intervalMs: 15 * 60 * 1000,
  },
});
