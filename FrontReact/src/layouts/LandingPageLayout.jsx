import React, { useEffect, useState } from "react";
import NavLandingPage from "../pages/LandingPage/NavLandingPage";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const LandingPageContainer = styled.div`
  margin-top: 60px; /* Compensa el navbar fijo */
  padding: 20px;
  text-align: center;
`;

const LandingPageLayout = () => {
  // Ejemplo de efecto para detectar scroll (opcional)
  const [isArrowVisible, setIsArrowVisible] = useState(true);

  useEffect(() => {
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
      <NavLandingPage />
      <LandingPageContainer>
        {/* Aquí se renderizará el contenido de la landing a través del Outlet */}
        <Outlet />
      </LandingPageContainer>
    </>
  );
};

export default LandingPageLayout;
