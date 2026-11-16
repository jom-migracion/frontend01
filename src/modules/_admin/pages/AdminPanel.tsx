import React, { useEffect, useState, Suspense } from 'react';
import { Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import ReservationComponent from '../components/reservationManagement/ReservationComponent';
// import RentalCalendar1 from '../components/RentalCalendar1';
// import MonthlyCalendar from '@/components/Calendar/MonthlyCalendar';

const AdminListCard = React.lazy(() => import('../components/AdminListCard'));
const AdminGaleryCard = React.lazy(() => import('../components/AdminGaleryCard'));
const DetailGaleryCard = React.lazy(() => import('../pages/DetailAdmin'));
const GuestMessage = React.lazy(() => import('@/modules/_guest/page/GuestMessage'));
const Dashboard = React.lazy(() => import('@/modules/_admin/components/dashBoard/Dashboard'));
// import { PropertyInfo } from '@/models/interfaces/calendar/PropertyInfo';
import TodayIcon from '@mui/icons-material/Today';
import CampaignIcon from '@mui/icons-material/Campaign';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MessageIcon from '@mui/icons-material/Message';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useAuthContext } from '@/modules/_auth/context';
import { useNavigate } from 'react-router';
import { useGet } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useViewReservationStore } from '@/store/message.store';
import { RestClient } from '@/services/RestClient';
// import { useListingRentStore } from '@/store/message.store';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const CustomTabPanel = ({ children, value, index }: any) => (
  <div hidden={value !== index}>{value === index && <Box sx={{ p: 0, m: 0 }}>{children}</Box>}</div>
);

const AdminPanel = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [cardView, setCardView] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  // const [isMonthy, setIsMonthy] = useState(false);
  // const [propertySelected, setPropertySelected] = useState<PropertyInfo | null>(null);
  const [statusCode, setStatusCode] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { isHostAuthenticated } = useAuthContext();
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();

  // store
  const setDataListingRent = usePropertyRegistration((state) => state.setData);
  const setContinueStepPublishing = usePropertyRegistration(
    (state) => state.setContinueStepPublishing
  );
  const viewReservation = useViewReservationStore((state: any) => state.viewReservationData);

  // Switch to Reservations tab (0) when a reservation is queued for detail view
  useEffect(() => {
    if (viewReservation) {
      setSelectedTab(0);
    }
  }, [viewReservation]);
  // const resetState = useListingRentStore((state: any) => state.resetState);
  // const listingRent = useListingRentStore((state: any) => state.listingRent);

  // api
  const { data: listDataRent, isLoading } = useGet<any>(
    'listingRent',
    '/Host/ListingRent',
    { status: 'PUBLISH,DRAFT,COMPLETED,UNPUBLISH' },
    selectedTab === 1 // llamada solo si es tab de "Anuncios"
  );

  const handleChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedCardId(null); // reset selected card
    // setPropertySelected(null);
    // setIsMonthy(false);
  };
  // const handlePropertySelected = React.useCallback((property: PropertyInfo) => {
  //   setPropertySelected(property);
  //   setIsMonthy(true);
  // }, []);

  const handleChangeSelected = (id: number, statusCode?: string) => {
    setStatusCode(statusCode);
    setSelectedCardId(id);
  };

  const handleCardClick = async (
    listingRentId: any,
    status?: 'publicado' | 'pendiente' | 'no_publicado'
  ) => {
    if (status == 'pendiente') {
      const responseContinue = await RestClient.get(
        `/Host/ListingRent/${listingRentId}/ProcessData/Continue`
      );

      const responseProcessData = await responseContinue.data;
      if (responseProcessData.statusCode == '200' && responseProcessData.data) {
        setDataListingRent(responseProcessData.data);
        setContinueStepPublishing(responseProcessData.data.listingData.nextViewCode);
        navigate(`/host/register`);
      } else {
        showSnackbar(responseProcessData?.resultError?.message, 'error');
      }
    } else {
      setSelectedCardId(listingRentId);
    }
  };

  useEffect(() => {
    !isHostAuthenticated && navigate('/');
  }, [isHostAuthenticated]);

  // useEffect(() => {
  //   if (listingRent?.listingRentId) {
  //     setPropertySelected({
  //       id: listingRent.listingRentId,
  //       name: listingRent?.name,
  //     } as PropertyInfo);
  //     setIsMonthy(true);
  //     setSelectedTab(2); // Cambiar al tab del calendario
  //     resetState();
  //   }
  // }, [resetState, listingRent]);

  return (
    <>
      <Helmet>
        <title>Host</title>
        <meta name="host" content="Página principal del host" />
      </Helmet>     
      {isHostAuthenticated ? (
        <>
          {isSmallScreen && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(5, 1fr)',
                gap: '8px',
                marginLeft: '10%',
                marginRight: '5%',
                mt: 0,
                pt: 0,
              }}
            >
              <Box
                sx={{
                  gridColumn: isSmallScreen ? '1 / -1' : 'span 4',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pl: '22px',
                  mt: 0,
                  pt: 0,
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                  {isSmallScreen ? (
                    <BottomNavigation
                      showLabels
                      value={selectedTab}
                      onChange={handleChange}
                      sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: 3,
                      }}
                    >
                      <BottomNavigationAction label={t('adminPanel.today')} icon={<TodayIcon />} />
                      <BottomNavigationAction
                        label={t('adminPanel.listings')}
                        icon={<CampaignIcon />}
                      />
                      <BottomNavigationAction
                        label={t('adminPanel.calendar')}
                        icon={<CalendarMonthIcon />}
                      />
                      <BottomNavigationAction
                        label={t('adminPanel.messages')}
                        icon={<MessageIcon />}
                      />
                      <BottomNavigationAction
                        label={t('adminPanel.dashboard')}
                        icon={<DashboardIcon />}
                      />
                    </BottomNavigation>
                  ) : (
                    <Tabs
                      value={selectedTab}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      textColor="primary"
                      indicatorColor="primary"
                    >
                      <Tab
                        label={t('adminPanel.today')}
                        {...a11yProps(0)}
                        sx={{ textTransform: 'none' }}
                      />
                      <Tab
                        label={t('adminPanel.listings')}
                        {...a11yProps(1)}
                        sx={{ textTransform: 'none' }}
                      />
                      <Tab
                        label={t('adminPanel.calendar')}
                        {...a11yProps(2)}
                        sx={{ textTransform: 'none' }}
                      />
                      <Tab
                        label={t('adminPanel.messages')}
                        {...a11yProps(3)}
                        sx={{ textTransform: 'none' }}
                      />
                      <Tab
                        label={t('adminPanel.dashboard')}
                        {...a11yProps(4)}
                        sx={{ textTransform: 'none' }}
                      />
                    </Tabs>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          <Box sx={{ width: '100%', mt: 0, pt: 0 }}>
            <Suspense
              fallback={
                <Box sx={{ p: 4, textAlign: 'center' }}>{t('commonNames.loadingModule')}</Box>
              }
            >
              <CustomTabPanel value={selectedTab} index={0}>
                <ReservationComponent />
              </CustomTabPanel>
              <CustomTabPanel value={selectedTab} index={1}>
                {selectedCardId !== null ? (
                  <>
                    <DetailGaleryCard
                      cardId={selectedCardId}
                      handleChangeSelectedCardId={handleChange}
                      statusCode={statusCode}
                    />
                  </>
                ) : cardView ? (
                  <>
                    <AdminGaleryCard
                      onCardSelect={handleChangeSelected}
                      listDataRent={listDataRent?.data ?? []}
                      isLoading={isLoading}
                    />
                  </>
                ) : (
                  <>
                    <AdminListCard
                      handleCardClick={handleCardClick}
                      listDataRent={listDataRent?.data ?? []}
                      isLoading={isLoading}
                    />
                  </>
                )}
              </CustomTabPanel>

              <CustomTabPanel value={selectedTab} index={2}></CustomTabPanel>
              <CustomTabPanel value={selectedTab} index={3}>
                <GuestMessage />
              </CustomTabPanel>
              <CustomTabPanel value={selectedTab} index={4}>
                <Dashboard />
              </CustomTabPanel>
            </Suspense>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminPanel;
