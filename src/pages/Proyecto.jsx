import { useEffect } from "react";
import { useParams, Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import Tarea from "../components/Tarea";
import Alerta from "../components/Alerta";
import Colaborador from "../components/Colaborador";
import useAdmin from "../hooks/useAdmin";
import io from "socket.io-client";

let socket;

const Proyecto = () => {

  const { obtenerProyecto, proyecto, cargando, handleModalFormTarea, alerta, agregarTareaSocket, eliminarTareaSocket, editarTareaSocket, tareaEstadoSocket } = useProyectos();
  const admin = useAdmin();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit('abrir-proyecto', params.id);
  }, []);

  useEffect(() => {
    socket.on('agregar-tarea', tareaNueva => {
      if (tareaNueva.proyecto === proyecto._id) {
        agregarTareaSocket(tareaNueva);
      }
    });
    socket.on('eliminar-tarea', tareaEliminada => {
      if (tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaSocket(tareaEliminada);
      }
    });
    socket.on('editar-tarea', tareaEditada => {
      if (tareaEditada.proyecto._id === proyecto._id) {
        editarTareaSocket(tareaEditada);
      }
    });
    socket.on('estado-tarea', tareaEditada => {
      if (tareaEditada.proyecto._id === proyecto._id) {
        tareaEstadoSocket(tareaEditada);
      }
    });
  });

  const params = useParams();
  const { nombre } = proyecto;

  if (cargando) return <p>Cargando...</p>
  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-black text-4xl">{nombre}</h1>
        {admin && <div className="flex items-center gap-1 text-gray-400 hover:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
          <Link to={`/proyectos/editar/${params.id}`} className="uppercase font-bold">Editar</Link>
        </div>}
      </div>
      {admin && <button onClick={handleModalFormTarea} type="button" className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Nueva tarea</span>
      </button>
      }
      <p className="font-bold text-xl mt-10 ">Tareas del Proyecto</p>
      {alerta?.mensaje && <Alerta alerta={alerta} />}
      <div className="bg-white shadow mt-10 rounded-lg">
        {proyecto.tareas?.length ? (
          proyecto.tareas?.map(task => (<Tarea key={task._id} tarea={task} />))
        ) :
          (<p className="text-center my-5 p-10">Este proyecto aún no tiene tareas</p>)
        }
      </div>
      {admin &&
        <div className="flex items-center justify-between mt-10">
          <p className="font-bold text-xl">Colaboradores del Proyecto</p>
          <Link to={`/proyectos/nuevo-colaborador/${params.id}`} className="text-gray-400 uppercase font-bold hover:text-gray-500">Añadir colaborador</Link>
        </div>
      }
      {admin &&
        <div className="bg-white shadow mt-10 rounded-lg">
          {proyecto.colaboradores?.length ? (
            proyecto.colaboradores?.map(colaborador => (<Colaborador key={colaborador._id} colaborador={colaborador} />))
          ) :
            (<p className="text-center my-5 p-10">Este proyecto aún no tiene colaboradores</p>)
          }
        </div>
      }

      <ModalFormularioTarea />
    </>
  )
}

export default Proyecto