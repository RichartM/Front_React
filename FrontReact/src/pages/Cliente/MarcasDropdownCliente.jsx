import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ClienteService from "../../services/ClienteService/ClienteService";

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
  display: ${(props) => (props.$isVisible ? "flex" : "none")};
  flex-direction: row;
  gap: 10px;
  width: auto;
  padding: 10px 15px;
`;

const StyledDropdownItem = styled.li`
  cursor: pointer;
  padding: 10px 15px;
  color: black !important;
  transition: color 0.3s ease;
  white-space: nowrap;
  border-right: 1px solid #ddd;

  &:hover {
    color: #018180 !important;
  }

  &:last-child {
    border-right: none;
  }
`;

const MarcasDropdownCliente = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await ClienteService.getAllBrands();
        const activeBrands = data.filter((brand) => brand.estado === true);
        setBrands(activeBrands);
      } catch (error) {
        console.error("❌ Error al obtener marcas:", error);
      }
    };
    fetchBrands();
  }, []);

  return (
    <DropdownContainer
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <StyledDropdownToggle>
        Comprar auto <i className="bi bi-caret-down-fill"></i>
      </StyledDropdownToggle>

      <DropdownMenu $isVisible={isVisible}>
        {brands.length > 0 ? (
          brands.map((brand) => (
            <StyledDropdownItem
              key={brand.id}
              onClick={() => navigate(`/cliente/marca/${brand.id.toString()}`)}
            >
              {brand.nombre}
            </StyledDropdownItem>
          ))
        ) : (
          <StyledDropdownItem>No hay marcas disponibles</StyledDropdownItem>
        )}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default MarcasDropdownCliente;