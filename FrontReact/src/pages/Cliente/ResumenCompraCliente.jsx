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


const ResumenCompraCliente = () => {
  const [resumen, setResumen] = useState(null);
  const [nombreClienteDesdeToken, setNombreClienteDesdeToken] = useState("");

  useEffect(() => {
    // Obtener nombre desde el token JWT
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        setNombreClienteDesdeToken(payload?.nombre || payload?.name || "Cliente");
        console.log("Nombre desde tokennnnn:", payload?.nombre || payload?.name || "Cliente");
      } catch (error) {
        console.error("❌ Error al decodificar el token:", error);
      }
    }

    // Obtener resumen de compra
    const data = localStorage.getItem("resumenCompra");
    if (!data) {
      const tempData = sessionStorage.getItem("tempResumenCompra");
      if (tempData) {
        setResumen(JSON.parse(tempData));
        setTimeout(() => {
          window.history.replaceState(null, null, "/cliente/home");
          window.location.href = "/cliente/home";
        }, 5000);
      } else {
        console.error("No se encontraron datos de compra");
        window.location.href = "/cliente/home";
      }
    } else {
      setResumen(JSON.parse(data));
    }

    return () => {
      sessionStorage.removeItem("tempResumenCompra");
    };
  }, []);

  if (!resumen) return <p>No hay información disponible.</p>;

  const {
    cliente,
    coche,
    servicios = [],
    totalAuto = 0,
    totalServicios = 0,
    totalFinal = 0,
  } = resumen;

  const nombreCompletoCliente = (() => {
    const nombre =
      cliente?.name || cliente?.nombre || nombreClienteDesdeToken || "";
    const apellido = cliente?.lastname || cliente?.apellido || "";
    return `${nombre} ${apellido}`.trim();
  })();
  console.log("👤 Cliente desde resumen:", cliente);
console.log("🪪 Nombre desde token:", nombreClienteDesdeToken);

  
  const handleGeneratePDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(16).setFont(undefined, "bold").text("Factura de Venta de Automóvil", 70, 20);

      const fechaEmision = new Date().toLocaleDateString("es-MX");
      doc.setFontSize(12);
      doc.setFont(undefined, "bold").text("Fecha de emisión: ", 14, 30);
      doc.setFont(undefined, "normal").text(fechaEmision, 50, 30);

      doc.setFont(undefined, "bold").text("Folio de compra:", 14, 38);
      doc.setFont(undefined, "normal").text("000000", 50, 38);

      doc.setFont(undefined, "bold").text("Comprador:", 14, 46);
      doc.setFont(undefined, "normal").text(nombreCompletoCliente, 50, 46);

      doc.setFont(undefined, "bold").text("Marca:", 14, 58);
      doc.setFont(undefined, "normal").text(coche?.marca?.nombre || "Marca no disponible", 40, 58);

      doc.setFont(undefined, "bold").text("Modelo:", 14, 66);
      doc.setFont(undefined, "normal").text(`${coche?.modelo || ""} ${coche?.year || ""}`, 40, 66);

      doc.setFont(undefined, "bold").text("Placa:", 14, 74);
      doc.setFont(undefined, "normal").text(coche?.matricula || "Placa no disponible", 40, 74);

      autoTable(doc, {
        head: [["Concepto", "Precio"]],
        body: [
          ["Automóvil", `$${Number(totalAuto).toLocaleString()}`],
          ["Servicios", `$${Number(totalServicios).toLocaleString()}`],
        ],
        startY: 88,
        styles: { halign: "center" },
        headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: "bold" },
        margin: { left: 14, right: 14 },
      });

      const afterTableY = doc.lastAutoTable.finalY;

      doc.setFont(undefined, "bold").setFontSize(13);
      doc.text(`Total a pagar: $${Number(totalFinal).toLocaleString()}`, 135, afterTableY + 10);

      doc.setFontSize(10).setTextColor(255, 0, 0);
      doc.setFont(undefined, "normal").text(
        "Gracias por su compra. Diríjase a una de nuestras sucursales para que un agente pueda procesar su compra.",
        14,
        afterTableY + 20
      );

      doc.setTextColor(0, 0, 0).setFont(undefined, "bold").setFontSize(14);
      doc.text("S E G A", 95, afterTableY + 40, { align: "center" });

      doc.save("Factura_Compra_Cliente.pdf");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Ocurrió un error al generar el PDF. Por favor, intenta nuevamente.");
    }
  };
  console.log("objeto recibido apra los detalles: ",resumen)
  return (
    <Container>
      <Title>Detalles de la compra</Title>

      <ContentRow>
        <Column>
          <VehicleImage src={coche?.imagen || "default_image_url.jpg"} alt={coche?.modelo} />
        </Column>

        <Column>
          <SectionTitle>Información del vehículo</SectionTitle>
          <Line />
          <InfoItem><Bold>Marca:</Bold> {coche?.marca?.nombre}</InfoItem>
          <InfoItem><Bold>Modelo:</Bold> {coche?.modelo}</InfoItem>
          <InfoItem><Bold>Año:</Bold> {coche?.year}</InfoItem>
          <InfoItem><Bold>Cliente:</Bold> {nombreCompletoCliente}</InfoItem>
        </Column>

        <Column>
          <SectionTitle>Servicios contratados</SectionTitle>
          <Line />
          {servicios.length > 0 ? (
            servicios.map((serv, idx) => (
              <Chip key={idx}>
                {serv.name} <span>${serv.price}</span>
                <span>{serv.modalidad?.nombre || ""}</span>
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
        <PriceRow><Bold>Subtotal:</Bold> ${Number(totalAuto).toLocaleString()}</PriceRow>
        <PriceRow><Bold>+ Servicios:</Bold> ${Number(totalServicios).toLocaleString()}</PriceRow>
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

export default ResumenCompraCliente;