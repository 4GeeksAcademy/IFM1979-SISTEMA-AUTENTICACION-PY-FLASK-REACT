import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/private.css";
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
            console.log("No se encontró token, redirigiendo a la página de inicio");
            navigate('/');
            return; // No se ejecuta más código si no hay token
        }

        // Validar el token
        fetch(`${process.env.BACKEND_URL}/api/verify-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        })
        .then(response => {
            if (response.ok) {
                // Token OK
                return response.json();
            } else {
                console.log("Token inválido, redirigiendo al inicio");
                navigate('/');
                throw new Error('Token inválido'); // Error para manejarlo en el catch
            }
        })
        .then(data => {
            console.log("Datos recibidos del servidor al verificar token:", data); 

            if (!data.valid) {
                console.log("Token inválido, redirigiendo al inicio");
                navigate('/');
            } else {
                console.log("Token válido, usuario autenticado");
            }
        })
        .catch(error => {
            console.error("Error validando el token", error);
            navigate('/'); 
        });
    }, [navigate]);

    return (
        <div>
            <div className="image-container">
                <h2>Esta es tu Página Privada</h2>
                <img
                    src="https://media1.tenor.com/m/NnKwaHrSSikAAAAC/bob-esponja.gif"
                    alt="Bienvenida"
                    className="welcome-image"
                />
                <p>Espero que te guste tu GIF</p>
            </div>
            <div className="private-container">
                <p>Podrás ver este contenido si eres miembro exclusivo</p>
                <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
};

export default Private;
