import React, { useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {

  const [usuario, setUsuario] = useState({
    name: "Magas",
    email: "magas@magas.com",
    celular: "xxxxxxxxx",
  });


  const [caronas, setCaronas] = useState([
    { id: 1, titulo: "Carona para o centro", descricao: "Saída às 8h", partida:"H15" },
    { id: 2, titulo: "Carona para o shopping", descricao: "Saída às 14h", partida:"ponto de onibus" },
  ]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bem-vindo, {usuario.name}!</h2>
        <Link to="/" className="btn btn-danger">
          Logout
        </Link>
      </div>

      {/* Seção do perfil do usuário */}
      <div className="mb-4">
        <p>
          <strong>Email:</strong> {usuario.email}
        </p>
        <p>
          <strong>Celular:</strong> {usuario.celular}
        </p>
        <Link to="/perfil" className="btn btn-primary mb-3">
          Ver Perfil Completo
        </Link>
      </div>

      <div className="mb-4">
        <h3>Caronas Disponíveis</h3>
        {caronas.length > 0 ? (
          caronas.map((carona) => (
            <div key={carona.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{carona.titulo}</h5>
                <p className="card-text">{carona.descricao}</p>
                <p className="card-text">{carona.partida}</p>
                <button className="btn btn-success">Solicitar Carona</button>
              </div>
            </div>
          ))
        ) : (
          <p>Não há caronas disponíveis no momento.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
