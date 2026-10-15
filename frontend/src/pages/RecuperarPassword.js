import React, { useState } from 'react';
import axios from 'axios';

const RecuperarPassword = () => {
    const [email, setEmail] = useState('');
    const [cedula, setCedula] = useState(''); // Nuevo campo

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos ambos datos al backend
            const res = await axios.post('http://localhost:5000/api/auth/recuperar-password', { email, cedula });
            alert("✅ " + res.data.msg);
        } catch (error) {
            // Aquí aparecerá el mensaje de "No pertenece al usuario"
            alert("❌ " + (error.response?.data?.msg || "Error de validación"));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Validar Identidad</h2>
            <p style={{ textAlign: 'center', fontSize: '14px' }}>Ingrese sus datos para recibir el enlace</p>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Cédula de Identidad:</label>
                    <input 
                        type="text" 
                        value={cedula} 
                        onChange={(e) => setCedula(e.target.value)} 
                        placeholder="Ingrese su cédula"
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
                        required 
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Ingrese su correo registrado"
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
                        required 
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Verificar y Enviar Enlace
                </button>
            </form>
        </div>
    );
};

export default RecuperarPassword;