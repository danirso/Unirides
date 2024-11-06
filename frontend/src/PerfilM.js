import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Validation from "./PerfilValidations";

function PerfilMotorista() {
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    celular: "",
    ra: "",
  });
  const [carInfo, setCarInfo] = useState({
    modelo: "",
    placa: ""
  });
  const [editing, setEditing] = useState(false);
  const [initialUsuario, setInitialUsuario] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/usuario/${user.id}`)
        .then(response => response.json())
        .then(data => setUsuario(data))
        .catch(error => {
          console.error("Erro ao carregar os dados do usuário:", error);
          alert("Não foi possível carregar os dados do usuário.");
        });
  
      fetch(`/api/carInfo/${user.id}`)
        .then(response => response.json())
        .then(data => setCarInfo(data))
        .catch(error => {
          console.error("Erro ao carregar as informações do carro:", error);
          alert("Não foi possível carregar os dados do carro.");
        });
    }
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prevUsuario => ({ ...prevUsuario, [name]: value })); // Atualiza corretamente o estado do formulário
  };

  const handleCarChange = (e) => {
    const { name, value } = e.target;
    setCarInfo(prevCarInfo => ({ ...prevCarInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = Validation(usuario);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (JSON.stringify(usuario) === JSON.stringify(initialUsuario)) {
      alert("Nenhuma informação foi alterada.");
      return;
    }

    try {
      // Atualizar dados do usuário
      await fetch(`/api/usuario/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
  
      // Atualizar informações do carro
      await fetch(`/api/carInfo/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carInfo)
      });
  
      alert("Informações atualizadas com sucesso!");
      setEditing(false);
      localStorage.setItem("user", JSON.stringify({ ...user, ...usuario, carro: carInfo }));
    } catch (error) {
      console.error("Erro ao atualizar as informações do usuário:", error);
      alert("Erro ao atualizar as informações. Tente novamente mais tarde.");
    }
  };
  

  const handleBackToDashboard = () => {
    navigate("/motorista");
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100" style={{ background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)", color: "#f7f9fc", minHeight: "100vh", backgroundAttachment: "fixed" }}>
      <div className="container mt-3">
        <div className="card shadow-sm p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#1f3b4d" }}>
            <h3 className="mb-0" style={{ color: "white" }}>Área do {user.nome}</h3>
          </div>
          <div className="card-body">
            {editing ? (
              <form onSubmit={handleSubmit}>
                {/* Campos de edição */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Nome:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={usuario.nome}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                    {errors.nome && (
                      <small className="text-danger">{errors.nome}</small>
                    )}
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
                      value={usuario.email}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
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
                      value={usuario.celular}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                    {errors.celular && (
                      <small className="text-danger">{errors.celular}</small>
                    )}
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
                      value={usuario.ra}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                    {errors.ra && (
                      <small className="text-danger">{errors.ra}</small>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Modelo do Carro:</strong>
                  </div>
                  <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    name="modelo"
                    value={carInfo.modelo}
                    onChange={handleCarChange}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Placa do Carro:</strong>
                  </div>
                  <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    name="placa"
                    value={carInfo.placa}
                    onChange={handleCarChange}
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
                {/* Exibição dos dados */}
                <p style={{ color: "white" }}><strong>Nome:</strong> {usuario.nome}</p>
                <p style={{ color: "white" }}><strong>Email:</strong> {usuario.email}</p>
                <p style={{ color: "white" }}><strong>Celular:</strong> {usuario.celular}</p>
                <p style={{ color: "white" }}><strong>RA:</strong> {usuario.ra}</p>
                <p style={{ color: "white" }}><strong>Modelo do Carro:</strong> {carInfo.modelo}</p>
                <p style={{ color: "white" }}><strong>Placa do Carro:</strong> {carInfo.placa}</p>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-warning" onClick={() => setEditing(true)}>
                    Editar Informações
                  </button>
                  <button className="btn btn-outline-info" onClick={handleBackToDashboard}>
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

export default PerfilMotorista;
