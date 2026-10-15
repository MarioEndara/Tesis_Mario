import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // La página de Figma
import Login from './pages/Login'; // Tu login que ya funciona
import Dashboard from './pages/Dashboard';
import RutaPrivada from './components/RutaPrivada';
import RecuperarPassword from './pages/RecuperarPassword';
import Registro from './pages/Registro';
import NuevaPassword from './pages/NuevaPassword';
import RegistrarBautismo from './pages/RegistrarBautismo';
import ConsultarBautismo from './pages/ConsultarBautismo';
import InscribirCatequesis from './pages/InscribirCatequesis';
import ConsultarCatequesis from './pages/ConsultarCatequesis';
import RegistrarMatrimonio from './pages/RegistrarMatrimonio';
import ConsultarMatrimonio from './pages/ConsultarMatrimonio';


function App() {
  return (
    <Router>
      <Routes>
        {/* 1. La raíz "/" ahora muestra la página de Figma */}
        <Route path="/" element={<Home />} /> 

        {/* 2. El login ahora estará en "/login" */}
        <Route path="/login" element={<Login />} /> 

        {/* 3. El dashboard sigue protegido */}
        <Route path="/dashboard" element={<RutaPrivada><Dashboard /></RutaPrivada>} />
        {/* 5. Registro */}
        <Route path="/Registro" element={<Registro />} />
        {/* Esta página debe ser la que tiene el input libre para escribir tu correo */}
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        {/*  Abre la ruta desde de Gmail */}
        <Route path="/nuevo-password/:token" element={<NuevaPassword />} />
        {/*  Registro de Bautismo */}
        <Route path="/registrar-bautismo" element={<RegistrarBautismo />} />
        {/*  Consultar */}
        <Route path="/consultar-bautismo" element={<ConsultarBautismo />} />
        {/*  Inscribir Catequesis */}
        <Route path="/inscribir-catequesis/:id?" element={<InscribirCatequesis />} />
        {/*  Consultar Catequesis */}
        <Route path="/consultar-catequesis" element={<ConsultarCatequesis />} />
        {/*  Registrar matrimonio */}
        <Route path="/registrar-matrimonio/:id?" element={<RegistrarMatrimonio />} />
        {/*  Consultar matrimonio */}
        <Route path="/consultar-matrimonio" element={<ConsultarMatrimonio />} />
      </Routes>
    </Router>
  );
}

export default App;