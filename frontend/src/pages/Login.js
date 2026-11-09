// Componente de inicio de sesión y registro dinámico adaptado con campos separados para nombres y apellidos
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarOlvidado, setMostrarOlvidado] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState('');
    const [mostrarRegistroRol, setMostrarRegistroRol] = useState(false);
    const [nombresReg, setNombresReg] = useState('');
    const [apellidosReg, setApellidosReg] = useState('');
    const [cedulaReg, setCedulaReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passReg, setPassReg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', respuesta.data.token); 
            navigate('/dashboard');
        } catch (error) {
            setMostrarOlvidado(true);
            alert(error.response?.data?.msg || "Error en el servidor");
        }
    };

    const handleRolChange = (e) => {
        const rol = e.target.value;
        setRolSeleccionado(rol);
        setMostrarRegistroRol(rol !== '');
    };

    const handleRegistroRolSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/registro', {
                nombres: nombresReg,
                apellidos: apellidosReg,
                cedula: cedulaReg,
                email: emailReg,
                password: passReg,
                rol: rolSeleccionado
            });
            alert('Usuario registrado exitosamente');
            setMostrarRegistroRol(false);
            setRolSeleccionado('');
            setNombresReg('');
            setApellidosReg('');
            setCedulaReg('');
            setEmailReg('');
            setPassReg('');
        } catch (error) {
            alert(error.response?.data?.msg || "Error al registrar usuario");
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                {mostrarOlvidado && (
                    <div className="forgot-password">
                        <span onClick={() => navigate('/recuperar-password')}>
                            ¿Olvidaste tu contraseña?
                        </span>
                    </div>
                )}

                <button type="submit" className="btn-entrar">
                    Entrar
                </button>
            </form>

            <div className="role-section">
                <label htmlFor="selectRol">Por favor seleccione un Perfil:</label>
                <select id="selectRol" value={rolSeleccionado} onChange={handleRolChange}>
                    <option value="" disabled>Seleccione...</option>
                    <option value="Secretario/a">Secretario/a</option>
                    <option value="Coordinador de catequesis">Coordinador de catequesis</option>
                    <option value="Catequista">Catequista</option>
                </select>
            </div>

            {mostrarRegistroRol && (
                <div className="register-rol-box">
                    <h3>Registro para: {rolSeleccionado}</h3>
                    <form onSubmit={handleRegistroRolSubmit}>
                        <div className="form-group">
                            <label>Nombres:</label>
                            <input 
                                type="text" 
                                value={nombresReg} 
                                onChange={(e) => setNombresReg(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos:</label>
                            <input 
                                type="text" 
                                value={apellidosReg} 
                                onChange={(e) => setApellidosReg(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Cédula:</label>
                            <input 
                                type="text" 
                                value={cedulaReg} 
                                onChange={(e) => setCedulaReg(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo:</label>
                            <input 
                                type="email" 
                                value={emailReg} 
                                onChange={(e) => setEmailReg(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input 
                                type="password" 
                                value={passReg} 
                                onChange={(e) => setPassReg(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-registrar">
                            Completar Registro
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Login;