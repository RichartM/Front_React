import React from 'react';
import { usePerfilAgente } from "../../context/PerfilAgenteContext";
import { Navbar, Nav, Container, Dropdown, Offcanvas } from 'react-bootstrap';
import homeIcon from '../../img/home.png';
import styled from 'styled-components';
import MarcasDropdownAgente from './MarcasDropdownAgente';

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

  &:hover::after,
  &.active::after {
    width: 100%;
  }

  &.active {
    color: #018180 !important;
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

const NavAgenteVenta = () => {
  const { perfil } = usePerfilAgente();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ✅ Si perfil no está cargado aún
  if (!perfil || !perfil.email) {
    return null; // O un Spinner si prefieres
  }

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

        <Navbar.Toggle aria-controls="offcanvasNavbar" />

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
                  <Dropdown.Menu align="end">
                    <Dropdown.Item href="/agente/editPerfil">
                      <i className="bi bi-person-gear fs-6"></i> Editar perfil
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-left fs-6"></i> Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>

              <StyledNavLink href="/agente/clientes">
                <i className="bi bi-people-fill"></i> Clientes
              </StyledNavLink>

              <MarcasDropdownAgente tipoUsuario="agente" />

              <StyledNavLink href="/agente/historial-ventas">
                <i className="bi bi-clock-history"></i> Historial de Ventas
              </StyledNavLink>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
          <Nav className="me-auto">
            <StyledNavLink href="/agente/tablaCliente">Clientes</StyledNavLink>
            <MarcasDropdownAgente tipoUsuario="agente" />
            <StyledNavLink href="/agente/historialventas">Historial de Ventas</StyledNavLink>
          </Nav>
          <div className="d-flex flex-column text-end me-3">
            <span style={{ fontWeight: "500", fontSize: "16px", color: "#018180" }}>
              {perfil.email}
            </span>
            <span style={{ fontWeight: "700", fontSize: "18px", color: "#5b5b5b" }}>
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
                  <Dropdown.Item href="/agente/editPerfil">
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

export default NavAgenteVenta;
