import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BrandsContext } from "../../context/BrandsContext";
import VehiculoService from "../../services/AgenteService/VehiculoService";
import ServiciosModal from "../../components/ServiciosModal";
import SeleccionarClienteModal from "./SeleccionarClienteModal";
import NavAgenteVenta from "./NavAgenteVenta";
import { BsDashCircle, BsX } from "react-icons/bs"; // Importar el ícono de cierre

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

const DetallesCocheAgente = () => {
  const { brandId, carId } = useParams();
  const { brands } = useContext(BrandsContext);
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [showServiciosModal, setShowServiciosModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await VehiculoService.getVehiclesByBrandId(brandId);
        const foundCar = data.find((c) => c.id.toString() === carId);
        setCar(foundCar || null);
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
  if (!brand) return <p>Marca no encontrada</p>;

  if (!car) return <p>Coche no encontrado</p>;

  const handleClienteSeleccionado = (cliente) => {
    setSelectedCliente(cliente);
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

  return (
    <>
      <NavAgenteVenta />
      <ContentWrapper>
        <MainContent>
          <LeftSection>
            <CarImage src={car.imagen || "default_image_url.jpg"} alt={car.modelo} />
            <CarInfo>
              <CarTitle>{car.modelo}</CarTitle>
              <CarYear>Año: {car.year}</CarYear>
              <Price>Precio: ${car.precio.toLocaleString()} MXN</Price>
              <BuyButton>Comprar</BuyButton>
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