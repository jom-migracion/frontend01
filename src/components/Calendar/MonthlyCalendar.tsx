import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useGet } from '@/hooks/api';
import { ListingsRentResponse1 } from '@/modules/_admin/hooks/useOwnerProperties1';
import { ArrowBackIos, MoreHoriz, Settings } from '@mui/icons-material';
import { PropertyInfo } from '@/models/interfaces/calendar/PropertyInfo';
import { SelectedDay } from '@/models/interfaces/SelectedDay';
import { RestClient } from '@/services/RestClient';
import PanelConfiguracion1 from './PanelConfiguracion1';
import { jomWhite } from '@/assets';
import CalendarioMensual2 from './CalendarioMensual2';
import LoadingThreeDotsJumping from '../LoadingThreeDotsJumping';
import { useTranslation } from 'react-i18next';
interface PropertyProps {
  propertySelected: PropertyInfo;
  handleBackButtonEvent: () => void;
  onOpenMessaging: () => void;
}

const MonthlyCalendar: React.FC<PropertyProps> = ({
  propertySelected,
  handleBackButtonEvent,
  onOpenMessaging,
}) => {
  const [vista, setVista] = useState<'mensual' | 'anual'>('mensual');
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<PropertyInfo | null>(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState<SelectedDay[]>([]);
  const [propertyActive, setPropertyActive] = useState<any>(null);
  const [propiedadesShort, setPropiedadesShort] = useState<PropertyInfo[]>([]);
  // const [additionalFeeTypes, setAdditionalFeeTypes] = useState<any>(null); //revisar como va esto
  const [isPending, setIsPending] = useState<boolean>(false);
  // Estados para controlar los paneles en modo mobile
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(false);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const {
    data: calendarDataInfo,
    // refetch: loadCalendar,
    isLoading,
  } = useGet<ListingsRentResponse1>('PersonalInfoRequest', '/Host/ListingRent/CalendarInfo');
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState<number | null>(null);
  const [eventReservation, setEventReservation] = useState<any[]>([]);
  const [preparationEvents, setPreparationEvents] = useState<any[]>([]);

  useEffect(() => {
    const calendarListings = (calendarDataInfo as any)?.data;

    if (Array.isArray(calendarListings) && calendarListings.length > 0) {
      const fetchedProperties = calendarListings.map((p: any) => ({
        id: p.listingRentId.toString(),
        name: p.name,
        image: p?.photos[0]?.photoLink || '',
      }));

      setPropiedadesShort(fetchedProperties);

      const initialSelectedIndex = fetchedProperties.findIndex(
        (property: PropertyInfo) => property.id === propertySelected?.id?.toString()
      );

      if (initialSelectedIndex >= 0) {
        setSelectedPropertyIndex(initialSelectedIndex);
      }

      if (!propiedadSeleccionada) {
        setPropiedadSeleccionada(propertySelected);
      }
      RestClient.get(`/Host/ListingRent/CalendarInfo/ListingRent/${propertySelected.id}`).then(
        (x: any) => {
          if (x?.data?.statusCode == '200') {
            setPropertyActive(x.data.data);
            const reservations = x.data.data.reservations || [];
            let listPreparationEvents: any[] = [];
            const eventos = reservations
              .map((res: any) => {
                if (Array.isArray(res?.calendarDays) && res.calendarDays.length > 0) {
                  const datesType2 = res.calendarDays
                    .filter((item: any) => item.blockType === 2)
                    .map((item: any) => new Date(item.date).getTime());

                  let startDate = new Date(Math.min(...datesType2)).toISOString().split('T')[0];
                  let endDate = new Date(Math.max(...datesType2)).toISOString().split('T')[0];

                  return {
                    id: res.bookId.toString(),
                    title:
                      res.userIdRenterNavigation?.name +
                        ' ' +
                        res.userIdRenterNavigation?.lastName || 'Reservación',
                    startDate: startDate,
                    endDate: endDate,
                    backgroundColor: '#5b4ca0',
                    color: 'white',
                    guests: res.gests || 0,
                    checkin: res.checkin,
                    checkout: res.checkout,
                    totalAmount: res.payPriceCalculations[0]?.priceCalculation?.payoutAmount || 0,
                  };
                }
                return null;
              })
              .filter((evento: any) => evento !== null);

            // Verificar si hay días de preparación (blockType == 3 o blockType == 9) para esta reserva
            const preparationDays = x?.data?.data?.calendarDays
              .filter((item: any) => item.blockType === 3 || item.blockType === 9)
              .map((item: any) => item.date);
            if (preparationDays.length > 0) {
              listPreparationEvents.push(...preparationDays);
            }

            setEventReservation(eventos);
            setPreparationEvents(listPreparationEvents);
          }
        }
      );
    }
  }, [calendarDataInfo, propertySelected]); // Sincroniza la selección inicial cuando llegan datos o cambia la propiedad

  const getLisintRentInfo = (id: string, index: number) => {
    RestClient.get(`/Host/ListingRent/CalendarInfo/ListingRent/${id}`).then((x: any) => {
      if (x?.data?.statusCode == '200') {
        setPropertyActive(x.data.data);
        setSelectedPropertyIndex(index);
        const reservations = x.data.data.reservations || [];
        let listPreparationEvents: any[] = [];
        const eventos = reservations
          .map((res: any) => {
            if (Array.isArray(res?.calendarDays) && res.calendarDays.length > 0) {
              const datesType2 = res.calendarDays
                .filter((item: any) => item.blockType === 2)
                .map((item: any) => new Date(item.date).getTime());

              let startDate = new Date(Math.min(...datesType2)).toISOString().split('T')[0];
              let endDate = new Date(Math.max(...datesType2)).toISOString().split('T')[0];

              return {
                id: res.bookId.toString(),
                title:
                  res.userIdRenterNavigation?.name + ' ' + res.userIdRenterNavigation?.lastName ||
                  'Reservación',
                startDate: startDate,
                endDate: endDate,
                backgroundColor: '#5b4ca0',
                color: 'white',
                guests: res.gests || 0,
                checkin: res.checkin,
                checkout: res.checkout,
                totalAmount: res.payPriceCalculations[0]?.priceCalculation?.payoutAmount || 0,
              };
            }
            return null;
          })
          .filter((evento: any) => evento !== null);

        // Verificar si hay días de preparación (blockType == 3 o blockType == 9) para esta reserva
        const preparationDays = x?.data?.data?.calendarDays
          .filter((item: any) => item.blockType === 3 || item.blockType === 9)
          .map((item: any) => item.date);
        if (preparationDays.length > 0) {
          listPreparationEvents.push(...preparationDays);
        }
        setEventReservation(eventos);
        setPreparationEvents(listPreparationEvents);
      }
    });
  };

  const reloadProperty = async () => {
    setIsPending(true);
    try {
      await RestClient.get(
        `/Host/ListingRent/CalendarInfo/ListingRent/${propiedadSeleccionada?.id}`
      ).then((x: any) => {
        if (x?.data?.statusCode == '200') {
          setPropertyActive(x.data.data);
          const reservations = x.data.data.reservations || [];
          let listPreparationEvents: any[] = [];
          const eventos = reservations
            .map((res: any) => {
              if (Array.isArray(res?.calendarDays) && res.calendarDays.length > 0) {
                const datesType2 = res.calendarDays
                  .filter((item: any) => item.blockType === 2)
                  .map((item: any) => new Date(item.date).getTime());

                let startDate = new Date(Math.min(...datesType2)).toISOString().split('T')[0];
                let endDate = new Date(Math.max(...datesType2)).toISOString().split('T')[0];

                return {
                  id: res.bookId.toString(),
                  title:
                    res.userIdRenterNavigation?.name + ' ' + res.userIdRenterNavigation?.lastName ||
                    'Reservación',
                  startDate: startDate,
                  endDate: endDate,
                  backgroundColor: '#5b4ca0',
                  color: 'white',
                  guests: res.gests || 0,
                  checkin: res.checkin,
                  checkout: res.checkout,
                  totalAmount: res.payPriceCalculations[0]?.priceCalculation?.payoutAmount || 0,
                };
              }
              return null;
            })
            .filter((evento: any) => evento !== null);

          // Verificar si hay días de preparación (blockType === 3 || item.blockType === 9) para esta reserva
          const preparationDays = x?.data?.data?.calendarDays
            .filter((item: any) => item.blockType === 3 || item.blockType === 9)
            .map((item: any) => item.date);
          if (preparationDays.length > 0) {
            listPreparationEvents.push(...preparationDays);
          }
          setEventReservation(eventos);
          setPreparationEvents(listPreparationEvents);
        }
        setIsPending(false);
      });
    } catch (error) {
      setIsPending(false);
    }
  };
  // Componente del panel izquierdo
  const LeftPanel = () => (
    <Box
      sx={{
        height: '100vh',
        maxHeight: 'calc(100vh - 178px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        p: 0,
        // width: isMobile ? '280px' : '100%',
        width: '100%',
        backgroundColor: 'white',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#555',
          },
        },
      }}
    >
      <Typography fontWeight={600} m={1} textAlign={'center'} fontSize={18}>
        {t('MonthlyCalendar.allListings', { defaultValue: 'Todos mis anuncios' })}
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5}>
        {propiedadesShort.map((propiedad, index) => (
          <Box
            key={propiedad.id}
            onClick={() => {
              setPropiedadSeleccionada(propiedad);
              getLisintRentInfo(propiedad.id, index);
              if (isMobile) setLeftPanelOpen(false);
            }}
            sx={{
              cursor: 'pointer',
              border:
                selectedPropertyIndex === index ? '3px solid #5E4DB2' : '2px solid transparent',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              '&:hover': {
                border: '3px solid #5E4DB2',
                boxShadow: '0 2px 8px rgba(94, 77, 178, 0.3)',
              },
            }}
          >
            <Box
              component="img"
              onError={(e: any) => {
                if (e.target.src !== jomWhite) {
                  e.target.src = jomWhite;
                }
              }}
              src={propiedad.image || '/placeholder-property.jpg'}
              alt={propiedad.name}
              sx={{
                width: '100%',
                height: '80px',
                objectFit: 'cover',
                display: 'block',
                backgroundColor: theme.palette.customColors.primary[1],
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );

  // Componente del panel derecho
  const RightPanel = () => (
    <Box
      sx={{
        height: '100vh',
        maxHeight: 'calc(100vh - 178px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        p: isMobile ? 2 : 0,
        // width: isMobile ? '320px' : '100%',
        width: '100%',
        backgroundColor: 'white',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#555',
          },
        },
      }}
    >
      <PanelConfiguracion1
        diasSeleccionados={diasSeleccionados}
        propertyId={propiedadSeleccionada?.id || ''}
        propertyInfo={propertyActive}
        onSeleccionarDias={setDiasSeleccionados}
        handleRefetchCalendar={reloadProperty}
      />
    </Box>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={0} bgcolor="white" sx={isMobile ? { paddingTop: '94px' } : undefined}>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
      <Grid container spacing={0}>
        <Grid spacing={0} size={{ xs: 12, md: 12 }} borderBottom={'1px solid#C8C8C4'}>
          <Box
            display="flex"
            p={0}
            m={0}
            justifyContent="space-between"
            alignItems="center"
            mb={1}
            gap={2}
            sx={
              isMobile
                ? {
                    position: 'fixed',
                    top: '42.5pt',
                    left: 0,
                    right: 0,
                    zIndex: 130,
                    backgroundColor: '#fff',
                    paddingTop: 1,
                    paddingBottom: 1,
                    borderBottom: '1px solid #C8C8C4',
                    boxSizing: 'border-box',
                    width: '100%',
                  }
                : undefined
            }
          >
            <Box display="flex" gap={1}>
              <IconButton
                edge="end"
                sx={{ mr: 2, color: 'black' }}
                onClick={() => handleBackButtonEvent()}
              >
                <ArrowBackIos style={{ paddingLeft: '5px' }} />
              </IconButton>
            </Box>

            {/* Botones para mobile */}
            {isMobile && (
              <Box display="flex" gap={1}>
                <IconButton
                  onClick={() => setLeftPanelOpen(true)}
                  sx={{
                    color: 'black',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' },
                  }}
                >
                  <MoreHoriz />
                </IconButton>
                <IconButton
                  onClick={() => setRightPanelOpen(true)}
                  sx={{
                    color: 'black',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' },
                  }}
                >
                  <Settings />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={0}>
        {/* Panel Izquierdo - Solo visible en desktop */}
        {!isMobile && (
          <Grid size={{ xs: 1, md: 1 }}>
            <LeftPanel />
          </Grid>
        )}

        {/* Panel Central */}
        <Grid
          size={{ xs: 12, md: isMobile ? 12 : 8 }}
          borderRight={isMobile ? 'none' : '1px solid#C8C8C4'}
        >
          <Box
            sx={{
              maxHeight: isMobile ? 'none' : 'calc(100vh - 178px)',
              overflowY: isMobile ? 'visible' : 'auto',
              overflowX: 'hidden',
              pr: 0,
              pl: 0,
              width: '100%',
              padding: isMobile ? '0 4px' : 0,
              boxSizing: 'border-box',
              '&::-webkit-scrollbar': isMobile
                ? undefined
                : {
                    width: '8px',
                  },
              '&::-webkit-scrollbar-track': isMobile
                ? undefined
                : {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                  },
              '&::-webkit-scrollbar-thumb': isMobile
                ? undefined
                : {
                    backgroundColor: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: '#555',
                    },
                  },
            }}
          >
            {vista === 'mensual' ? (
              <CalendarioMensual2
                propiedadId={propiedadSeleccionada?.name || ''}
                diasSeleccionados={diasSeleccionados}
                onSeleccionarDias={setDiasSeleccionados}
                vista={vista}
                onChangeVista={setVista}
                propertyInfo={propertyActive}
                isMobile={isMobile}
                eventos={eventReservation}
                preparationEvents={preparationEvents}
                onOpenMessaging={onOpenMessaging}
              />
            ) : null}
          </Box>
        </Grid>

        {/* Panel Derecho - Solo visible en desktop */}
        {!isMobile && (
          <Grid size={{ xs: 2, md: 3 }} style={{ border: '1px' }}>
            <RightPanel />
          </Grid>
        )}
      </Grid>

      {/* Drawers para mobile */}
      {isMobile && (
        <>
          {/* Drawer panel izquierdo */}
          <Drawer
            anchor="bottom"
            open={leftPanelOpen}
            onClose={() => setLeftPanelOpen(false)}
            slotProps={{
              paper: {
                sx: {
                  width: '100%',
                  maxHeight: '90vh',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  backgroundColor: 'white',
                  overflow: 'hidden',
                },
              },
            }}
          >
            <LeftPanel />
          </Drawer>

          {/* Drawer panel derecho */}
          <Drawer
            anchor="bottom"
            open={rightPanelOpen}
            onClose={() => setRightPanelOpen(false)}
            slotProps={{
              paper: {
                sx: {
                  width: '100%',
                  maxHeight: '90vh',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  backgroundColor: 'white',
                  overflow: 'hidden',
                },
              },
            }}
          >
            <RightPanel />
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default MonthlyCalendar;
