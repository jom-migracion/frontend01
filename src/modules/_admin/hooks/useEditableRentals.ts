// src/hooks/useEditableRentals.ts
import { useState, useMemo } from 'react';
import { Rental } from './useMockRentals';

export const useEditableRentals = () => {
  const initialData: Record<number, Rental[]> = useMemo(
    () => ({
      671: [
        { date: '2025-07-13', amount: 250, action: 'rent', guest: 'John Doe' },
        { date: '2025-07-14', amount: 275, action: 'rent', guest: 'Jane Doe' },
      ],
      672: [
        { date: '2025-07-14', amount: 0, action: 'blocked', guest: 'Alice Smith' },
        { date: '2025-07-16', amount: 0, action: 'blocked', guest: 'Bob Johnson' },
      ],
      // ... resto de los datos omitidos por brevedad
    }),
    []
  );

  const [rentals, setRentals] = useState<Record<number, Rental[]>>(initialData);

  const updateRentals = (listingRentId: number, updates: Rental[]) => {
    setRentals((prev) => ({
      ...prev,
      [listingRentId]: updates,
    }));
  };

  const addOrUpdateRentals = (listingRentId: number, newEntries: Rental[]) => {
    setRentals((prev) => {
      const existing = prev[listingRentId] || [];
      const filtered = existing.filter(
        (r) => !newEntries.find((n) => n.date === r.date)
      );
      return {
        ...prev,
        [listingRentId]: [...filtered, ...newEntries],
      };
    });
  };

  return {
    rentals,
    updateRentals,
    addOrUpdateRentals,
  };
};
