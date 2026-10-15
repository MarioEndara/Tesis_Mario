import React, { useState } from 'react';
import axios from 'axios';

const RegistrarBautismo = () => {
    // Estado inicial del formulario (Exactamente igual a lo que probamos en Postman)
    const [formData, setFormData] = useState({
        nombreNiño: '',
        apellidoNiño: '',
        cedulaNiño: '',
        fechaNacimiento: '',
        lugarNacimiento: '',
        genero: '',
        celebrante: '',
        nombrePadre: '',
        nombreMadre: '',
        padrino: '',
        madrina: '',
        libro: '',
        tomo: '',
        pagina: '',
        acta: '',
        direccion: '' 
    });

    const { nombreNiño, apellidoNiño, cedulaNiño, fechaNacimiento, lugarNacimiento, genero, celebrante, nombrePadre, nombreMadre, padrino, madrina, libro, tomo, pagina, acta, direccion} = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Enviamos los datos al backend que ya probamos
            const res = await axios.post('http://localhost:5000/api/bautismo', formData);
            alert("✅ " + res.data.msg);
            
            // Opcional: Limpiar formulario después de éxito
            setFormData({
                nombreNiño: '', apellidoNiño: '', cedulaNiño: '', fechaNacimiento: '',
                lugarNacimiento: '', genero: '', celebrante: '', nombrePadre: '',
                nombreMadre: '', padrino: '', madrina: '', libro: '', tomo: '', pagina: '', acta: '', direccion: ''
            });
        } catch (error) {
            // Aquí capturamos el error de "Cédula duplicada" que configuramos en el backend
            alert("❌ " + (error.response?.data?.msg || "Error al registrar"));
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Registro de Nuevo Bautismo</h2>
            <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                
                {/* Datos del Niño */}
                <div style={{ gridColumn: '1 / span 2' }}><h3>Datos del Bautizado</h3></div>
                <input type="text" name="nombreNiño" placeholder="Nombres del Niño" value={nombreNiño} onChange={onChange} required />
                <input type="text" name="apellidoNiño" placeholder="Apellidos del Niño" value={apellidoNiño} onChange={onChange} required />
                <input type="text" name="cedulaNiño" placeholder="Cédula de Identidad" value={cedulaNiño} onChange={onChange} required />
                <input type="date" name="fechaNacimiento" value={fechaNacimiento} onChange={onChange} required />
                <input type="text" name="lugarNacimiento" placeholder="Lugar de Nacimiento" value={direccion} onChange={onChange} required />
                <input type="text" name="direccion" placeholder="Direccion de domicilio" value={lugarNacimiento} onChange={onChange} required/>
                <select name="genero" value={genero} onChange={onChange} required>
                    <option value="">Seleccione Género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>

                {/* Datos de los Padres */}
                <div style={{ gridColumn: '1 / span 2' }}><h3>Padres y Padrinos</h3></div>
                <input type="text" name="nombrePadre" placeholder="Nombre del Padre" value={nombrePadre} onChange={onChange} required />
                <input type="text" name="nombreMadre" placeholder="Nombre de la Madre" value={nombreMadre} onChange={onChange} required />
                <input type="text" name="padrino" placeholder="Nombre del Padrino" value={padrino} onChange={onChange} required />
                <input type="text" name="madrina" placeholder="Nombre de la Madrina" value={madrina} onChange={onChange} required />

                {/* Datos de la Iglesia */}
                <div style={{ gridColumn: '1 / span 2' }}><h3>Datos de Registro Parroquial</h3></div>
                <input type="text" name="celebrante" placeholder="Sacerdote Celebrante" value={celebrante} onChange={onChange} required />
                <input type="text" name="libro" placeholder="Libro" value={libro} onChange={onChange} required />
                <input type="text" name="tomo" placeholder="Tomo" value={tomo} onChange={onChange} required />
                <input type="text" name="pagina" placeholder="Página" value={pagina} onChange={onChange} required />
                <input type="text" name="acta" placeholder="Acta #" value={acta} onChange={onChange} required />

                <button type="submit" style={{ gridColumn: '1 / span 2', padding: '15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                    Guardar Registro de Bautismo
                </button>
            </form>
        </div>
    );
};

export default RegistrarBautismo;