import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');

    // Si no hay token, se lo envía al login
    if (!token) {
        return <Navigate to="/" />;
    }

    // Si hay token, lo dejamos ver la página
    return children;
};

export default RutaPrivada;