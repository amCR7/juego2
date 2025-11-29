import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await open({
  filename: path.join(__dirname, "database.sqlite"),
  driver: sqlite3.Database
});

// Crear tablas si no existen
await db.exec(`
CREATE TABLE IF NOT EXISTS personas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    foto TEXT,
    votos INTEGER DEFAULT 0
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS parejas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    persona1_id INTEGER NOT NULL,
    persona2_id INTEGER NOT NULL,
    FOREIGN KEY (persona1_id) REFERENCES personas(id),
    FOREIGN KEY (persona2_id) REFERENCES personas(id)
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS elecciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pareja_id INTEGER NOT NULL,
    elegido_id INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pareja_id) REFERENCES parejas(id),
    FOREIGN KEY (elegido_id) REFERENCES personas(id)
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS votos_usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    pareja_id INTEGER NOT NULL,
    elegido_id INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (pareja_id) REFERENCES parejas(id),
    FOREIGN KEY (elegido_id) REFERENCES personas(id)
);
`);

export default db;
