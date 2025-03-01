import React from 'react';
import { Table } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import styled from 'styled-components';
import BootstrapPagination from '../../components/common/BootstrapPagination';
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';

const CustomTableHeader = styled.thead`
  .scrollable-table {
    max-height: 400px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #018180 #f1f1f1;
  }

  .scrollable-table::-webkit-scrollbar {
    width: 8px;
  }

  .scrollable-table::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  .scrollable-table::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  background-color: #018180;
  color: white;
  
  th {
    background-color: #018180;
    color: white;
    padding: 12px;
    text-align: center;
    border: 1px solid rgb(255, 255, 255);
  }
`;

const TablaMarcas = ({
  marcas,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  recordsPerPage,
  onEdit,
  onToggleStatus,
}) => {
  const filteredMarcas = marcas.filter(marca =>
    marca.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentMarcas = filteredMarcas.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
      </div>
      <div>
        <Table striped bordered hover className="mt-2">
          <CustomTableHeader className="scrollable-table">
            <tr>
              <th>Marca</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </CustomTableHeader>
          <tbody>
            {currentMarcas.map((marca) => (
              <tr key={marca.id}>
                <td>{marca.nombre}</td>
                <td>{marca.estado}</td>
                <td>
                  <BsPencilSquare
                    className="text-primary me-5 fs-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => onEdit(marca, true)}
                  />
                  {marca.estado === "ACTIVO" ? (
                    <BsToggleOn
                      className="text-success fs-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => onToggleStatus(marca, true)}
                    />
                  ) : (
                    <BsToggleOff
                      className="text-danger fs-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => onToggleStatus(marca, true)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <BootstrapPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredMarcas.length / recordsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default TablaMarcas;
