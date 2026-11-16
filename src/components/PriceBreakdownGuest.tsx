import React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
//import { GuestResume } from './types'; // ajusta la ruta según tu estructura
//import type { Accommodation, AdditionalCharges } from './types';

export interface GuestResume {
  accommodation: Accommodation;
  additionalCharges: AdditionalCharges;
  subtotal: number;
  guestCommission: number;
  guestCommissionPercent: number;
  total: number;
  currencyCode: string;
}

export interface HostResume {
  accommodation: Accommodation;
  additionalCharges: AdditionalCharges;
  subtotal: number;
  hostCommission: number;
  hostCommissionPercent: number;
  amountToCollect: number;
  currencyCode: string;
  penaltyApplied: number;
  originalAmountToCollect: number;
}

export interface Accommodation {
  ratePerNight: number;
  nightsCount: number;
  baseAmount: number;
  weekend_RatePerNight: number;
  weekend_NightsCount: number;
  weekend_BaseAmount: number;
  totalBaseAmount: number;
  appliedDiscount: number;
  discountedAmount: number;
}

export interface AdditionalCharges {
  extraGuestFee: number;
  petFee: number;
  cleaningFee: number;
  otherFees: number;
}

export interface PriceBreakdown {
  type: string;
  description: string;
  amount: number;
  percentage: number | null;
  date: string | null;
}

interface PriceBreakdownGuestProps {
  guestResume?: GuestResume | null;
  fallbackAmount?: number | null;
  fallbackCurrency?: string;
}

const PriceBreakdownGuest: React.FC<PriceBreakdownGuestProps> = ({
  guestResume,
  fallbackAmount = 0,
  fallbackCurrency = 'BOB',
}) => {
  const { t } = useTranslation();

  if (!guestResume) {
    return (
      <Box mt={8}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
          {t('reservationPostApproved.price.title')}
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#64748b', mb: 0.5 }}>
          {t('reservationPostApproved.amountToPay')}
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>
          {`${fallbackAmount} ${fallbackCurrency}.`}
        </Typography>
      </Box>
    );
  }

  const { accommodation, additionalCharges, subtotal, guestCommission, total, currencyCode } =
    guestResume;

  return (
    <Box mt={8}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
        {t('reservationPostApproved.price.title')}
      </Typography>

      <Stack spacing={1.5}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ fontSize: 14, color: '#64748b' }}>
            {accommodation.nightsCount} noche
            {accommodation.nightsCount !== 1 ? 's' : ''} × {accommodation.ratePerNight}{' '}
            {currencyCode}
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {accommodation.baseAmount} {currencyCode}
          </Typography>
        </Box>

        {additionalCharges.extraGuestFee > 0 && (
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: 14, color: '#64748b' }}>Huéspedes extra</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {additionalCharges.extraGuestFee} {currencyCode}
            </Typography>
          </Box>
        )}

        {additionalCharges.petFee > 0 && (
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: 14, color: '#64748b' }}>Mascotas</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {additionalCharges.petFee} {currencyCode}
            </Typography>
          </Box>
        )}

        {additionalCharges.cleaningFee > 0 && (
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: 14, color: '#64748b' }}>Limpieza</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {additionalCharges.cleaningFee} {currencyCode}
            </Typography>
          </Box>
        )}

        {additionalCharges.otherFees > 0 && (
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: 14, color: '#64748b' }}>Otros cargos</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {additionalCharges.otherFees} {currencyCode}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ fontSize: 14, color: '#64748b' }}>Subtotal</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {subtotal} {currencyCode}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ fontSize: 14, color: '#64748b' }}>
            Comisión de servicio ({guestResume.guestCommissionPercent}%)
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {guestCommission} {currencyCode}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Total</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>
            {total} {currencyCode}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default PriceBreakdownGuest;
