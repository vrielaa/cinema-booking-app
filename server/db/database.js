import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dbDirectory = path.dirname(fileURLToPath(import.meta.url)); // /Users/gfron/cinema-booking-app/server/db
const dbPath = path.join(dbDirectory, "database.sqlite"); // /Users/gfron/cinema-booking-app/server/db/database.sqlite
const schemaPath = path.join(dbDirectory, "schema.sql"); // /Users/gfron/cinema-booking-app/server/db/schema.sql
const seedPath = path.join(dbDirectory, "seed.sql"); // /Users/gfron/cinema-booking-app/server/db/seed.sql

export const db = new Database(dbPath); // Opens or creates the SQLite database file and creates a connection to it.

db.exec(fs.readFileSync(schemaPath, "utf8")); // Creates schema if it does not exist, based on the rules in schema.sql.

/*checking if the database is already populated with movies (we choose to check only movies table,
because if it is populated, then the other tables are probably populated) */
const movieCount = db.prepare("SELECT COUNT(*) AS count FROM movies").get();

if (movieCount.count === 0) {
  db.exec(fs.readFileSync(seedPath, "utf8"));
}
