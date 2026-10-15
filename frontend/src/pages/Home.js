import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();

    // Función para abrir Google Maps (Ubicación de la parroquia)
    const abrirMapa = () => {
        const url = "https://www.google.com/maps/search/?api=1&query=Parroquia+San+Ignacio+de+Loyola+Quito";
        window.open(url, "_blank");
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <img src="/images/logo.png" alt="Logo" className="logo-img" />
                <div className="nav-buttons">
                    <button className="btn-nav" onClick={() => navigate('/nosotros')}>NOSOTROS</button>
                    <button className="btn-nav" onClick={() => navigate('/servicios')}>SERVICIOS</button>
                    <button className="btn-nav" onClick={() => navigate('/login')}>INICIAR SESIÓN</button>
                </div>
            </nav>

            <header className="hero-section">
                <div className="hero-content-left">
                    <h1>PARROQUIA<br/>SAN IGNACIO DE<br/>LOYOLA</h1>
                </div>
                <div className="hero-content-center">
                    {/* Agregamos la función del mapa */}
                    <button className="btn-white" onClick={abrirMapa}>UBICACIÓN</button>
                    <button className="btn-white" onClick={() => navigate('/servicios')}>CURSOS</button>
                </div>
                <div className="hero-image-container">
                    <img src="/images/iglesia.jpg" alt="Iglesia" />
                </div>
            </header>

            <section className="download-section">
                <div className="download-phone">
                    <img src="/images/phone.png" alt="Phone" />
                </div>
                <div className="download-content">
                    <h2>DESCARGA LA APLICACION</h2>
                    <p>
                        Próximamente descarga nuestra aplicación móvil para estar al tanto de las actividades parroquiales, horarios de misas, inscripciones a catequesis y recibir noticias de nuestra comunidad en tiempo real.
                    </p>
                    <div className="store-buttons">
                        <img src="/images/appstore.png" alt="App Store" />
                        <img src="/images/googleplay.png" alt="Google Play" />
                    </div>
                </div>
            </section>

            <footer className="footer-bar">
                <span>Contactos: (+593) 22680756 </span>
                <div className="footer-social">
                    <span>Síguenos</span>
                    {/* Puedes poner los enlaces reales a las redes de la parroquia aquí */}
                    <img src="/images/icons8-facebook.png" alt="FB" style={{cursor: 'pointer'}} />
                    <img src="/images/cons8-instagram.png" alt="IG" style={{cursor: 'pointer'}} />
                    <img src="/images/icons8-twitter.png" alt="TW" style={{cursor: 'pointer'}} />
                </div>
            </footer>
        </div>
    );
};

export default Home;