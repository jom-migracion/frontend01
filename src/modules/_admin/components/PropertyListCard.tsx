import React from 'react';
import { Box, Card, CardActionArea, CardContent, Typography, CardMedia } from '@mui/material';
import { IoIosStar } from 'react-icons/io';
import { casa } from '@/assets';
import Listing from '@/models/interfaces/Listing';

const getState = (listing: Listing) =>
  listing.property?.address?.city?.state ?? 'Sin dirección';

const getCountry = (listing: Listing) =>
  listing.property?.address?.city?.country ?? '';

const getPrice = (listing: Listing) =>
  listing.price?.priceNightly ? `${listing.price.priceNightly} BOB/noche` : '---';

const getStatusColor = (status: string) => {
  if (status.toLowerCase() === 'disponible') return '#76C811';
  return '#161716';
};

const PropertyListCard: React.FC<{
  card: Listing;
  onDoubleClick: () => void;
}> = ({ card, onDoubleClick }) => {
  const title = getState(card);
  const description = getCountry(card);
  const cost = getPrice(card);
  const bgColor = getStatusColor(card.status ?? 'reservado');
  const sub = card.status ?? 'Reservado';

  return (
    <Card>
      <CardActionArea onDoubleClick={onDoubleClick} sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%', boxShadow: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '8px',
              height: '45px',
              marginBottom: '10px',
            }}
          >
            <Box sx={{ gridColumn: 'span 3 / span 3' }}>
              <Card sx={{ display: 'flex', height: '55px', boxShadow: 'none' }}>
                <Card sx={{ width: '72.71px', borderRadius: '6.16px' }}>
                  <CardMedia
                    component="img"
                    height="auto"
                    image={card.photos?.[0]?.photoLink ?? casa}
                    alt="Imagen propiedad"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Card>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto', padding: '1px 0 0 10px' }}>
                    <Typography component="div" sx={{ fontSize: '8.63px' }}>
                      {title}
                    </Typography>
                    <Typography component="div" sx={{ fontSize: '8.63px', fontWeight: 600 }}>
                      {description}
                    </Typography>
                    <Typography component="div" sx={{ fontSize: '8.63px', fontWeight: 600 }}>
                      {cost}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Box>

            <Box sx={{ gridColumnStart: 4, alignContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IoIosStar color="black" style={{ width: '10%', height: '10%' }} />
                <Box sx={{ ml: 0.5, fontWeight: 300 }}>{card.valoration ?? '4.4'}</Box>
              </Box>
            </Box>

            <Box sx={{ gridColumnStart: 5, alignContent: 'center' }}>
              <Box
                sx={{
                  fontSize: '9.3px',
                  fontWeight: 600,
                  width: '61.95px',
                  borderRadius: '11.29px',
                  padding: '3.32px 5.98px',
                  backgroundColor: bgColor,
                  color: 'white',
                  display: 'inline-block',
                  textAlign: 'center',
                }}
              >
                {sub}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PropertyListCard;
