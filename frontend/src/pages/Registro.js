import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
    const [formData, setFormData] = useState({
        rol: 'Usuario',
        nombres: '',
        apellidos: '',
        cedula: '',
        direccion: '',
        fechaNacimiento: '',
        email: '',
        password: '',
        nombrePadre: '',
        nombreMadre: '',
        contacto: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        try {
            if (formData.rol === 'Usuario') {
                const usuarioData = {
                    nombres: formData.nombres,
                    apellidos: formData.apellidos,
                    cedula: formData.cedula,
                    direccion: formData.direccion,
                    fechaNacimiento: formData.fechaNacimiento,
                    email: formData.email,
                    password: formData.password,
                    rol: 'Usuario',
                    padres: {
                        nombrePadre: formData.nombrePadre,
                        nombreMadre: formData.nombreMadre,
                        contacto: formData.contacto
                    }
                };

                const res = await axios.post('http://localhost:5000/api/usuarios', usuarioData);
                alert(res.data.msg);
                navigate('/dashboard');
            } else {
                const operadorData = {
                    nombres: formData.nombres,
                    apellidos: formData.apellidos,
                    cedula: formData.cedula,
                    email: formData.email,
                    password: formData.password,
                    rol: formData.rol
                };

                const res = await axios.post('http://localhost:5000/api/auth/registro', operadorData);
                alert(res.data.msg);
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.msg || "Error al registrar. Intenta con otra cédula.");
        }
    };

    const styleInput = { width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc' };

    return (
        <div style={{ maxWidth: '450px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center' }}>Registro en el Sistema</h2>
            <form onSubmit={handleRegistro}>
                <label>Tipo de Cuenta / Rol:</label>
                <select name="rol" value={formData.rol} onChange={handleChange} style={styleInput}>
                    <option value="Usuario">Usuario</option>
                    <option value="Secretario/a">Secretario/a</option>
                    <option value="Coordinador de Catequesis">Coordinador de Catequesis</option>
                    <option value="Catequista">Catequista</option>
                </select>

                <input type="text" name="nombres" placeholder="Nombres" onChange={handleChange} style={styleInput} required />
                <input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} style={styleInput} required />
                <input type="text" name="cedula" placeholder="Cédula" onChange={handleChange} style={styleInput} required />
                <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} style={styleInput} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} style={styleInput} required />

                {formData.rol === 'Usuario' && (
                    <>
                        <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} style={styleInput} required />
                        <label>Fecha de Nacimiento:</label>
                        <input type="date" name="fechaNacimiento" onChange={handleChange} style={styleInput} required />

                        <hr />
                        <p>Datos de los Padres:</p>
                        <input type="text" name="nombrePadre" placeholder="Nombre del Padre" onChange={handleChange} style={styleInput} />
                        <input type="text" name="nombreMadre" placeholder="Nombre de la Madre" onChange={handleChange} style={styleInput} />
                        <input type="text" name="contacto" placeholder="Teléfono de contacto" onChange={handleChange} style={styleInput} />
                    </>
                )}

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>
                    Finalizar Registro
                </button>
            </form>
        </div>
    );
};

export default Registro;