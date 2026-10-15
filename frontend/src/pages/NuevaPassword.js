import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NuevaPassword = () => {
    const [password, setPassword] = useState('');
    const [emailUsuario, setEmailUsuario] = useState(''); // Estado para que el usuario escriba
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos AMBOS: la contraseña y el email que el usuario escribió
            const res = await axios.post(`http://localhost:5000/api/auth/nuevo-password/${token}`, { 
                password, 
                email: emailUsuario 
            });
            
            alert("✅ " + res.data.msg);
            navigate('/login');
        } catch (error) {
            // Aquí aparecerá el mensaje: "El correo de recuperación no es el mismo..."
            alert("❌ " + (error.response?.data?.msg || "Error al actualizar"));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Confirmar Identidad</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Confirma tu Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={emailUsuario} 
                        onChange={(e) => setEmailUsuario(e.target.value)} 
                        placeholder="Escribe el correo de esta cuenta"
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
                        required 
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Nueva Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Nueva clave"
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
                        required 
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Cambiar Contraseña
                </button>
            </form>
        </div>
    );
};

export default NuevaPassword;