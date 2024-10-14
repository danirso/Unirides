import React from 'react'
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'
import Dashboard from './dashboardp'

function App() {
    return (
      <BrowserRouter> 
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/passageiro' element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    )
}

export default App