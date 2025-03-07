import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { BrandsContext } from "../../context/BrandsContext";
import { useNavigate } from "react-router-dom";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// ✅ Se mantiene la línea debajo de "Marcas" al pasar el cursor
const StyledDropdownToggle = styled.span`
  cursor: pointer;
  font-weight: bold;
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
  top: 100%;
  left: 0;
  list-style: none;
  padding: 10px;
  margin: 0;
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 8px;
  display: ${(props) => (props.isMobile ? "block" : "flex")};
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
  width: ${(props) => (props.isMobile ? "200px" : "auto")};
`;

const StyledDropdownItem = styled.li`
  cursor: pointer;
  padding: 10px 15px;
  color: #000;
  transition: color 0.3s ease;
  border-bottom: ${(props) => (props.isMobile ? "1px solid #ddd" : "none")};

  &:hover {
    color: #018180;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const MarcasDropdown = () => {
  const { brands } = useContext(BrandsContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DropdownContainer
      onMouseEnter={() => !isMobile && setIsVisible(true)}
      onMouseLeave={() => !isMobile && setIsVisible(false)}
    >
      <StyledDropdownToggle onClick={() => isMobile && setIsVisible(!isVisible)}>
        Marcas <i className="bi bi-caret-down-fill"></i>
      </StyledDropdownToggle>

      {isVisible && (
        <DropdownMenu isMobile={isMobile}>
          {brands.map((brand) => (
            <StyledDropdownItem key={brand.id} isMobile={isMobile} onClick={() => navigate(`/cliente/marca/${brand.id}`)}>
              {brand.name}
            </StyledDropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default MarcasDropdown;
