import React, { useContext, useState, useEffect } from "react";
import { useParams, useLocation,useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BrandsContext } from "../../context/BrandsContext";
import ServiciosModal from "../../components/ServiciosModal";
import NavCliente from "../Cliente/NavCliente";
import NavAgenteVenta from "../AgenteVenta/NavAgenteVenta";
import { BsDashCircle, BsX } from "react-icons/bs"; // Aquí agregué BsX
import VehiculoService from "../../services/AgenteService/VehiculoService";
import axios from  'axios'
import Swal from 'sweetalert2';



// ... (el resto del código permanece igual)


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

const DetallesCoche = () => {
  const { brandId, carId } = useParams();
  const location = useLocation();
  const { brands } = useContext(BrandsContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [autosEnEspera, setAutosEnEspera] = useState([])

  const isAgente = location.pathname.includes("/agente");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await VehiculoService.getVehiclesByBrandId(brandId);
        const foundCar = data.find((c) => c.id.toString() === carId);
        setCar(foundCar);
      } catch (error) {
        console.error("Error obteniendo vehículo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [brandId, carId]);


///Agregado para compra onine back
const [selectedCliente, setSelectedCliente] = useState(null);
    const [selectedAgente, setSelectedAgente] = useState(null)
    const [correoAgente,setCorreoAgente] = useState("")
    const [agentes,setAgentes] = useState([])
    const [agenteAgregadoAhorite,setAgenteAgregadoAhorita] = useState(null)
    const [cliente,setCliente] = useState(null)
    const [venta,setVenta] = useState(
      {
        date :new Date(),
        cliente:{},
        vehiculo:{},
        agente:{},
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
          await axios.post('http://localhost:8080/ventas/vender', ventaActualizado, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
              },
          });
          

          
          Swal.fire({
              title: "Registro Exitoso",
              text: 'Gracias por comprar con nosotros, eres insano',
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
      estado: {id:2,nombre:'En espera'},
  };
    try {
        await axios.put(`http://localhost:8080/vehiculo/actualizar/${venta.vehiculo.id}`, autoActualizado, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        

        
        

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




    const fetchClientes = async () => {
            const token = localStorage.getItem("token");
    
            if (token) {
                try {
                    const response = await axios.get("http://localhost:8080/cliente/buscar", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
    
                    console.log("respuesta del api con los clientes: ",response.data)
                    setSelectedCliente(response.data);
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
                fetchClientes();
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
              if (selectedCliente?.length > 0 && correoAgente) {
                  const agenteEncontrado = selectedCliente.find(agente => agente.email === correoAgente);
                  if (agenteEncontrado) {
                      setCliente(agenteEncontrado);
                      setVenta((prevVenta) => ({...prevVenta,  cliente: agenteEncontrado }));

                  } else {
                      console.log("No se encontró el agente con ese correo");
                  }
              }
          }, [selectedCliente, correoAgente]);
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

    /*const handleClienteSeleccionado = (cliente) => {
      setSelectedCliente(cliente);
      setVenta((prevVenta) => ({...prevVenta,  cliente: cliente }));

    };*/


///Fin Agregado compra online back

useEffect(() => {
  setVenta((prevVenta) => ({...prevVenta,  agente: venta.cliente.agente }));
}, [selectedCliente, correoAgente]);

console.log("desde la viata de cliente, datos de venta")
console.log(selectedCliente)
console.log(car)
console.log(venta)














  const handleCompra = () => {
    if (isAgente) {
      // Lógica para agente (podría redirigir a selección de cliente)
      console.log("Proceso de compra para agente");
    } else {
      // Lógica para cliente
      const cliente = JSON.parse(localStorage.getItem('user'));
      console.log("Proceso de compra para cliente", cliente);
    }
  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const vendeYa = () =>{
  console.log("mira man, en teoria ya se debe vender")
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
            // Si el usuario confirma la compra, redirigimos a la página de resumen
            navigate("/resumen-compra", {
              state: {
                cliente: selectedCliente,
                coche: car,
                fecha: new Date().toLocaleDateString(),
                servicios: selectedServices,
                totalAuto: car.precio,
                totalServicios: selectedServices.reduce((acc, service) => acc + service.price, 0),
                totalFinal: car.precio + selectedServices.reduce((acc, service) => acc + service.price, 0),
                agente: agenteAgregadoAhorite
              },
            });
            //console.log("Objeto de la venta desdel el dulce alert")
            //console.log(venta);
            //useEffect(()=>{
              venderUnAutoInsano()
              ActualizarEstadoDeUnAutoInsano()
            //},[])
          } else {
            // Si el usuario cancela, no pasa nada
            console.log("Compra cancelada por el usuario");
          }
        });
}






  if (loading) return <p>Cargando...</p>;
  if (!car) return <p>Coche no encontrado</p>;

  return (
    <>
      {isAgente ? <NavAgenteVenta /> : <NavCliente />}

        <ContentWrapper>
        <MainContent>
          <LeftSection>
            <CarImage src={car.imagen || "default_image_url.jpg"} alt={car.modelo} />
            <CarInfo>
              <CarTitle>{car.modelo}</CarTitle>
              <CarYear>Año: {car.year}</CarYear>
              <Price>Precio: ${car.precio?.toLocaleString() || "XXX,XXX"} MXN</Price>
              <BuyButton onClick={()=>{
                vendeYa();
              }}>
                {isAgente ? "Iniciar Venta" : "Comprar"}
              </BuyButton>
            </CarInfo>
          </LeftSection>

          <ServicesSection>
          <ServicesHeader>
            <ServicesTitle>Servicios</ServicesTitle>
            <ServicesButton onClick={() => setShowModal(true)}>
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
                      onClick={() => setSelectedServices(
                        selectedServices.filter((s) => s.id !== service.id)
                      )}
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
          {car.description || `🚗 Este ${car.modelo} del ${car.year} es una excelente opción...`}
        </DescriptionContainer>
        </ContentWrapper>


        {showModal && (
          <ServiciosModal
            onClose={() => setShowModal(false)}
            onAddService={setSelectedServices}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            closeButton={<CloseButton onClick={() => setShowServiciosModal(false)} />} // Ícono de cierre

          />
        )}
    </>
  );
};

export default DetallesCoche;