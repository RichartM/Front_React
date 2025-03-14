import React, { useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { BrandsContext } from "../../context/BrandsContext";
import CarCard from "./CarCard"; 
import CarCardAgente from "../AgenteVenta/CarCardAgente"; // ✅ Importamos la versión para agentes

const PageContainer = styled.div`
  padding: 50px;
  text-align: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const BrandImage = styled.img`
  position: absolute;
  left: 50px; 
  width: 120px; 
  object-fit: contain;
`;

const TitleContainer = styled.div`
  text-align: center;
  flex: 1;
`;

const BrandTitle = styled.h1`
  font-size: 2.2rem;
  color: #018180;
  margin: 0;
`;

const BrandDescription = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-top: 10px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const CarrosPorMarca = () => {
  const { brandId } = useParams();
  const { brands } = useContext(BrandsContext);
  const location = useLocation();
  const isAgente = location.pathname.includes("/agente"); // 🔹 Detectamos si es agente

  const brand = brands.find((b) => b.id === brandId);
  if (!brand) return <p>Marca no encontrada</p>;

  return (
    <PageContainer>
      <HeaderContainer>
        <BrandImage src={brand.logo} alt={brand.name} />
        <TitleContainer>
          <BrandTitle>{brand.name}</BrandTitle>
          <BrandDescription>{brand.descripcion}</BrandDescription>
        </TitleContainer>
      </HeaderContainer>

      <GridContainer>
        {brand.cars.map((car) => (
          isAgente ? 
            <CarCardAgente key={car.id} car={car} brandId={brandId} /> :
            <CarCard key={car.id} car={car} brandId={brandId} />
        ))}
      </GridContainer>
    </PageContainer>
  );
};

export default CarrosPorMarca;
  