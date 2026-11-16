import React, { useEffect, useMemo, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import CollectionsTab from '../components/Payment/CollectionsTab';
import PaymentsTab from '../components/Payment/PaymentsTab';
import FeePerServiceTab from '../components/Payment/FeePerServiceTab';
import BankAccountGrid from '../components/Payment/BankAccountGrid';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  disablePadding?: boolean;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, disablePadding = false, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: disablePadding ? 0 : 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const PaymentsContent = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const requestedTab = useMemo(() => {
    const tabFromQuery = Number(searchParams.get('tab'));
    const tabFromState = Number((location.state as { paymentTab?: number } | null)?.paymentTab);
    const sourceTab = Number.isFinite(tabFromQuery) ? tabFromQuery : tabFromState;

    if (!Number.isFinite(sourceTab)) return 0;

    return Math.max(0, Math.min(3, sourceTab));
  }, [searchParams, location.state]);

  const [value, setValue] = useState(requestedTab);

  const { t } = useTranslation();

  useEffect(() => {
    setValue(requestedTab);
  }, [requestedTab]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('accountSettings.payments.title', { defaultValue: 'Pagos y cobros' })}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="pestañas de pagos"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
            },
          }}
        >
          <Tab
            label={t('accountSettings.payments.payments', { defaultValue: 'Pagos' })}
            {...a11yProps(0)}
          />
          <Tab
            label={t('accountSettings.payments.payouts', { defaultValue: 'Cobros' })}
            {...a11yProps(1)}
          />
          <Tab
            label={t('accountSettings.payments.serviceFee', {
              defaultValue: 'Tarifa por servicio',
            })}
            {...a11yProps(2)}
          />
          <Tab
            label={t('accountSettings.payments.bankAccount', { defaultValue: 'Cuenta bancaria' })}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>

      {/* Contenido de las pestañas */}
      <CustomTabPanel value={value} index={0}>
        <PaymentsTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CollectionsTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <FeePerServiceTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3} disablePadding>
        <BankAccountGrid />
      </CustomTabPanel>
    </Box>
  );
};

export default PaymentsContent;
