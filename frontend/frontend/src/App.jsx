import { useEffect, useState } from "react";
import "./App.css";
import imagemTopo from "./assets/caminhao.jpg";

const API = "https://backend-transportadora.onrender.com";

function App() {

    const [entregas, setEntregas] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [cliente, setCliente] = useState("");

    const [nomeCliente, setNomeCliente] = useState("");
    const [telefoneCliente, setTelefoneCliente] = useState("");

    const [editando, setEditando] = useState(null);
    const [editandoCliente, setEditandoCliente] = useState(null);

    useEffect(() => {
        carregarDados();
        carregarClientes();
    }, []);

   
    async function carregarClientes() {
        try {
            const res = await fetch(`${API}/clientes`);
            if (!res.ok) return;

            const data = await res.json();
            setClientes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("Erro clientes:", err);
        }
    }

    async function salvarCliente() {

        const dados = {
            nome: nomeCliente,
            telefone: telefoneCliente
        };

        try {
            if (editandoCliente) {
                await fetch(`${API}/clientes/${editandoCliente}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados)
                });
            } else {
                await fetch(`${API}/clientes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados)
                });
            }

            setNomeCliente("");
            setTelefoneCliente("");
            setEditandoCliente(null);

            carregarClientes();
        } catch (err) {
            console.log(err);
        }
    }

    function editarCliente(c) {
        setNomeCliente(c.nome);
        setTelefoneCliente(c.telefone);
        setEditandoCliente(c.id);
    }

    async function removerCliente(id) {
        await fetch(`${API}/clientes/${id}`, { method: "DELETE" });
        carregarClientes();
    }

    
    async function carregarDados() {
        try {
            const res = await fetch(`${API}/entregas`);
            if (!res.ok) return;

            const data = await res.json();

            const lista = await Promise.all(
                (Array.isArray(data) ? data : []).map(async (entrega) => {

                    const resCustos = await fetch(`${API}/custos/entrega/${entrega.id}`);
                    const custos = resCustos.ok ? await resCustos.json() : [];

                    const resLucro = await fetch(`${API}/lucro/${entrega.id}`);
                    const financeiro = resLucro.ok ? await resLucro.json() : { custo: 0, lucro: 0 };

                    return {
                        ...entrega,
                        custos: Array.isArray(custos) ? custos : [],
                        custoTotal: financeiro.custo || 0,
                        lucro: financeiro.lucro || 0
                    };

                })
            );

            setEntregas(lista);

        } catch (err) {
            console.log("Erro entregas:", err);
        }
    }

    async function salvar() {

        const dados = {
            descricao,
            valor_cobrado: Number(valor),
            data: new Date().toISOString(),
            cliente_id: Number(cliente)
        };

        try {
            if (editando) {
                await fetch(`${API}/entregas/${editando}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados)
                });
            } else {
                await fetch(`${API}/entregas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados)
                });
            }

            limpar();
            carregarDados();
        } catch (err) {
            console.log(err);
        }
    }

    async function remover(id) {
        await fetch(`${API}/entregas/${id}`, { method: "DELETE" });
        carregarDados();
    }

    function editar(entrega) {
        setDescricao(entrega.descricao);
        setValor(entrega.valor_cobrado);
        setCliente(entrega.cliente_id);
        setEditando(entrega.id);
    }

    function limpar() {
        setDescricao("");
        setValor("");
        setCliente("");
        setEditando(null);
    }

   
    async function adicionarCusto(id) {

        const tipo = prompt("Tipo do custo");
        const valor = prompt("Valor");

        if (!tipo || !valor) return;

        await fetch(`${API}/custos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                descricao: tipo,
                valor: Number(valor),
                entrega_id: id
            })
        });

        carregarDados();
    }

    async function editarCusto(custo) {

        const descricao = prompt("Descrição", custo.descricao);
        const valor = prompt("Valor", custo.valor);

        await fetch(`${API}/custos/${custo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descricao, valor })
        });

        carregarDados();
    }

    async function removerCusto(id) {
        await fetch(`${API}/custos/${id}`, { method: "DELETE" });
        carregarDados();
    }

   
    return (
        <div className="container mt-4">

            <div className="banner-container mb-4">
                <img src={imagemTopo} className="img-fluid rounded w-100 banner" />
                <h1 className="titulo-banner">Controle Financeiro</h1>
            </div>

            {/* CLIENTES */}
            <div className="card p-4 mb-4 form-card">

                <h4>Clientes</h4>

                <div className="row g-3 mb-3">

                    <div className="col-md-4">
                        <input className="form-control"
                            placeholder="Nome"
                            value={nomeCliente}
                            onChange={(e) => setNomeCliente(e.target.value)}
                        />
                    </div>

                    <div className="col-md-4">
                        <input className="form-control"
                            placeholder="Telefone"
                            value={telefoneCliente}
                            onChange={(e) => setTelefoneCliente(e.target.value)}
                        />
                    </div>

                    <div className="col-md-4">
                        <button className="btn btn-primary w-100" onClick={salvarCliente}>
                            Salvar
                        </button>
                    </div>

                </div>

                {clientes.map(c => (
                    <div key={c.id} className="d-flex justify-content-between mb-2">
                        <span>{c.id} - {c.nome}</span>
                        <div className="d-flex gap-2">
                            <button className="btn btn-warning btn-sm" onClick={() => editarCliente(c)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => removerCliente(c.id)}>X</button>
                        </div>
                    </div>
                ))}

            </div>

           
            <div className="card p-4 mb-4 form-card">

                <div className="row g-3">

                    <div className="col-md-5">
                        <input className="form-control"
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <input className="form-control"
                            placeholder="Valor"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <input className="form-control"
                            placeholder="Cliente ID"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" onClick={salvar}>
                            {editando ? "Salvar" : "Adicionar"}
                        </button>
                    </div>

                </div>

            </div>

            {/* LISTA */}
            <div className="row">

                {entregas.map(e => (
                    <div className="col-md-4 mb-4" key={e.id}>

                        <div className="card p-3 h-100">

                            <h4>{e.descricao}</h4>
                            <p>Cliente: {e.nome}</p>
                            <p>Valor: R$ {e.valor_cobrado}</p>

                            <hr />

                            <h6>Custos</h6>

                            {(e.custos || []).map(c => (
                                <div key={c.id} className="d-flex justify-content-between mb-2">
                                    <span>{c.descricao}: R$ {c.valor}</span>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-warning btn-sm" onClick={() => editarCusto(c)}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => removerCusto(c.id)}>X</button>
                                    </div>
                                </div>
                            ))}

                            <p><strong>Total custos:</strong> R$ {e.custoTotal}</p>
                            <p><strong>Lucro:</strong> R$ {e.lucro}</p>

                            <div className="d-flex gap-2 flex-wrap">
                                <button className="btn btn-success" onClick={() => adicionarCusto(e.id)}>Custo</button>
                                <button className="btn btn-warning" onClick={() => editar(e)}>Editar</button>
                                <button className="btn btn-danger" onClick={() => remover(e.id)}>Remover</button>
                            </div>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default App;