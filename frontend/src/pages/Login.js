import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // Estado para capturar lo que el usuario escribe
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarOlvidado, setMostrarOlvidado] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aquí conectaremos con tu backend mañana
            console.log("Intentando iniciar sesión con:", { email, password });
            const respuesta = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            // Guardar Token
            localStorage.setItem('token', respuesta.data.token); 

            console.log("Login exitoso, token guardado");
            navigate('/dashboard');
            
        } catch (error) {
            console.error("Error al loguear:", error.response.data.msg);
            setMostrarOlvidado(true);
            alert(error.response.data.msg);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}
                        required 
                    />
                </div>
                {/* OPCIÓN OLVIDASTE TU CONTRASEÑA (Solo aparece tras un error) */}
                {mostrarOlvidado && (
                    <div style={{ marginBottom: '15px', textAlign: 'right' }}>
                        <span 
                            onClick={() => navigate('/recuperar-password')} 
                            style={{ color: '#2c3e50', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            ¿Olvidaste tu contraseña?
                        </span>
                    </div>
                )}

                <button 
                    type="button" 
                    onClick={() => navigate('/registro')}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer' }}
                >
                    Registrarse
                </button>

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;
                