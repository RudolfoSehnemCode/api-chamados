import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

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
  }
  ));

  const contagemPorCategoria = {};

  chamados.forEach((chamado) => {
    const categoria = chamado.categoria;
    contagemPorCategoria[categoria] = (contagemPorCategoria[categoria] || 0) + 1;
  });

  const dadosPorCategoria = Object.entries(contagemPorCategoria).map(([categoria, total]) => ({
    categoria,
    total,
  }
  ));

  let tempoFechamento = 0;

  fechados.forEach((chamado) => {
    const abertura = new Date(chamado.dataAbertura);
    const fechamento = new Date(chamado.dataFechamento);
    tempoFechamento += fechamento - abertura;

  })

  const tempoMedioHoras = tempoFechamento / fechados.length / 1000 / 60 / 60;

  const contagemPorMes = {};
  
  chamados.forEach((chamado) => {
    const mes = chamado.dataAbertura.slice(0, 7);
    contagemPorMes[mes] = (contagemPorMes[mes] || 0) + 1;
  })

  const dadosPorMes = Object.entries(contagemPorMes).map(([mes, total]) => ({
    mes,
    total,
  })).sort((a, b) => a.mes.localeCompare(b.mes));

  const contagemPorHora = {};

  chamados.forEach((chamado) => {
    const pico = new Date(chamado.dataAbertura).getHours();
    contagemPorHora[pico] = (contagemPorHora[pico] || 0) + 1;
  })

  const dadosPorHora = Object.entries(contagemPorHora).map(([hora, total]) => ({
    hora,
    total,
  })).sort((a, b) => a.hora - b.hora);

  return (
    <main>
      <div className="graficos">

      <h1>Dashboard de Chamados</h1>

      <div className="cards">
        <div className="card">
          <h2>Total</h2>
          <p>{chamados.length}</p>
        </div>
        <div className="card">
          <h2>Abertos</h2>
          <p>{abertos.length}</p>
        </div>
        <div className="card">
          <h2>Fechados</h2>
          <p>{fechados.length}</p>
        </div>
        <div className="card">
          <h2>Tempo médio de resolução</h2>
          <p>{tempoMedioHoras.toFixed(1)}h </p>
        </div>
      </div>

      <div className="grafico">
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
      <div className="grafico">
        <h2>Chamados por categoria</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosPorCategoria}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
       <div className="grafico">
        <h2>Chamados por Mês</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line dataKey="total" stroke="#f59e0b" type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grafico">
        <h2>Horparios de pico</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosPorHora}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" tickFormatter={(hora) => `${hora}h`} />
            <YAxis />
            <Tooltip />
            <Line dataKey="total" stroke="#e11d48" type="linear"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
      

    </main>
  );
}


export default App;