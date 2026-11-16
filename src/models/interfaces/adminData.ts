// src/data/adminData.ts

export interface Department {
  id: number;
  name: string;
  image: string;
  description: string;
  basePrice: number;
  rentals: { date: string; amount: number }[];
}

export interface CardData {
  id: number;
  title: string;
  description: string;
  imageUrl: string[];
  location: string;
  details: string;
  available: string;
  price: string;
  rating: string;
}

export const departments: Department[] = [
  {
    id: 1,
    name: "Santa Cruz Bolivia",
    image: "https://plus.unsplash.com/premium_photo-1683140700115-bfef0432280d",
    description: "Moambiente - Nomad Smart",
    basePrice: 200,
    rentals: [
      { date: '2025-05-05', amount: 300 },
      { date: '2025-05-06', amount: 320 },
    ],
  },
  {
    id: 2,
    name: "Cochabamba Bolivia",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a12",
    description: "Departamento entero - Nomad Smart",
    basePrice: 300,
    rentals: [
      { date: '2025-05-07', amount: 350 },
      { date: '2025-05-08', amount: 370 },
    ],
  },
  {
    id: 3,
    name: "La Paz Bolivia",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    description: "Estudio - Nomad Smart",
    basePrice: 250,
    rentals: [
      { date: '2025-05-09', amount: 280 },
      { date: '2025-05-10', amount: 300 },
    ],
  },
];

export const cardsData: CardData[] = [
  {
    id: 1,
    title: 'Santa Cruz Bolivia',
    description: 'Descripción breve',
    imageUrl: ['https://plus.unsplash.com/premium_photo-1683140700115-bfef0432280d'],
    location: "Monoambiente - Nomad Smart",
    details: 'Esta es la descripción detallada.',
    available: "Disponible",
    price: "200 BOB/noches",
    rating: "4.4",
  },
  {
    id: 2,
    title: 'Cochabamba Bolivia',
    description: 'Descripción breve',
    imageUrl: ['https://images.unsplash.com/photo-1586105251261-72a756497a12'],
    location: "Departamento entero - Nomad Smart",
    details: 'Esta es la descripción detallada.',
    available: "Disponible",
    price: "300 BOB/noches",
    rating: "4.6",
  },
  {
    id: 3,
    title: 'La Paz Bolivia',
    description: 'Descripción breve',
    imageUrl: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
    location: "Estudio - Nomad Smart",
    details: 'Esta es la descripción detallada.',
    available: "Disponible",
    price: "250 BOB/noches",
    rating: "4.5",
  },
];
