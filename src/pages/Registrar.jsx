import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import axios from 'axios';

const Registrar =  () => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e => {

    e.preventDefault();

    if([nombre, email, password, passwordRepeat].includes('')){
      setAlerta({
        error: true,
        mensaje: 'Todos los campos son obligatorios'
      });
      return;
    }

    if(password !== passwordRepeat){
      setAlerta({
        error: true,
        mensaje: 'Las contraseñas no coinciden'
      });
      return;
    }

    setAlerta({});

    try {
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios` , {
        nombre,
        email,
        password,
      });
      setAlerta({
          mensaje: data.msg,
          error: false
      });
      setNombre('');
      setEmail('');
      setPassword('');
      setPasswordRepeat('');
    } catch (error) {
      setAlerta({
        error: true,
        mensaje: error.response.data.msg
      })
    }

  }

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Crea tu cuenta y administra tus <span className='text-slate-700'>proyectos</span></h1>
      {alerta.mensaje && <Alerta alerta={alerta} />}
      <form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg p-10'>
        <div className='my-5'>
          <label htmlFor="registerNombre" className='uppercase text-gray-600 block text-xl font-bold'>Nombre</label>
          <input value={nombre} onChange={e =>setNombre(e.target.value)} type="text" id="registerNombre" className='w-full mt-3 border rounded-xl p-3' placeholder="Escribe tu nombre" />
        </div>
        <div className='my-5'>
          <label htmlFor="registerEmail" className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
          <input value={email} onChange={e =>setEmail(e.target.value)} type="email" id="registerEmail" className='w-full mt-3 border rounded-xl p-3' placeholder="Introduce tu email" />
        </div>
        <div className='my-5'>
          <label htmlFor="registerPassword" className='uppercase text-gray-600 block text-xl font-bold'>Contraseña</label>
          <input value={password} onChange={e =>setPassword(e.target.value)} type="password" id="registerPassword" className='w-full mt-3 border rounded-xl p-3' placeholder="Introduce tu contraseña" />
        </div>
        <div className='my-5'>
          <label htmlFor="registerPasswordRepeat" className='uppercase text-gray-600 block text-xl font-bold'>Repetir Contraseña</label>
          <input value={passwordRepeat} onChange={e =>setPasswordRepeat(e.target.value)} type="password" id="registerPasswordRepeat" className='w-full mt-3 border rounded-xl p-3' placeholder="Introduce tu contraseña de nuevo" />
        </div>
        <input type="submit" id="registerSubmit" value="Registrar Cuenta" className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5" />
      </form>
      <nav className='lg:flex lg:justify-between'>
        <Link to="/" className="block text-center my-5 text-slate-500 text-sm">¿Ya tienes una cuenta? Inicia sesión</Link>
        <Link to="/olvide-password" className="block text-center my-5 text-slate-500 text-sm">Olvide mi contraseña</Link>
      </nav>
    </>
  )
}



export default Registrar