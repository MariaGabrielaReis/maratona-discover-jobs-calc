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
);`)

Database.exec(`CREATE TABLE job (
    id INT PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    daily-hours INT,
    total-hours INT,
    created_at DATETIME
);`)

Database.run(`INSERT INTO profile (
    name, 
    avatar,
    monthly-budget,
    days-per-week,
    hours-per-day,
    vacation-per-year,
    value-hour
) VALUES (
    "Maby",
    "https://unavatar.now.sh/github/MariaGabrielaReis",
    3000,
    5,
    4,
    10,
    75
);`)

Database.run(`INSERT INTO profile (
    name,
    daily-hours,
    total-hours,
    created_at
) VALUES (
    "Padaria Pãozinho Quente",
    2,
    1,
    1617992743828
);`)

// fechando conexão com banco
Database.close()