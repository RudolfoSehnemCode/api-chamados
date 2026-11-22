import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, Cell } from "recharts";

function App() {

  const [chamados, setChamados] = useState([]);
  const [filtroSetor, setFiltroSetor] = useState("TODOS");

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

  const chamadosFiltrados = chamados.filter(
    chamado => filtroSetor === "TODOS" || chamado.setor === filtroSetor
  );

  const abertos = chamadosFiltrados.filter((chamado) => chamado.status === "ABERTO")
  const fechados = chamadosFiltrados.filter((chamado) => chamado.status === "FECHADO")

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

  chamadosFiltrados.forEach((chamado) => {
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

  chamadosFiltrados.forEach((chamado) => {
    const mes = chamado.dataAbertura.slice(0, 7);
    contagemPorMes[mes] = (contagemPorMes[mes] || 0) + 1;
  })

  const dadosPorMes = Object.entries(contagemPorMes).map(([mes, total]) => ({
    mes,
    total,
  })).sort((a, b) => a.mes.localeCompare(b.mes));

  const contagemPorHora = {};

  chamadosFiltrados.forEach((chamado) => {
    const pico = new Date(chamado.dataAbertura).getHours();
    contagemPorHora[pico] = (contagemPorHora[pico] || 0) + 1;
  })

  const dadosPorHora = Object.entries(contagemPorHora).map(([hora, total]) => ({
    hora,
    total: Number((total / 180).toFixed(1)),
  })).sort((a, b) => a.hora - b.hora);

  const datasAbertura = chamadosFiltrados.map((chamado) => new Date(chamado.dataAbertura));
  const formatarMes = (data) =>
    data.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", "");
  const periodo = datasAbertura.length
    ? `${formatarMes(new Date(Math.min(...datasAbertura)))} a ${formatarMes(new Date(Math.max(...datasAbertura)))}`
    : "";

  return (
    <main>


      <header className="cabecalho">
        <h1>Dashboard de Chamados</h1>
        {periodo && (
          <p className="periodo">Dados dos últimos 6 meses · {periodo}</p>
        )}
      </header>
      <select value={filtroSetor} onChange={(evento) => setFiltroSetor(evento.target.value)}>
        <option value="TODOS">Todos os setores</option>
        <option value="Rh">Recursos Humanos</option>
        <option value="Marketing">Marketing</option>
        <option value="Diretoria">Diretoria</option>
        <option value="Financeiro">Financeiro</option>
        <option value="Recepção">Recepção</option>
        <option value="Comercial">Comercial</option>
      </select>

      <div className="cards">
        <div className="card">
          <h2>Total</h2>
          <p>{chamadosFiltrados.length}</p>
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

      <div className="graficos">
        <div className="grafico">
          <h2>Chamados por setor</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosPorSetor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="setor" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total">
                {dadosPorSetor.map((item) => (
                  <Cell
                    key={item.setor}
                    fill={filtroSetor === "TODOS" || item.setor === filtroSetor ? "#4f46e5" : "#3f3f46"}
                  />
                ))}
              </Bar>
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
          <h2>Chamados por mês</h2>
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
          <h2>Média de chamados por horário (por dia)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosPorHora}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" tickFormatter={(hora) => `${hora}h`} />
              <YAxis />
              <Tooltip />
              <Line dataKey="total" stroke="#e11d48" type="linear" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


    </main>
  );
}


export default App;