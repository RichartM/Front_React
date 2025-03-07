import React from 'react';
import { Navbar, Nav, Container, Dropdown, Offcanvas } from 'react-bootstrap';
import homeIcon from '../../img/home.png';
import styled from 'styled-components';

// Estilos para la línea debajo del enlace al hacer hover
const StyledNavLink = styled(Nav.Link)`
  color: #000 !important; /* Color del texto por defecto */
  position: relative;
  transition: color 0.3s ease; /* Transición suave para el color del texto */

  &:hover {
    color: #018180 !important; /* Color del texto al hacer hover */
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px; /* Ajusta la posición de la línea */
    width: 0; /* Inicialmente sin línea */
    height: 2px; /* Grosor de la línea */
    background-color: #018180; /* Color de la línea */
    transition: width 0.3s ease; /* Transición suave para la línea */
  }

  &:hover::after {
    width: 100%; /* Línea completa al hacer hover */
  }

  &.active {
    color: #018180 !important; /* Color del texto cuando está activo */
  }

  &.active::after {
    width: 100%; /* Línea completa cuando está activo */
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
  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      className="w-100 position-fixed top-0 start-0 shadow-sm px-2"
      style={{ zIndex: 1050 }} // Asegura que el navbar esté siempre encima
    >
      <Container fluid>
        <Navbar.Brand>
          <img src={homeIcon} alt="home" style={{ width: "80px", height: "40px" }} />
        </Navbar.Brand>

        {/* ✅ Botón de hamburguesa que abre el menú lateral en móviles */}
        <Navbar.Toggle aria-controls="offcanvasNavbar" />

        {/* ✅ Offcanvas solo en móviles (se despliega de derecha a izquierda) */}
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
              <StyledNavLink href="/gerente/agenteVentas">Agentes de venta</StyledNavLink>
              <StyledNavLink href="/gerente/cartable">Marcas</StyledNavLink>
              <StyledNavLink href="/gerente/servicios">Servicio</StyledNavLink>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* ✅ Navbar normal en PC */}
        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
          <Nav className="me-auto">
            <StyledNavLink href="/gerente/agenteVentas">Agentes de venta</StyledNavLink>
            <StyledNavLink href="/gerente/cartable">Marcas</StyledNavLink>
            <StyledNavLink href="/gerente/servicios">Servicio</StyledNavLink>
          </Nav>

          <Nav>
            <Nav.Item>
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                  <i className="bi bi-person-circle fs-2"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item href="/gerente/editPerfil">
                    <i className="bi bi-person-gear fs-6"></i> Editar perfil
                  </Dropdown.Item>
                  <Dropdown.Item href="#/logout">
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
