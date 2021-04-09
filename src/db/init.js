const Database = require('config')

// conexão com banco - open()
Database()

Database.exec(`CREATE TABLE profile (
    id INT PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    avatar TEXT,
    monthly-budget INT,
    days-per-week INT,
    hours-per-day INT,
    vacation-per-year INT,
    value-hour INT
)`)

Database.exec(`CREATE TABLE job (
    id INT PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    daily-hours INT,
    total-hours INT,
    created_at DATETIME
)`)

// fechando conexão com banco
Database.close()