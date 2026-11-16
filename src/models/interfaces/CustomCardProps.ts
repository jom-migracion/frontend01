import { CardProps } from "@mui/material";

interface CustomCardProps extends CardProps {
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
  location?: string;
  country?: string;
  title?: string;
  price: string;
  rating?: number | undefined;
  sx?: object;
  labelNew?: {
    see: boolean;
    label?: string;
  };
  available?: string;
  refDetail: string;
  onToggleFavorite?: (card: {
    id: string;
    title: string;
    image?: string;
  }) => void;
  isFavorite?: boolean;
  setIsFavorite?: (isFav: boolean) => void;
  goDetailOnclick?: boolean;
}

export default CustomCardProps;
