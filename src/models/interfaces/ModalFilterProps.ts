interface ModalFilterProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: {
    category: number | undefined | false;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    roomCounts: { habitaciones: number; banos: number; camas: number };
    services: number[];
  }) => void;
}

export default ModalFilterProps;