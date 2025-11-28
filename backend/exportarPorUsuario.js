import db from "./db.js";
import XLSX from "xlsx";

async function exportar() {
    try {
        const [rows] = await db.query(`
            SELECT u.nombre AS usuario, p.persona1, p.persona2, e.elegido, e.fecha
            FROM votos_usuario e
            JOIN usuarios u ON e.usuario_id = u.id
            JOIN parejas p ON e.pareja_id = p.id
            ORDER BY u.nombre, e.id ASC
        `);

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "VotacionesPorUsuario");

        XLSX.writeFile(wb, "votaciones_por_usuario.xlsx");
        console.log("Archivo votaciones_por_usuario.xlsx generado ✅");
    } catch(err) {
        console.error("Error al exportar Excel:", err);
    }
}

exportar();
