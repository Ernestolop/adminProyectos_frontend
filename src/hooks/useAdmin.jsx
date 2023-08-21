import useProyectos from "./useProyectos";
import useAuth from "./useAuth";

const useAdmin = () => {
    const {auth} = useAuth();
    const {proyecto} = useProyectos();

    return proyecto?.creador === auth?._id;
}

export default useAdmin