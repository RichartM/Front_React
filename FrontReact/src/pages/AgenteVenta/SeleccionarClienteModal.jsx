import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import FiltroBuscador from "../../components/Filtros/FiltroBuscador"; 
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 420px;
  width: 400px;
  max-width: 95%;
  text-align: center;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #018180;
`;

const ClienteList = styled.ul`
  list-style: none;
  padding: 0;
    margin-top: 10px;

  max-height: 200px;
  overflow-y: auto;
  border-radius: 5px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  scrollbar-width: thin;
  scrollbar-color: #018180 #f1f1f1;
  
  /* Estilizar scrollbar en navegadores basados en WebKit */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #018180;
    border-radius: 4px;
  }
`;

const ClienteItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  transition: background 0.3s ease;
  font-size: 16px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
  &:hover {
    background: #e3f6f5;
    background: #f1f1f1;
    transform: scale(1.02);
  }
  &:last-child {
    border-bottom: none;
  }
`;

const CloseButton = styled.button`
  padding: 8px 16px;
  margin-top: 10px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
   font-size: 16px;
  width: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: #cc0000;
  }
`;

const SeleccionarClienteModal = ({ isOpen, onClose, onSelect }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [AgenteAgregadoAhorita, setAgenteAgregadoAhorita] = useState({})
      const [correoAgente, setCorreoAgente] = useState("")
      const [agentes, setAgentes] = useState([])
  

      const fetchAgentes = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const response = await axios.get("https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth/fullAgentes", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setAgentes(response.data);
                //setFilteredClientes(response.data); // ✅ Actualizamos ambos estados
                return response.data

            } catch (error) {
                console.error("Error al obtener clientes:", error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log("No se encontró el token");
            setLoading(false);
        }
    };



      useEffect(() => {
          const token = localStorage.getItem("token");
          if (token) {
              try {
                  const payloadBase64 = token.split('.')[1];
                  const payload = JSON.parse(atob(payloadBase64));
                  setCorreoAgente(payload.sub);
              } catch (error) {
                  console.error("Error al decodificar el token:", error);
              }
          }
      }, []);

      useEffect(() => {
        fetchAgentes();
    }, []);
  
   useEffect(() => {
          if (agentes.length > 0 && correoAgente) {
              const agenteEncontrado = agentes.find(agente => agente.email === correoAgente);
              if (agenteEncontrado) {
                  console.log("si se encontroo el chido agente")
                  setAgenteAgregadoAhorita(agenteEncontrado);
              } else {
                  console.log("No se encontró el agente con ese correo");
              }
          }
      }, [correoAgente,agentes]);

        useEffect(() => {
              if (AgenteAgregadoAhorita && AgenteAgregadoAhorita.id) {
                  console.log("Agente encontrado:", AgenteAgregadoAhorita);
                  //fetchClientesEspecificos();
              }
          }, [AgenteAgregadoAhorita]); // ✅ Se ejecuta cuando el estado cambie
          

          


  

  const fetchClientes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`https://bwubka276h.execute-api.us-east-1.amazonaws.com/clientes-agente/buscarClienteDelAgente?idAgente=${AgenteAgregadoAhorita.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClientes(response.data);
      setFilteredClientes(response.data); // ✅ Actualizamos ambos estados
      response.data.filter(cliente => cliente.name && cliente.email);

    } catch (error) {
      console.error("Error al obtener clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
    }
  }, [isOpen, AgenteAgregadoAhorita]); // ✅ Se ejecuta cuando el modal se abre o el agente cambia

   useEffect(() => {
          setFilteredClientes(clientes);
      }, [clientes]);
  
  const handleSearch = (searchTerm) => {
    const filtered = clientes.filter(cliente =>
        Object.values(cliente).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredClientes(filtered);
    setCurrentPage(1);
};

  return isOpen ? (
    <ModalBackground>
      <ModalContainer>
        <Title>Seleccionar Cliente</Title>

         {/* ✅ Usamos FiltroBuscador en lugar de input manual */}
         <p></p>
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <FiltroBuscador
          onSearch={handleSearch} placeholder="Buscar cliente..."
        />
         </div>
         
        <p></p>
        {loading ? (
          <p>Cargando clientes...</p>
        ) : (
          <ClienteList>
{filteredClientes.map((cliente) => (
              <ClienteItem key={cliente.id} onClick={() => onSelect(cliente)}>
                {cliente.name} - {cliente.email}
              </ClienteItem>
            ))}
          </ClienteList>
        )}
        <CloseButton onClick={onClose}>Cancelar</CloseButton>
      </ModalContainer>
    </ModalBackground>
  ) : null;
};

export default SeleccionarClienteModal;
