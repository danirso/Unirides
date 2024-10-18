import React, { useState, useEffect } from 'react';

function Historico() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      fetchHistorico(user.id);
    } else {
      alert('Usuário não está logado.');
    }
  }, []);

  const fetchHistorico = (idPassageiro) => {
    console.log('ID do passageiro:', idPassageiro);  // Verificar se o ID está correto
  
    fetch(`http://localhost:3000/api/historico/${idPassageiro}/passageiro`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Dados recebidos do histórico:', data);  // Log para verificar os dados
        setHistorico(data);
      })
      .catch((error) => console.error('Erro ao buscar histórico:', error));
  };
  

  return (
    <div className="container mt-5">
      <h2>Histórico de Caronas</h2>
      {historico.length > 0 ? (
        historico.map((viagem) => (
          <div key={viagem.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">
                Carona com {viagem.motorista.nome} em {new Date(viagem.data).toLocaleDateString()}
              </h5>
              <p className="card-text">Destino: {viagem.destino}</p>
              <p className="card-text">Partida: {viagem.partida}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Você não possui histórico de caronas.</p>
      )}
    </div>
  );
}

export default Historico;