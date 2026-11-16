import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RefundsTab from '../components/Refund/RefundsTab';
import PenaltiesTab from '../components/Refund/PenaltiesTab';

import { useAuthContext } from '@/modules/_auth/context';

interface TabPanelProps {
  children?: React.ReactNode;
  // index: number;
  // value: number;
  index: string;
  value: string;
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

function a11yProps(index: string) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RefundsAndPenaltiesContent = () => {
  const { isGuestAuthenticated, isHostAuthenticated } = useAuthContext();
  const { t } = useTranslation();

  const [value, setValue] = useState<string>(isGuestAuthenticated ? 'guest' : 'host');

  useEffect(() => {
    if (isGuestAuthenticated) {
      setValue('guest');
    } else if (isHostAuthenticated) {
      setValue('host');
    }
  }, [isGuestAuthenticated, isHostAuthenticated]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    // console.log('Selected tab: ', event, newValue);
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('accountSettings.refundsAndPenalties.title', {
          defaultValue: 'Reembolsos y penalidades',
        })}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="pestañas de reembolsos y penalidades"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {/* Solo se muestra si es Guest */}
          {isGuestAuthenticated && (
            <Tab
              value="guest"
              label={t('accountSettings.refundsAndPenalties.refundAsGuest', {
                defaultValue: 'Reembolsos como huésped',
              })}
              {...a11yProps('guest')}
            />
          )}

          {/* <Tab 
            label={t('accountSettings.refundsAndPenalties.refundAsHost', { defaultValue: 'Reembolsos como anfitrión' })} 
            {...a11yProps(1)} 
          /> */}
          {/* <Tab 
            label={t('accountSettings.refundsAndPenalties.penaltiesAsGuest', { defaultValue: 'Penalidades como huésped' })} 
            {...a11yProps(2)} 
          /> */}

          {/* Solo se muestra si es Host */}
          {isHostAuthenticated && (
            <Tab
              value="host"
              label={t('accountSettings.refundsAndPenalties.penaltiesAsHost', {
                defaultValue: 'Penalidades como anfitrión',
              })}
              {...a11yProps('host')}
            />
          )}
        </Tabs>
      </Box>
      {/* Contenido de las pestañas */}
      {/* Contenido Guest */}
      {isGuestAuthenticated && (
        <CustomTabPanel value={value} index="guest">
          <RefundsTab userRole="GUEST" />
        </CustomTabPanel>
      )}
      {/* <CustomTabPanel value={value} index={1}>
        <RefundsTab userRole="HOST" />
      </CustomTabPanel> */}
      {/* <CustomTabPanel value={value} index={2}>
        <PenaltiesTab userRole="GUEST" />
      </CustomTabPanel> */}
      {/* Contenido Host */}
      {isHostAuthenticated && (
        <CustomTabPanel value={value} index="host" disablePadding>
          <PenaltiesTab userRole="HOST" />
        </CustomTabPanel>
      )}
    </Box>
  );
};

export default RefundsAndPenaltiesContent;
