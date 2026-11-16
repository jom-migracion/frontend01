import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  // Button,
  Divider,
  useTheme,
} from '@mui/material';
import { differenceInDays, parseISO } from 'date-fns';

interface SearchFormStorage {
  CityName: string;
  typeDesc: string;
  CityId: number;
  CheckInDate: string;
  CheckOutDate: string;
  Guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  pageNumber: number;
  pageSize: number;
}

const ReviewCard: React.FC<{
  enabledDaysCount: number;
  pricePerNight: number;
  discountedPrice: number | undefined;
  // onPay: () => void;
  isExpanded: boolean;
  onToggle: any;
}> = ({enabledDaysCount, pricePerNight, discountedPrice, /*onPay,*/ isExpanded = false, onToggle }) => {
  const theme = useTheme();

  const getNumberOfNights = (): number => {
    try {
      const searchFormData = localStorage.getItem('search-form-storage');
      if (!searchFormData) {
        return 7; 
      }
      const parsedData: SearchFormStorage = JSON.parse(searchFormData);
      const checkInDate = parseISO(parsedData.CheckInDate);
      const checkOutDate = parseISO(parsedData.CheckOutDate);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return 7; 
      }

      const nights = differenceInDays(checkOutDate, checkInDate);
      return nights > 0 ? nights : 7; 
    } catch (error) {
      console.error('Error parsing search-form-storage:', error);
      return 7; 
    }
  };

  // const handlePay = () => {
  //   if (onPay) {
  //     onPay();
  //   }
  // };

  const nights = enabledDaysCount //getNumberOfNights();
  const subtotal: number = pricePerNight * nights;
  const discount = discountedPrice ? subtotal * (discountedPrice / 100) : subtotal * 0.1;
  const cleaningFee = 100;
  const serviceFee = 20;
  const total = subtotal - discount + cleaningFee + serviceFee;

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onToggle}
      sx={{
        maxWidth: 600,
        mb: 2,
        '&:before': {
          display: 'none',
        },
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '12px !important',
        fontFamily: theme.typography.paragraph1SRegular,
      }}
    >
      <AccordionSummary
        sx={{
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
          },
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          3. Revisa tu solicitud
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">
              {pricePerNight} BOB x {nights} noches
            </Typography>
            <Typography variant="body1">{subtotal} BOB</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">
              {discountedPrice ? `${discountedPrice}% Descuento` : '10% Descuento'}
            </Typography>
            <Typography variant="body1">{discount} BOB</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">Limpieza</Typography>
            <Typography variant="body1">{cleaningFee} BOB</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">Tarifa Assert</Typography>
            <Typography variant="body1">{serviceFee} BOB</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {total} BOB
            </Typography>
          </Box>

          {/* <Button
            onClick={handlePay}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              },
              borderRadius: 2,
              py: 1.5,
              fontSize: '1rem',
            }}
          >
            Pagar
          </Button> */}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ReviewCard;