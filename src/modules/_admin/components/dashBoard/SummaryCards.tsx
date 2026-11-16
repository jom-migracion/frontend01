import React from 'react';
import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';

// Interface para los datos financieros
interface FinancialSummaryData {
  dateRange: string;
  totalEarned: string;
  grossIncome: number;
  adjustments: number;
  serviceFee: number;
  total: number;
  confirmedReservations: number;
  reservedNights: number;
  averageNightsPerReservation: number;
  propertyDetails: any;
}

interface MetricCardProps {
  value: string;
  label: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => (
  <Grid size={{ xs: 12, sm: 4 }}>
    <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', textAlign: 'left' }}>
      <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  </Grid>
);

interface SummaryCardsProps {
  data?: FinancialSummaryData;
  isLoading?: boolean;
  isError?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data, isLoading, isError }) => {
  const { t } = useTranslation();

  // Estados de carga y error
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        <MetricCard value="..." label={t('summaryCards.confirmedReservations')} />
        <MetricCard value="..." label={t('summaryCards.reservedNights')} />
        <MetricCard value="..." label={t('summaryCards.averageNights')} />
      </Grid>
    );
  }

  if (isError || !data) {
    return (
      <Grid container spacing={2}>
        <MetricCard value="--" label={t('summaryCards.confirmedReservations')} />
        <MetricCard value="--" label={t('summaryCards.reservedNights')} />
        <MetricCard value="--" label={t('summaryCards.averageNights')} />
      </Grid>
    );
  }

  // Usar datos reales del API
  return (
    <Grid container spacing={2}>
      <MetricCard
        value={data.confirmedReservations.toString()}
        label={t('summaryCards.confirmedReservations')}
      />
      <MetricCard value={data.reservedNights.toString()} label={t('summaryCards.reservedNights')} />
      <MetricCard
        value={data.averageNightsPerReservation.toString()}
        label={t('summaryCards.averageNights')}
      />
    </Grid>
  );
};

export default SummaryCards;
