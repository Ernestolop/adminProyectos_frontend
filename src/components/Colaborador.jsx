import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";

const Colaborador = ({ colaborador }) => {

    const { nombre, email } = colaborador;
    const { eliminarColaborador } = useProyectos();
    const admin = useAdmin();



    const handleEliminarColaborador = () => {
        if (confirm(`¿Estás seguro de eliminar a ${nombre} como colaborador del proyecto?`)) {
            eliminarColaborador(colaborador)
        }
    }

    return (
        <div className="border-b p-5 flex justify-between items-center ">
            <div>
                <p> {nombre} </p>
                <p className="text-sm text-gray-700"> {email} </p>
            </div>
            {
                admin &&
                <div>
                    <button onClick={handleEliminarColaborador} className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">Eliminar</button>
                </div>
            }
        </div>
    )
}

export default Colaborador