import React from "react";
import { Carousel, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"; // Importar styled-components
import "bootstrap/dist/css/bootstrap.min.css";

const StyledWrapper = styled.div`
  .button {
    background: linear-gradient(140.14deg, #018180 15.05%, #018180 114.99%) padding-box,
      linear-gradient(142.51deg, #018180 8.65%, rgb(255, 255, 255) 88.82%) border-box;
    border-radius: 7px;
    border: 2px solid transparent;
    text-shadow: 1px 1px 1px rgba(50, 204, 255, 0.25);
    box-shadow: 8px 8px 20px 0px rgba(255, 255, 255, 0.35);
    padding: 10px 20px;
    line-height: 1; /* Asegura que el texto esté en una sola línea */
    white-space: nowrap; /* Evita que el texto del botón se rompa */
    cursor: pointer;
    transition: all 0.3s;
    color: white;
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
    text-align: center;
  }

  .button:hover {
    box-shadow: none;
    opacity: 80%;
  }

  .brand-container {
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .brand-container img {
    height: 350px;
    width: 200px;
    object-fit: contain;
  }

  .brand-button-container {
    margin-top: 10px; /* Espacio entre la imagen y el botón */
  }

  /* Estilos personalizados para las flechas del carrusel */
  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    background-image: none; /* Elimina el icono predeterminado */
    color: #018180; /* Color de las flechas */
    font-size: 2.5rem; /* Tamaño de las flechas (más grandes) */
  }

  .carousel-control-prev-icon::before {
    content: "‹"; /* Icono de flecha izquierda */
  }

  .carousel-control-next-icon::before {
    content: "›"; /* Icono de flecha derecha */
  }
`;

// Asegúrate de que las rutas de las imágenes sean correctas
import toyota from "../img/CARROS/LogoToyota.png";
import mazda from "../img/CARROS/MAZDA.png";
import honda from "../img/CARROS/HONDA.png";
import ford from "../img/CARROS/FORD.png";

const brands = [
  { name: "Toyota", img: toyota, route: "/catalogo/toyota" },
  { name: "Mazda", img: mazda, route: "/catalogo/mazda" },
  { name: "Honda", img: honda, route: "/catalogo/honda" },
  { name: "Ford", img: ford, route: "/catalogo/ford" },
  { name: "Toyota", img: toyota, route: "/catalogo/toyota" },
  { name: "Mazda", img: mazda, route: "/catalogo/mazda" },
  { name: "Honda", img: honda, route: "/catalogo/honda" },
  { name: "Ford", img: ford, route: "/catalogo/ford" },
];

const CarruselMarcas = () => {
  const navigate = useNavigate();

  // Función para dividir las marcas en grupos de tres
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const brandGroups = chunkArray(brands, 3); // Grupos de 3 imágenes

  return (
    <StyledWrapper>
      <Carousel interval={5000} indicators={false} controls={true}>
        {brandGroups.map((group, index) => (
          <Carousel.Item key={index}>
            <Row className="justify-content-center">
              {group.map((brand, idx) => (
                <Col key={idx} md={4} className="d-flex justify-content-center">
                  <div className="brand-container">
                    <img className="d-block" src={brand.img} alt={brand.name} />
                    <div className="brand-button-container">
                      <Button className="button" onClick={() => navigate(brand.route)}>
                        Ver {brand.name}
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </StyledWrapper>
  );
};

export default CarruselMarcas;