import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RegistrarMatrimonio = () => {
    const { id } = useParams(); // Atrapamos el ID de la URL si existe
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombreEsposo: '', apellidoEsposo: '', cedulaEsposo: '',
        nombreEsposa: '', apellidoEsposa: '', cedulaEsposa: '',
        fechaMatrimonio: '', celebrante: '', libro: '', tomo: '', pagina: '', testigos: ''
    });

    const { nombreEsposo, apellidoEsposo, cedulaEsposo, nombreEsposa, apellidoEsposa, cedulaEsposa, fechaMatrimonio, celebrante, libro, tomo, pagina, testigos } = formData;

    // EFECTO PARA CARGAR DATOS SI ESTAMOS EDITANDO
    useEffect(() => {
        const obtenerMatrimonio = async () => {
            if (id) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/matrimonio/${id}`);
                    const d = res.data;
                    setFormData({
                        nombreEsposo: d.nombreEsposo || '',
                        apellidoEsposo: d.apellidoEsposo || '',
                        cedulaEsposo: d.cedulaEsposo || '',
                        nombreEsposa: d.nombreEsposa || '',
                        apellidoEsposa: d.apellidoEsposa || '',
                        cedulaEsposa: d.cedulaEsposa || '',
                        // Formateamos la fecha para que el input tipo date la entienda (YYYY-MM-DD)
                        fechaMatrimonio: d.fechaMatrimonio ? d.fechaMatrimonio.substring(0, 10) : '',
                        celebrante: d.celebrante || '',
                        libro: d.libro || '',
                        tomo: d.tomo || '',
                        pagina: d.pagina || '',
                        testigos: d.testigos || ''
                    });
                } catch (error) {
                    console.error("Error al obtener el registro:", error);
                    alert("No se pudo cargar el registro para editar.");
                }
            }
        };
        obtenerMatrimonio();
    }, [id]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            if (id) {
                // MODODO EDICIÓN: Usamos PUT (aunque para simplificar puedes usar POST si tu backend lo permite, 
                // pero lo correcto es PUT a una ruta de actualizar)
                await axios.put(`http://localhost:5000/api/matrimonio/${id}`, formData);
                alert("¡Matrimonio actualizado con éxito!");
                navigate('/consultar-matrimonio'); // Volvemos a la tabla
            } else {
                // MODO REGISTRO NUEVO
                const res = await axios.post('http://localhost:5000/api/matrimonio/guardar', formData);
                alert(res.data.msg);
                setFormData({
                    nombreEsposo: '', apellidoEsposo: '', cedulaEsposo: '',
                    nombreEsposa: '', apellidoEsposa: '', cedulaEsposa: '',
                    fechaMatrimonio: '', celebrante: '', libro: '', tomo: '', pagina: '', testigos: ''
                });
            }
        } catch (error) {
            alert(error.response?.data?.msg || "Error al procesar la solicitud");
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#641212' }}>
                {id ? 'Editar Registro de Matrimonio' : 'Registro de Matrimonio Eclesiástico'}
            </h2>
            <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
                
                <h4 style={{ gridColumn: '1 / span 2', color: '#641212', borderBottom: '1px solid #eee' }}>Datos del Esposo</h4>
                <input type="text" name="nombreEsposo" placeholder="Nombres Esposo" value={nombreEsposo} onChange={onChange} required />
                <input type="text" name="apellidoEsposo" placeholder="Apellidos Esposo" value={apellidoEsposo} onChange={onChange} required />
                <input type="text" name="cedulaEsposo" placeholder="Cédula Esposo" value={cedulaEsposo} onChange={onChange} required />

                <h4 style={{ gridColumn: '1 / span 2', color: '#641212', borderBottom: '1px solid #eee', marginTop: '10px' }}>Datos de la Esposa</h4>
                <input type="text" name="nombreEsposa" placeholder="Nombres Esposa" value={nombreEsposa} onChange={onChange} required />
                <input type="text" name="apellidoEsposa" placeholder="Apellidos Esposa" value={apellidoEsposa} onChange={onChange} required />
                <input type="text" name="cedulaEsposa" placeholder="Cédula Esposa" value={cedulaEsposa} onChange={onChange} required />

                <h4 style={{ gridColumn: '1 / span 2', color: '#641212', borderBottom: '1px solid #eee', marginTop: '10px' }}>Detalles del Acta</h4>
                <input type="date" name="fechaMatrimonio" value={fechaMatrimonio} onChange={onChange} required />
                <input type="text" name="celebrante" placeholder="Sacerdote Celebrante" value={celebrante} onChange={onChange} required />
                <input type="text" name="libro" placeholder="Libro" value={libro} onChange={onChange} required />
                <input type="text" name="tomo" placeholder="Tomo" value={tomo} onChange={onChange} required />
                <input type="text" name="pagina" placeholder="Página" value={pagina} onChange={onChange} required />
                <input type="text" name="testigos" placeholder="Testigos / Padrinos" value={testigos} onChange={onChange} required />

                <button type="submit" style={{ gridColumn: '1 / span 2', padding: '15px', backgroundColor: id ? '#28a745' : '#641212', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    {id ? 'Actualizar Cambios' : 'Guardar Registro de Matrimonio'}
                </button>
                
                {id && (
                    <button type="button" onClick={() => navigate('/consultar-matrimonio')} style={{ gridColumn: '1 / span 2', padding: '10px', backgroundColor: '#ccc', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                        Cancelar Edición
                    </button>
                )}
            </form>
        </div>
    );
};

export default RegistrarMatrimonio;