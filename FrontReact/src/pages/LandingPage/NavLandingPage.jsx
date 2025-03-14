import React from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import homeIcon from "../../img/home.png";
import styled from "styled-components";
import MarcasDropdown from "../Cliente/MarcasDropdown";

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

const NavLandingPage = () => {
  return (
    <Navbar
      bg="light"
      expand="lg"
      className="w-100 position-fixed top-0 start-0 shadow-sm px-2"
      style={{ zIndex: 1050 }}
    >
      <Container fluid>
        {/* Enlace que apunta a /landing */}
        <Navbar.Brand href="/landing">
          <img
            src={homeIcon}
            alt="LandingPage"
            style={{ width: "80px", height: "40px" }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Menú desplegable de Marcas */}
            <MarcasDropdown />
          </Nav>

          <Nav>
            <Nav.Item>
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                  <i className="bi bi-person-circle fs-2"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item href="/login">
                  <i className="bi bi-person-raised-hand"></i> Iniciar sesión 
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

export default NavLandingPage;
