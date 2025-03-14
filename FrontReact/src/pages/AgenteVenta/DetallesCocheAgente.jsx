import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importamos useNavigate
import styled from "styled-components";
import { BrandsContext } from "../../context/BrandsContext";
import ServiciosModal from "../../components/ServiciosModal";
import SeleccionarClienteModal from "./SeleccionarClienteModal";
import NavAgenteVenta from "./NavAgenteVenta";
import { BsDashCircle } from "react-icons/bs";

const PageContainer = styled.div`
  padding: 100px 50px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 80px 20px 40px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }
`;

/* 🔥 SECCIÓN IZQUIERDA: AUTO */
const LeftSection = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const CarImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: 300px;
  object-fit: contain;
  background: transparent;
  border: none;

  @media (max-width: 768px) {
    max-width: 100%;
    height: auto;
  }
`;

const CarInfo = styled.div`
  text-align: center;
  margin-top: 15px;
  width: 100%;
`;

const CarTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #212121;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CarYear = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #026c6c;
  margin-bottom: 15px;
`;

const BuyButton = styled.button`
  padding: 12px 24px;
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

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 12px 24px;
  }
`;

/* 🔥 SECCIÓN DERECHA: SERVICIOS */
const ServicesSection = styled.div`
  width: 40%;
  padding: 20px;
  border-radius: 10px;
  text-align: left;

  @media (max-width: 1024px) {
    width: 100%;
    text-align: center;
  }
`;

const ServicesTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #212121;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
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
  margin-top: 20px;
`;

const SelectedServiceItem = styled.li`
  background: #fff;
  padding: 12px;
  border: 2px solid #018180;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;

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

/* 🔥 DESCRIPCIÓN */
const DescriptionContainer = styled.div`
  color: black;
  padding: 20px;
  border-radius: 10px;
  margin-top: 30px;
  max-width: 80%;
  text-align: justify;
  font-size: 1.2rem;
  line-height: 1.6;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  background: white;
`;

const DetallesCocheAgente = () => {
  const { brandId, carId } = useParams();
  const { brands } = useContext(BrandsContext);
  const [showServiciosModal, setShowServiciosModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(true); // Modal de cliente abierto al inicio
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const navigate = useNavigate(); // Hook para redireccionar

  const brand = brands.find((b) => b.id === brandId);
  if (!brand) return <p>Marca no encontrada</p>;

  const car = brand.cars.find((c) => c.id.toString() === carId);
  if (!car) return <p>Coche no encontrado</p>;

  // Maneja la selección de un cliente
  const handleClienteSeleccionado = (cliente) => {
    setSelectedCliente(cliente);
    setShowClienteModal(false); // Cierra el modal de selección de cliente
  };

  // Maneja el clic en "Agregar Servicios"
  const handleAgregarServicios = () => {
    if (selectedCliente) {
      setShowServiciosModal(true); // Abre el modal de servicios solo si hay un cliente seleccionado
    }
  };

  // Si el usuario cancela la selección de cliente, redirige a la página anterior
  const handleCancelarCliente = () => {
    navigate(-1); // Redirige a la página anterior
  };

  return (
    <>
      <NavAgenteVenta />
      <PageContainer>
        <ContentWrapper>
          <LeftSection>
            <CarImage src={car.image} alt={car.name} />
            <CarInfo>
              <CarTitle>{car.name}</CarTitle>
              <CarYear>Año: {car.year}</CarYear>
              <Price>Precio: $XXX,XXX MXN</Price>
              <BuyButton>Comprar</BuyButton>
            </CarInfo>
          </LeftSection>

          {/* 🔥 SECCIÓN DE SERVICIOS */}
          <ServicesSection>
            {selectedCliente && (
              <p>Atendiendo a: {selectedCliente.name}</p>
            )}
            <ServicesTitle>Servicios</ServicesTitle>
            <ServicesButton
              onClick={handleAgregarServicios}
              disabled={!selectedCliente} // Deshabilita el botón si no hay cliente seleccionado
            >
              Agregar Servicios
            </ServicesButton>

            {/* 📌 Lista de servicios seleccionados */}
            <SelectedServicesList>
              {selectedServices.length > 0 ? (
                selectedServices.map((service, index) => (
                  <SelectedServiceItem key={index}>
                    {service.name} - {service.price}
                    <DeleteIcon 
                      onClick={() => setSelectedServices(selectedServices.filter((s) => s.id !== service.id))}
                    />
                  </SelectedServiceItem>
                ))
              ) : (
                <p>Aún no has seleccionado servicios.</p>
              )}
            </SelectedServicesList>
          </ServicesSection>
        </ContentWrapper>

        {/* 🔥 DESCRIPCIÓN */}
        <DescriptionContainer>
          🚗 Este {car.name} del {car.year} es una excelente opción para quienes buscan comodidad y rendimiento.
          Con un diseño innovador y tecnología avanzada, este vehículo ofrece seguridad y eficiencia en cada trayecto.
        </DescriptionContainer>

        {/* Modal de Servicios */}
        <div style={{marginTop: '20%'}}>
        {showServiciosModal && (
          <ServiciosModal
            onClose={() => setShowServiciosModal(false)}
            onAddService={setSelectedServices}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
          />
        )}
        </div>
      
      </PageContainer>

      {/* Modal para seleccionar cliente */}
      <SeleccionarClienteModal 
        isOpen={showClienteModal} 
        onClose={handleCancelarCliente} // Redirige al cancelar
        onSelect={handleClienteSeleccionado} 
      />
    </>
  );
};

export default DetallesCocheAgente;