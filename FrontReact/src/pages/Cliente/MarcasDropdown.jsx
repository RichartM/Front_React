import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import styled from "styled-components";

// Lista de marcas disponibles
const marcas = ["Toyota", "Ford", "Chevrolet", "Honda", "Mazda", "Nissan"];

// Estilización del menú desplegable horizontal
const DropdownMenuHorizontal = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 10px;
  min-width: 400px;
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 8px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateY(10px);
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${DropdownMenuHorizontal} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const StyledDropdownToggle = styled.span`
  cursor: pointer;
  font-weight: bold;
  padding: 5px 10px;
  display: inline-block;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #018180 !important;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: #018180;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const StyledDropdownItem = styled.span`
  cursor: pointer;
  padding: 10px 15px;
  color: black !important;
  transition: color 0.3s ease;

  &:hover {
    color: #018180 !important;
  }
`;

const MarcasDropdown = () => {
  return (
    <DropdownContainer>
      <StyledDropdownToggle>Marcas</StyledDropdownToggle>
      <DropdownMenuHorizontal>
        {marcas.map((marca, index) => (
          <StyledDropdownItem key={index} onClick={() => console.log(`Seleccionaste ${marca}`)}>
            {marca}
          </StyledDropdownItem>
        ))}
      </DropdownMenuHorizontal>
    </DropdownContainer>
  );
};

export default MarcasDropdown;
