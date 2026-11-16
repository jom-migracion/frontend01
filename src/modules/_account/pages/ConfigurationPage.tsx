import React, { useState, useEffect } from 'react';
import { Box, Container, IconButton, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecuritySettingsContent from './SecuritySettingsContent';
import PaymentsContent from './PaymentsContent';
import Sidebar from '../components/Sidebar';
import AccountContent from './AccountContent';
import NotificationHistory from './NotificationHistory';
import InvoiceContent from './InvoiceContent';
import RefundsAndPenaltiesContent from './RefundsAndPenaltiesContent';

const ConfigurationPage: React.FC = () => {
  const theme = useTheme();
  const { option } = useParams<{ option?: string }>();
  const [searchParams] = useSearchParams();
  const [selectedSection, setSelectedSection] = useState<string | undefined>(option);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const openIdentityFromQuery =
    searchParams.get('openIdentityVerification') === 'true' ||
    searchParams.get('openIdentityVerification') === '1';

  useEffect(() => {
    if (!isMobile) {
      setSelectedSection(option);
      return;
    }

    if (openIdentityFromQuery) {
      setSelectedSection('personal');
      setShowMobileSidebar(false);
      return;
    }

    if (!option) {
      setSelectedSection(undefined);
      setShowMobileSidebar(true);
    }
  }, [option, isMobile, openIdentityFromQuery]);

  const handleSelectSection = (section: string) => {
    setSelectedSection(section);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    setShowMobileSidebar(true);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'personal':
        return <AccountContent />;
      case 'security':
        return <SecuritySettingsContent />;
      case 'payments':
        return <PaymentsContent />;
      case 'notification':
        return <NotificationHistory />;
      case 'invoice':
        return <InvoiceContent />;
      case 'reembolso':
        return <RefundsAndPenaltiesContent />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth={isMobile ? 'sm' : isLargeScreen ? 'xl' : 'lg'}>
      <Box pt={4}>
        <Grid container spacing={6}>
          {(!isMobile || showMobileSidebar) && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Sidebar selected={selectedSection} onSelect={handleSelectSection} />
            </Grid>
          )}

          {(!isMobile || !showMobileSidebar) && (
            <Grid size={{ xs: 12, md: 8 }}>
              {isMobile && (
                <IconButton
                  onClick={handleBackToSidebar}
                  sx={{ mb: 2, ml: -1 }}
                  aria-label="Volver al menu"
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              {renderSection()}
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default ConfigurationPage;
