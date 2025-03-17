import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
`;

const Title = styled.h2`
  color: #018180;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  margin: 5px 0;
`;

const Total = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  color: #026c6c;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #018180, #026c6c);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const ResumenCompra = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cliente, coche, fecha, servicios, totalAuto, totalServicios, totalFinal } = location.state || {};

  if (!cliente || !coche) {
    return <Container><p>No hay datos disponibles. Regresa a la compra.</p></Container>;
  }

  return (
    <Container>
      <Title>Resumen de Compra</Title>
      <Section>
        <h3>Datos del Cliente</h3>
        <InfoText><strong>Nombre:</strong> {cliente.name}</InfoText>
        <InfoText><strong>Email:</strong> {cliente.email}</InfoText>
      </Section>

      <Section>
        <h3>Detalles del Vehículo</h3>
        <InfoText><strong>Modelo:</strong> {coche.modelo}</InfoText>
        <InfoText><strong>Año:</strong> {coche.year}</InfoText>
        <InfoText><strong>Precio:</strong> ${totalAuto.toLocaleString()} MXN</InfoText>
      </Section>

      <Section>
        <h3>Servicios Contratados</h3>
        {servicios.length > 0 ? (
          servicios.map((servicio, index) => (
            <InfoText key={index}>{servicio.name} - ${servicio.price.toLocaleString()} MXN</InfoText>
          ))
        ) : (
          <InfoText>No se seleccionaron servicios.</InfoText>
        )}
        <Total>Total en Servicios: ${totalServicios.toLocaleString()} MXN</Total>
      </Section>

      <Total>Total a Pagar: ${totalFinal.toLocaleString()} MXN</Total>

      <Button onClick={() => navigate("/")}>Finalizar Compra</Button>
    </Container>
  );
};

export default ResumenCompra;
