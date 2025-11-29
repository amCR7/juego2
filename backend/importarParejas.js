import fs from "fs";
import db from "./db.js";
import path from "path";

async function run() {
    const texto = fs.readFileSync(path.join("../db/parejas.txt"), "utf8");
    const lineas = texto.split("\n").map(l => l.trim()).filter(l => l);

    for (const linea of lineas) {
        let separador = linea.includes(" – ") ? " – " : " - ";
        const [nombre1, nombre2] = linea.split(separador).map(s => s.trim());
        if (!nombre1 || !nombre2) continue;

        // persona1
        let p1 = await db.get("SELECT id FROM personas WHERE nombre=?", [nombre1]);
        let id1 = p1 ? p1.id : (await db.run("INSERT INTO personas (nombre) VALUES (?)", [nombre1])).lastID;

        // persona2
        let p2 = await db.get("SELECT id FROM personas WHERE nombre=?", [nombre2]);
        let id2 = p2 ? p2.id : (await db.run("INSERT INTO personas (nombre) VALUES (?)", [nombre2])).lastID;

        // pareja
        await db.run("INSERT INTO parejas (persona1_id, persona2_id) VALUES (?, ?)", [id1, id2]);
        console.log(`Pareja añadida: ${nombre1} - ${nombre2}`);
    }

    console.log("Importación completada.");
    process.exit(0);
}

run();
