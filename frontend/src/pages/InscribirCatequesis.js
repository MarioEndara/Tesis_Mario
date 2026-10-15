import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const InscribirCatequesis = () => {
    const { id } = useParams(); // Detecta si hay un ID en la URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombreEstudiante: '',
        apellidoEstudiante: '',
        cedulaEstudiante: '',
        fechaNacimiento: '',
        nivel: '',
        nombreRepresentante: '',
        telefonoRepresentante: '',
        direccion: ''
    });

    const { nombreEstudiante, apellidoEstudiante, cedulaEstudiante, fechaNacimiento, nivel, nombreRepresentante, telefonoRepresentante, direccion } = formData;

    // EFECTO: Si hay un ID, buscamos los datos del alumno en la DB
    useEffect(() => {
        const obtenerAlumno = async () => {
            if (id) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/catequesis/${id}`);
                    const d = res.data;
                    setFormData({
                        ...d,
                        // Formateamos la fecha para el input date (YYYY-MM-DD)
                        fechaNacimiento: d.fechaNacimiento ? d.fechaNacimiento.substring(0, 10) : ''
                    });
                } catch (error) {
                    console.error("Error al cargar datos", error);
                }
            }
        };
        obtenerAlumno();
    }, [id]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            if (id) {
                // MODO EDICIÓN: Usamos PUT
                await axios.put(`http://localhost:5000/api/catequesis/${id}`, formData);
                alert("¡Inscripción actualizada correctamente!");
                navigate('/consultar-catequesis');
            } else {
                // MODO NUEVO: Usamos POST
                const res = await axios.post('http://localhost:5000/api/catequesis', formData);
                alert(res.data.msg);
                setFormData({
                    nombreEstudiante: '', apellidoEstudiante: '', cedulaEstudiante: '',
                    fechaNacimiento: '', nivel: '', nombreRepresentante: '',
                    telefonoRepresentante: '', direccion: ''
                });
            }
        } catch (error) {
            alert(error.response?.data?.msg || "Error al procesar");
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>
                {id ? 'EDITAR INSCRIPCIÓN' : 'INSCRIPCIÓN A CATEQUESIS'}
            </h2>
            <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                
                <input type="text" name="nombreEstudiante" placeholder="Nombres del Estudiante" value={nombreEstudiante} onChange={onChange} required />
                <input type="text" name="apellidoEstudiante" placeholder="Apellidos del Estudiante" value={apellidoEstudiante} onChange={onChange} required />
                <input type="text" name="cedulaEstudiante" placeholder="Cédula" value={cedulaEstudiante} onChange={onChange} required />
                <input type="date" name="fechaNacimiento" value={fechaNacimiento} onChange={onChange} required />
                
                <select name="nivel" value={nivel} onChange={onChange} required style={{ padding: '10px', borderRadius: '5px' }}>
                    <option value="">-- Seleccionar Nivel --</option>
                    <option value="Nivel 1">Nivel 1 (Iniciación)</option>
                    <option value="Nivel 2">Nivel 2 (Primera Comunión)</option>
                    <option value="Nivel 3">Nivel 3 (Post-Comunión)</option>
                    <option value="Confirmación 1">Confirmación 1</option>
                    <option value="Confirmación 2">Confirmación 2</option>
                </select>

                <input type="text" name="nombreRepresentante" placeholder="Nombre del Representante" value={nombreRepresentante} onChange={onChange} required />
                <input type="text" name="telefonoRepresentante" placeholder="Teléfono de Contacto" value={telefonoRepresentante} onChange={onChange} required />
                
                <input type="text" name="direccion" placeholder="Dirección" value={direccion} onChange={onChange} required style={{ gridColumn: '1 / span 2' }} />

                <button type="submit" style={{ gridColumn: '1 / span 2', padding: '12px', backgroundColor: id ? '#27ae60' : '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {id ? 'GUARDAR CAMBIOS' : 'REGISTRAR INSCRIPCIÓN'}
                </button>

                {id && (
                    <button type="button" onClick={() => navigate('/consultar-catequesis')} style={{ gridColumn: '1 / span 2', padding: '10px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        CANCELAR EDICIÓN
                    </button>
                )}
            </form>
        </div>
    );
};

export default InscribirCatequesis;