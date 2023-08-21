import { useState } from "react";
import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";

const Tarea = ({ tarea }) => {

    const [cambiandoEstado, setCambiandoEstado] = useState(false);
    const { _id, nombre, descripcion, prioridad, fechaEntrega, estado } = tarea;
    const { handleModalEditarTarea, handleEliminarTarea, cambiarEstadoTarea } = useProyectos();
    const admin = useAdmin();

    const handleEstadoTarea = async () => {
        setCambiandoEstado(true);
        await cambiarEstadoTarea(_id);
        setCambiandoEstado(false);
    }

    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className="text-xl mb-2"> {nombre} </p>
                <p className="text-gray-500 text-sm uppercase mb-2"> {descripcion} </p>
                <p className="text-xm mb-2"> Fecha de Entrega: {formatearFecha(fechaEntrega)} </p>
                <p className="text-gray-600 mb-2"> Prioridad: {prioridad} </p>
                {estado && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white"> Completado por: {tarea.completado.nombre} </p>}
            </div>
            <div className="flex gap-2 flex-col lg:flex-row">
                <button disabled={cambiandoEstado} className={`${estado ? 'bg-sky-600' : 'bg-gray-600'}  px-4 py-3 text-white uppercase font-bold text-sm rounded-lg ${cambiandoEstado && 'bg-opacity-50 text-opacity-50 cursor-not-allowed border-opacity-50'}`} onClick={() => handleEstadoTarea()}> {estado ? 'Completa' : 'Incompleta'} </button>
                {admin && <button className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" onClick={() => handleModalEditarTarea(tarea)}>Editar</button>}
                {admin && <button className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" onClick={() => handleEliminarTarea(tarea)} >Eliminar</button>}
            </div>
        </div>
    )
}

export default Tarea