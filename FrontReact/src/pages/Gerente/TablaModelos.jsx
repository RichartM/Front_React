import React from 'react';
import { Table } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import styled from 'styled-components';
import BootstrapPagination from '../../components/common/BootstrapPagination';
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';

const CustomTableHeader = styled.thead`
  background-color: #018180;
  color: white;
  
  th {
    background-color: #018180;
    color: white;
    padding: 8px;
    text-align: center;
    border: 1px solid rgb(255, 255, 255);
  }
`;

const ScrollableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #018180 #f1f1f1;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const TablaModelos = ({
    modelos,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    onEdit,
    onToggleStatus,
}) => {
    const filteredModelos = modelos.filter(item =>
        item.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentModelos = filteredModelos.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                {/* Puedes incluir el FiltroBuscador aquí si lo requieres */}
            </div>
            <ScrollableContainer>
                <Table striped bordered hover className="mt-2">
                    <CustomTableHeader>
                        <tr>
                            <th>Modelo</th>
                            <th>Marca</th>
                            <th>Placa</th>
                            <th>Precio</th>
                            <th>Año</th>
                            <th>Color</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </CustomTableHeader>
                    <tbody>
                        {currentModelos.map((item) => (
                            <tr key={item.id}>
                                <td>{item.modelo}</td>
                                <td>{item.marca}</td>
                                <td>{item.placa}</td>
                                <td>{item.precio}</td>
                                <td>{item.año}</td>
                                <td>{item.color}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.estado}</td>
                                <td>
                                    <BsPencilSquare
                                        className="text-primary me-2 fs-1"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => onEdit(item, false)}
                                    />
                                    {item.estado === "Activo" ? (
                                        <BsToggleOn
                                            className="text-success fs-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => onToggleStatus(item, false)}
                                        />
                                    ) : (
                                        <BsToggleOff
                                            className="text-danger fs-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => onToggleStatus(item, false)}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ScrollableContainer>
            <BootstrapPagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredModelos.length / recordsPerPage)}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default TablaModelos;
