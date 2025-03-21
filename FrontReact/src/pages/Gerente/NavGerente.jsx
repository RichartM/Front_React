import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Nav, Container, Dropdown, Offcanvas } from 'react-bootstrap';
import homeIcon from '../../img/home.png';
import styled from 'styled-components';

// Estilos para la línea debajo del enlace al hacer hover
const StyledNavLink = styled(Nav.Link)`
  color: #000 !important;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #018180 !important;
  }

  &::after {
    content: '';
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

// Componente personalizado para el toggle del Dropdown
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

const NavPrincipal = () => {
  const [perfil, setPerfil] = useState({}); // Asumo que perfil es un objeto

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8080/api/auth/perfilGerente', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setPerfil(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

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
          <img src={homeIcon} alt="home" style={{ width: "80px", height: "40px" }} />
        </Navbar.Brand>

        {/* Botón hamburguesa */}
        <Navbar.Toggle aria-controls="offcanvasNavbar" />

        {/* Offcanvas móviles */}
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
              <Nav.Item>
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} className="d-flex align-items-center text-center">
                    <i className="bi bi-person-circle fs-2 me-2"></i>
                    Perfil
                  </Dropdown.Toggle>
                  {/* Aquí mostramos el nombre y rol */}
                  <Dropdown.Menu align="end">
                    <Dropdown.Item href="/gerente/editPerfil">
                      <i className="bi bi-person-gear fs-6"></i> Editar perfil
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-left fs-6"></i> Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>
              <StyledNavLink href="/gerente/agenteVentas">
                <i className="bi bi-people-fill"></i> Agentes de venta
              </StyledNavLink>
              <StyledNavLink href="/gerente/cartable">
                <i className="bi bi-collection-fill"></i> Marcas
              </StyledNavLink>
              <StyledNavLink href="/gerente/servicios">
                <i className="bi bi-clipboard-fill"></i> Servicio
              </StyledNavLink>

            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* Navbar PC */}
        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
          <Nav className="me-auto">
            <StyledNavLink href="/gerente/panelControl">Panel de control</StyledNavLink>
            <StyledNavLink href="/gerente/agenteVentas">Agentes de venta</StyledNavLink>
            <StyledNavLink href="/gerente/cartable">Marcas</StyledNavLink>
            <StyledNavLink href="/gerente/servicios">Servicio</StyledNavLink>

          </Nav>

          <Nav className="d-flex align-items-center gap-3">
  <div className="d-flex flex-column text-end me-3">
    <span style={{ fontWeight: "500", fontSize: "16px", color: "#018180" }}>
    {perfil.email}
    </span>
    <span style={{ fontWeight: "700", fontSize: "18px", color: "#000" }}>
      {perfil.name} - {perfil.rol}
    </span>
  </div>

  <Nav.Item>
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <i className="bi bi-person-circle fs-2"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.Item href="/gerente/editPerfil">
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

export default NavPrincipal;
