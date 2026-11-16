import { CardProps } from '@mui/material';

interface CustomCardAdminProps extends CardProps{
  images: string[];
  location: string;
  title: string;
  price: string;
  rating: string;
  sx?: object;

  available?: string;
  refDetail: string;
}

export default CustomCardAdminProps;