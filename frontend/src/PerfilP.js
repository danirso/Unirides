import React from "react";

function PerfilPassageiro() {
  const user = JSON.parse(localStorage.getItem("user")); // Pega as informações do usuário logado

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Perfil do Passageiro</h3>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <strong>Nome:</strong>
            </div>
            <div className="col-md-8">
              <p>{user.nome}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <strong>Email:</strong>
            </div>
            <div className="col-md-8">
              <p>{user.email}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <strong>Telefone:</strong>
            </div>
            <div className="col-md-8">
              <p>{user.telefone}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <strong>RA:</strong>
            </div>
            <div className="col-md-8">
              <p>{user.RA}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilPassageiro;
