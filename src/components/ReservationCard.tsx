import React from 'react';
import { Box, Typography, Card, CardContent, Button, Avatar } from '@mui/material';
import { VscCalendar } from "react-icons/vsc";
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import { PiBagThin } from "react-icons/pi";

import theme from '@/themes/theme';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import { AssertRoutes } from '@/common/enum/AssertRoutes';

interface ReservationCardProps {
  listingRentId: string | undefined;
  pricePerNight: number | undefined;
  discountedPrice: number | undefined;
  rating: number;
  reviews: number;
  checkIn: string;
  checkOut: string;
  travelers: number;
  nights: number;
  discount: number;
  cleaningFee: number;
  total: number;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  listingRentId,
  pricePerNight,
  discountedPrice,
  rating,
  reviews,
  checkIn,
  checkOut,
  travelers,
  nights,
  discount,
  cleaningFee,
  total,
}) => {
  const handleRouteLink = useHandleRouteLink();

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        position: 'sticky',
        top: 70,
        // maxWidth: 360,
        width: '100%',
      }}
    >
      <CardContent sx={{ margin: 2 }} >
        {/* Precio y calificación */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {pricePerNight} BOB{' '}
              <Typography component="span" variant="body2" color="text.secondary">
                {discountedPrice} BOB/noche
              </Typography>
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <StarIcon sx={{ color: 'primary', fontSize: '1.5em' }} />
              <Typography variant="body2" color="text.secondary" ml={1}>
                {rating} ({reviews} reviews)
              </Typography>
            </Box>
          </Box>
          <Box>
            <Avatar sx={{ width: 40, height: 40, alignSelf: 'baseline' }} />
          </Box>
        </Box>

        {/* Fechas y viajeros */}
        <Box
          sx={{
            backgroundColor: theme.palette.lights.light,
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={1} ml={1} mr={1}>
            <Box>
              <Box display="flex" alignItems="center">
                <VscCalendar fontSize="small" color="action" style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}} />
                <Typography variant="body1" fontSize={'1.1em'}>Check in</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="text.secondary" fontSize={'0.78em'} ml={3.5}>
                  {checkIn}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box display="flex" alignItems="center">
                <VscCalendar fontSize="small" color="action" style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}} />
                <Typography variant="body1" fontSize={'1.1em'}>Check out</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="text.secondary" fontSize={'0.78em'} ml={3.5}>{checkOut}</Typography>
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1} ml={1} mr={1} mt={2}>
            <Box>
              <Box display="flex" alignItems="center">
                <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body1" fontSize={'1.1em'}>Travelers</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="text.secondary" fontSize={'0.78em'} ml={3.5}>
                  {travelers} adultos
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Desglose de costos */}
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color={theme.palette.secondary.main}>
              {discountedPrice} BOB x {nights} noches
            </Typography>
            <Typography variant="body2">{discountedPrice == undefined ? 0 : discountedPrice * nights} BOB</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color={theme.palette.secondary.main}>10% Descuento</Typography>
            <Typography variant="body2">{discount} BOB</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color={theme.palette.secondary.main}>Limpieza</Typography>
            <Typography variant="body2">{cleaningFee} BOB</Typography>
          </Box>
        </Box>
        {/* Total */}
        <Box
          display="flex"
          justifyContent="space-between"
          //   mb={2}
          sx={{
            backgroundColor: theme.palette.lights.light,
            borderRadius: 2,
            p: 1,
            mb: 1,
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            TOTAL
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {total} BOB
          </Typography>
        </Box>

        {/* Botón de reserva */}
        <Box display="flex" justifyContent="center">
          <Button
            onClick={() => {              
              handleRouteLink(`${AssertRoutes.BOOK}/${listingRentId}`)
            }}
            variant="contained"
            //   fullWidth
            endIcon={<PiBagThin  />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.secondary.main },
              borderRadius: 3.8,
              textTransform: 'none',
              maxWidth: 250,
              width: 250,
            }}
          >
            Reserva
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
