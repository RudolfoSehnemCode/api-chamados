import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function App() {

  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/chamados")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setChamados(dados);
      })
      .catch((erro) => {
        console.log("Erro ao buscar chamados", erro);
      });
  }, []);

  const abertos = chamados.filter((chamado) => chamado.status === "ABERTO")
  const fechados = chamados.filter((chamado) => chamado.status === "FECHADO")

  const contagemPorSetor = {};

  chamados.forEach((chamado) => {
    const setor = chamado.setor;
    contagemPorSetor[setor] = (contagemPorSetor[setor] || 0) + 1;
  });

  const dadosPorSetor = Object.entries(contagemPorSetor).map(([setor, total]) => ({
    setor,
    total,
  }));


  return (
    <main>
      <h1>Dashboard de Chamados</h1>
      <div>
        <h2>Total</h2>
        <p>{chamados.length}</p>
      </div>
      <div>
        <h2>Abertos</h2>
        <p>{abertos.length}</p>
      </div>
      <div>
        <h2>Fechados</h2>
        <p>{fechados.length}</p>
      </div>
      <div>
        <h2>Chamados por setor</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosPorSetor}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="setor" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}


export default App;