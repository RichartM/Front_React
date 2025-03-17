import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { BsX } from "react-icons/bs"; // Importar el ícono de cierre
import Checkbox from "./common/CheckBox"; // ✅ Checkbox personalizado
import ServiciosService from "../services/AgenteService/ServiciosService"; // ✅ Importar servicio

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  margin-top: 5%;
  border-radius: 10px;
  width: 85%;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButtonContainer = styled.div`
  position: sticky;
  top: 0;
  background: #ffffff;
  padding: 15px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #018180; /* Borde inferior más grueso */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra para resaltar */
`;

const CloseButton = styled(BsX)`
  font-size: 2.9rem;
  color: white;
  cursor: pointer;
  background: #ff4d4d;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;

  &:hover {
    background: #cc0000;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #018180;
  margin: 0;
  font-weight: bold;
`;

const SectionTitle = styled.h3`
  color: #018180;
  text-align: left;
  margin-bottom: 10px;
  font-size: 1.4rem;
`;

const ServiceContainer = styled.div`
  margin-bottom: 20px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border-left: 5px solid ${({ color }) => color || "#018180"};
`;

const ServiceTitle = styled.h4`
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
  color: #212121;
`;

const ServiceDescription = styled.p`
  font-size: 0.95rem;
  color: #555;
  margin: 5px 0 0;
  text-align: left;
`;

const ServiceCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer; /* Para indicar que es clickeable */
`;

const ServiciosModal = ({ onClose, selectedServices, setSelectedServices }) => {
  const [services, setServices] = useState([]); // Estado para almacenar los servicios
  const [loading, setLoading] = useState(true);

  // Cargar los servicios desde el backend
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await ServiciosService.obtenerServicios();
        setServices(data);
      } catch (error) {
        console.error("❌ Error obteniendo los servicios:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los servicios.",
          icon: "error",
          confirmButtonColor: "#018180",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  // Agrupar servicios por modalidad
  const groupedServices = services.reduce((acc, service) => {
    const key = service.modalidad || "Otros";
    if (!acc[key]) acc[key] = [];
    acc[key].push(service);
    return acc;
  }, {});

  const handleToggleService = (service) => {
    setSelectedServices((prevServices) => {
      const alreadySelected = prevServices.some((s) => s.id === service.id);

      // Si el servicio es de "Única Aplicación" y ya hay uno seleccionado
      if (service.modalidad === "DE ÚNICA OCASIÓN" && !alreadySelected) {
        const hasUniqueService = prevServices.some((s) => s.modalidad === "DE ÚNICA OCASIÓN");

        if (hasUniqueService) {
          Swal.fire({
            title: "Solo puedes seleccionar un servicio de Única Aplicación",
            text: "Si deseas cambiarlo, primero deselecciona el actual.",
            icon: "warning",
            confirmButtonColor: "#018180",
          });
          return prevServices;
        }
      }

      // Si ya está en la lista, lo eliminamos. Si no, lo agregamos
      return alreadySelected ? prevServices.filter((s) => s.id !== service.id) : [...prevServices, service];
    });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButtonContainer>
          <ModalTitle>SERVICIOS DISPONIBLES</ModalTitle>
          <CloseButton onClick={onClose} /> {/* Botón de cerrar a la derecha */}
        </CloseButtonContainer>

        {loading ? (
          <p>Cargando servicios...</p>
        ) : (
          Object.keys(groupedServices).map((category) => (
            <div key={category}>
              <SectionTitle>{category}</SectionTitle>
              {groupedServices[category].map((service) => (
                <ServiceContainer key={service.id} color="#018180">
                  <ServiceCheckbox onClick={() => handleToggleService(service)}>
                    <div>
                      <ServiceTitle>{service.name}</ServiceTitle>
                      <ServiceDescription>{service.description}</ServiceDescription>
                    </div>
                    <Checkbox isChecked={selectedServices.some((s) => s.id === service.id)} />
                  </ServiceCheckbox>
                </ServiceContainer>
              ))}
            </div>
          ))
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ServiciosModal;