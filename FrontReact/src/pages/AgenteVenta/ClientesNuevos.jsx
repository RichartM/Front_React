import React, { useState,useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import styled from "styled-components";
import { BiSolidUserVoice } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from 'axios'

const StyledTable = styled(Table)`
  th {
    background-color: #018180;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  td {
    text-align: center;
    vertical-align: middle;
  }

  tr:hover {
    background-color: #f1fdfd;
  }

  .btn-atender {
    background-color: #018180;
    color: white;
    border: none;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
  }

  .btn-atender:hover {
    background-color: #026c6c;
  }

  .btn-wrapper {
    display: flex;
    justify-content: center;
  }
`;




const ClientesNuevos = ({ autos = [], onAprobar }) => {
console.log("esto trae los auts: ",autos)

const [clienteSinAgente, setClientesSinAgente] = useState([])
const [ventas, setVentas] = useState([])
const [ventasSinAgente, setVentasSinAgente] = useState([]);
const [correoAgente, setCorreoAgente] = useState(null);
const [agentes,setAgentes] = useState([])
const [agenteAgregadoAhorita, setAgenteAgregadoAhorita] = useState(null);

const fetchAgentes = async () => {
  const token = localStorage.getItem("token");

  if (token) {
      try {
          const response = await axios.get("http://localhost:8080/api/auth/fullAgentes", {
              headers: { Authorization: `Bearer ${token}` },
          });

          setAgentes(response.data);
          //setFilteredClientes(response.data); // ✅ Actualizamos ambos estados
          return response.data

      } catch (error) {
          console.error("Error al obtener clientes:", error);
      } finally {
      //setLoading(false);
      }
  } else {
      console.log("No se encontró el token");
      //setLoading(false);
  }
};

useEffect(() => {
      fetchAgentes();
  }, []);




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
          }, []);  // 🔄 Se ejecuta solo una vez al montar el componente
          // ✅ Llamamos a fetchClientes cuando el componente se monta


          console.log("id del agente agregado ahorita: ",agenteAgregadoAhorita)


useEffect(() => {
                if (agentes.length > 0 && correoAgente) {
                    const agenteEncontrado = agentes.find(agente => agente.email === correoAgente);
                    if (agenteEncontrado) {
                        setAgenteAgregadoAhorita(agenteEncontrado);
                        //setVenta((prevVenta) => ({...prevVenta,  agente: agenteEncontrado }));
  
                    } else {
                        console.log("No se encontró el agente con ese correo");
                    }
                }
            }, [agentes, correoAgente]);


  const ActualizarEstadoDeUnAutoInsano = async (au) => {

    console.log("Esto es lo que trae el auto: ",au)

    const autoActualizado = {
      ...au.vehiculo,
      estado: { id: 3, nombre: 'Vendido' }
    };
    
    try {
        await axios.put(`http://localhost:8080/vehiculo/actualizar/${au.venta.vehiculo.id}`, autoActualizado, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        
        console.log("carro actualizado ",autoActualizado)
        
        

    } catch (error) {
        console.error("Error Al cambiar el estado del auto:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo completar el registro. Inténtalo de nuevo.",
            icon: "error",
            confirmButtonColor: "#d33",
        });
    }
    
};






const asociarGerenteCliente = async (ve) => {

  console.log("esto trae el asociar cliente: ",ve," y el agente: ",agenteAgregadoAhorita)
    try {
        // 1. Obtenemos los clientes actualizados


        // 4. Hacemos la solicitud PUT al backend
        await axios.put(
            `http://localhost:8080/clientes-agente/moverClienteAAgente?idNuevoAgente=${agenteAgregadoAhorita.id}&idCliente=${ve.cliente.id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` ,
                    'Content-Type': 'application/json',
                },
            }
        );

    } catch (error) {
        console.error("❌ Error en el registro:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo completar el registro. Inténtalo de nuevo.",
            icon: "error",
            confirmButtonColor: "#d33",
        });
    }
};





console.log("datos insanos de las ventas asndjsadnsja ",ventas)
const ventasHistorial = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.get(
        `http://localhost:8080/ventas/obtenerTodas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVentas(response.data);
      console.log("ventasTodas :",response.data)
    } catch (error) {
      console.error("Error al obtener historial de ventas:", error);
    }
  }
};


const clientesSinAg = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.get(
        `http://localhost:8080/cliente/null`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientesSinAgente(response.data);
      console.log("clientesSinAgente :",response.data)

    } catch (error) {
      console.error("Error al obtener historial de ventas:", error);
    }
  }
};

useEffect(() => {
  clientesSinAg();
  ventasHistorial();
}, []);


useEffect(() => {
  const coincidencias = [];
  clienteSinAgente.forEach(cliente => {
    const venta = ventas.find(v => v.cliente.id === cliente.id);
    if (venta) {
      coincidencias.push({ cliente, venta });
    }
  });

  setVentasSinAgente(coincidencias);
}, [clienteSinAgente, ventas]);

console.log("ventas sin agente: ",ventasSinAgente)


  const handleAtender = (auto) => {
    Swal.fire({
      title: '¿Atender compra?',
      text: "¿Estás seguro de que deseas atender esta compra del cliente?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#018180',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, atender',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      iconColor: '#018180',
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("verifiacndo que se manipule el registro", auto)
        ActualizarEstadoDeUnAutoInsano(auto)
        asociarGerenteCliente(auto)

        onAprobar(auto.id);
        Swal.fire(
          '¡Atendido!',
          'La compra ha sido atendida correctamente.',
          'success'
        );
      }
    });
  };

  return (
    <StyledTable striped hover responsive>
      <thead>
        <tr>
          <th>Modelo</th>
          <th>Marca</th>
          <th>Cliente</th>
          <th>Correo</th>
          <th>Precio (MXN)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventasSinAgente.map((auto, i) => (
          <tr key={i}>
            <td>{auto.venta.vehiculo?.modelo || 'N/A'}</td>
            <td>{auto.venta.vehiculo?.marca?.nombre || 'N/A'}</td>
            <td>{auto.cliente?.name ? `${auto.cliente.name} ${auto.cliente.lastname}` : 'N/A'}</td>
            <td>{auto.cliente?.email || 'N/A'}</td>
            <td>${auto.venta?.vehiculo.precio?.toLocaleString() || '0'}</td>
            <td>
              <div className="btn-wrapper">
                <Button 
                  className="btn-atender" 
                  onClick={() => handleAtender(auto)}
                >
                  <BiSolidUserVoice size={16} />
                  Atenderrrrrr
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default ClientesNuevos;