import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface ListingProps {
  title: string;
  price: number;
  image: string;
}

const ListingCard = ({ title, price, image }: ListingProps) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" height="180" image={image} alt={title} />
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography color="textSecondary">${price} por noche</Typography>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
