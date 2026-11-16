import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Typography,
  Box,
  ButtonBase,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  IconButton,
  Theme,
  Link
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CampaignIcon from '@mui/icons-material/Campaign';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import GridViewIcon from '@mui/icons-material/GridView';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ReservationRequestCard from './ReservationRequestCard';
import { useGet, useGet3 } from '@/hooks/api';
import ScheduledReservationsList from './ScheduledReservationsList';
import ReservationRequest from './ReservationRequest';
import FilterByAdDialog from '../dashBoard/FilterByAdDialog';
import ReservationsTable from './ReservationsTable';
import Maleta from '../../../../assets/maleta.png';
import { ReservationRequestCardSkeleton } from './ReservationSkeletons';
import { formatDateRange } from '@/common/util/dateFunctions';
import { useTranslation } from 'react-i18next';
import { PropertyInfo } from '@/models/interfaces/calendar/PropertyInfo';
import { useLocation } from 'react-router-dom';

const Dashboard = React.lazy(() => import('../dashBoard/Dashboard'));
const AdminGaleryCard = React.lazy(() => import('../AdminGaleryCard'));
const RentalCalendar1 = React.lazy(() => import('../RentalCalendar1'));
const GuestMessage = React.lazy(() => import('@/modules/_guest/page/GuestMessage'));
const DetailGaleryCard = React.lazy(() => import('@/modules/_admin/pages/DetailAdmin'));
const MonthlyCalendar = React.lazy(() => import('@/components/Calendar/MonthlyCalendar'));
import { useListingRentStore, useViewReservationStore } from '@/store/message.store';
import { listingRentPublishedStore } from '@/store/listingRentPropertyRegistration.store';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Helmet } from 'react-helmet-async';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ROWS_TO_LOAD = 4;

const ReservationsComponent: React.FC = () => {
  // ========================================================================
  // ESTADO - Declaraciones de estado para gestión del componente
  // ========================================================================
  const [value, setValue] = useState(0);
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);
  const [seeAllReservations, setSeeAllReservations] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'table'>('list');
  const [originCard, setOriginCard] = useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>('today');
  const [selectedCardId, setSelectedCardId] = useState<number | null | string>(null);
  const [statusCode, setStatusCode] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [collapsed, setCollapsed] = useState(true);
  const [fromMessaging, setFromMessaging] = useState(false);
  const [isMonthy, setIsMonthy] = useState(false);
  const [propertySelected, setPropertySelected] = useState<PropertyInfo | null>(null);
  const [visibleRowCount, setVisibleRowCount] = useState(ROWS_TO_LOAD);
  // const [calendarRefreshTrigger, setCalendarRefreshTrigger] = useState(0);
  const location = useLocation();

  const drawerWidth = collapsed ? 64 : 240;

  // ========================================================================
  // STORE - Gestión de estado global desde tiendas Zustand
  // ========================================================================
  const listingRent = useListingRentStore((state: any) => state.listingRent);
  const seeProperties = listingRentPublishedStore((state: any) => state.seeProperties);
  const setSeeProperties = listingRentPublishedStore((state: any) => state.setSeeProperties);
  const listingRentIdStore = listingRentPublishedStore((state: any) => state.listingRentId);
  const setListingRentIdStore = listingRentPublishedStore((state: any) => state.setListingRentId);

  const viewReservation = useViewReservationStore((state: any) => state.viewReservationData);
  const resetViewReservation = useViewReservationStore((state: any) => state.resetViewReservation);

  // ========================================================================
  // EFECTOS - Manejar navegación y cambios de ruta
  // ========================================================================
  useEffect(() => {
    if (seeProperties) {
      handleSectionChange('announcements');
      setSeeProperties(false);
    } else if (listingRentIdStore) {
      handleSectionChange('announcements');
      handleCardSelect(listingRentIdStore, 'PUBLISH');
      setListingRentIdStore(null);
    } else {
      handleSectionChange('today');
    }
  }, [location.key]);

  useEffect(() => {
    if (listingRent?.listingRentId) {
      setActiveSection('calendar');
      setPropertySelected({
        id: listingRent.listingRentId,
        name: listingRent?.name,
      } as PropertyInfo);
    }
  }, [listingRent]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const propertyParam = params.get('property');
    const nameParam = params.get('name');

    if (propertyParam && nameParam) {
      setActiveSection('calendar');
    }
  }, [location.search]);

  useEffect(() => {
    if (viewReservation) {
      setFromMessaging(true);
      handleReservationClick(viewReservation, true);
      resetViewReservation();
    }
  }, [viewReservation]);

  // ========================================================================
  // BARRA LATERAL - Configuración de elementos del menú de navegación
  // ========================================================================
  const sidebarItems = [
    {
      id: 'today',
      label: t('reservationComponent.today'),
      icon: <CalendarTodayIcon sx={{ fontSize: 20 }} />,
    },
    {
      id: 'announcements',
      label: t('reservationComponent.announcements'),
      icon: <CampaignIcon sx={{ fontSize: 20 }} />,
    },
    {
      id: 'calendar',
      label: t('reservationComponent.calendar'),
      icon: <CalendarMonthIcon sx={{ fontSize: 20 }} />,
    },
    {
      id: 'messaging',
      label: t('reservationComponent.messaging'),
      icon: <ChatBubbleIcon sx={{ fontSize: 20 }} />,
    },
    {
      id: 'dashboard',
      label: t('reservationComponent.dashboard'),
      icon: <GridViewIcon sx={{ fontSize: 20 }} />,
    },
  ];

  // ========================================================================
  // LLAMADAS API - Obtención de datos desde servicios backend
  // ========================================================================
  const {
    data: PendingAcceptance,
    isLoading: loadingPendingAcceptance,
    refetch: refetchPendingAcceptance,
  } = useGet3<any[]>(
    'PendingAcceptance',
    `/Book/ReservationsListUser/prebook`,
    {},
    {
      staleTime: 0,
    }
  );
  const { data: ReservationsList, isLoading: loadingReservationsList } = useGet(
    'ReservationsList',
    `/Book/ReservationsListUser/approved,rented,review`
  );
  const { data: ReservationsListSchedule, isLoading: loadingReservationsListSchedule } = useGet(
    'ReservationsListSchedule',
    `/Book/ReservationsListUser/rented`
  );

  // API para anuncios
  const { data: listDataRent, isLoading: isLoadingListings } = useGet(
    'listingRent',
    '/Host/ListingRent',
    { status: 'PUBLISH,DRAFT,COMPLETED,UNPUBLISH' },
    activeSection === 'announcements'
  );

  // ========================================================================
  // MANEJADORES DE EVENTOS - Funciones para gestionar interacciones del usuario y navegación
  // ========================================================================
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setStatusCode('');
    setSelectedCardId(null);
    setValue(newValue);
  };

  const handleReservationClick = (reservation: any, onProcess: boolean = false) => {
    setSelectedReservation(reservation);
    setCurrentView('detail');
    if (onProcess) {
      setOriginCard(true);
    } else {
      setOriginCard(false);
      setFromMessaging(false);
    }
  };

  const handleReservationSelect = (reservation: any) => {
    setSelectedReservation(reservation);
  };

  const handleBackToList = () => {
    setSelectedReservation(null);
    if (fromMessaging) {
      setFromMessaging(false);
      setCurrentView('list');
      setActiveSection('messaging');
    } else if (seeAllReservations) {
      setCurrentView('table');
    } else {
      setCurrentView('list');
      setSeeAllReservations(false);
      setActiveSection('today');
    }
  };

  const handleShowAllReservations = () => {
    setSeeAllReservations(true);
    setCurrentView('table');
  };

  const handleBackToMainList = () => {
    setCurrentView('list');
    setSelectedReservation(null);
    setSeeAllReservations(false);
    setActiveSection('today');
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setCurrentView('list');
    setSelectedReservation(null);
    setSeeAllReservations(false);
    setSelectedCardId(null);
    setIsMonthy(false);
    if (sectionId != 'calendar'){
      setPropertySelected(null);
    }
    setFromMessaging(false);
  };

  const handleCardSelect = (cardId: number | string, statusCode?: string) => {
    setStatusCode(statusCode);
    setSelectedCardId(cardId);
  };

  const handlePropertySelected = React.useCallback((property: PropertyInfo) => {
    setPropertySelected(property);
    setIsMonthy(true);
  }, []);

  const handleChangeProperty = () => {
    setSelectedCardId(null);
    setPropertySelected(null);
    setIsMonthy(false);
    // setCalendarRefreshTrigger((prev) => prev + 1);
  };

  type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  const useCurrentBreakpoint = (): Breakpoint => {
    const theme = useTheme<Theme>();

    // Evaluamos usando "up" (desde ese tamaño hacia arriba)
    const isXl = useMediaQuery(theme.breakpoints.up('xl'));
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const isSm = useMediaQuery(theme.breakpoints.up('sm'));

    // El orden importa: verificamos de mayor a menor
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs'; // Si no es ninguno de los anteriores, es xs
  };
  const currentBreakpoint = useCurrentBreakpoint();

  const isCheckinToday = (checkin?: string): boolean => {
    if (!checkin) return false;

    const checkinDate = new Date(checkin);
    if (Number.isNaN(checkinDate.getTime())) return false;

    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - checkinDate.getTime()) / (1000 * 60 * 60);

    return diffInHours <= 24;
  };

  const pendingAcceptanceToday = React.useMemo(() => {
    if (!Array.isArray(PendingAcceptance?.data)) return [];
    return PendingAcceptance.data.filter((reservation: any) =>
      isCheckinToday(reservation?.requestDateTime)
    );
  }, [PendingAcceptance?.data]);

  const hasMoreReservations = visibleRowCount < pendingAcceptanceToday.length;
  let reservationsPendingAcceptanceToShow = pendingAcceptanceToday.slice(0, visibleRowCount);

  const handleLoadMore = () => {
    setOriginCard(false);
    setCurrentView('detail');
    setSelectedReservation(reservationsPendingAcceptanceToShow[0]);
  };

  const reservationsToday = React.useMemo(() => {
    if (!Array.isArray(ReservationsList?.data)) return [];
    return ReservationsList.data.filter((reservation: any) => isCheckinToday(reservation?.checkin));
  }, [ReservationsList?.data]);

  const reservationsListToday = React.useMemo(() => {
    if (!ReservationsList) return { data: reservationsToday };
    return {
      ...ReservationsList,
      data: reservationsToday,
    };
  }, [ReservationsList, reservationsToday]);

  const hasAnyReservations = React.useMemo(() => {
    return Array.isArray(ReservationsList?.data) && ReservationsList.data.length > 0;
  }, [ReservationsList?.data]);

  useEffect(() => {
    if (activeSection === 'today' || currentView === 'detail') {
      void refetchPendingAcceptance();
    }
  }, [activeSection, currentView, refetchPendingAcceptance]);

  const pendingReservationsList = React.useMemo(() => {
    if (fromMessaging) return [];
    const apiData = Array.isArray(PendingAcceptance?.data) ? PendingAcceptance.data : [];
    if (
      selectedReservation?.bookId &&
      !apiData.some((r: any) => r.bookId === selectedReservation.bookId)
    ) {
      return [selectedReservation, ...apiData];
    }
    return apiData;
  }, [fromMessaging, PendingAcceptance?.data, selectedReservation]);

  return (
    <React.Fragment>
      <Helmet>
        <title>Hoy</title>
        <meta name="reservas" content="Página administración de las reservas" />
      </Helmet>        
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          minHeight: { xs: '100vh', md: 'unset' },
          bgcolor: 'background.default',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
        }}
      >
        {/* ====================================================================
            BARRA LATERAL - Drawer de navegación izquierda con menú colapsable
            ==================================================================== */}
        <Drawer
          variant="permanent"
          sx={{
            width: { xs: '100%', md: drawerWidth },
            flexShrink: 0,
            position: { xs: 'fixed', md: 'relative' },
            bottom: { xs: 0, md: 'auto' },
            left: { xs: 0, md: 'auto' },
            right: { xs: 0, md: 'auto' },
            top: { xs: 'auto', md: 'auto' },
            zIndex: { xs: 1100, md: 1000 },
            transition: 'width 0.2s ease',
            '& .MuiDrawer-paper': {
              width: { xs: '100%', md: drawerWidth },
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              border: 'none',
              position: { xs: 'fixed', md: 'fixed' },
              height: { xs: 'auto', md: 'calc(100vh - 74px)' },
              top: { xs: 'auto', md: '74px' },
              bottom: { xs: 0, md: 'auto' },
              left: { xs: 0, md: 'auto' },
              right: { xs: 0, md: 'auto' },
              borderTop: { xs: 'none', md: 'none' },
              borderRight: { xs: 'none', md: '1px solid #ececec' },
              borderColor: '#ececec',
              zIndex: 1000,
              overflow: 'visible',
              transition: 'width 0.2s ease',
            },
          }}
        >
          {/* Botón para expandir/contraer — solo en escritorio */}
          {!isMobile && (
            <IconButton
              onClick={() => setCollapsed((prev) => !prev)}
              size="small"
              sx={{
                display: { xs: 'none', md: 'flex' },
                position: 'absolute',
                top: '20px',
                right: -14,
                zIndex: 1200,
                width: 28,
                height: 28,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 1,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              {collapsed ? (
                <ChevronRightIcon sx={{ fontSize: 16 }} />
              ) : (
                <ChevronLeftIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          )}
          <List
            sx={{
              px: { xs: 1.5, md: collapsed ? 1 : 2 },
              py: { xs: 1.25, md: 3 },
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              justifyContent: { xs: 'space-evenly', md: 'flex-start' },
              gap: { xs: 1, md: 0.5 },
              alignItems: { xs: 'center', md: 'stretch' },
              width: '100%',
              transition: 'padding 0.2s ease',
            }}
          >
            {sidebarItems.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                sx={{ mb: { xs: 0, md: 0.5 }, flex: { xs: '1 1 auto', md: '0 0 auto' } }}
              >
                <Tooltip title={collapsed && !isMobile ? item.label : ''} placement="right" arrow>
                  <ListItemButton
                    selected={activeSection === item.id}
                    onClick={() => handleSectionChange(item.id)}
                    sx={{
                      borderRadius: { xs: 1.5, md: 3 },
                      py: { xs: 1.25, md: 1.5 },
                      px: { xs: 1, md: collapsed ? 1.5 : 2 },
                      minWidth: { xs: '45px', md: 'auto' },
                      justifyContent: { xs: 'center', md: collapsed ? 'center' : 'flex-start' },
                      flexDirection: { xs: 'column', md: 'row' },
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      transition: '//0.2s ease, justify-content 0.2s ease',
                      '&.Mui-selected': {
                        bgcolor: { xs: 'rgba(91, 85, 200, 0.15)', md: 'rgba(91, 85, 200, 0.08)' },
                        color: 'primary.main',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                        '&:hover': {
                          bgcolor: { xs: 'rgba(91, 85, 200, 0.2)', md: 'rgba(91, 85, 200, 0.12)' },
                        },
                      },
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: { xs: 'auto', md: collapsed ? 'auto' : 36 },
                        color: activeSection === item.id ? 'primary.main' : 'text.secondary',
                        fontSize: { xs: '22px', md: '20px' },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          fontSize: { xs: '0.65rem', md: '0.875rem' },
                          fontWeight: activeSection === item.id ? 600 : 400,
                          noWrap: true,
                        },
                      }}
                      sx={{
                        display: { xs: 'none', md: collapsed ? 'none' : 'block' },
                        ml: { xs: 0, md: 1 },
                        opacity: collapsed ? 0 : 1,
                        transition: 'opacity 0.15s ease',
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Drawer>
        {/* ====================================================================
            CONTENIDO PRINCIPAL - Área de contenido principal con cambio de vista dinámico
            ==================================================================== */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            pl: { xs: 0, md: 2 },
            pr: { xs: 0, md: 3 },
            py: { xs: 0, md: 3 },
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            pb: { xs: '100px', md: 0 },
            height: { xs: 'auto', md: 'calc(100vh - 74px)' },
            overflowY: { xs: 'visible', md: 'auto' },
          }}
        >
          <React.Suspense fallback={<Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>{t('commonNames.loadingSection')}</Box>}>
          {/* Vista: TABLA - Todas las reservas en formato tabla */}
          {currentView === 'table' ? (
            <Box
              sx={{
                ml: currentBreakpoint == 'lg' ? 0 : currentBreakpoint == 'xl' ? 12 : 0,
                mr: currentBreakpoint == 'lg' ? 0 : currentBreakpoint == 'xl' ? 12 : 0,
              }}
            >
              <ReservationsTable
                handleBackToList={handleBackToMainList}
                seeAllReservations={seeAllReservations}
                handleReservationClick={handleReservationClick}
              />
            </Box>
          ) : currentView === 'detail' ? (
            /* Vista: DETALLE - Información detallada de reserva y procesamiento de solicitudes */
            <Box sx={{ mb: 8, mt: 1 }}>
              <Box sx={{ display: 'flex', minHeight: '400px' }}>
                <>
                  <ReservationRequest
                    handleBackToList={handleBackToList}
                    selectedReservation={selectedReservation}
                    originCard={originCard}
                    pendingReservations={pendingReservationsList}
                    onReservationSelect={handleReservationSelect}
                    onShowCalendar={() => handleSectionChange('calendar')}
                    onShowMessaging={() => handleSectionChange('messaging')}
                    handleReservationClick={handleReservationClick}
                  />
                </>
              </Box>
            </Box>
          ) : activeSection === 'today' ? (
            /* Vista: SECCIÓN HOY - Dashboard con reservas pendientes y programadas */
            <Box sx={{ m: 0, p: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pt: 2,
                  position: 'relative',
                  p: { xs: 2.5, md: 0 },
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '50px',
                    border: 1,
                    borderColor: 'divider',
                    display: 'inline-flex',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    padding: '8px 8px 4px 8px',
                  }}
                >
                  {/* TABS para HOY y Reservaciones Programadas */}
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    sx={{
                      minHeight: '44px',
                      '& .MuiTabs-indicator': { display: 'none' },
                      '& .MuiTabs-flexContainer': {
                        gap: 0.5,
                      },
                    }}
                  >
                    {/* TAB 1: HOY - Reservas pendientes y en curso */}
                    <Tab
                      label={t('homeHost.today.tabToday')}
                      {...a11yProps(0)}
                      sx={{
                        borderRadius: '50px',
                        minHeight: '40px',
                        px: { xs: 3, md: 4 },
                        py: 1.25,
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        color: value === 0 ? 'white !important' : 'text.primary',
                        bgcolor: value === 0 ? 'primary.main' : 'transparent',
                        '&:hover': {
                          color: value === 0 ? 'white' : 'text.primary',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    />

                    {/* TAB 2: PROGRAMADAS - Reservas futuras y próximas */}
                    <Tab
                      label={t('homeHost.today.tabScheduled')}
                      {...a11yProps(1)}
                      sx={{
                        borderRadius: '50px',
                        minHeight: '40px',
                        px: { xs: 1, md: 4 },
                        py: 1.25,
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        color: value === 1 ? 'white !important' : 'text.secondary',
                        bgcolor: value === 1 ? 'primary.main' : 'transparent',
                        '&:hover': {
                          color: value === 1 ? 'white' : 'text.primary',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    />
                  </Tabs>
                </Box>
              </Box>
              {/* --- ÁREA DE CONTENIDO DE TABS --- */}
              {/* PANEL TAB 1: HOY - Vista principal de reservas */}
              <TabPanel value={value} index={0}>
                {/* Sección: Título de Solicitud y Estado de Carga */}
                {loadingPendingAcceptance ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Typography
                      sx={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        my: 2,
                        textAlign: 'center',
                        color: 'text.primary',
                      }}
                    >
                      {t('homeHost.today.titleRequests')}
                    </Typography>
                  </Box>
                ) : (
                  pendingAcceptanceToday.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                      <Typography
                        sx={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          my: 1,
                          textAlign: 'center',
                          color: 'text.primary',
                        }}
                      >
                        {t('homeHost.today.titleRequests')}
                      </Typography>
                    </Box>
                  )
                )}

                {/* Sección: Tarjetas de Solicitudes de Reserva Pendientes */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 4,
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  {loadingPendingAcceptance
                    ? Array.from({ length: 2 }).map((_, index) => (
                        <ReservationRequestCardSkeleton key={index} />
                      ))
                    : reservationsPendingAcceptanceToShow.map((reservation: any, index: number) => (
                        <div
                          key={reservation?.bookId || index}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Box onClick={() => handleReservationClick(reservation)}>
                            <ReservationRequestCard
                              remainingHours={reservation?.remainingTimeToRequestExpiration}
                              userAvatarUrl={reservation?.userIdRenterNavigation?.photoLink}
                              reservationDates={formatDateRange(
                                reservation?.checkin,
                                reservation?.checkout
                              )}
                              listingName={
                                reservation?.listingRent?.name ||
                                t('homeHost.today.placeholderListing')
                              }
                            />
                          </Box>                         
                        </div>
                      ))}
                      {hasMoreReservations && (
                          <Box sx={{ textAlign: 'center', width: '100%' }}>
                            <Link
                              component="button"
                              type="button"
                              onClick={handleLoadMore}
                              underline="none"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: '#5B57D8',
                                fontFamily: theme.typography.paragraph1SMedium,
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Ver mas solicitudes
                              <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                            </Link>
                          </Box>
                        )}                      
                </Box>
                {/* Sección: Estado Vacío - Sin Solicitudes Pendientes */}
                {!loadingPendingAcceptance && pendingAcceptanceToday.length === 0 && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                      <Typography
                        sx={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          color: 'text.primary',
                        }}
                      >
                        {t('homeHost.today.titleRequests')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                      <Box
                        sx={{
                          width: { xs: '100%', md: '280px' },
                          minHeight: '220px',
                          bgcolor: 'background.paper',
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 4,
                          p: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 1,
                          }}
                        >
                          {t('homeHost.today.titleRequests2')}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.875rem',
                            color: 'text.secondary',
                          }}
                        >
                          {t('homeHost.today.noReservations2')}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}

                {!loadingReservationsList && hasAnyReservations && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                      flexDirection: 'column',
                      gap: 0,
                      borderRadius: '8px',
                      ml: currentBreakpoint == 'lg' ? 0 : currentBreakpoint == 'xl' ? 12 : 0,
                      mr: currentBreakpoint == 'lg' ? 0 : currentBreakpoint == 'xl' ? 12 : 0,
                    }}
                  >
                    <ScheduledReservationsList
                      ReservationsList={ReservationsList}
                      handleReservationClick={handleReservationClick}
                      isLoading={loadingReservationsList}
                      filterNext={true}
                      filterCodes={['procesando_pago', 'en_curso', 'revision']}
                    />
                  </Box>
                )}
                {!loadingReservationsList && !hasAnyReservations && (
                  <Box
                    display={'flex'}
                    width={'100%'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    alignItems={'center'}
                  >
                    <Box
                      sx={{
                        width:
                          currentBreakpoint == 'lg'
                            ? '100%'
                            : currentBreakpoint == 'xl'
                              ? '90%'
                              : '100%',
                        display: 'flex',

                        pl: 0,
                        pr: 0,
                        pt: isSmallScreen ? 1 : 0,
                        pb: isSmallScreen ? 1 : 0,
                        ml: isSmallScreen
                          ? 0
                          : currentBreakpoint == 'lg'
                            ? 0
                            : originCard && currentBreakpoint == 'xl'
                              ? 16
                              : originCard
                                ? 4
                                : 0,
                      }}
                    >
                      {/* Sección: Título de Reservas */}
                      <Typography
                        sx={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 2,
                          width: '100%',
                        }}
                      >
                        {t('homeHost.today.titleReservations')}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {!loadingReservationsList && !hasAnyReservations && (
                  /* Sección: Estado Vacío - Sin Reservas */
                  <Box
                    display={'flex'}
                    width={'100%'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    alignItems={'center'}
                  >
                    <Box
                      sx={{
                        width:
                          currentBreakpoint == 'lg'
                            ? '100%'
                            : currentBreakpoint == 'xl'
                              ? '90%'
                              : '100%',
                        display: 'flex',

                        pl: 0,
                        pr: 0,
                        pt: isSmallScreen ? 1 : 0,
                        pb: isSmallScreen ? 1 : 0,
                        ml: isSmallScreen
                          ? 0
                          : currentBreakpoint == 'lg'
                            ? 0
                            : originCard && currentBreakpoint == 'xl'
                              ? 16
                              : originCard
                                ? 4
                                : 0,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 3,

                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        minHeight: '120px',
                      }}
                    >
                      <Typography
                        sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary', mb: 1 }}
                      >
                        {t('homeHost.today.noReservationsToday')}
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {t('homeHost.today.noReservationsTodayDesc')}
                      </Typography>
                    </Box>
                  </Box>
                )}
                    <ButtonBase
                      onClick={handleShowAllReservations}
                      sx={{
                        width: '100%',
                        p: 2,
                        mt: 4,
                        borderRadius: 3,
                        bgcolor: 'grey.50',
                        border: 1,
                        borderColor: 'divider',
                        justifyContent: 'flex-start',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          px: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {t('homeHost.today.btnShowAll')}
                          </Typography>
                          <KeyboardArrowRightIcon
                            sx={{ ml: 0.5, color: 'text.primary', fontSize: 20 }}
                          />
                        </Box>
                        <Box
                          component="img"
                          src={Maleta}
                          alt="maleta"
                          sx={{ width: 80, height: 80 }}
                        />
                      </Box>
                    </ButtonBase>                
                {
                  !loadingReservationsList && ''
                  /* Sección: Botón Ver Todas las Reservas */
                  // <Box
                  //   display={'flex'}
                  //   width={'100%'}
                  //   justifyContent={'center'}
                  //   flexDirection={'column'}
                  //   alignItems={'center'}
                  // >
                  //   <Box
                  //     sx={{
                  //       width:
                  //         currentBreakpoint == 'lg'
                  //           ? '100%'
                  //           : currentBreakpoint == 'xl'
                  //             ? '90%'
                  //             : '100%',
                  //       display: 'flex',
                  //       pl: 0,
                  //       pr: 0,
                  //       pt: isSmallScreen ? 1 : 0,
                  //       pb: isSmallScreen ? 1 : 0,
                  //       ml: isSmallScreen
                  //         ? 0
                  //         : currentBreakpoint == 'lg'
                  //           ? 0
                  //           : originCard && currentBreakpoint == 'xl'
                  //             ? 16
                  //             : originCard
                  //               ? 4
                  //               : 0,
                  //     }}
                  //   >
                  //     <ButtonBase
                  //       onClick={handleShowAllReservations}
                  //       sx={{
                  //         width: '100%',
                  //         p: 2,
                  //         mt: 4,
                  //         borderRadius: 3,
                  //         bgcolor: 'grey.50',
                  //         border: 1,
                  //         borderColor: 'divider',
                  //         justifyContent: 'flex-start',
                  //         transition: 'all 0.2s ease-in-out',
                  //         '&:hover': {
                  //           bgcolor: 'grey.100',
                  //           boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  //         },
                  //       }}
                  //     >
                  //       <Box
                  //         sx={{
                  //           display: 'flex',
                  //           justifyContent: 'space-between',
                  //           alignItems: 'center',
                  //           width: '100%',
                  //           px: 1,
                  //         }}
                  //       >
                  //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  //           <Typography
                  //             sx={{
                  //               fontSize: '0.875rem',
                  //               fontWeight: 600,
                  //               color: 'text.primary',
                  //             }}
                  //           >
                  //             {t('homeHost.today.btnShowAll')}
                  //           </Typography>
                  //           <KeyboardArrowRightIcon
                  //             sx={{ ml: 0.5, color: 'text.primary', fontSize: 20 }}
                  //           />
                  //         </Box>
                  //         <Box
                  //           component="img"
                  //           src={Maleta}
                  //           alt="maleta"
                  //           sx={{ width: 80, height: 80 }}
                  //         />
                  //       </Box>
                  //     </ButtonBase>
                  //   </Box>
                  // </Box>
                }
              </TabPanel>
              {/* PANEL TAB 2: PROGRAMADAS - Lista de reservas programadas */}
              <TabPanel value={value} index={1}>
                <Box
                  sx={{
                    ml: currentBreakpoint == 'lg' ? 0 : currentBreakpoint == 'xl' ? 12 : 0,
                    mr: currentBreakpoint == 'lg' ? 0 : currentBreakpoint == 'xl' ? 12 : 0,
                  }}
                >
                  <ScheduledReservationsList
                    isLoading={loadingReservationsListSchedule}
                    ReservationsList={ReservationsListSchedule}
                    handleReservationClick={handleReservationClick}
                    filterNext={true}
                    filterCodes={['proximo']}                    
                  />
                </Box>
              </TabPanel>
            </Box>
          ) : activeSection === 'announcements' ? (
            /* Vista: SECCIÓN ANUNCIOS - Gestión de anuncios de propiedades */
            <Box sx={{ width: '100%', minHeight: '400px' }}>
              {isLoadingListings ? (
                <Box sx={{ textAlign: 'center', mt: 5 }}>
                  <Typography>{t('reservationComponent.loadingAnnouncements')}</Typography>
                </Box>
              ) : !listDataRent?.data ||
                (Array.isArray(listDataRent.data) && listDataRent.data.length === 0) ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 4,
                      p: 6,
                      maxWidth: 400,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      {t('reservationComponent.messageNoPorperties')}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                      }}
                    >
                      {t('reservationComponent.messageNoPorperties2')}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  {selectedCardId !== null ? (
                    <DetailGaleryCard
                      cardId={selectedCardId}
                      handleChangeSelectedCardId={handleChange}
                      statusCode={statusCode}
                    />
                  ) : (
                    <>
                      <AdminGaleryCard
                        onCardSelect={handleCardSelect}
                        listDataRent={(listDataRent?.data as any[]) ?? []}
                        isLoading={false}
                      />
                    </>
                  )}
                </>
              )}
            </Box>
          ) : activeSection === 'calendar' ? (
            /* Vista: SECCIÓN CALENDARIO - Gestión de calendario de disponibilidad */
            isMonthy && propertySelected ? (
              <Box
                sx={{
                  overflowX: 'auto',
                  width: '100%',
                  paddingBottom: isSmallScreen ? '60px' : '0',
                }}
              >
                <Box>
                  <MonthlyCalendar
                    propertySelected={propertySelected}
                    handleBackButtonEvent={handleChangeProperty}
                    onOpenMessaging={() => setActiveSection('messaging')}
                  />
                </Box>
              </Box>
            ) : (
              <Box>
                <RentalCalendar1
                  handldePropertySelected={handlePropertySelected}
                  // refreshTrigger={calendarRefreshTrigger}
                  onOpenMessaging={() => setActiveSection('messaging')}
                />
              </Box>
            )
          ) : activeSection === 'messaging' ? (
            /* Vista: SECCIÓN MENSAJERÍA - Comunicación con huéspedes d*/
            <Box
              sx={{
                mx: { xs: -5, sm: 0, md: 0, lg: 1 },
                mr: { xs: -5, sm: 0, md: 0, lg: 1 },
                my: { xs: 0, md: -3 },
                height: { xs: 'auto', sm: 'calc(100vh - 74px)', md: 'calc(100vh - 74px)' },
                overflow: 'hidden',
                px: { xs: '40px', sm: 0, md: 0, lg: '0px' },
              }}
            >
              <GuestMessage
                onViewReservation={(bookingData) => {
                  setFromMessaging(true);
                  handleReservationClick(bookingData, true);
                }}
              />
            </Box>
          ) : activeSection === 'dashboard' ? (
            /* Vista: SECCIÓN DASHBOARD - Análisis y estadísticas */
            <Box>
              <Dashboard />
            </Box>
          ) : (
            /* FALLBACK POR DEFECTO - Mensaje de sección no disponible */
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 4,
                  p: 6,
                  maxWidth: 400,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2,
                  }}
                >
                  {t('reservationComponent.sectionUnavailable')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                  }}
                >
                  {t('reservationComponent.sectionUnavailableDesc')}
                </Typography>
              </Box>
            </Box>
          )}
          </React.Suspense>
        </Box>
      </Box>
      <FilterByAdDialog open={openFilterModal} onClose={() => setOpenFilterModal(false)} />
    </React.Fragment>
  );
};

export default ReservationsComponent;
