export interface Reservation {
  date: string; // formato YYYY-MM-DD
  amount: number;
}

export interface Property {
  id: string;
  name: string;
  image: string;
  reservations: Reservation[];
}

export const fetchProperties = async (): Promise<Property[]> => {
  // Simulación de propiedades con reservas
  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const reservations1: Reservation[] = Array.from({ length: 20 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return { date: formatDate(d), amount: 100 + i * 5 };
  });

  const reservations2: Reservation[] = Array.from({ length: 15 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return { date: formatDate(d), amount: 90 + i * 4 };
  });

  return [
    {
      id: "1",
      name: "Depto Santiago",
      image: "https://via.placeholder.com/40",
      reservations: reservations1,
    },
    {
      id: "2",
      name: "Casa Viña del Mar",
      image: "https://via.placeholder.com/40",
      reservations: reservations2,
    },
  ];
};