import React from "react";
import "./PerfilM.css"; // Importe um arquivo CSS para customizações adicionais

function PerfilMotorista() {
  const user = JSON.parse(localStorage.getItem("user")); // Pega as informações do usuário logado

  return (
    <div className="perfil-container mt-5">
      <div className="perfil-card">
        <div className="perfil-header">
          <h3>Perfil Completo do Motorista</h3>
        </div>
        <div className="perfil-content">
          <div className="perfil-item">
            <strong>Nome:</strong> <span>{user.nome}</span>
          </div>
          <div className="perfil-item">
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div className="perfil-item">
            <strong>Telefone:</strong> <span>{user.telefone}</span>
          </div>
          <div className="perfil-item">
            <strong>RA:</strong> <span>{user.RA}</span>
          </div>
          <div className="perfil-item">
            <strong>Modelo do Carro:</strong> <span>{user.carroModelo || "Não informado"}</span>
          </div>
          <div className="perfil-item">
            <strong>Placa do Carro:</strong> <span>{user.carroPlaca || "Não informada"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilMotorista;
