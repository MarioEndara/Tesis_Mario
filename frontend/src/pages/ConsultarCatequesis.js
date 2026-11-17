// Vista de consulta de catequesis adaptada con registro de asistencias para catequistas y gestión administrativa
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generarCertificadoCatequesis } from '../utils/generarPDF';

const ConsultarCatequesis = () => {
    const navigate = useNavigate();
    const [alumnos, setAlumnos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [fechaAsistencia, setFechaAsistencia] = useState(new Date().toISOString().split('T')[0]);
    const rolUsuario = (localStorage.getItem('rol') || '').toLowerCase();
    const esCatequista = rolUsuario === 'catequista';

    const obtenerAlumnos = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/catequesis', {
                headers: { 'x-auth-token': token }
            });
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
                await axios.delete(`http://localhost:5000/api/catequesis/${id}`);
                obtenerAlumnos();
                alert('Eliminado con éxito');
            } catch (error) {
                console.error("Error al eliminar", error);
                alert('Hubo un error al eliminar');
            }
        }
    };

    const marcarAsistencia = async (id, estado) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/catequesis/${id}/asistencia`,
                { fecha: fechaAsistencia, estado },
                { headers: { 'x-auth-token': token } }
            );
            obtenerAlumnos();
            alert(`Asistencia marcada como: ${estado}`);
        } catch (error) {
            console.error("Error al registrar asistencia", error);
            alert('Error al actualizar la asistencia');
        }
    };

    const obtenerEstadoHoy = (asistencias = []) => {
        const registro = asistencias.find(
            item => new Date(item.fecha).toISOString().split('T')[0] === fechaAsistencia
        );
        return registro ? registro.estado : 'Sin registrar';
    };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ color: '#2c3e50', margin: 0 }}>
                    {esCatequista ? 'MIS CATEQUIZADOS Y ASISTENCIAS' : 'LISTA DE CATEQUESIS'}
                </h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {esCatequista && (
                        <div>
                            <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Fecha Asistencia:</label>
                            <input
                                type="date"
                                value={fechaAsistencia}
                                onChange={(e) => setFechaAsistencia(e.target.value)}
                                style={{ padding: '9px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                    )}
                    <input 
                        type="text" 
                        placeholder="Buscar por Apellido o Cédula..." 
                        style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                        <th style={{ padding: '10px' }}>ESTUDIANTE</th>
                        <th style={{ padding: '10px' }}>CÉDULA</th>
                        <th style={{ padding: '10px' }}>NIVEL / PARALELO</th>
                        <th style={{ padding: '10px' }}>REPRESENTANTE / TELÉFONO</th>
                        {esCatequista && <th style={{ padding: '10px' }}>ESTADO ({fechaAsistencia})</th>}
                        <th style={{ padding: '10px' }}>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrados.map(a => (
                        <tr key={a._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{a.nombreEstudiante} {a.apellidoEstudiante}</td>
                            <td style={{ padding: '10px' }}>{a.cedulaEstudiante}</td>
                            <td style={{ padding: '10px' }}>{a.nivel} - Paralelo {a.paralelo || 'A'}</td>
                            <td style={{ padding: '10px' }}>{a.nombreRepresentante} ({a.telefonoRepresentante})</td>
                            {esCatequista && (
                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                                    {obtenerEstadoHoy(a.asistencias)}
                                </td>
                            )}
                            <td style={{ padding: '10px' }}>
                                {esCatequista ? (
                                    <>
                                        <button
                                            onClick={() => marcarAsistencia(a._id, 'Presente')}
                                            style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            PRESENTE
                                        </button>
                                        <button
                                            onClick={() => marcarAsistencia(a._id, 'Falta')}
                                            style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginLeft: '8px' }}
                                        >
                                            FALTA
                                        </button>
                                        <button
                                            onClick={() => marcarAsistencia(a._id, 'Justificado')}
                                            style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginLeft: '8px' }}
                                        >
                                            JUSTIFICADO
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => navigate(`/inscribir-catequesis/${a._id}`)}
                                            style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            EDITAR
                                        </button>
                                        <button 
                                            onClick={() => eliminarAlumno(a._id)}
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
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConsultarCatequesis;