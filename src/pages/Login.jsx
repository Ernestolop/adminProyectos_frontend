import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";  
import Alerta from "../components/Alerta";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Login = () => {

  const [alerta, setAlerta] = useState({});
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const {setAuth} = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    if(email === '' || password === ''){
      setAlerta({error: true, mensaje: 'Todos los campos son obligatorios'});
      return;
    }
    try{
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/login`, {email, password});
      setAlerta({});
      localStorage.setItem('token', data.token);
      setAuth(data);
      navigate('/proyectos');
    } catch(error){
      setAlerta({error: true, mensaje: error.response.data?.msg});
    }
  }

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Inicia sesión y administra tus <span className='text-slate-700'>proyectos</span></h1>
      {alerta.mensaje && <Alerta alerta={alerta} />}
      <form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg p-10'>
        <div className='my-5'>
          <label htmlFor="loginEmail" className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" id="loginEmail" className='w-full mt-3 border rounded-xl p-3' placeholder="Introduce tu email"/>
        </div>
        <div className='my-5'>
          <label htmlFor="loginPassword" className='uppercase text-gray-600 block text-xl font-bold'>Contraseña</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="loginPassword" className='w-full mt-3 border rounded-xl p-3' placeholder="Introduce tu contraseña"/>
        </div>
        <input type="submit" id="loginSubmit" value="Iniciar Sesión" className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5" />
      </form>
      <nav className='lg:flex lg:justify-between'>
        <Link to="registrar" className="block text-center my-5 text-slate-500 text-sm">¿No tienes una cuenta? Registrate</Link>
        <Link to="olvide-password" className="block text-center my-5 text-slate-500 text-sm">Olvide mi contraseña</Link>
      </nav>
    </>
  )
}

export default Login