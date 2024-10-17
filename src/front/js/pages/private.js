import React , { useContext, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/paginaUsuario.css";
import { Context } from "../store/appContext";

const Private = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    const handleLogout = () => {
        actions.cerrarSesion();
        navigate('/');
    };

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (!token) {
            navigate('/');
        } else {
            console.log("Token válido, usuario autenticado");
        }
    }, [navigate]);

    return (
        <div>
            <div className="vip-container">
                <h2>Acabas de acceder a nuestro contenido PRIVADO</h2>
                <img
                    src="https://tercetocomunicacion.es/wp-content/uploads/2017/05/minions.gif"
                    alt="Bienvenido"
                    className="welcome-image"
                />
                <p>Te agradecemos que te hayas registrado con nosotros</p>
            </div>
            <div className="private-container">
                <br></br>
                <p>Este contenido es exclusivo para usuarios registrados</p>
                <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
};

export default Private;