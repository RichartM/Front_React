import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import Checkbox from "./common/CheckBox"; // Importamos tu checkbox animado

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
  border-radius: 10px;
  width: 80%;
  max-width: 900px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 8px 15px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 15px;

  &:hover {
    background: darkred;
  }
`;

const TableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

const TableHeader = styled.thead`
  background: #018180;
  color: white;

  th {
    padding: 12px;
    border: 1px solid #fff;
  }
`;

const TableRow = styled.tr`
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

// **Servicios Simulados (Remplazar con datos de API más adelante)**
const initialServices = [
  { id: 1, name: "Cambio de Aceite", price: "$500", type: "Mensual" },
  { id: 2, name: "Revisión de Frenos", price: "$700", type: "Mensual" },
  { id: 3, name: "Servicio Completo", price: "$1200", type: "Anual" },
  { id: 4, name: "Alineación y Balanceo", price: "$900", type: "Anual" },
  { id: 5, name: "Cambio de Motor", price: "$8000", type: "Única Aplicación" },
  { id: 6, name: "Cambio de Transmisión", price: "$7500", type: "Única Aplicación" }, // 🔴 Segundo servicio de única aplicación para prueba
];

const ServiciosModal = ({ onClose, onAddService, selectedServices, setSelectedServices }) => {
  // Manejo de selección de servicios
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
        <CloseButton onClick={onClose}>X</CloseButton>
        <h2>Servicios disponibles</h2>

        {/* 📌 Tabla de Servicios */}
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <th>Seleccionar</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Tipo</th>
              </tr>
            </TableHeader>
            <tbody>
              {initialServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell onClick={() => handleToggleService(service)}>
                    <Checkbox isChecked={selectedServices.some((s) => s.id === service.id)} />
                  </TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>{service.type}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ServiciosModal;
