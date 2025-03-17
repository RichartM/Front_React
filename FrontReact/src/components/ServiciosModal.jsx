import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { BsX } from "react-icons/bs"; // Importar el ícono de cierre
import Checkbox from "./common/CheckBox"; // ✅ Checkbox personalizado

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
`;

const ServiciosModal = ({ onClose, onAddService, selectedServices, setSelectedServices }) => {
  // **Servicios Simulados (Puedes cambiar esto por una API)**
  const initialServices = [
    { id: 1, name: "Cambio de Aceite", type: "Mensual", description: "Se reemplaza el aceite viejo por uno nuevo y se cambia el filtro." },
    { id: 2, name: "Revisión de Frenos", type: "Mensual", description: "Revisión completa del sistema de frenos para garantizar seguridad." },
    { id: 7, name: "Cambio de Aceite", type: "Mensual", description: "Se reemplaza el aceite viejo por uno nuevo y se cambia el filtro." },
    { id: 8, name: "Revisión de Frenos", type: "Mensual", description: "Revisión completa del sistema de frenos para garantizar seguridad." },
    { id: 3, name: "Servicio Completo", type: "Anual", description: "Mantenimiento general que incluye cambio de aceite, filtros y alineación." },
    { id: 4, name: "Alineación y Balanceo", type: "Anual", description: "Corrección de la alineación de llantas para evitar desgaste prematuro." },
    { id: 5, name: "Cambio de Motor", type: "Única Aplicación", description: "Sustitución completa del motor con garantía de fábrica." },
    { id: 6, name: "Cambio de Transmisión", type: "Única Aplicación", description: "Reemplazo total de la transmisión para un mejor rendimiento." }
  ];

  // **Clasificar los servicios por tipo**
  const groupedServices = {
    Anual: initialServices.filter(s => s.type === "Anual"),
    Mensual: initialServices.filter(s => s.type === "Mensual"),
    "Única Aplicación": initialServices.filter(s => s.type === "Única Aplicación")
  };

  const handleToggleService = (service) => {
    setSelectedServices((prevServices) => {
      const alreadySelected = prevServices.some((s) => s.id === service.id);

      // Si el servicio es de "Única Aplicación" y ya hay uno seleccionado
      if (service.type === "Única Aplicación" && !alreadySelected) {
        const hasUniqueService = prevServices.some((s) => s.type === "Única Aplicación");

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

        {/* 🔹 Servicios Anuales */}
        <SectionTitle>Servicios Anuales</SectionTitle>
        {groupedServices.Anual.map((service) => (
          <ServiceContainer key={service.id} color="#ffb400">
            <ServiceCheckbox onClick={() => handleToggleService(service)}>
              <div>
                <ServiceTitle>{service.name}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
              </div>
              <Checkbox isChecked={selectedServices.some((s) => s.id === service.id)} />
            </ServiceCheckbox>
          </ServiceContainer>
        ))}

        {/* 🔹 Servicios Mensuales */}
        <SectionTitle>Servicios Mensuales</SectionTitle>
        {groupedServices.Mensual.map((service) => (
          <ServiceContainer key={service.id} color="#4caf50">
            <ServiceCheckbox onClick={() => handleToggleService(service)}>
              <div>
                <ServiceTitle>{service.name}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
              </div>
              <Checkbox isChecked={selectedServices.some((s) => s.id === service.id)} />
            </ServiceCheckbox>
          </ServiceContainer>
        ))}

        {/* 🔹 Servicios de Única Aplicación */}
        <SectionTitle>Servicios de Única Aplicación</SectionTitle>
        {groupedServices["Única Aplicación"].map((service) => (
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
      </ModalContent>
    </ModalOverlay>
  );
};

export default ServiciosModal;