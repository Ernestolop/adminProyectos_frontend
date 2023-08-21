import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Alerta from '../components/Alerta';

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    if(email === '') {
      setAlerta({
        error : true,
        mensaje : 'El email es obligatorio'
      })
      return;
    }
    setAlerta({});
    try{
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/olvide-password`, {email}); 
      setAlerta({
        error : false,
        mensaje : data.msg
      })
    }catch(error){
      setAlerta({
        error : true,
        mensaje : error.response.data?.msg
      })
    }
  }
  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Recupera tu acceso y no pierdas tus <span className='text-slate-700'>proyectos</span></h1>
      {alerta.mensaje && <Alerta alerta={alerta} />}
      <form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg p-10'>
        <div className='my-5'>
          <label htmlFor="forgetEmail" className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
          <input type="email" id="forgetEmail" className='w-full mt-3 border rounded-xl p-3' placeholder="Introduce tu email" value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <input type="submit" id="forgetSubmit" value="Enviar Instrucciones" className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5" />
      </form>
      <nav className='lg:flex lg:justify-between'>
        <Link to="/" className="block text-center my-5 text-slate-500 text-sm">¿Ya tienes una cuenta? Inicia sesión</Link>
        <Link to="/registrar" className="block text-center my-5 text-slate-500 text-sm">¿No tienes una cuenta? Registrate</Link>
      </nav>
    </>
  )
}

export default OlvidePassword;