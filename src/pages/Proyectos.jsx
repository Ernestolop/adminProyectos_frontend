
import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto"
import Alerta from "../components/Alerta";

const Proyectos = () => {

  const { proyectos, alerta } = useProyectos();
  

  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>
      {alerta?.mensaje && <Alerta alerta={alerta} />}
      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length > 0 ? 
          proyectos.map(proyecto => (
            <PreviewProyecto
            key={proyecto._id}
            proyecto={proyecto} 
            />
          ))
         :
          <p className="p-5 text-center text-gray-400 uppercase">Aún no tienes proyectos</p>
        }
      </div>
    </>
  )
}

export default Proyectos