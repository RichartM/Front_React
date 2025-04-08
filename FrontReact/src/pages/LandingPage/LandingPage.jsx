import React, { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import CarruselMarcas from '../../components/common/CarruselMarcas';
import bgImage from '../../img/EsteBueno.avif';
import Ruben from '../../img/RUBEN.png';
import FormRegistro from '../Auth/FormRegistro';
import Footer from "../../components/common/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';
import NavLandingPage from "./NavLandingPage"; // Importa el nav desde la misma carpeta

const LandingPage = () => {
  const [isArrowVisible, setIsArrowVisible] = useState(true);

  const registroRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToRegister && registroRef.current) {
      registroRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.state]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsArrowVisible(false);
      } else {
        setIsArrowVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      {/* Nav de Landing Page */}
      <NavLandingPage />
      
      {/* Contenedor del contenido con margen superior para compensar el navbar fijo */}
      <div style={{ marginTop: "80px" }}>
        {/* Hero Section */}
        <div
          className="text-center"
          style={{
            position: "relative",
            height: "90vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={bgImage}
            alt="Carro"
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: -1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
              zIndex: 0,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "22%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              color: "white",
            }}
          >
            <h1>¿BUSCAS UN AUTO?</h1>
            <p className="text" style={{color: '#018180' , fontWeight: 'bold'}}>REVISA NUESTRO CATÁLOGO Y BENEFÍCIATE CON NUESTROS SERVICIOS</p>
          </div>
          <div
            className={`arrow-down ${isArrowVisible ? "" : "hidden"}`}
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" })}
            style={{ bottom: "40px" }}
          ></div>
        </div>

        {/* Sección de marcas */}
        <div className="text-center p-5" style={{ backgroundColor: "#f8f9fa" }} data-aos="fade-up">
          <h3 className="mb-4" style={{ fontSize: "2rem", color: "#018180" }}>¿Tienes una marca en mente?</h3>
          <p className="text text-center" style={{ fontSize: "1.2rem", textAlign: "justify" }}>
            Descubre una amplia selección de marcas en un solo lugar. En nuestra agencia, trabajamos con diversas marcas
            reconocidas para ofrecerte productos de calidad, garantía y estilo. ¡Explora nuestras opciones y elige la que más te guste!
          </p>
          <CarruselMarcas />
        </div>

        {/* Services Section */}
        <div className="text-center p-5" data-aos="fade-up">
          <h4 className="text mb-4" style={{color: '#018180'}}>SERVICIOS PARA TU AUTO</h4>
          <p className="mb-4">No solo basta con tener un auto, debes darle mantenimiento:</p>
          <ul className="text-start d-inline-block mb-4">
            <li>Aplicación única – Para quienes buscan un servicio puntual.</li>
            <li>Plan mensual – Ideal para quienes desean mantenimiento recurrente.</li>
            <li>Plan anual – La opción más conveniente.</li>
          </ul>
          <h6 className="text mb-4" style={{color: '#018180'}}>Explora nuestros servicios y elige la opción que mejor se adapte a ti. ¡Tu auto merece lo mejor!</h6>
        </div>

        {/* Contact Section */}
        {/* Sección de contacto con el formulario de registro */}
        <div ref={registroRef} style={{ position: 'relative', top: '20%' }}></div>

        <div className="text-center mt-2 mb-2" data-aos="fade-up" >
          <Row className="justify-content-center">
            <Col md={5} className="d-flex align-items-center justify-content-center" >
              <div>
                <img
                  src={Ruben}
                  alt="Imagen representativa"
                  className="img-fluid mb-3"
                  style={{ width: "70%", maxWidth: "400px" }}
                />
                <h4>¿TE INTERESA ALGO?</h4>
                <p className="text-primary">SÉ UNO DE NUESTROS CLIENTES</p>
              </div>
            </Col>
<Col md={5} id="registro">
  <FormRegistro />
</Col>
          </Row>
        </div>

        {/* Footer Section */}
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
