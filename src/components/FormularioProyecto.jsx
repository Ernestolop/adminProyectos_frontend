
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Alerta from '../components/Alerta'
import useProyectos from '../hooks/useProyectos'

const FormularioProyecto = () => {

    const [id , setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [cliente, setCliente] = useState('');
    const [enviando, setEnviando] = useState(false);

    const { alerta, mostrarAlerta, submitProyecto, proyecto } = useProyectos();

    const params = useParams();
    useEffect(() => {
        if (params.id) {
            setId(params.id);
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]);
            setCliente(proyecto.cliente);
        }
    }, [])

    const handleSubmit = async e => {
        e.preventDefault();
        if(nombre.trim() === '' || descripcion.trim() === '' || fechaEntrega.trim() === '' || cliente.trim() === ''){
            mostrarAlerta({
                mensaje: 'Todos los campos son obligatorios',
                error: true
            })
            return;
        }

        setEnviando(true);

        //Pasar datos hacia el provider
        await submitProyecto({
            id,
            nombre,
            descripcion,
            fechaEntrega,
            cliente
        });

        //Reiniciar el form
        setId(null);
        setNombre('');
        setDescripcion('');
        setFechaEntrega('');
        setCliente('');

        setEnviando(false);

    }

  return (
    <form className="bg-white py-10 px-5 md:w-1/2 rounded-lg"
    onSubmit={handleSubmit}
    >
        {alerta.mensaje && <Alerta alerta={alerta} />}
        <div className='mb-5'>
            <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="nombre">
                Nombre del Proyecto
            </label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} type="text" id="nombre" placeholder="Ingresa el nombre del proyecto" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" />
        </div>
        <div className='mb-5'>
            <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="descripcion">
                Descripción
            </label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} id="descripcion" placeholder="Describe el proyecto" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" />
        </div>
        <div className='mb-5'>
            <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="fechaEntrega">
                Fecha de Entrega
            </label>
            <input type="date" value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} id="fechaEntrega" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" />
        </div>
        <div className='mb-5'>
            <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="cliente">
                Nombre del Cliente
            </label>
            <input value={cliente} onChange={e => setCliente(e.target.value)} type="text" id="cliente" placeholder="Ingresa el nombre del cliente" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" />
        </div>
        <input disabled={enviando} type="submit" className={`rounded  ${enviando ? 'cursor-no-drop' : 'cursor-pointer'} hover:bg-sky-700 transition-colors bg-sky-600 p-3 uppercase text-white w-full ${enviando ? 'opacity-30' : ''}`} value={id ? "Guardar Cambios" : "Crear Proyecto"}  />
    </form>
  )
}

export default FormularioProyecto