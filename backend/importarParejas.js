import fs from "fs";
import db from "./db.js";

async function run() {
    const texto = fs.readFileSync("../db/parejas.txt", "utf8");
    const lineas = texto.split("\n").map(l => l.trim()).filter(l => l);

    for (const linea of lineas) {
        let separador = linea.includes(" – ") ? " – " : " - ";
        const [nombre1, nombre2] = linea.split(separador).map(s => s.trim());

        if (!nombre1 || !nombre2) continue;

        // persona1
        let [p1] = await db.query("SELECT id FROM personas WHERE nombre=?", [nombre1]);
        let id1 = p1.length ? p1[0].id : (await db.query("INSERT INTO personas (nombre) VALUES (?)", [nombre1]))[0].insertId;

        // persona2
        let [p2] = await db.query("SELECT id FROM personas WHERE nombre=?", [nombre2]);
        let id2 = p2.length ? p2[0].id : (await db.query("INSERT INTO personas (nombre) VALUES (?)", [nombre2]))[0].insertId;

        // pareja
        await db.query("INSERT INTO parejas (persona1_id, persona2_id) VALUES (?, ?)", [id1, id2]);
        console.log(`Pareja añadida: ${nombre1} - ${nombre2}`);
    }

    console.log("Importación completada.");
    process.exit(0);
}

run();
