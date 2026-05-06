import { useEffect, useState } from "react";
import "./App.css";
import imagemTopo from "./assets/caminhao.jpg";

function App(){

    const [entregas, setEntregas] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [cliente, setCliente] = useState("");

    const [nomeCliente, setNomeCliente] = useState("");
    const [telefoneCliente, setTelefoneCliente] = useState("");

    const [editando, setEditando] = useState(null);
    const [editandoCliente, setEditandoCliente] = useState(null);



    useEffect(()=>{

        carregarDados();
        carregarClientes();

    },[]);





    async function carregarClientes(){

        const resposta =
            await fetch(
                "http://localhost:5000/clientes"
            );

        const dados =
            await resposta.json();

        setClientes(
            dados
        );

    }





    async function carregarDados(){

        const resposta =
            await fetch(
                "http://localhost:5000/entregas"
            );

        const dados =
            await resposta.json();




        const listaCompleta =
            await Promise.all(

                dados.map(

                    async(entrega)=>{

                        const respostaCustos =
                            await fetch(

                                "http://localhost:5000/custos/entrega/"
                                + entrega.id

                            );



                        const custos =
                            await respostaCustos.json();




                        const respostaLucro =
                            await fetch(

                                "http://localhost:5000/lucro/"
                                + entrega.id

                            );



                        const financeiro =
                            await respostaLucro.json();




                        return{

                            ...entrega,

                            custos:custos,

                            custoTotal:
                                financeiro.custo,

                            lucro:
                                financeiro.lucro

                        };

                    }

                )

            );




        setEntregas(
            listaCompleta
        );

    }





    async function salvarCliente(){

        const dados = {

            nome:nomeCliente,

            telefone:telefoneCliente

        };




        if(editandoCliente){

            await fetch(

                "http://localhost:5000/clientes/"
                + editandoCliente,

                {

                    method:"PUT",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body: JSON.stringify(
                        dados
                    )

                }

            );

        }

        else{

            await fetch(

                "http://localhost:5000/clientes",

                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body: JSON.stringify(
                        dados
                    )

                }

            );

        }




        setNomeCliente("");
        setTelefoneCliente("");
        setEditandoCliente(null);

        carregarClientes();

    }





    function editarCliente(cliente){

        setNomeCliente(
            cliente.nome
        );

        setTelefoneCliente(
            cliente.telefone
        );

        setEditandoCliente(
            cliente.id
        );

    }





    async function removerCliente(id){

        await fetch(

            "http://localhost:5000/clientes/" + id,

            {
                method:"DELETE"
            }

        );

        carregarClientes();

    }





    async function salvar(){

        const dados = {

            descricao: descricao,

            valor_cobrado: Number(valor),

            data: "2026-05-03",

            cliente_id: Number(cliente)

        };




        if(editando){

            await fetch(

                "http://localhost:5000/entregas/"
                + editando,

                {

                    method:"PUT",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body: JSON.stringify(
                        dados
                    )

                }

            );

        }

        else{

            await fetch(

                "http://localhost:5000/entregas",

                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body: JSON.stringify(
                        dados
                    )

                }

            );

        }




        limpar();

        carregarDados();

    }





    async function adicionarCusto(id){

        const tipo =
            prompt("Tipo do custo");

        const valor =
            prompt("Valor");




        await fetch(

            "http://localhost:5000/custos",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    descricao: tipo,

                    valor: Number(valor),

                    entrega_id: id

                })

            }

        );



        carregarDados();

    }





    async function editarCusto(custo){

        const descricao =
            prompt(
                "Descrição",
                custo.descricao
            );


        const valor =
            prompt(
                "Valor",
                custo.valor
            );




        await fetch(

            "http://localhost:5000/custos/"
            + custo.id,

            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    descricao,
                    valor

                })

            }

        );



        carregarDados();

    }





    async function removerCusto(id){

        await fetch(

            "http://localhost:5000/custos/" + id,

            {
                method:"DELETE"
            }

        );

        carregarDados();

    }





    function editar(entrega){

        setDescricao(
            entrega.descricao
        );

        setValor(
            entrega.valor_cobrado
        );

        setCliente(
            entrega.cliente_id
        );

        setEditando(
            entrega.id
        );

    }





    async function remover(id){

        await fetch(

            "http://localhost:5000/entregas/" + id,

            {
                method:"DELETE"
            }

        );

        carregarDados();

    }





    function limpar(){

        setDescricao("");
        setValor("");
        setCliente("");

        setEditando(null);

    }





    return(

        <div className="container mt-4">


            <div className="banner-container mb-4">

                <img
                    src={imagemTopo}
                    alt=""
                    className="img-fluid rounded w-100 banner"
                />

                <h1 className="titulo-banner">

                    Controle Financeiro

                </h1>

            </div>





            <div className="card p-4 mb-4 form-card">

                <h4>Clientes</h4>


                <div className="row g-3 mb-3">


                    <div className="col-md-4">

                        <input
                            className="form-control"
                            placeholder="Nome"
                            value={nomeCliente}
                            onChange={(e)=>
                                setNomeCliente(
                                    e.target.value
                                )
                            }
                        />

                    </div>



                    <div className="col-md-4">

                        <input
                            className="form-control"
                            placeholder="Telefone"
                            value={telefoneCliente}
                            onChange={(e)=>
                                setTelefoneCliente(
                                    e.target.value
                                )
                            }
                        />

                    </div>



                    <div className="col-md-4">

                        <button
                            className="btn btn-primary w-100"
                            onClick={salvarCliente}
                        >

                            Salvar

                        </button>

                    </div>

                </div>



                {

                    clientes.map(

                        c=>(

                            <div
                                key={c.id}
                                className="d-flex justify-content-between mb-2"
                            >

                                <span>

                                    {c.id} - {c.nome}

                                </span>


                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={()=>editarCliente(c)}
                                    >

                                        Editar

                                    </button>


                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={()=>removerCliente(c.id)}
                                    >

                                        X

                                    </button>

                                </div>

                            </div>

                        )

                    )

                }

            </div>





            <div className="card p-4 mb-4 form-card">

                <div className="row g-3">


                    <div className="col-md-5">

                        <input
                            className="form-control"
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e)=>
                                setDescricao(
                                    e.target.value
                                )
                            }
                        />

                    </div>



                    <div className="col-md-2">

                        <input
                            className="form-control"
                            placeholder="Valor"
                            value={valor}
                            onChange={(e)=>
                                setValor(
                                    e.target.value
                                )
                            }
                        />

                    </div>



                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Cliente ID"
                            value={cliente}
                            onChange={(e)=>
                                setCliente(
                                    e.target.value
                                )
                            }
                        />

                    </div>



                    <div className="col-md-2">

                        <button
                            className="btn btn-primary w-100"
                            onClick={salvar}
                        >

                            {editando ? "Salvar" : "Adicionar"}

                        </button>

                    </div>

                </div>

            </div>





            <div className="row">


                {

                    entregas.map(

                        entrega=>(

                            <div
                                className="col-md-4 mb-4"
                                key={entrega.id}
                            >

                                <div className="card p-3 h-100">


                                    <h4>

                                        {entrega.descricao}

                                    </h4>


                                    <p>

                                        Cliente: {entrega.nome}

                                    </p>


                                    <p>

                                        Valor: R$ {entrega.valor_cobrado}

                                    </p>


                                    <hr/>


                                    <h6>

                                        Custos

                                    </h6>




                                    {

                                        entrega.custos.map(

                                            custo=>(

                                                <div
                                                    key={custo.id}
                                                    className="d-flex justify-content-between mb-2"
                                                >

                                                    <span>

                                                        {custo.descricao}: R$ {custo.valor}

                                                    </span>


                                                    <div className="d-flex gap-2">

                                                        <button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={()=>editarCusto(custo)}
                                                        >

                                                            Editar

                                                        </button>


                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={()=>removerCusto(custo.id)}
                                                        >

                                                            X

                                                        </button>

                                                    </div>

                                                </div>

                                            )

                                        )

                                    }




                                    <p>

                                        <strong>

                                            Total custos:

                                        </strong>

                                        R$ {entrega.custoTotal}

                                    </p>


                                    <p>

                                        <strong>

                                            Lucro:

                                        </strong>

                                        R$ {entrega.lucro}

                                    </p>




                                    <div className="d-flex gap-2 flex-wrap">

                                        <button
                                            className="btn btn-success"
                                            onClick={()=>adicionarCusto(entrega.id)}
                                        >

                                            Custo

                                        </button>


                                        <button
                                            className="btn btn-warning"
                                            onClick={()=>editar(entrega)}
                                        >

                                            Editar

                                        </button>


                                        <button
                                            className="btn btn-danger"
                                            onClick={()=>remover(entrega.id)}
                                        >

                                            Remover

                                        </button>

                                    </div>


                                </div>

                            </div>

                        )

                    )

                }


            </div>


        </div>

    );

}

export default App;