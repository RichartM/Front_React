import React, { useContext } from "react";
import styled from "styled-components";
import { BrandsContext } from "../../context/BrandsContext";
import { useNavigate } from "react-router-dom";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledDropdownToggle = styled.span`
  cursor: pointer;
  font-weight: bold;
  padding: 5px 10px;
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

const DropdownMenuHorizontal = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 10px;
  min-width: 300px;
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 8px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateY(10px);
`;

const StyledDropdownItem = styled.span`
  cursor: pointer;
  padding: 10px 15px;
  color: #000;
  transition: color 0.3s ease;

  &:hover {
    color: #018180;
  }
`;

const MarcasDropdown = () => {
  const { brands } = useContext(BrandsContext);
  const navigate = useNavigate();

  return (
    <DropdownContainer
      onMouseEnter={(e) => {
        const menu = e.currentTarget.querySelector("div");
        if (menu) {
          menu.style.opacity = 1;
          menu.style.visibility = "visible";
          menu.style.transform = "translateY(0)";
        }
      }}
      onMouseLeave={(e) => {
        const menu = e.currentTarget.querySelector("div");
        if (menu) {
          menu.style.opacity = 0;
          menu.style.visibility = "hidden";
          menu.style.transform = "translateY(10px)";
        }
      }}
    >
      <StyledDropdownToggle>Marcas <i class="bi bi-caret-down-fill"></i></StyledDropdownToggle>
      <DropdownMenuHorizontal>
        {brands.map((brand) => (
          <StyledDropdownItem
            key={brand.id}
            onClick={() => navigate(`/cliente/marca/${brand.id}`)}
          >
            {brand.name}
          </StyledDropdownItem>
        ))}
      </DropdownMenuHorizontal>
    </DropdownContainer>
  );
};

export default MarcasDropdown;
