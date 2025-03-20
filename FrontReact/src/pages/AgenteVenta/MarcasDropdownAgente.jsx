import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AgenteService from "../../services/AgenteService/AgenteService";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledDropdownToggle = styled.span`
  cursor: pointer;
  padding: 10px;
  display: inline-block;
  position: relative;
  transition: color 0.3s ease;
  color: #000;

  &:hover {
    color: #018180;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 2px;
    background-color: #018180;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  left: 0;
  list-style: none;
  padding: 10px;
  margin: 0;
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 8px;
  display: ${(props) => (props.$isVisible ? "flex" : "none")}; /* 🔹 Ahora es 'flex' para que sea horizontal */
  flex-direction: row; /* 🔹 Muestra los elementos en fila */
  gap: 10px; /* 🔹 Espacio entre las marcas */
  width: auto; /* 🔹 Se ajusta automáticamente al contenido */
  padding: 10px 15px;
`;

const StyledDropdownItem = styled.li`
  cursor: pointer;
  padding: 10px 15px;
  color: black !important;
  transition: color 0.3s ease;
  white-space: nowrap; /* 🔹 Evita que los nombres de las marcas se corten */
  border-bottom: none; /* 🔹 Quitamos el borde inferior */
  border-right: 1px solid #ddd; /* 🔹 Agregamos una separación vertical entre marcas */

  &:hover {
    color: #018180 !important;
  }

  &:last-child {
    border-right: none; /* 🔹 El último elemento no tendrá borde */
  }
`;

const MarcasDropdownAgente = ({ tipoUsuario }) => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await AgenteService.getAllBrands();
        console.log("📢 Marcas obtenidas desde API:", data);

        // Filtra las marcas activas (suponiendo que 'estado' sea el campo que marca si la marca está activa)
        const activeBrands = data.filter((brand) => brand.estado === true);  // Cambia 'estado' si es necesario
        setBrands(activeBrands);
      } catch (error) {
        console.error("❌ Error al obtener marcas:", error);
      }
    };
    fetchBrands();
  }, []);

  return (
    <DropdownContainer
      onMouseEnter={() => setIsVisible(true)} // 🔹 Muestra el dropdown al pasar el mouse
      onMouseLeave={() => setIsVisible(false)} // 🔹 Oculta el dropdown al salir del área
    >
      <StyledDropdownToggle>
        Vender auto <i className="bi bi-caret-down-fill"></i>
      </StyledDropdownToggle>

      <DropdownMenu $isVisible={isVisible}>
        {brands.length > 0 ? (
          brands.map((brand) => (
            <StyledDropdownItem
              key={brand.id}
              onClick={() => navigate(`/agente/marca/${brand.id.toString()}`)}
            >
              {brand.nombre} {/* 🔹 Asegura que usa 'nombre' en lugar de 'name' */}
            </StyledDropdownItem>
          ))
        ) : (
          <StyledDropdownItem>No hay marcas disponibles</StyledDropdownItem>
        )}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default MarcasDropdownAgente;
