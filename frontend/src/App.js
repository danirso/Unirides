import React from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './dashboardp';  // Dashboard para passageiro
import DashboardM from './dashboardm';  // Importa o componente DashboardM
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
      <BrowserRouter> 
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/passageiro' element={<Dashboard />}></Route>
          <Route path='/motorista' element={<DashboardM />}></Route>  {/* Rota para DashboardM */}
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
    );
}

export default App;
