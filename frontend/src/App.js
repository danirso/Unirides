import React, { useState } from "react";
import Login from './Login';
import EsqueciSenha from './esquecisenha'; 
import VerificacaoCodigo from './verificarcodigo'; 
import RedefinicaoSenha from './redefinirsenha'; 
import Signup from './Signup';
import LandPage from './landPage';
import Dashboard from './dashboardp';  // Dashboard para passageiro
import DashboardM from './dashboardm';  // Dashboard para motorista
import Historico from './Historico';    // Histórico do usuário
import PerfilPassageiro from './PerfilP';  // Novo componente para perfil de passageiro
import PerfilMotorista from './PerfilM';    // Novo componente para perfil de motorista
import Detalhescaronam from './Detalhescaronam';    // Detalhes da carona para o motorista
import Detalhescaronap from './Detalhescaronap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  const [email, setEmail] = useState("");  // Estado para armazenar o email


    return (
      <BrowserRouter> 
        <Routes>
          <Route path='/' element={<LandPage />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/recuperar-senha" element={<EsqueciSenha setEmail={setEmail}/>}></Route> 
          <Route path="/verificar-codigo" element={<VerificacaoCodigo email={email}/>}></Route>
          <Route path="/trocar-senha" element={<RedefinicaoSenha />}></Route>        
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/passageiro' element={<Dashboard />}></Route>
          <Route path='/motorista' element={<DashboardM />}></Route>  {/* Rota para DashboardM */}
          <Route path='/detalhescaronam' element={<Detalhescaronam />}></Route>
          <Route path='/detalhescaronap' element={<Detalhescaronap />}></Route>          
          <Route path="/historico" element={<Historico />}></Route>  {/* Nova rota para o componente Historico */}
          <Route path='/perfil-passageiro' element={<PerfilPassageiro />}></Route> {/* Perfil completo passageiro */}
          <Route path='/perfil-motorista' element={<PerfilMotorista />}></Route> {/* Perfil completo motorista */}
        </Routes>
      </BrowserRouter>
    );
}

export default App;
