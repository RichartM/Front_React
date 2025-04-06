import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BrandsContext } from '../../context/BrandsContext';
import CarCardCliente from '../Cliente/CardCardCliente';
import CarCardAgente from '../AgenteVenta/CarCardAgente';
import VehiculoService from "../../services/AgenteService/VehiculoService";

import NavAgenteVenta from '../AgenteVenta/NavAgenteVenta';
import NavCliente from '../Cliente/NavCliente';

const PageContainer = styled.div`
  padding: 50px;
  margin-top: -10%;
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
  const isAgente = location.pathname.includes("/agente");
  const [noHay,setNoHay] = useState(false)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log("📌 Obteniendo vehículos para marca ID:", brandId);
        const data = await VehiculoService.getVehiclesByBrandId(brandId);
        console.log("📌 Vehículos obtenidos:", data);
  
        // Eliminar duplicados por ID
        setCars([...new Map(data.map(car => [car.id, car])).values()]);
      } catch (error) {
        console.error('❌ Error al obtener vehículos:', error);
      }
    };
  
    if (brandId) {
      fetchCars();
    }
  }, [brandId]);

  const brand = brands?.find((b) => b.id.toString() === brandId);
  
  if (!brands || brands.length === 0) {
    return <p>Cargando marcas...</p>;
  }

  if (!brand) {
    return <p>Marca no encontrada en Carros por marca</p>;
  }

  return (
    <PageContainer>
      <HeaderContainer>
        {isAgente ? <NavAgenteVenta /> : <NavCliente />}
        
        <TitleContainer style={{ marginTop: -100 }}>
          <BrandTitle>Descubre los {brand.nombre}</BrandTitle>
          <BrandDescription>{brand.descripcion}</BrandDescription>
        </TitleContainer>
      </HeaderContainer>

      <GridContainer >
        {cars.length > 0 ? (
          cars.map((car) => (
            (isAgente) ? 
              (
                car.estado.id ===1 ?(
                  <CarCardAgente key={car.id} car={car} brandId={brandId} />
                ):console.log()
            ) :
            (
              car.estado.id ===1 ?(
                <CarCardCliente key={car.id} car={car} brandId={brandId}/>
              ):console.log()
            )
          ))
        ) : (
          <h1>No hay vehículos disponibles para esta marca.</h1>
        )}
      </GridContainer>
      {noHay?( <center><h1>No hay vehículos disponibles para esta marca.</h1></center>):( <center><h1></h1></center>)}

    </PageContainer>
  );
};

export default CarrosPorMarca;