import React, { useState, useEffect } from 'react'; // <--- ESTO ES LO QUE TE FALTA
import { useNavigate } from 'react-router-dom';
import { generarActaMatrimonio } from '../utils/generarPDF';
import axios from 'axios';

const ConsultarMatrimonio = () => {
    const navigate = useNavigate();
    
    // Estados
    const [registros, setRegistros] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

    // 1. Obtener datos
    const obtenerMatrimonios = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/matrimonio');
            setRegistros(res.data);
            setCargando(false);
        } catch (error) {
            console.error("Error al obtener datos:", error);
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerMatrimonios();
    }, []);

    // 2. Lógica de Filtrado por Apellido o Cédula
    const registrosFiltrados = registros.filter((reg) => {
        const termino = busqueda.toLowerCase();
        return (
            (reg.apellidoEsposo && reg.apellidoEsposo.toLowerCase().includes(termino)) || 
            (reg.apellidoEsposa && reg.apellidoEsposa.toLowerCase().includes(termino)) || 
            (reg.cedulaEsposo && reg.cedulaEsposo.includes(termino)) ||
            (reg.cedulaEsposa && reg.cedulaEsposa.includes(termino))
        );
    });

    const styles = {
        container: { padding: '40px', backgroundColor: '#F4F4F4', minHeight: '100vh' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
        title: { color: '#641212', margin: '0', fontSize: '2rem', fontWeight: 'bold' },
        searchBox: { 
            padding: '12px 20px', width: '100%', maxWidth: '400px', borderRadius: '25px', 
            border: '2px solid #641212', outline: 'none'
        },
        tableCard: { backgroundColor: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '15px', borderBottom: '2px solid #EEE', color: '#666' },
        td: { padding: '15px', borderBottom: '1px solid #EEE' },
        btnEditar: { backgroundColor: '#641212', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
        btnVolver: { backgroundColor: 'transparent', border: '1px solid #641212', color: '#641212', padding: '8px 20px', borderRadius: '25px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <button onClick={() => navigate('/dashboard')} style={styles.btnVolver}>← VOLVER</button>
                    <h1 style={styles.title}>CONSULTAR MATRIMONIOS</h1>
                </div>
                <input 
                    type="text" 
                    placeholder="Buscar por Apellido o Cédula..." 
                    style={styles.searchBox}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div style={styles.tableCard}>
                {cargando ? (
                    <p style={{ textAlign: 'center' }}>Conectando con la base de datos...</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ESPOSO</th>
                                <th style={styles.th}>ESPOSA</th>
                                <th style={styles.th}>CÉDULA</th>
                                <th style={styles.th}>FECHA</th>
                                <th style={styles.th}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
        {registrosFiltrados.map(reg => (
            <tr key={reg._id}>
                <td style={styles.td}>{reg.nombreEsposo} {reg.apellidoEsposo}</td>
                <td style={styles.td}>{reg.nombreEsposa} {reg.apellidoEsposa}</td>
                <td style={styles.td}>{reg.cedulaEsposo}</td>
                <td style={styles.td}>
                    {reg.fechaMatrimonio ? new Date(reg.fechaMatrimonio).toLocaleDateString() : 'S/F'}
                </td>
                <td style={styles.td}>
                <button 
                    style={styles.btnEditar} 
                    onClick={() => navigate(`/registrar-matrimonio/${reg._id}`)} // Nos lleva al formulario con el ID
                >
                    EDITAR
                </button>
                {/* Imprimir */}
                {/* Imprimir corregido */}
<button 
    onClick={() => generarActaMatrimonio(reg)} // Cambiamos 'm' por 'reg'
    style={{ 
        backgroundColor: '#641212', 
        color: 'white', 
        border: 'none', 
        padding: '5px 10px', 
        borderRadius: '3px', 
        cursor: 'pointer',
        marginLeft: '5px' // Un pequeño espacio para que no pegue con el botón Editar
    }}
>
    IMPRIMIR ACTA
</button>
                </td>
            </tr>
        ))}
    </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ConsultarMatrimonio;