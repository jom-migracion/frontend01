import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from '@mui/material';

interface PaymentInfoCardProps {
  amount: number;
  currency?: string;
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({ amount, currency = 'USD' }) => {
  return (
    <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        {/* Título */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Información de pago
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Monto */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Monto de pago
          </Typography>
          <Typography variant="h5" fontWeight="medium">
            ${amount.toFixed(2)} {currency}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoCard;
