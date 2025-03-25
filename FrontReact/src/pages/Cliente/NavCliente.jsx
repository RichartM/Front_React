import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Nav, Container, Dropdown, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import homeIcon from "../../img/home.png";
import styled from "styled-components";
import MarcasDropdown from "../Cliente/MarcasDropdownCliente";
import { usePerfilCliente } from '../../context/PerfilClienteContext';

// Estilos personalizados para los enlaces del navbar


// Estilos personalizados para los enlaces del navbar
const StyledNavLink = styled(Nav.Link)`
  color: #000 !important;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #018180 !important;
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

  &.active {
    color: #018180 !important;
  }

  &.active::after {
    width: 100%;
  }
`;

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <StyledNavLink
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </StyledNavLink>
));

const NavCliente = () => {
  const { perfil, updatePerfil } = usePerfilCliente(); // Usa el hook
  const navigate = useNavigate();

  useEffect(() => {
    updatePerfil(); // Actualiza el perfil al cargar el componente
  }, [updatePerfil]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.history.pushState(null, "", window.location.href);
    window.history.replaceState(null, "", "/login");

    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="w-100 position-fixed top-0 start-0 shadow-sm px-2"
      style={{ zIndex: 1050 }}
    >
      <Container fluid>
        <Navbar.Brand>
          <img src={homeIcon} alt="LandingPage" style={{ width: "80px", height: "40px" }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="offcanvasNavbar" />

        {/* Offcanvas solo en móviles */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          style={{ maxWidth: "280px" }}
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="d-flex flex-column align-items-start gap-2 w-100">
              {/* Dropdown del usuario - PRIMERO */}
              <Nav.Item className="w-100">
                <Dropdown className="w-100">
                  <Dropdown.Toggle as={CustomToggle} className="w-100">
                    <i className="bi bi-person-circle fs-2"></i> Perfil
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item href="/cliente/editPerfil">
                      <i className="bi bi-person-gear fs-6"></i> Editar perfil
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-left fs-6"></i> Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>

              {/* Historial de compras - SEGUNDO */}
              <StyledNavLink href="/cliente">
                <i className="bi bi-clock-history fs-5"></i> Historial de compras
              </StyledNavLink>

              {/* Menú de Marcas - ÚLTIMO */}
              <div className="w-100">
                <MarcasDropdown />
              </div>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* Navbar normal en PC */}
        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
          <Nav className="me-auto d-flex align-items-center">
            <StyledNavLink href="/cliente">Historial de compras</StyledNavLink>
            <MarcasDropdown />
          </Nav>
          <div className="d-flex flex-column text-end me-3">
            <span style={{ fontWeight: "500", fontSize: "16px", color: "#018180" }}>
              {perfil.email}
            </span>
            <span style={{ fontWeight: "700", fontSize: "18px", color: "#000" }}>
              {perfil.name} - {perfil.rol}
            </span>
          </div>
          <Nav>
            <Nav.Item>
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                  <i className="bi bi-person-circle fs-2"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item href="/cliente/editPerfil">
                    <i className="bi bi-person-gear fs-6"></i> Editar perfil
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-left fs-6"></i> Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavCliente;