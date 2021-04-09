const Database = require('./config')

const initDb = {
    async init() {
        // conexão com banco
        const db = await Database()

        //Criando tabelas
        await db.exec(`CREATE TABLE profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            avatar TEXT,
            monthly_budget INT,
            days_per_week INT,
            hours_per_day INT,
            vacation_per_year INT,
            value_hour INT
        );`)

        await db.exec(`CREATE TABLE job (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            daily_hours INT,
            total_hours INT,
            created_at DATETIME
        );`)

        //Populando tabelas (inicialmente)
        await db.run(`INSERT INTO profile (
            name, 
            avatar,
            monthly_budget,
            days_per_week,
            hours_per_day,
            vacation_per_year,
            value_hour
        ) VALUES (
            "Maby",
            "https://unavatar.now.sh/github/MariaGabrielaReis",
            3000,
            5,
            4,
            10,
            75
        );`)

        await db.run(`INSERT INTO job (
            name,
            daily_hours,
            total_hours,
            created_at
        ) VALUES (
            "Padaria Pãozinho Quente",
            2,
            1,
            1617992743828
        );`)

        // fechando conexão com banco
        await db.close()
    }
}

initDb.init()