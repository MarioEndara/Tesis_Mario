import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generarCertificadoCatequesis } from '../utils/generarPDF';

const ConsultarCatequesis = () => {
    const navigate = useNavigate();
    const [alumnos, setAlumnos] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    // Sacamos la función para que sea accesible desde cualquier parte
    const obtenerAlumnos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/catequesis');
            setAlumnos(res.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        obtenerAlumnos();
    }, []);

    const filtrados = alumnos.filter(a => 
        a.apellidoEstudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.cedulaEstudiante.includes(busqueda)
    );

    const eliminarAlumno = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
            try {
                // Asegúrate de que el puerto sea el correcto (5000 según tu GET de arriba)
                await axios.delete(`http://localhost:5000/api/catequesis/${id}`);
                obtenerAlumnos(); // Ahora sí funciona porque la función es global
                alert('Eliminado con éxito');
            } catch (error) {
                console.error("Error al eliminar", error);
                alert('Hubo un error al eliminar');
            }
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ color: '#2c3e50' }}>LISTA DE CATEQUESIS</h2>
                <input 
                    type="text" 
                    placeholder="Buscar por Apellido o Cédula..." 
                    style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                        <th style={{ padding: '10px' }}>ESTUDIANTE</th>
                        <th style={{ padding: '10px' }}>CÉDULA</th>
                        <th style={{ padding: '10px' }}>NIVEL</th>
                        <th style={{ padding: '10px' }}>REPRESENTANTE</th>
                        <th style={{ padding: '10px' }}>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrados.map(a => (
                        <tr key={a._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{a.nombreEstudiante} {a.apellidoEstudiante}</td>
                            <td style={{ padding: '10px' }}>{a.cedulaEstudiante}</td>
                            <td style={{ padding: '10px' }}>{a.nivel}</td>
                            <td style={{ padding: '10px' }}>{a.nombreRepresentante}</td>
                            <td style={{ padding: '10px' }}>
                                <button 
                                    onClick={() => navigate(`/inscribir-catequesis/${a._id}`)}
                                    style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    EDITAR
                                </button>
                                <button 
                                    onClick={() => eliminarAlumno(a._id)} // CAMBIADO: reg por a
                                    style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginLeft: '10px' }}
                                >
                                    ELIMINAR
                                </button>
                                <button 
                                onClick={() => generarCertificadoCatequesis(a)} 
                                style={{ 
                                    backgroundColor: '#f39c12', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '5px 10px', 
                                    borderRadius: '3px', 
                                    cursor: 'pointer', 
                                    marginLeft: '10px',
                                    fontWeight: 'bold'
                                }}
                                >
                                    PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConsultarCatequesis;