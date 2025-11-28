import express from "express";
import cors from "cors";
import db from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

// Endpoint: todas las parejas ordenadas
app.get("/api/all-pairs", async (req, res) => {
    const [rows] = await db.query(`
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

    // 1️⃣ Registrar usuario si no existe
    const [usuarioRows] = await db.query(
        "SELECT id FROM usuarios WHERE nombre = ?",
        [usuario_nombre]
    );

    let usuario_id;
    if (usuarioRows.length === 0) {
        const [result] = await db.query(
            "INSERT INTO usuarios (nombre) VALUES (?)",
            [usuario_nombre]
        );
        usuario_id = result.insertId;
    } else {
        usuario_id = usuarioRows[0].id;
    }

    // 2️⃣ Registrar la votación
    await db.query(
        "INSERT INTO elecciones (pareja_id, elegido_id) VALUES (?, ?)",
        [pareja_id, elegido_id]
    );

    // 3️⃣ Registrar en una tabla nueva votos por usuario
    await db.query(`
        INSERT INTO votos_usuario (usuario_id, pareja_id, elegido_id)
        VALUES (?, ?, ?)
    `, [usuario_id, pareja_id, elegido_id]);

    // 4️⃣ Incrementar contador general
    await db.query("UPDATE personas SET votos = votos + 1 WHERE id = ?", [elegido_id]);

    res.json({ ok: true });
});


// Ranking
app.get("/api/ranking", async (req, res) => {
    const [rows] = await db.query("SELECT id, nombre, foto, votos FROM personas ORDER BY votos DESC LIMIT 50");
    res.json(rows);
});

// Servir index.html por defecto
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor backend corriendo en http://localhost:3000");
});
