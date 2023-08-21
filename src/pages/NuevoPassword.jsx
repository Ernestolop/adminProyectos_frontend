import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {

  const [tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passswordModificado, setPassswordModificado] = useState(false);

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const comProbarToken = async () => {
      try {
        await axios(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/olvide-password/${token}`)
        setTokenValido(true);
      } catch (error) {
        setAlerta({
          error: true,
          mensaje: error.response.data?.msg
        })
      }
    }
    comProbarToken();
  }, [])

  const handleSubmit = async e => {
    e.preventDefault();
    if(password !== passwordRepeat){
      setAlerta({
        error: true,
        mensaje: 'Las contraseñas no coinciden'
      })
      return;
    }

    if(password.length < 6){
      setAlerta({
        error: true,
        mensaje: 'La contraseña debe tener al menos 6 caracteres'
      })
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/olvide-password/${token}`, {
        password
      })
      setAlerta({
        error: false,
        mensaje: 'Contraseña actualizada correctamente'
      }) 
      setPassswordModificado(true);
      setTokenValido(false);
      setPassword('');
      setPasswordRepeat('');
    } catch (error) {
      setAlerta({
        error: true,
        mensaje: error.response.data?.msg
      })
    }

  }

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Restablece tu contraseña para acceder a tus <span className='text-slate-700'>proyectos</span></h1>
      {alerta.mensaje && <Alerta alerta={alerta} />}
      {tokenValido && (
        <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
          <div className='my-5'>
            <label htmlFor="newPassword" className='uppercase text-gray-600 block text-xl font-bold'>Contraseña</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="newPassword" className='w-full mt-3 border rounded-xl p-3' placeholder="Introduce tu contraseña" />
          </div>
          <div className='my-5'>
            <label htmlFor="newPasswordRepeat" className='uppercase text-gray-600 block text-xl font-bold'>Repetir Contraseña</label>
            <input value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)} type="password" id="newPasswordRepeat" className='w-full mt-3 border rounded-xl p-3' placeholder="Introduce tu contraseña de nuevo" />
          </div>
          <input type="submit" id="newSubmit" value="Reestablecer Contraseña" className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5" />
        </form>
      )}
      {passswordModificado && (
        <Link to="/" className="block text-center my-5 text-slate-500 text-sm">Inicia sesión</Link>
      )}
    </>
  )
}

export default NuevoPassword