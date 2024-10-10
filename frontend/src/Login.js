import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
    return(
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <form action="">
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder='Insira seu Email' className='form-control rounded-0' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Senha</strong></label>
                        <input type="password" placeholder='Insira sua Senha' className='form-control rounded-0'/>
                    </div>
                    <button className='btn btn-success w-100 rounded-0'>Login</button>
                    <p></p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Criar Conta</Link>
                </form>
            </div>
        </div>
    )
}

export default Login