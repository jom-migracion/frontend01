import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import ListingCard from '@/components/ListingCard';

const listings = [
  { id: 1, title: 'Moderno Departamento', price: 50, image: '/images/apartment1.jpg' },
  { id: 2, title: 'Casa con Piscina', price: 80, image: '/images/apartment2.jpg' },
  { id: 3, title: 'Cabaña Rústica', price: 45, image: '/images/apartment3.jpg' },
  { id: 4, title: 'Villa de Lujo', price: 150, image: '/images/apartment4.jpg' },
];

const FeaturedListings = () => {
  return (
    <Box mt={5} px={3}>
      <Typography variant="h4">Hospedajes Destacados</Typography>
      <Grid container spacing={3} mt={3}>
        {listings.map((listing) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={listing.id}>
            <ListingCard {...listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedListings;
