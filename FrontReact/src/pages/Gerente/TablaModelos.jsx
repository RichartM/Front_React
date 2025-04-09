import React from 'react';
import { Table } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import styled from 'styled-components';
import BootstrapPagination from '../../components/common/BootstrapPagination';
import axios from 'axios';
import Swal from 'sweetalert2';

const CustomTableHeader = styled.thead`
  th {
      background-color: #018180;
      text-align: center;
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

const StyledTable = styled(Table)`
border-collapse: collapse; /* Fusiona los bordes de las celdas */
width: 100%;



th {
  background-color: #018180; /* Color de fondo del encabezado */
  color: white; /* Color del texto del encabezado */
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
    setModelos,
}) => {
    const filteredModelos = modelos.filter(item =>
        item.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentModelos = filteredModelos.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const toggleStatus = async (item) => {
        const newState = !item.estadoVehiculo; // Alternar el estado booleano

        try {
            const response = await axios.put(
                `http://localhost:8080/vehiculo/estado/${item.id}`,
                { estadoVehiculo: newState },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const updatedItem = response.data;

            // Actualizar el estado local
            setModelos(prevModelos =>
                prevModelos.map(modelo =>
                    modelo.id === updatedItem.id
                        ? { ...modelo, estadoVehiculo: newState }
                        : modelo
                )
            );

            // Mostrar mensaje de éxito
            Swal.fire({
                title: "¡Hecho!",
                text: `El estado del vehículo ha sido actualizado a ${newState ? "Activo" : "Inactivo"}.`,
                icon: "success",
                confirmButtonColor: "#018180",
                customClass: { confirmButton: "btn-swal-confirmar" },
            });
        } catch (error) {
            console.error("Error al cambiar el estado del vehículo:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al actualizar el estado del vehículo.",
                icon: "error",
                confirmButtonColor: "#dc3545",
                customClass: { confirmButton: "btn-swal-cancelar" },
            });
        }
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                {/* Puedes incluir el FiltroBuscador aquí si lo requieres */}
            </div>
            <ScrollableContainer>
            <StyledTable striped hover className="mt-2">
                    <CustomTableHeader>
                        <tr>
                            <th>Modelo</th>
                            <th>Marca</th>
                            <th>Placa</th>
                            <th>Precio</th>
                            <th>Año</th>
                            <th>Color</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </CustomTableHeader>
                    <tbody>
                        {currentModelos.map((item) => (
                            <tr key={item.id}>
                                <td>{item.modelo}</td>
                                <td>{item.marca.nombre}</td>
                                <td>{item.matricula}</td>
                                <td>{item.precio}</td>
                                <td>{item.year}</td>
                                <td>{item.color}</td>
                                <td>{item.estadoVehiculo ? "Activo" : "Inactivo"}</td>
                                <td>
                                    <BsPencilSquare
                                        className="text-primary me-5 fs-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => onEdit(item, false)}
                                    />
                                    {item.estadoVehiculo ? (
                                        <BsToggleOn
                                            className="text-success fs-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => toggleStatus(item)}
                                        />
                                    ) : (
                                        <BsToggleOff
                                            className="text-danger fs-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => toggleStatus(item)}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
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