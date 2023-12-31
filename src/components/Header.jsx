import { Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import Busqueda from "./Busqueda";  
import useAuth from "../hooks/useAuth";

const Header = () => {

    const {handleBuscador, cerrarSesionProyectos} = useProyectos();
    const {cerrarSesionAuth} = useAuth();

    const handleCerrarSesion = () => {
        cerrarSesionAuth();
        cerrarSesionProyectos();
        localStorage.removeItem('token');
    }

    return (
        <header className="px-4 py-5 bg-white border-b">
            <div className="md:flex md:justify-between">
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">UpTask</h2>
                <div className="flex items-center gap-4 flex-col md:flex-row">
                    <button onClick={handleBuscador} type="button" className="font-bold uppercase">Buscar Proyectos</button>
                    <Link to="/proyectos" className="font-bold uppercase">
                        Proyectos
                    </Link>
                    <button onClick={handleCerrarSesion} type="buttom" className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold">
                        Cerrar Sesión
                    </button>
                    <Busqueda/>
                </div>
            </div>
        </header>
    )
}

export default Header