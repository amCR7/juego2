import db from "./db.js";
import fetch from "node-fetch";

async function buscarFoto(nombre) {
    try {
        const query = nombre.replace(/ /g, "_");
        const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const pages = data.query.pages;
        const page = pages[Object.keys(pages)[0]];
        if (page && page.thumbnail && page.thumbnail.source) return page.thumbnail.source;
        return null;
    } catch (err) {
        console.log("Error buscando foto de", nombre, err);
        return null;
    }
}

async function main() {
    const personas = await db.all("SELECT id, nombre FROM personas");
    for (const persona of personas) {
        console.log(`Buscando foto de: ${persona.nombre}`);
        const foto = await buscarFoto(persona.nombre);
        if (foto) {
            console.log(`   ✔ Foto encontrada`);
            await db.run("UPDATE personas SET foto=? WHERE id=?", [foto, persona.id]);
        } else {
            console.log(`   ❌ No hay foto`);
        }
    }
    console.log("Proceso terminado.");
    process.exit(0);
}

main();
