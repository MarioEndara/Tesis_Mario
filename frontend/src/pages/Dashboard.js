import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const styles = {
        container: { backgroundColor: '#f4f4f4', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
        headerBanner: {
            backgroundColor: '#641212', // TU COLOR CORPORATIVO
            color: 'white',
            margin: '20px',
            borderRadius: '25px',
            display: 'flex',
            overflow: 'hidden',
            minHeight: '400px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
        },
        bannerText: { flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
        bannerImage: {
            flex: 1,
            backgroundImage: 'url("/assets/iglesia.jpeg")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            clipPath: 'ellipse(100% 100% at 100% 50%)' 
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Se ajustan solas
            gap: '20px',
            padding: '40px 20px',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        card: {
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            borderLeft: '6px solid #641212'
        },
        iconCircle: {
            backgroundColor: '#641212', color: 'white', width: '50px', height: '50px',
            borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem'
        },
        downloadSection: {
            backgroundColor: 'white',
            margin: '20px',
            borderRadius: '25px',
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        },
        btnStore: { 
            height: '45px', 
            cursor: 'pointer',
            borderRadius: '7px'
        }
    };

    return (
        <div style={styles.container}>
            {/* NIVEL 1: EL BANNER CURVO (IGUAL A TU FIGMA) */}
            <div style={styles.headerBanner}>
                <div style={styles.bannerText}>
                    <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>BIENVENIDOS</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Parroquia San Ignacio de Loyola</p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <button style={{ padding: '12px 25px', borderRadius: '30px', border: 'none', backgroundColor: 'white', color: '#641212', fontWeight: 'bold', cursor: 'pointer' }}>ADMINISTRADOR</button>
                        {/* Botón de cerrar sesión con estilo de tu diseño */}
                        <button onClick={cerrarSesion} style={{ padding: '12px 25px', borderRadius: '30px', border: '1px solid white', backgroundColor: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>CERRAR SESIÓN</button>
                    </div>
                </div>
                <div style={styles.bannerImage}></div>
            </div>

            {/* GRILLA DE 6 TARJETAS */}
            <div style={styles.grid}>
                {/* BAUTISMOS */}
                <div style={styles.card} onClick={() => navigate('/registrar-bautismo')}>
                    <div style={styles.iconCircle}>🌊</div>
                    <div><h3 style={{ margin: 0, color: '#333' }}>Registrar Bautismo</h3><small style={{ color: '#888' }}>Nuevo ingreso</small></div>
                </div>

                <div style={styles.card} onClick={() => navigate('/consultar-bautismo')}>
                    <div style={styles.iconCircle}>🔍</div>
                    <div><h3 style={{ margin: 0, color: '#333' }}>Consultar Bautismo</h3><small style={{ color: '#888' }}>Búsqueda y edición</small></div>
                </div>

                {/* CATEQUESIS */}
                <div style={styles.card} onClick={() => navigate('/inscribir-catequesis')}>
                    <div style={styles.iconCircle}>📖</div>
                    <div><h3 style={{ margin: 0, color: '#333' }}>Inscribir Catequesis</h3><small style={{ color: '#888' }}>Registro de alumnos</small></div>
                </div>

                <div style={styles.card} onClick={() => navigate('/consultar-catequesis')}>
                    <div style={styles.iconCircle}>📋</div>
                    <div><h3 style={{ margin: 0, color: '#333' }}>Lista de Alumnos</h3><small style={{ color: '#888' }}>Control de tutorías</small></div>
                </div>

                {/* MATRIMONIOS */}
                <div style={styles.card} onClick={() => navigate('/registrar-matrimonio')}>
                    <div style={styles.iconCircle}>💍</div>
                    <div><h3 style={{ margin: 0, color: '#333' }}>Registrar Matrimonio</h3><small style={{ color: '#888' }}>Módulo de actas</small></div>
                </div>

                {/* NUEVO: CONSULTAR MATRIMONIOS */}
                <div style={styles.card} onClick={() => navigate('/consultar-matrimonio')}>
                    <div style={styles.iconCircle}>📂</div>
                    <div><h3 style={{ margin: 0, color: '#333' }}>Consultar Matrimonio</h3><small style={{ color: '#888' }}>Ver actas registradas</small></div>
                </div>
            </div>
            {/* SECCIÓN DESCARGA APP - IGUAL A TU IMAGEN */}
<div style={styles.downloadSection}>
    
    {/* Contenedor Izquierdo: Logo */}
    <div style={{ textAlign: 'center' }}>
        <img src="/assets/logo.png" alt="Logo Parroquia" style={{ width: '140px' }} />
        <h4 style={{ margin: '10px 0 0 0', color: '#641212', fontWeight: 'bold' }}>SAN IGNACIO DE LOYOLA</h4>
    </div>
    
    {/* Contenedor Derecho: Texto y Botones CENTRADOS entre ellos */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px' }}>
        <h2 style={{ color: '#1a1919', marginBottom: '10px', fontSize: '2.2rem', textAlign: 'center', fontWeight: 'bold' }}>
            DESCARGA LA APLICACIÓN
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem', textAlign: 'center', marginBottom: '20px' }}>
            Gestiona tus trámites y certificados de forma rápida y segura desde tu dispositivo móvil.
        </p>
        
        {/* Botones centrados respecto al texto de arriba */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <img src="/assets/appstore.png" alt="App Store" style={styles.btnStore} />
            <img src="/assets/googleplay.png" alt="Google Play" style={styles.btnStore} />
        </div>
    </div>
</div>                       
        </div>
    );
}

export default Dashboard;