import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { generarActaBautismo } from '../utils/generarPDF';

const ConsultarBautismo = () => {
    const [registros, setRegistros] = useState([]);
    const [editando, setEditando] = useState(false);
    const [formEdit, setFormEdit] = useState({});
    const [busqueda, setBusqueda] = useState("");

    const obtenerDatos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bautismo');
            setRegistros(res.data);
        } catch (error) {
            console.error("Error al obtener registros", error);
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, []);

    const registrosFiltrados = registros.filter(reg => 
        reg.cedulaNiño.includes(busqueda) || 
        reg.apellidoNiño.toLowerCase().includes(busqueda.toLowerCase())
    );

    const eliminarRegistro = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
            try {
                await axios.delete(`http://localhost:5000/api/bautismo/${id}`);
                alert("Registro eliminado con éxito");
                obtenerDatos(); 
            } catch (error) {
                alert("Error al eliminar el registro");
            }
        }
    };

    const seleccionarParaEditar = (registro) => {
        setEditando(true);
        setFormEdit(registro);
    };

    const actualizarRegistro = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/bautismo/${formEdit._id}`, formEdit);
            alert("✅ Registro actualizado correctamente");
            setEditando(false);
            obtenerDatos();
        } catch (error) {
            alert("❌ Error al actualizar el registro");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Consultar Registros de Bautismo</h2>
            
            <input 
                type="text" 
                placeholder="Buscar por cédula o apellido..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ marginBottom: '20px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            {/* FORMULARIO DE EDICIÓN EXPANDIDO */}
            {editando && (
                <div style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #3498db' }}>
                    <h3>Editando Registro de: {formEdit.nombreNiño}</h3>
                    <form onSubmit={actualizarRegistro} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        
                        {/* Fila 1 */}
                        <input type="text" value={formEdit.nombreNiño} onChange={(e) => setFormEdit({...formEdit, nombreNiño: e.target.value})} placeholder="Nombre" />
                        <input type="text" value={formEdit.apellidoNiño} onChange={(e) => setFormEdit({...formEdit, apellidoNiño: e.target.value})} placeholder="Apellido" />
                        <input type="text" value={formEdit.cedulaNiño} onChange={(e) => setFormEdit({...formEdit, cedulaNiño: e.target.value})} placeholder="Cédula" />
                        
                        {/* Fila 2 */}
                        <input type="text" value={formEdit.nombrePadre} onChange={(e) => setFormEdit({...formEdit, nombrePadre: e.target.value})} placeholder="Padre" />
                        <input type="text" value={formEdit.nombreMadre} onChange={(e) => setFormEdit({...formEdit, nombreMadre: e.target.value})} placeholder="Madre" />
                        <input type="text" value={formEdit.celebrante} onChange={(e) => setFormEdit({...formEdit, celebrante: e.target.value})} placeholder="Celebrante" />

                        {/* Fila 3 */}
                        <input type="text" value={formEdit.libro} onChange={(e) => setFormEdit({...formEdit, libro: e.target.value})} placeholder="Libro" />
                        <input type="text" value={formEdit.tomo} onChange={(e) => setFormEdit({...formEdit, tomo: e.target.value})} placeholder="Tomo" />
                        <input type="text" value={formEdit.pagina} onChange={(e) => setFormEdit({...formEdit, pagina: e.target.value})} placeholder="Página" />

                        {/* DIRECCIÓN: Ocupa todo el ancho */}
                        <input 
                            type="text" 
                            value={formEdit.direccion || ''} 
                            onChange={(e) => setFormEdit({...formEdit, direccion: e.target.value})} 
                            placeholder="Dirección de Domicilio" 
                            required
                            style={{ gridColumn: '1 / span 3', padding: '10px' }}
                        />
                        
                        <div style={{ gridColumn: '1 / span 3' }}>
                            <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Guardar Cambios</button>
                            <button type="button" onClick={() => setEditando(false)} style={{ backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cédula</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Niño/a</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fecha Bautismo</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Libro/Folia</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {registrosFiltrados.map(reg => (
    <tr key={reg._id}>
        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{reg.cedulaNiño}</td>
        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{reg.nombreNiño} {reg.apellidoNiño}</td>
        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
            {reg.fechaBautismo ? new Date(reg.fechaBautismo).toLocaleDateString() : 'S/F'}
        </td>
        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>L:{reg.libro} - P:{reg.pagina}</td>
        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', whiteSpace: 'nowrap' }}>
            <button 
                onClick={() => seleccionarParaEditar(reg)} 
                style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
            >
                Editar
            </button>
            <button 
                onClick={() => eliminarRegistro(reg._id)} 
                style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginLeft: '10px' }}
            >
                Eliminar
            </button>
            <button 
                onClick={() => generarActaBautismo(reg)} 
                style={{ backgroundColor: '#1a5276', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginLeft: '10px', fontWeight: 'bold' }}
            >
                IMPRIMIR FE
            </button>
        </td>
    </tr>
))}
                </tbody>
            </table>
        </div>
    );
};

export default ConsultarBautismo;