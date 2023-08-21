import { useState, useEffect, createContext } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import io from "socket.io-client";
import useAuth from "../hooks/useAuth";

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormTarea, setModalFormTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [colaborador, setColaborador] = useState({});
    const [buscador, setBuscador] = useState(false);
    const navigate = useNavigate();
    const {auth} = useAuth();

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
                const { data } = await axios(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos`, config);
                setProyectos(data);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos();
    }, [auth]);

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, []);

    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 3000);
    }

    const submitProyecto = async proyecto => {
        if (proyecto.id) {
            await editarProyecto(proyecto);
        } else {
            await nuevoProyecto(proyecto);
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos`, proyecto, config);

            setProyectos([...proyectos, data]);

            setAlerta({
                error: false,
                mensaje: 'Proyecto creado correctamente'
            });

        } catch (error) {
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            });
        } finally {
            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);
        }
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${proyecto.id}`, proyecto, config);

            //Sincronizar con el state
            const proyectosActualizados = proyectos.map(project => project._id === data._id ? data : project);
            setProyectos(proyectosActualizados);

            //Mostar alerta
            setAlerta({
                error: false,
                mensaje: 'Proyecto editado correctamente'
            });
        } catch (error) {
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            });
        } finally {
            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
            const { data } = await axios(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${id}`, config);
            setProyecto(data);
        } catch (error) {
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            })
            navigate('/proyectos');
        } finally {
            setCargando(false);
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${id}`, config);

            //Sincronizar con el state
            const proyectosActualizados = proyectos.filter(project => project._id !== id);
            setProyectos(proyectosActualizados);

            //Mostar alerta
            setAlerta({
                error: false,
                mensaje: data.msg
            })
        } catch (error) {
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            })
        } finally {
            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);
        }
    }

    const handleModalFormTarea = () => {
        setTarea({});
        setModalFormTarea(!modalFormTarea);
    }

    const submitTarea = async tarea => {

        if (tarea?.id) {
            await editarTarea(tarea);
            return;
        }
        await crearTarea(tarea);
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormTarea(!modalFormTarea);
    }

    const crearTarea = async tarea => {
        const token = localStorage.getItem('token');
        if (!token) return
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tareas`, tarea, config);
            console.log(data)
            setModalFormTarea(false);
            //Socket.io
            socket.emit('nueva-tarea', data);
        } catch (error) {
            setModalFormTarea(false);
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            })
        } finally {
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }
    }

    const editarTarea = async tarea => {
        const token = localStorage.getItem('token');
        if (!token) return
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/tareas/${tarea.id}`, tarea, config);
            setModalFormTarea(false);
            socket.emit('tarea-editada', data);
        } catch (error) {
            setModalFormTarea(false);
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            })
        } finally {
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }
    }

    const handleEliminarTarea = async tarea => {
        if (!confirm('¿Estas seguro de eliminar esta tarea? Esta accion es irreversible')) return;
        eliminarTarea(tarea);
    }

    const eliminarTarea = async tarea => {
        const token = localStorage.getItem('token');
        if (!token) return
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tareas/${tarea._id}`, config);
            setAlerta({
                error: false,
                mensaje: data.msg
            })
            //Socket.io
            socket.emit('tarea-eliminada', tarea);
        } catch (error) {
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            })
        } finally {
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }
    }

    const submitColaborador = async email => {
        setCargando(true);
        const token = localStorage.getItem('token');
        if (!token) return
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos/colaboradores`, { email }, config);
            setColaborador(data);
            setAlerta({});
        } catch (error) {
            mostrarAlerta({
                error: true,
                mensaje: error.response.data.msg
            });
        } finally {
            setCargando(false);
        }
    }

    const agregarColaborador = async email => {
        const token = localStorage.getItem('token');
        if (!token) return
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos/colaboradores/${proyecto._id}`, email, config);
            setProyecto(data);
            setAlerta({
                error: false,
                mensaje: 'Colaborador agregado correctamente'
            });
            setColaborador({});
        } catch (error) {
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            })
        } finally {
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }
    }

    const eliminarColaborador = async colaborador => {
        const token = localStorage.getItem('token');
        if (!token) return
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config);
            setAlerta({
                error: false,
                mensaje: data.msg
            });
            const proyectoActualizado = { ...proyecto };
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colab => colab._id !== colaborador._id);
            setProyecto(proyectoActualizado);
        } catch (error) {
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            })
        } finally {
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }
    }

    const cambiarEstadoTarea = async taskId => {
        const token = localStorage.getItem('token');
        if (!token) return
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tareas/estado/${taskId}`, {}, config);
            //Socket.io
            socket.emit('tarea-estado', data);
        } catch (error) {
            setAlerta({
                error: true,
                mensaje: error.response.data.msg
            })
        } finally {
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    const agregarTareaSocket = tarea => {
        const proyectoActualizado = { ...proyecto, tareas: [...proyecto.tareas, tarea] };
        setProyecto(proyectoActualizado);
    }

    const eliminarTareaSocket = tarea => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
        setProyecto(proyectoActualizado);
    }

    const editarTareaSocket = tarea => {
        const tareasActualizadas = proyecto.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState);
        const proyectoActualizado = { ...proyecto, tareas: tareasActualizadas };
        setProyecto(proyectoActualizado);
    }

    const tareaEstadoSocket = tarea => {
        const tareasActualizadas = proyecto.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState);
        const proyectoActualizado = { ...proyecto, tareas: tareasActualizadas };
        setProyecto(proyectoActualizado);
    }

    const cerrarSesionProyectos = () => {
        setProyectos([]);
        setProyecto({});
        setColaborador({});
        setTarea({});
        setAlerta({});
        setCargando(false);
        setModalFormTarea(false);
        setBuscador(false);
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormTarea,
                handleModalFormTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleEliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                eliminarColaborador,
                cambiarEstadoTarea,
                buscador,
                handleBuscador,
                agregarTareaSocket,
                eliminarTareaSocket,
                editarTareaSocket,
                tareaEstadoSocket,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export default ProyectosContext
export { ProyectosProvider }