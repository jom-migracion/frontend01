import { userPriceInformationStore } from '@/store/priceInformation.store';
import { Box, Divider, Typography, useTheme } from '@mui/material';

const PriceInformationCard = () => {
  const theme = useTheme();
  const { nightlyRate, nights, cleaningFee, discount, serviceFee, subtotal, total } =
    userPriceInformationStore((state) => state.dataInformation);

  return (
    <>
      <Box sx={{ fontFamily: theme.typography.paragraph1SRegular }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: theme.typography.paragraph1SRegular }}>
            {nightlyRate} BOB x {nights} noches
          </Typography>
          <Typography variant="body2">{subtotal} BOB</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">10% Descuento</Typography>
          <Typography variant="body2">{discount} BOB</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Limpieza</Typography>
          <Typography variant="body2">{cleaningFee} BOB</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2">Tarifa Assert</Typography>
          <Typography variant="body2">{serviceFee} BOB</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {total} BOB
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default PriceInformationCard;
