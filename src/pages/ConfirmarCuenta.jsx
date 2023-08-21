import {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';
import Alerta from '../components/Alerta';

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const {token} = useParams();
  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/confirmar-cuenta/${token}`;
        const {data} = await axios(url);
        setAlerta({
          mensaje: data.msg,
          error: false
        });
        setCuentaConfirmada(true);
      } catch (error) {
        setAlerta({
          error: true,
          mensaje: error.response.data.msg
        });
      }
    } 
      confirmarCuenta();
  }, []);

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Confirma tu cuenta y comienza a crear tus <span className='text-slate-700'>proyectos</span></h1>
      <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
      {alerta.mensaje && <Alerta alerta={alerta} />}
      {cuentaConfirmada && (
        <Link to="/" className="block text-center my-5 text-slate-500 text-sm">Iniciar Sesión</Link>
      )}
      </div>
    </>
  )
}

export default ConfirmarCuenta;