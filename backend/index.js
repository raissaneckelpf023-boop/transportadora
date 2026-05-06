const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());







app.get("/clientes", async(req,res)=>{

    const resultado =
        await db.query(

            "SELECT * FROM clientes ORDER BY id"

        );

    res.json(
        resultado.rows
    );

});




app.post("/clientes", async(req,res)=>{

    const {

        nome,

        telefone

    } = req.body;



    const resultado =
        await db.query(

            `INSERT INTO clientes
            (nome, telefone)

            VALUES($1,$2)

            RETURNING *`,

            [

                nome,

                telefone

            ]

        );



    res.json(
        resultado.rows[0]
    );

});




app.put("/clientes/:id", async(req,res)=>{

    const {id} = req.params;



    const {

        nome,

        telefone

    } = req.body;



    const resultado =
        await db.query(

            `UPDATE clientes

             SET

             nome=$1,

             telefone=$2

             WHERE id=$3

             RETURNING *`,

            [

                nome,

                telefone,

                id

            ]

        );



    res.json(
        resultado.rows[0]
    );

});




app.delete("/clientes/:id", async(req,res)=>{

    const {id} = req.params;



    await db.query(

        "DELETE FROM clientes WHERE id=$1",

        [id]

    );



    res.json({

        mensagem:"cliente removido"

    });

});








app.get("/entregas", async (req, res) => {

    try {

        const resultado = await db.query(
            `SELECT e.*, c.nome
             FROM entregas e
             LEFT JOIN clientes c
             ON e.cliente_id = c.id
             ORDER BY e.id`
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "erro em entregas" });
    }

});



app.post("/entregas", async(req,res)=>{

    try{

        const {

            descricao,

            valor_cobrado,

            data,

            cliente_id

        } = req.body;



        const resultado =
            await db.query(

                `INSERT INTO entregas

                (descricao, valor_cobrado, data, cliente_id)

                VALUES($1,$2,$3,$4)

                RETURNING *`,

                [

                    descricao,

                    valor_cobrado,

                    data,

                    cliente_id

                ]

            );



        res.json(
            resultado.rows[0]
        );

    }

    catch(erro){

        console.log(erro.message);

        res.status(500).json({

            erro:erro.message

        });

    }

});




app.put("/entregas/:id", async(req,res)=>{

    const {id} = req.params;



    const {

        descricao,

        valor_cobrado,

        data,

        cliente_id

    } = req.body;



    const resultado =
        await db.query(

            `UPDATE entregas

             SET

             descricao=$1,

             valor_cobrado=$2,

             data=$3,

             cliente_id=$4

             WHERE id=$5

             RETURNING *`,

            [

                descricao,

                valor_cobrado,

                data,

                cliente_id,

                id

            ]

        );



    res.json(
        resultado.rows[0]
    );

});




app.delete("/entregas/:id", async(req,res)=>{

    const {id} = req.params;



    await db.query(

        "DELETE FROM entregas WHERE id=$1",

        [id]

    );



    res.json({

        mensagem:"entrega removida"

    });

});









app.get("/custos/entrega/:id", async(req,res)=>{

    const {id} = req.params;



    const resultado =
        await db.query(

            `SELECT *

             FROM custos

             WHERE entrega_id=$1`,

            [id]

        );



    res.json(
        resultado.rows
    );

});




app.post("/custos", async(req,res)=>{

    const {

        descricao,

        valor,

        entrega_id

    } = req.body;



    const resultado =
        await db.query(

            `INSERT INTO custos

            (descricao, valor, entrega_id)

            VALUES($1,$2,$3)

            RETURNING *`,

            [

                descricao,

                valor,

                entrega_id

            ]

        );



    res.json(
        resultado.rows[0]
    );

});




app.put("/custos/:id", async(req,res)=>{

    const {id} = req.params;



    const {

        descricao,

        valor

    } = req.body;



    const resultado =
        await db.query(

            `UPDATE custos

             SET

             descricao=$1,

             valor=$2

             WHERE id=$3

             RETURNING *`,

            [

                descricao,

                valor,

                id

            ]

        );



    res.json(
        resultado.rows[0]
    );

});




app.delete("/custos/:id", async(req,res)=>{

    const {id} = req.params;



    await db.query(

        "DELETE FROM custos WHERE id=$1",

        [id]

    );



    res.json({

        mensagem:"custo removido"

    });

});








app.get("/lucro/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const entrega = await db.query(
            `SELECT valor_cobrado FROM entregas WHERE id=$1`,
            [id]
        );

        const custos = await db.query(
            `SELECT COALESCE(SUM(valor), 0) AS total FROM custos WHERE entrega_id=$1`,
            [id]
        );

        const valorCobrado = Number(entrega.rows[0]?.valor_cobrado || 0);
        const custoTotal = Number(custos.rows[0]?.total || 0);

        const lucro = valorCobrado - custoTotal;

        res.json({
            custo: custoTotal,
            lucro: lucro
        });

    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "erro ao calcular lucro" });
    }

});





app.listen(5000, ()=>{

    console.log(
        "rodando"
    );

});