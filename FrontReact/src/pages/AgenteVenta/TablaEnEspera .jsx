import React from "react";
import { Table, Button } from "react-bootstrap";
import styled from "styled-components";
import { BiSolidUserVoice } from "react-icons/bi";
import Swal from "sweetalert2";

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

const TablaEnEspera = ({ autos = [], onAprobar }) => {
  const handleAtender = (autoId) => {
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
        onAprobar(autoId);
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
        {autos.map((auto, i) => (
          <tr key={i}>
            <td>{auto.vehiculo?.modelo || 'N/A'}</td>
            <td>{auto.vehiculo?.marca?.nombre || 'N/A'}</td>
            <td>{auto.cliente?.name ? `${auto.cliente.name} ${auto.cliente.lastname}` : 'N/A'}</td>
            <td>{auto.cliente?.email || 'N/A'}</td>
            <td>${auto.vehiculo?.precio?.toLocaleString() || '0'}</td>
            <td>
              <div className="btn-wrapper">
                <Button 
                  className="btn-atender" 
                  onClick={() => handleAtender(auto.id)}
                >
                  <BiSolidUserVoice size={16} />
                  Atender
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default TablaEnEspera;