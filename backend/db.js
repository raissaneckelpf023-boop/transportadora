const { Pool } = require("pg");

const pool = new Pool({

    host: "aws-1-us-east-1.pooler.supabase.com",

    port: 5432,

    database: "postgres",

    user: "postgres.tuklojsilqnpiwnuepph",

    password: "Hp4Rf4krHhNCUJYE",

    ssl: {
        rejectUnauthorized: false
    }

});

module.exports = pool;