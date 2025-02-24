import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
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
        {/* Imagen fuera del toggle para que no colapse  href="/NoDefinido" */ }
        <Navbar.Brand >
          <img src={homeIcon} alt="home" style={{ width: "80px", height: "40px" }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <StyledNavLink href="/gerente/agenteVentas">Agentes de venta</StyledNavLink>
            </Nav.Item>
            <Nav.Item>
              <StyledNavLink href="/gerente/cartable">Marcas</StyledNavLink>
            </Nav.Item>
            <Nav.Item>
              <StyledNavLink href="/gerente/servicios">Servicio</StyledNavLink>
            </Nav.Item>
          </Nav>

          {/* Ícono alineado a la derecha con menú desplegable */}
          <Nav>
            <Nav.Item>
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                  <i className="bi bi-person-circle fs-2"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item href="/gerente/editPerfil"><i class="bi bi-person-gear fs-6 "></i> Editar perfil</Dropdown.Item>
                  <Dropdown.Item href="#/edditPerfil"><i class="bi bi-box-arrow-left fs-6"></i> Cerrar sesión</Dropdown.Item>
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