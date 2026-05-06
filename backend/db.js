const { Pool } = require("pg");

const pool = new Pool({

    host: "db.tuklojsilqnpiwnuepph.supabase.co",

    port: 5432,

    database: "postgres",

    user: "postgres",

    password: "Setembro2003@",

    ssl: {
        rejectUnauthorized: false
    }

});

module.exports = pool;