import FormularioColaborador from "../components/FormularioColaborador"
import { useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
import Alerta from "../components/Alerta"

const NuevoColaborador = () => {

    const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador } = useProyectos();
    const params = useParams();

    useEffect(() => {
        obtenerProyecto(params.id);
    }, [])

    return (
        <>
            <h1 className="text-4xl font-black">Añadir Colaborador(a) al proyecto : {proyecto?.nombre}</h1>
            <div className="flex mt-10 justify-center">
                <FormularioColaborador />
            </div>
            {cargando ? <p className="text-center">Cargando...</p> :colaborador?._id && (
             <div className="flex justify-center mt-10">
                <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
                    <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>
                    <div className="flex justify-between items-center">
                        <p> {colaborador.nombre} </p>
                        <button onClick={() => agregarColaborador({email: colaborador.email})} type="button" className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm">Agregar al proyecto</button>
                    </div>
                </div>
             </div>
            )}
        </>
    )
}

export default NuevoColaborador