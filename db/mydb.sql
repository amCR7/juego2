CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

CREATE TABLE personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    foto VARCHAR(500),
    votos INT DEFAULT 0
);

CREATE TABLE parejas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    persona1_id INT NOT NULL,
    persona2_id INT NOT NULL,
    FOREIGN KEY (persona1_id) REFERENCES personas(id),
    FOREIGN KEY (persona2_id) REFERENCES personas(id)
);

CREATE TABLE elecciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pareja_id INT NOT NULL,
    elegido_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
