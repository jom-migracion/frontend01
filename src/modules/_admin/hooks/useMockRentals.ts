import { useMemo } from 'react';

export type Rental = {
  date: string; // formato 'yyyy-MM-dd'
  amount: number;
  action: string;
  guest: string; // nombre del huésped
};

export const useMockRentals = (): Record<number, Rental[]> => {
  return useMemo(() => {
    return {
      671: [
        { date: '2025-07-13', amount: 250 , action: 'rent' , guest: 'John Doe'},  
        { date: '2025-07-14', amount: 250 , action: 'rent' , guest: 'Jane Doe'},
      ],
      672: [
        { date: '2025-07-14', amount: 0 , action: 'blocked' , guest: 'Alice Smith'},
        { date: '2025-07-16', amount: 0 , action: 'blocked' , guest: 'Bob Johnson'},
      ],
      664: [
        { date: '2025-07-13', amount: 200 , action: 'rent' , guest: 'Alice Smith' },
        { date: '2025-07-17', amount: 210 , action: 'rent' , guest: 'Alice Smith'},
      ],
      669: [
        { date: '2025-07-12', amount: 260 , action: 'rent' , guest: 'Bob Johnson' },
        { date: '2025-07-13', amount: 260 , action: 'rent' , guest: 'Bob Johnson' },
        { date: '2025-07-14', amount: 260 , action: 'rent' , guest: 'Bob Johnson' },
        { date: '2025-07-15', amount: 260 , action: 'rent' , guest: 'Bob Johnson' },
      ],
      673: [
        { date: '2025-07-14', amount: 0 , action: 'blocked' , guest: 'Bob Johnson' },
        { date: '2025-07-15', amount: 0 , action: 'blocked' , guest: 'Bob Johnson' },
      ],
      674: [
        { date: '2025-09-13', amount: 310 , action: 'rent' , guest: 'Jane Doe' },
        { date: '2025-09-14', amount: 310 , action: 'rent' , guest: 'Jane Doe' },
      ],
      801: [
        { date: '2025-07-10', amount: 240 , action: 'rent' , guest: 'Ever' },
        { date: '2025-07-11', amount: 240 , action: 'rent' , guest: 'Ever' },
      ],
      802: [
        { date: '2025-07-16', amount: 260 , action: 'rent' , guest: 'Osmar' },
        { date: '2025-07-17', amount: 260 , action: 'rent' , guest: 'Osmar' },
      ],
      803: [
        { date: '2025-07-14', amount: 260 , action: 'rent' , guest: 'Carla' },
        { date: '2025-07-15', amount: 260 , action: 'rent' , guest: 'Carla'},
      ],
      804: [
        { date: '2025-07-23', amount: 225 , action: 'rent' , guest: 'Magda' },
        { date: '2025-07-24', amount: 225 , action: 'rent' , guest: 'Magda'},
      ],
      805: [
        { date: '2025-07-28', amount: 290 , action: 'rent' , guest: 'Fernanda'},
      ],
      806: [
        { date: '2025-07-19', amount: 210 , action: 'rent' , guest: 'Alison'},
      ],
      807: [
        { date: '2025-07-13', amount: 215 , action: 'rent' , guest: 'Bob Johnson'},
        { date: '2025-07-17', amount: 218 , action: 'rent' , guest: 'Bob Johnson'},
      ],
      808: [
        { date: '2025-05-15', amount: 265 , action: 'rent' , guest: 'Bob Johnson'},
        { date: '2025-05-16', amount: 270 , action: 'rent' , guest: 'Bob Johnson'},
      ],
      809: [
        { date: '2025-06-12', amount: 280 , action: 'rent' , guest: 'Bob Johnson'},
      ],
      810: [
        { date: '2025-08-13', amount: 299 , action: 'rent' , guest: 'Carlitos'},
        { date: '2025-08-14', amount: 299 , action: 'rent' , guest: 'Carlitos'},
      ],
    };
  }, []);
};
//export default useMockRentals;