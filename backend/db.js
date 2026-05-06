const { Pool } = require("pg");

const pool = new Pool({

    host: "db.tuklojsilqnpiwnuepph.supabase.com",

    port: 5432,

    database: "postgres",

    user: "postgre",

    password: "Hp4Rf4krHhNCUJYE",

    ssl: {
        rejectUnauthorized: false
    }

});

module.exports = pool;