import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  border: 2px solid #0181ff;
  border-radius: 25px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
`;

const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
`;

const VehicleImage = styled.img`
  width: 280px;
  height: auto;
  border-radius: 10px;
`;

const Column = styled.div`
  flex: 1;
  min-width: 280px;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Line = styled.hr`
  border: none;
  height: 4px;
  background-color: #018180;
  width: 100%;
  margin-bottom: 15px;
`;

const InfoItem = styled.p`
  font-size: 1rem;
  margin: 6px 0;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #d9d9d9;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 1rem;
  font-weight: 500;
  gap: 10px;
  margin-bottom: 8px;
`;

const PricesSection = styled.div`
  margin-top: 40px;
`;

const PriceRow = styled.p`
  font-size: 1.1rem;
  margin: 8px 0;
`;

const Bold = styled.span`
  font-weight: bold;
`;

const DownloadRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const DownloadButton = styled.button`
  background-color: #018180;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #026c6c;
  }
`;

const FooterNote = styled.p`
  margin-top: 10px;
  font-size: 0.75rem;
  color: #00a3a0;
  text-align: center;
  margin-top: 30px;
`;

const ResumenCompraScreen = () => {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("resumenCompra");
    if (data) {
      setResumen(JSON.parse(data));
    }
  }, []);

  if (!resumen) return <p>No hay información disponible.</p>;

  const {
    cliente,
    coche,
    servicios,
    totalAuto,
    totalServicios,
    totalFinal,
    agente
  } = resumen;

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("Factura de Venta de Automóvil", 70, 20);

    const fechaEmision = new Date().toLocaleDateString("es-MX");
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Fecha de emisión: ", 14, 30);
    doc.setFont(undefined, "normal");
    doc.text(fechaEmision, 50, 30);

    doc.setFont(undefined, "bold");
    doc.text("Folio de compra:", 14, 38);
    doc.setFont(undefined, "normal");
    doc.text("000000", 50, 38);

    doc.setFont(undefined, "bold");
    doc.text("Vendedor:", 14, 46);
    doc.setFont(undefined, "normal");
    doc.text(agente.name + " " + agente.lastname, 50, 46);

    doc.setFont(undefined, "bold");
    doc.text("Comprador:", 14, 54);
    doc.setFont(undefined, "normal");
    doc.text(cliente?.name + " " + cliente?.lastname || "Cliente", 50, 54);

    doc.setFont(undefined, "bold");
    doc.text("Marca:", 14, 66);
    doc.setFont(undefined, "normal");
    doc.text(coche.marca.nombre, 40, 66);

    doc.setFont(undefined, "bold");
    doc.text("Modelo:", 14, 74);
    doc.setFont(undefined, "normal");
    doc.text(`${coche.modelo} ${coche.year}`, 40, 74);

    doc.setFont(undefined, "bold");
    doc.text("Placa:", 14, 82);
    doc.setFont(undefined, "normal");
    doc.text(coche.matricula || "AX33400X", 40, 82);

    autoTable(doc, {
      head: [["Concepto", "Precio"]],
      body: [
        ["Automóvil", `$${totalAuto.toLocaleString()}`],
        ["Servicios", `$${servicios.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0).toLocaleString()}`]
      ],
      startY: 95,
      styles: { halign: "center" },
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold' },
      margin: { left: 14, right: 14 },
    });

    const afterTableY = doc.lastAutoTable.finalY;

    doc.setFont(undefined, "bold");
    doc.setFontSize(13);
    doc.text(`Total a pagar: $${totalFinal.toLocaleString()}`, 135, afterTableY + 10);

    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text(
      "Gracias por su compra. Diríjase a una de nuestras sucursales para que un agente pueda procesar su compra.",
      14,
      afterTableY + 20
    );

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.setFontSize(14);
    doc.text("S E G A", 95, afterTableY + 40, { align: "center" });

    doc.save("Factura_Compra.pdf");
  };

  return (
    <Container>
      <Title>Detalles de la compra </Title>

      <ContentRow>
        <Column>
          <VehicleImage
            src={coche.imagen || "default_image_url.jpg"}
            alt={coche.modelo}
          />
        </Column>

        <Column>
          <SectionTitle>Información del vehículo</SectionTitle>
          <Line />
          <InfoItem><Bold>Marca:</Bold> {coche.marca.nombre}</InfoItem>
          <InfoItem><Bold>Modelo:</Bold> {coche.modelo}</InfoItem>
          <InfoItem><Bold>Año:</Bold> {coche.year}</InfoItem>
          <InfoItem><Bold>Cliente:</Bold> {cliente?.name}</InfoItem>
        </Column>

        <Column>
          <SectionTitle>Servicios contratados</SectionTitle>
          <Line />
          {servicios.length > 0 ? (
            servicios.map((serv, idx) => (
              <Chip key={idx}>
                {serv.name} <span>${serv.price}</span>
                <span>{serv.modalidad.nombre}</span>
              </Chip>
            ))
          ) : (
            <p>No se contrataron servicios.</p>
          )}
        </Column>
      </ContentRow>

      <PricesSection>
        <SectionTitle>Precios</SectionTitle>
        <Line />
        <PriceRow><Bold>Subtotal:</Bold> ${totalAuto.toLocaleString()}</PriceRow>
        <PriceRow><Bold>+ Servicios:</Bold> ${parseInt(totalServicios,10).toLocaleString()}</PriceRow>
        <PriceRow><Bold>Total:</Bold> ${(
    parseInt(totalAuto, 10) + parseInt(totalServicios, 10)
  ).toLocaleString()}</PriceRow>
      </PricesSection>

      <DownloadRow>
        <DownloadButton onClick={handleGeneratePDF}>Descargar Factura</DownloadButton>
      </DownloadRow>

      <FooterNote>
        La factura solo es descargable en este momento, no podrás descargarla desde tu historial de compras. Puedes solicitarla después en la agencia.
      </FooterNote>
    </Container>
  );
};

export default ResumenCompraScreen;
