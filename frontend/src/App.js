import React from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './dashboardp';  // Dashboard para passageiro
import DashboardM from './dashboardm';  // Dashboard para motorista
import Historico from './Historico';    // Histórico do usuário
import PerfilPassageiro from './PerfilP';  // Novo componente para perfil de passageiro
import PerfilMotorista from './PerfilM';    // Novo componente para perfil de motorista
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
      <BrowserRouter> 
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/passageiro' element={<Dashboard />}></Route>
          <Route path='/motorista' element={<DashboardM />}></Route>  {/* Rota para DashboardM */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/historico" element={<Historico />}></Route>  {/* Nova rota para o componente Historico */}
          <Route path='/perfil-passageiro' element={<PerfilPassageiro />}></Route> {/* Perfil completo passageiro */}
          <Route path='/perfil-motorista' element={<PerfilMotorista />}></Route> {/* Perfil completo motorista */}
        </Routes>
      </BrowserRouter>
    );
}

export default App;
