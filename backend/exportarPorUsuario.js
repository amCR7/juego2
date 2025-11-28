import db from "./db.js";
import XLSX from "xlsx";

async function exportar() {
    const [rows] = await db.query(`
        SELECT u.nombre AS usuario, p1.nombre AS persona1, p2.nombre AS persona2, a.nombre AS elegido, e.fecha
        FROM votos_usuario e
        JOIN usuarios u ON e.usuario_id = u.id
        JOIN parejas p ON e.pareja_id = p.id
        JOIN personas a ON e.elegido_id = a.id
        JOIN personas p1 ON p.persona1_id = p1.id
        JOIN personas p2 ON p.persona2_id = p2.id
        ORDER BY u.nombre, e.id ASC
    `);

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VotacionesPorUsuario");

    XLSX.writeFile(wb, "votaciones_por_usuario.xlsx");
    console.log("Archivo votaciones_por_usuario.xlsx generado ✅");
}

exportar();
