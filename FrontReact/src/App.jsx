import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavPrincipal from './components/NavPrincipal';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CarTable from './components/CarTable';
import AgenteVentas from './components/GERENTE/AgenteVentas';
import Servicios  from './components/GERENTE/Servicios';
import EditPerfil from './components/GERENTE/EditPerfil'
import Home from './components/Home'
function App() {
  const [marcas, setMarcas] = useState([]); 
  const [modelo, setModelos] = useState([]);
  const handleAddMarca = (nuevaMarca) => {
    setMarcas([...marcas, nuevaMarca]);
  
 
  };


  return (
    <BrowserRouter>

      <NavPrincipal />
      
      <div style={{ marginTop: '60px' }}> {/* Ajusta el margen superior */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cartable" element={<CarTable />} />
          <Route path="/agenteVentas" element={<AgenteVentas />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/editPerfil" element={<EditPerfil />} />
          <Route path="/home" element={<Home />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
