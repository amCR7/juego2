import express from "express";
import cors from "cors";
import db from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors({
  origin: "https://juego2-3.onrender.com"
}));

app.use(express.json());

// Archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

// Obtener todas las parejas
app.get("/api/all-pairs", async (req, res) => {
    const rows = await db.query(`
        SELECT p.id AS pareja_id,
               a.id AS persona1_id, a.nombre AS nombre1, a.foto AS foto1,
               b.id AS persona2_id, b.nombre AS nombre2, b.foto AS foto2
        FROM parejas p
        JOIN personas a ON p.persona1_id = a.id
        JOIN personas b ON p.persona2_id = b.id
        ORDER BY p.id ASC
    `);

    const parejas = rows.map(r => ({
        pareja_id: r.pareja_id,
        persona1: { id: r.persona1_id, nombre: r.nombre1, foto: r.foto1 },
        persona2: { id: r.persona2_id, nombre: r.nombre2, foto: r.foto2 }
    }));

    res.json(parejas);
});

// Guardar elección
app.post("/api/choose", async (req, res) => {
    const { pareja_id, elegido_id, usuario_nombre } = req.body;

    // Registrar usuario si no existe
    let usuario = await db.get("SELECT id FROM usuarios WHERE nombre=?", [usuario_nombre]);
    let usuario_id = usuario ? usuario.id : (await db.run("INSERT INTO usuarios (nombre) VALUES (?)", [usuario_nombre])).lastID;

    // Registrar votación
    await db.run("INSERT INTO elecciones (pareja_id, elegido_id) VALUES (?, ?)", [pareja_id, elegido_id]);
    await db.run("INSERT INTO votos_usuario (usuario_id, pareja_id, elegido_id) VALUES (?, ?, ?)", [usuario_id, pareja_id, elegido_id]);
    await db.run("UPDATE personas SET votos = votos + 1 WHERE id=?", [elegido_id]);

    res.json({ ok: true });
});

// Ranking
app.get("https://juego2-3.onrender.com/api/ranking", async (req, res) => {
    const rows = await db.query("SELECT id, nombre, foto, votos FROM personas ORDER BY votos DESC LIMIT 50");
    res.json(rows);
});

// Servir index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor backend corriendo en 3000");
});
