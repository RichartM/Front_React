import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CardWrapper = styled.div`
  background: #fff;
  box-shadow: 0 2px 4px rgba(136,144,195,0.2),
              0 5px 15px rgba(37,44,97,0.15);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(37,44,97,0.3);
  }
`;

const CarImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const CarTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: #212121;
`;

const CarYear = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin: 5px 0 15px;
`;

const MoreButton = styled.button`
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #fff;
  background: #018180;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: block;
  margin: 0 auto;

  &:hover {
    background: #026c6c;
  }
`;

const CarCard = ({ car, brandId }) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    console.log(`Redirigiendo a /cliente/marca/${brandId}/coche/${car.id}`); 
    navigate(`/cliente/marca/${brandId}/coche/${car.id}`);  // ✅ Se corrige la URL
  };

  return (
    <CardWrapper>
      <CarImage src={car.image} alt={car.name} />
      <CardContent>
        <CarTitle>{car.name}</CarTitle>
        <CarYear>{car.year}</CarYear>
        <MoreButton onClick={handleViewMore}>Ver más</MoreButton>
      </CardContent>
    </CardWrapper>
  );
};

export default CarCard;
