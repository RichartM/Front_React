import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CarruselMarcas from '../../components/common/CarruselMarcas';
import bgImage from '../../img/EsteBueno.avif';
import Ruben from '../../img/RUBEN.png';
import FormRegistro from '../Auth/FormRegistro';
import Footer from "../../components/common/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [isArrowVisible, setIsArrowVisible] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });

    // Función para detectar el desplazamiento
    const handleScroll = () => {
      if (window.scrollY > 50) { // Oculta la flecha después de desplazarse 100px
        setIsArrowVisible(false);
      } else {
        setIsArrowVisible(true);
      }
    };

    // Agrega el listener de desplazamiento
    window.addEventListener("scroll", handleScroll);

    // Limpia el listener al desmontar el componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  

  return (
    <>
      {/* Hero Section */}
      <div
        className="text-center"
        style={{
          position: "relative",
          height: "80vh",
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
            width: "80%",
            height: "100%",
            background: "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
            zIndex: 0,
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "20%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            color: "white",
          }}
        >
          <h1>¿BUSCAS UN AUTO?</h1>
          <p className="text-primary">REVISA NUESTRO CATÁLOGO Y BENEFÍCIATE CON NUESTROS SERVICIOS</p>
        </div>

        {/* Flecha animada */}
        <div
          className={`arrow-down ${isArrowVisible ? "" : "hidden"}`}
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: "smooth" })}
          style={{ bottom: "40px" }} /* Ajusta este valor para mover la flecha más arriba */
        ></div>
      </div>
      {/* Sección de marcas */}
      <div className="text-center p-5" style={{ backgroundColor: "#f8f9fa" }} data-aos="fade-up">
        <h3 className="mb-4" style={{ fontSize: "2rem" }}>¿Tienes una marca en mente?</h3>
        <p className="text-primary text-center" style={{ fontSize: "1.2rem", textAlign: "justify" }}>
          Descubre una amplia selección de marcas en un solo lugar. En nuestra agencia, trabajamos con diversas marcas
          reconocidas para ofrecerte productos de calidad, garantía y estilo. Encuentra lo que necesitas con la confianza de que cada marca que
          manejamos ha sido cuidadosamente seleccionada para brindarte lo mejor. ¡Explora nuestras opciones y elige la que más te guste!
        </p>
        <CarruselMarcas />
      </div>

      {/* Services Section */}
      <div className="text-center p-5" data-aos="fade-up">
        <h4 className="text-primary mb-4">SERVICIOS PARA TU AUTO</h4>
        <p className="mb-4">No solo basta con tener un auto, debes darle mantenimiento:</p>
        <ul className="text-start d-inline-block mb-4">
          <li>Aplicación única – Para quienes buscan un servicio puntual.</li>
          <li>Plan mensual – Ideal para quienes desean mantenimiento recurrente.</li>
          <li>Plan anual – La opción más conveniente.</li>
        </ul>
        <h6 className="text-primary mb-4">Explora nuestros servicios y elige la opción que mejor se adapte a ti. ¡Tu auto merece lo mejor!</h6>
      </div>

      {/* Contact Section */}
      <div className="text-center mt-5 mb-5" data-aos="fade-up">
      <Row className="justify-content-center">
  <Col md={5} className="d-flex align-items-center justify-content-center">
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
  <Col md={5} id="registro"> {/* Aquí agregamos el ID "registro" */}
    <FormRegistro />
  </Col>
</Row>



      </div>

      {/* Footer Section */}
      <Footer />
    </>
  );
};

export default Home;