import mysql from "mysql2/promise";

async function init() {
    // Conectarse sin base de datos primero
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "duelo",
        password: "root"
    });

    // Crear la base de datos si no existe
    await connection.query("CREATE DATABASE IF NOT EXISTS mydb");

    // Conectarse ya a la base de datos
    await connection.changeUser({ database: "mydb" });

    // Crear tablas si no existen
    await connection.query(`
        CREATE TABLE IF NOT EXISTS personas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            foto VARCHAR(500),
            votos INT DEFAULT 0
        )
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS parejas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            persona1_id INT NOT NULL,
            persona2_id INT NOT NULL,
            FOREIGN KEY (persona1_id) REFERENCES personas(id),
            FOREIGN KEY (persona2_id) REFERENCES personas(id)
        )
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS elecciones (
            id INT AUTO_INCREMENT PRIMARY KEY,
            pareja_id INT NOT NULL,
            elegido_id INT NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);



    await connection.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL UNIQUE
        )
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS votos_usuario (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            pareja_id INT NOT NULL,
            elegido_id INT NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (pareja_id) REFERENCES parejas(id),
            FOREIGN KEY (elegido_id) REFERENCES personas(id)
        )
    `);

    
    console.log("Base de datos y tablas listas ✅");

    await connection.end();
}

init();
