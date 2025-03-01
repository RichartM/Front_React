import React, { createContext, useState } from "react";

// Datos simulados iniciales
const initialBrands = [
  {
    id: "chevrolet",
    name: "Chevrolet",
    descripcion: "Estos son los autos disponibles. ¿Te interesa alguno?",
    logo: "https://1000marcas.net/wp-content/uploads/2020/01/Chevrolet-logo.png",
    cars:  [
      { id: 1, image: "https://www.chevrolet.com.mx/content/dam/chevrolet/na/mx/es/index/cars/01-images/2025/2025-aveo-sedan-2000-1000.jpg?imwidth=960", name: "Chevrolet Spark", year: 2020 },
      { id: 2, image: "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_1a1944dc0bf848808dfe503014b177af.webp", name: "Chevrolet Onix", year: 2021 },
      { id: 3, image: "https://www.chevrolet.com.mx/content/dam/chevrolet/na/mx/es/index/cars/01-images/2023/2023-cavalier.jpg?imwidth=960", name: "Chevrolet Cruze", year: 2019 },
      { id: 4, image: "https://ppigmm.com.mx/media/cache/57/e5/57e5bae4a3fdfc0d4c0944dc71d1387b.jpg", name: "Chevrolet Malibu", year: 2022 },
      { id: 5, image: "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_0c2a30c41d0d40d29c20ac71c8c09b3d.jpg", name: "Chevrolet Camaro", year: 2021 },
      { id: 6, image: "https://www.chevrolet.com.pe/content/dam/chevrolet/south-america/peru/espanol/index/cars/2023-showroom/4-onix-hb.png?imwidth=960", name: "Chevrolet Corvette", year: 2023 },
      { id: 7, image: "https://www.chevrolet.com.mx/content/dam/chevrolet/na/mx/es/index/cars/01-images/2025/2025-aveo-sedan-2000-1000.jpg?imwidth=960", name: "Chevrolet Spark", year: 2020 },
      { id: 8, image: "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_1a1944dc0bf848808dfe503014b177af.webp", name: "Chevrolet Onix", year: 2021 },
      { id: 9, image: "https://www.chevrolet.com.mx/content/dam/chevrolet/na/mx/es/index/cars/01-images/2023/2023-cavalier.jpg?imwidth=960", name: "Chevrolet Cruze", year: 2019 },
      { id: 10, image: "https://ppigmm.com.mx/media/cache/57/e5/57e5bae4a3fdfc0d4c0944dc71d1387b.jpg", name: "Chevrolet Malibu", year: 2022 },
      { id: 11, image: "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_0c2a30c41d0d40d29c20ac71c8c09b3d.jpg", name: "Chevrolet Camaro", year: 2021 },
      { id: 12, image: "https://www.chevrolet.com.pe/content/dam/chevrolet/south-america/peru/espanol/index/cars/2023-showroom/4-onix-hb.png?imwidth=960", name: "Chevrolet Corvette", year: 2023 },
  ]
  },
  {
    id: "toyota",
    name: "Toyota",
    descripcion: "Estos son los autos disponibles. ¿Te interesa alguno?",
    logo: "https://cdn.worldvectorlogo.com/logos/toyota-7.svg",
    cars: [
      { id: 1, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfuUlmLBCMwV3WBf0p2MIyYX-PeHXvB1WYpA&s", name: "Toyota Corolla", year: 2021 },
      { id: 2, image: "https://images.carprices.com/pricebooks_data/usa/colorized/2022/Toyota/View2/Camry/XLE/2540_3T3.png", name: "Toyota Camry", year: 2022 },
      { id: 3, image: "https://www.toyota.mx/adobe/dynamicmedia/deliver/dm-aid--08b8a1dd-ef77-4ff8-a23a-9a7e939abd1e/yaris-sedan-base-mt-v3.png?quality=85&preferwebp=true", name: "Toyota Yaris", year: 2020 },
      { id: 4, image: "https://www.toyota.mx/content/dam/tmex/rav-4/RAV4Adventure_header.jpg", name: "Toyota RAV4", year: 2021 },
    ],
  },
  // Agrega más marcas según se requiera...
];

export const BrandsContext = createContext();

export const BrandsProvider = ({ children }) => {
  const [brands, setBrands] = useState(initialBrands);

  // Función para agregar una nueva marca  
  // (Más adelante reemplazas esto por una llamada a la API)
  const addBrand = (newBrand) => {
    setBrands((prev) => [...prev, newBrand]);
  };

  return (
    <BrandsContext.Provider value={{ brands, addBrand }}>
      {children}
    </BrandsContext.Provider>
  );
};
