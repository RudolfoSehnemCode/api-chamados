import { useEffect, useState } from "react";

function App(){

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



return (
    <main>
      <h1>Total de chamados</h1>
      <p>{chamados.length}</p>
    </main>
  );
}

export default App;