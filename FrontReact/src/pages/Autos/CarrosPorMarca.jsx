import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BrandsContext } from '../../context/BrandsContext';
import CarCard from './CarCard';
import CarCardAgente from '../AgenteVenta/CarCardAgente';
import VehiculoService from '../../services/AgenteService/VehiculoService';
import NavAgenteVenta from '../AgenteVenta/NavAgenteVenta';
import { Margin } from '@mui/icons-material';

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
  const [cars, setCars] = useState([]);
  const location = useLocation();
  const isAgente = location.pathname.includes("/agente"); // Detectamos si es agente

  // ✅ Buscar la marca en el contexto por ID
  const brand = brands.find((b) => b.id.toString() === brandId);
  if (!brand) return <p>Marca no encontrada</p>;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log("📌 Llamando a la API para obtener vehículos de marca ID:", brandId);
        const data = await VehiculoService.getVehiclesByBrandId(brandId);
        console.log("📌 Vehículos obtenidos:", data);
  
        // ✅ Asegurar que los datos no se dupliquen reemplazando completamente el estado
        setCars([...new Map(data.map(car => [car.id, car])).values()]);
  
      } catch (error) {
        console.error('❌ Error al obtener vehículos:', error);
      }
    };
  
    fetchCars();
  }, [brandId]);
  
  return (
    <PageContainer>

    <HeaderContainer>
    <NavAgenteVenta />

  <BrandImage src={brand.logo}  />
  <TitleContainer style={{marginTop:50}}>
    <BrandTitle>Descubre los {brand.nombre}</BrandTitle>
    <BrandDescription>{brand.descripcion}</BrandDescription>
  </TitleContainer>
</HeaderContainer>
      <GridContainer>
        {cars.length > 0 ? (
          cars.map((car) => (
            isAgente ? 
              <CarCardAgente key={car.id} car={car} brandId={brandId} /> :
              <CarCard key={car.id} car={car} brandId={brandId} />
          ))
        ) : (
          <p>No hay vehículos disponibles para esta marca.</p>
        )}
      </GridContainer>
    </PageContainer>
  );
};

export default CarrosPorMarca;
