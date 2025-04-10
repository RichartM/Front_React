  import React, { useContext, useState, useEffect } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import styled from "styled-components";
  import { BrandsContext } from "../../context/BrandsContext";
  import VehiculoService from "../../services/AgenteService/VehiculoService";
  import ServiciosModal from "../../components/ServiciosModal";
  import SeleccionarClienteModal from "./SeleccionarClienteModal";
  import NavAgenteVenta from "./NavAgenteVenta";
  import { BsDashCircle, BsX } from "react-icons/bs"; // Importar el ícono de cierre
  import Swal from 'sweetalert2';
  import { createGlobalStyle } from "styled-components";
  import axios from 'axios'


  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 10%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px;
    gap: 0px;
    overflow: hidden; /* Evita el scrollbar no deseado */
  `;

  const MainContent = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 40px;
  `;

  const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
  `;

  const CarImage = styled.img`
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  `;

  const CarInfo = styled.div`
    text-align: center;
    width: 100%;
    margin-top: 20px;
  `;

  const CarTitle = styled.h1`
    font-size: 1.8rem;
    font-weight: bold;
    color: #212121;
    margin-bottom: 10px;
  `;

  const CarYear = styled.p`
    font-size: 1.1rem;
    font-weight: bold;
    color: #555;
    margin-bottom: 10px;
  `;

  const Price = styled.p`
    font-size: 1.5rem;
    font-weight: bold;
    color: #026c6c;
    margin-bottom: 20px;
  `;

  const BuyButton = styled.button`
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #018180, #026c6c);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
  `;

  const ServicesSection = styled.div`
    width: 50%;
    padding: 20px;
    border-radius: 10px;
    background: #f9f9f9;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
  `;

  const ServicesHeader = styled.div`
    flex-shrink: 0;
  `;

  const ServicesListContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    max-height: 300px;
    padding-right: 20px; /* Espacio para el scrollbar */

    /* Estilo personalizado para el scroll */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #018180;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #026c6c;
    }
  `;

  const ServicesTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: #212121;
    margin-bottom: 15px;
  `;

  const ServicesButton = styled.button`
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    background: #018180;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    transition: background 0.3s ease, transform 0.2s ease;

    &:hover {
      background: #026c6c;
      transform: translateY(-2px);
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `;

  const SelectedServicesList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 2%;
  `;

  const SelectedServiceItem = styled.li`
    background: #fff;
    padding: 10px;
    border: 2px solid #018180;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;

    &:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  const DeleteIcon = styled(BsDashCircle)`
    cursor: pointer;
    color: red;
    font-size: 1.2rem;
  `;

  const DescriptionContainer = styled.div`
    color: black;
    padding: 20px;
    border-radius: 10px;
    margin-top: 20px;
    width: 100%;
    max-width: 100%;
    text-align: justify;
    font-size: 1.1rem;
    line-height: 1.6;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background: white;
  `;

  const CloseButton = styled(BsX)`
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.5rem;
    color: #026c6c;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #018180;
    }
  `;
 
  const GlobalStyle = createGlobalStyle`
  .swal2-popup {
    background-color: rgb(255, 255, 255) !important;
    color: black !important;
    border-radius: 10px !important;
  }

   .swal2-actions {
    display: flex;
    justify-content: center;
    gap: 15px; /* Espacio entre botones */
  }


  .btn-swal-confirmar {
    background-color: #018180 !important;
    color: white !important;
    border: none !important;
    padding: 10px 20px !important;
    border-radius: 5px !important;
    font-size: 16px !important;
    cursor: pointer !important;
  }

  .btn-swal-confirmar:hover {
    background-color: rgb(5, 110, 110) !important;
  }

  .btn-swal-cancelar {
    background-color: #dc3545 !important;
    color: white !important;
    border: none !important;
    padding: 10px 20px !important;
    border-radius: 5px !important;
    font-size: 16px !important;
    cursor: pointer !important;
  }

  .btn-swal-cancelar:hover {
    background-color: #c82333 !important;
  }
`;


  const DetallesCocheAgente = () => {
    const { brandId, carId } = useParams();
    const { brands } = useContext(BrandsContext);
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [showServiciosModal, setShowServiciosModal] = useState(false);
    const [showClienteModal, setShowClienteModal] = useState(true);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [selectedAgente, setSelectedAgente] = useState(null)
    const [correoAgente,setCorreoAgente] = useState("")
    const [agentes,setAgentes] = useState([])
    const [agenteAgregadoAhorite,setAgenteAgregadoAhorita] = useState(null)
    const [venta,setVenta] = useState(
      {
        date :new Date(),
        cliente:{},
        vehiculo:{},
        agente:{},
        total:0,
        ventaServicios:[]
      }
    )
    const [autoAct, setAutoct] = useState(null)
    


    const venderUnAutoInsano = async () => {
      const ventaActualizado = {
        ...venta,
        ventaServicios : selectedServices.map(s => ({ servicio: { id: s.id } }))
      };
      try {
          await axios.post('https://bwubka276h.execute-api.us-east-1.amazonaws.com/ventas/vender', ventaActualizado, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
              },
          });
          
          console.log("venta data contraa la salubridad ",ventaActualizado)
          
          Swal.fire({
              title: "Registro exitoso",
              text: 'Gracias por comprar con nosotros',
              icon: "success",
              confirmButtonColor: "#018180",
          });

      } catch (error) {
          console.error("Error en el registro:", error);
          Swal.fire({
              title: "Error",
              text: "No se pudo completar el registro. Inténtalo de nuevo.",
              icon: "error",
              confirmButtonColor: "#d33",
          });
      }
      
  };

  const ActualizarEstadoDeUnAutoInsano = async () => {
    //setAutoct(venta.vehiculo)
    //setAutoct((prevAuto)=>({...prevAuto, estado:3}))
    const autoActualizado = {
      ...venta.vehiculo,
      estado: { id: 3, nombre: 'Vendido' },
      precio: car.precio // Reemplaza 'nuevoPrecio' con el valor que quieras asignar
      //ventaServicios : selectedServices.map(s => ({ servicio: { id: s.id } }))
    };
    
    try {
        await axios.put(`https://bwubka276h.execute-api.us-east-1.amazonaws.com/vehiculo/actualizar/${venta.vehiculo.id}`, autoActualizado, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        
        console.log("datos de la venta segun registrados ",autoActualizado)
        
        

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
  
      useEffect(() => {
              if (agentes.length > 0 && correoAgente) {
                  const agenteEncontrado = agentes.find(agente => agente.email === correoAgente);
                  if (agenteEncontrado) {
                      setAgenteAgregadoAhorita(agenteEncontrado);
                      setVenta((prevVenta) => ({...prevVenta,  agente: agenteEncontrado }));

                  } else {
                      console.log("No se encontró el agente con ese correo");
                  }
              }
          }, [agentes, correoAgente]);
          //console.log("sdsdsadsdsddsdsds",AgenteAgregadoAhorita.id)

    useEffect(() => {
      const fetchCar = async () => {
        try {
          const data = await VehiculoService.getVehiclesByBrandId(brandId);
          const foundCar = data.find((c) => c.id.toString() === carId);
          setCar(foundCar || null);
          setVenta((prevVenta) => ({...prevVenta,  vehiculo: foundCar }));

        } catch (error) {
          console.error("❌ Error obteniendo vehículo:", error);
        }
      };

      fetchCar();
    }, [brandId, carId]);

    if (!brands || brands.length === 0) {
      return <p>Cargando marcas...</p>;
    }

    const brand = brands.find((b) => b.id.toString() === brandId);
    if (!brand) return <p>Marca no encontrada pero en</p>;

    if (!car) return <p>Coche no encontrado</p>;

    const handleClienteSeleccionado = (cliente) => {
      setSelectedCliente(cliente);
      setVenta((prevVenta) => ({...prevVenta,  cliente: cliente }));

      setShowClienteModal(false);
    };

    const handleAgregarServicios = () => {
      if (selectedCliente) {
        setShowServiciosModal(true);
      }
    };

    const handleCancelarCliente = () => {
      navigate(-1);
    };

    const handleCompra = () => {
      if (!selectedCliente) {
        alert("Selecciona un cliente antes de comprar.");
        return;
      }
    
      // Mostramos la alerta con SweetAlert2
      Swal.fire({
        title:"¡Gran elección!",
        text: "¿Desea continuar con la compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: 'btn-swal-confirmar',
          cancelButton: 'btn-swal-cancelar'
        },
        buttonsStyling: false, // Esto evita que SweetAlert2 sobrescriba los estilos
        reverseButtons: true
      
      
      
      }).then((result) => {
        if (result.isConfirmed) {
          // Creamos el objeto con los datos de la venta
          const resumenVenta = {
            cliente: selectedCliente,
            coche: car,
            fecha: new Date().toLocaleDateString(),
            servicios: selectedServices,
            totalAuto: car.precio,
            totalServicios: selectedServices.reduce((acc, service) => acc + service.price, 0),
            totalFinal: car.precio + selectedServices.reduce((acc, service) => acc + service.price, 0),
            agente: agenteAgregadoAhorite
          };
        
          // Guardamos en localStorage
          localStorage.setItem("resumenCompra", JSON.stringify(resumenVenta));
        
          // Abrimos nueva pestaña
          window.open("/resumen-compra", "_blank");
        
          // Realizamos las acciones necesarias
          venderUnAutoInsano();
          ActualizarEstadoDeUnAutoInsano();
        
          // Redireccionamos la pestaña actual
          window.location.href = "http://localhost:5173/agente/tablaCliente";
        }
        
         else {
          // Si el usuario cancela, no pasa nada
          console.log("Compra cancelada por el usuario");
        }
      });
    };
    
    

    //setVenta((venta)=>venta.cliente = selectedCliente)
    //setVenta((venta)=>venta.agente = agenteAgregadoAhorite)
    //setVenta((venta)=>venta.vehiculo= car)

    console.log("Datos a registrar de la venta")
    console.log(selectedCliente);
    console.log(agenteAgregadoAhorite)
    console.log(car)
    
    
    


    return (
      <>
          <GlobalStyle />

        <NavAgenteVenta />
        <ContentWrapper>
          <MainContent>
            <LeftSection>
              <CarImage src={car.imagen || "default_image_url.jpg"} alt={car.modelo} />
              <CarInfo>
                <CarTitle>{car.modelo}</CarTitle>
                <CarYear>Año: {car.year}</CarYear>
                <Price>Precio: ${car.precio.toLocaleString()} MXN</Price>
                <BuyButton onClick={handleCompra}>Comprar</BuyButton>
                </CarInfo>
            </LeftSection>

            <ServicesSection>
              <ServicesHeader>
                {selectedCliente && <p>Atendiendo a: {selectedCliente.name}</p>}
                <ServicesTitle>Servicios</ServicesTitle>
                <ServicesButton
                  onClick={handleAgregarServicios}
                  disabled={!selectedCliente}
                >
                  Agregar Servicios
                </ServicesButton>
              </ServicesHeader>

              <ServicesListContainer>
                <SelectedServicesList>
                  {selectedServices.length > 0 ? (
                    selectedServices.map((service, index) => (
                      <SelectedServiceItem key={index}>
                        {service.name} - ${service.price} 
                        <DeleteIcon
                          onClick={() =>
                            setSelectedServices(
                              selectedServices.filter((s) => s.id !== service.id)
                            )
                          }
                        />
                      </SelectedServiceItem>
                    ))
                  ) : (
                    <p>Aún no has seleccionado servicios.</p>
                  )}
                </SelectedServicesList>
              </ServicesListContainer>
            </ServicesSection>
          </MainContent>
          <DescriptionContainer>
            {car.description}
          </DescriptionContainer>
        </ContentWrapper>
        

        {showServiciosModal && (
          <ServiciosModal
            onClose={() => setShowServiciosModal(false)}
            onAddService={setSelectedServices}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            closeButton={<CloseButton onClick={() => setShowServiciosModal(false)} />} // Ícono de cierre
          />
        )}

        <SeleccionarClienteModal
          isOpen={showClienteModal}
          onClose={handleCancelarCliente}
          onSelect={handleClienteSeleccionado}
        />
      </>
    );
  };

  export default DetallesCocheAgente;