import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PerfilPassageiro() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    nome: user.nome,
    email: user.email,
    celular: user.celular,
    ra: user.ra,
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/api/usuario/${user.id}`, formData);
      alert(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.usuario));
      setEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar as informações:", error);
      alert("Erro ao atualizar as informações.");
    }
  };

  const handleBackToDashboard = () => {
    navigate("/passageiro");
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100" style={{ background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)", color: "#f7f9fc", minHeight: "100vh", backgroundAttachment: "fixed" }}>
      <style>
        {`
          body, html {
            height: 100%;
            margin: 0;
            background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
            background-attachment: fixed;
          }
        `}
      </style>
      <div className="container mt-3">
        <div className="card shadow-sm p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}> 
          <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#1f3b4d" }}>
            <h3 className="mb-0" style={{ color: "white" }}>Área do {formData.nome}</h3>
          </div>
          <div className="card-body">
            {editing ? (
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Nome:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Email:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Celular:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="celular"
                      value={formData.celular}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>RA:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="ra"
                      value={formData.ra}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success me-2">
                    Atualizar
                  </button>
                  <button type="button" className="btn btn-outline-danger" onClick={() => setEditing(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ color: "white" }}><strong>Nome:</strong> {formData.nome}</p>
                <p style={{ color: "white" }}><strong>Email:</strong> {formData.email}</p>
                <p style={{ color: "white" }}><strong>Celular:</strong> {formData.celular}</p>
                <p style={{ color: "white" }}><strong>RA:</strong> {formData.ra}</p>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-info" onClick={() => setEditing(true)}>
                    Editar Informações
                  </button>
                  <button className="btn btn-outline-danger" onClick={handleBackToDashboard}>
                    Voltar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilPassageiro;
