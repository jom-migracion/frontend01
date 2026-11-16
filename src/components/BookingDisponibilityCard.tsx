import { useNotification } from '@/context/NotificationContext';
import { usePost } from '@/hooks/api';
import { useAuthContext } from '@/modules/_auth/context';
import { IPropsPaymentMethodCardResponse } from '@/modules/_guest/interface/IPropsPaymentMethodCard';
import { priceCalculationCardStore } from '@/store/priceInformation.store';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/Remove';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import { eachDayOfInterval, format } from 'date-fns'; // Import eachDayOfInterval
import { es } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BiUser } from 'react-icons/bi';
import { IoCalendarOutline } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router';
import SignInForm from './SignInForm';

interface Location {
  id: string;
  name: string;
  description: string;
  type: number;
  typeDesc: string;
  entityId: number;
}

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface SearchFormStorage {
  CityName?: string;
  typeDesc?: string;
  CityId?: number;
  CountyId?: number;
  StateId?: number;
  CountryId?: number;
  CheckInDate?: string;
  CheckOutDate?: string;
  Guests?: Guests;
  pageNumber?: number;
  pageSize?: number;
}

interface SearchFormData {
  CityName?: string;
  CityId?: number;
  StateId?: number;
  CountryId?: number;
  CountyId?: number;
  typeDesc?: string;
  CheckInDate?: Date | null;
  CheckOutDate?: Date | null;
  Guests: Guests;
}

interface DisponibilityProps {
  listingRentId?: string | undefined;
  disponibility: boolean;
  changeDisponibility: (value: boolean) => void;
  pricePerNight: number;
  rating: number;
  countReviews: number;
  travelers: number;
  discountedPrice?: number;
  selectionRange: Range;
  onSelect: (ranges: RangeKeyDict) => void;
  onClear: () => void;
  disabledDates: Date[];
  avatarUrl?: string;
  maxGuests: number;
  maxPets: string | null;
  adults?: number | undefined;
  children?: number | undefined;
  infants?: number | undefined;
  pets?: number | undefined;
}

const BookingDisponibilityCard: React.FC<DisponibilityProps> = ({
  listingRentId,
  disponibility,
  changeDisponibility,
  pricePerNight,
  rating,
  adults,
  children,
  infants,
  pets,
  selectionRange,
  onSelect,
  onClear,
  disabledDates,
  avatarUrl,
  maxGuests,
  maxPets,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const [showDetail, setShowDetail] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const showNotification = useNotification();
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [autoOpenDate, setAutoOpenDate] = useState(false);
  const [autoOpenGuests, setAutoOpenGuests] = useState(false);
  const [selectedCityObject, setSelectedCityObject] = useState<Location | null>(null);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [loginType, setLoginType] = useState<'registration' | 'login'>('login');
  const { isGuestAuthenticated } = useAuthContext();
  const [guests, setGuests] = useState<Guests>(() => {
    const urlAdults = searchParams.get('adults');
    const urlChildren = searchParams.get('children');
    const urlInfants = searchParams.get('infants');
    const urlPets = searchParams.get('pets');
    return {
      adults: urlAdults !== null ? Math.max(1, parseInt(urlAdults) || 1) : Math.max(1, adults ?? 1),
      children: urlChildren !== null ? Math.max(0, parseInt(urlChildren) || 0) : (children ?? 0),
      infants: urlInfants !== null ? Math.max(0, parseInt(urlInfants) || 0) : (infants ?? 0),
      pets: urlPets !== null ? Math.max(0, parseInt(urlPets) || 0) : (pets ?? 0),
    };
  });
  const [_, setEnabledDaysCount] = useState(0);
  const [openBreakdownIndex, setOpenBreakdownIndex] = useState<number | null>(null);

  // store
  const setDataCalcPriceCard = priceCalculationCardStore((state) => state.setDataCalcPriceCard);

  // api
  const { mutate: PriceCalculationCard, isPending: isPendingCalculationCard } =
    usePost<IPropsPaymentMethodCardResponse>(`/Book/${listingRentId}/CalculatePrice`);

  const hasSyncedUrlDates = useRef(false);
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const guestPopoverRef = useRef<HTMLDivElement>(null);

  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);

  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 6);

  const defaultLocation = {
    CityName: '',
    typeDesc: '',
    CityId: 0,
  };

  const { control, handleSubmit, setValue } = useForm<SearchFormData>({
    defaultValues: {
      CityName: '',
      CityId: undefined,
      StateId: undefined,
      CountryId: undefined,
      CountyId: undefined,
      typeDesc: '',
      CheckInDate: selectionRange.startDate || today,
      CheckOutDate: selectionRange.endDate || sevenDaysFromNow,
      Guests: guests,
    },
  });

  // Function to calculate enabled days
  const calculateEnabledDays = () => {
    if (!selectionRange.startDate || !selectionRange.endDate) {
      setEnabledDaysCount(0);
      return;
    }

    const days = eachDayOfInterval({
      start: selectionRange.startDate,
      end: selectionRange.endDate,
    });

    const enabledDays = days.filter((day) => {
      return !disabledDates.some(
        (disabledDate) =>
          day.getFullYear() === disabledDate.getFullYear() &&
          day.getMonth() === disabledDate.getMonth() &&
          day.getDate() === disabledDate.getDate()
      );
    });

    setEnabledDaysCount(enabledDays.length);
  };

  // Sync URL checkIn/checkOut → parent state on first mount
  useEffect(() => {
    if (hasSyncedUrlDates.current) return;
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    if (urlCheckIn && urlCheckOut) {
      const startDate = new Date(urlCheckIn + 'T00:00:00');
      const endDate = new Date(urlCheckOut + 'T00:00:00');
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
        hasSyncedUrlDates.current = true;
        onSelect({ selection: { startDate, endDate, key: 'selection' } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateEnabledDays();
  }, [selectionRange, disabledDates]);

  useEffect(() => {
    setShowDetail(false);
  }, [
    selectionRange.startDate,
    selectionRange.endDate,
    guests.adults,
    guests.children,
    guests.infants,
    guests.pets,
  ]);

  const handleCloseModal = () => {
    setIsModalLogin(false);
  };

  useEffect(() => {
    const storedData = localStorage.getItem('search-form-storage');
    if (storedData) {
      try {
        const parsed: SearchFormStorage = JSON.parse(storedData);
        const cityObject: Location | null =
          parsed.CityName && parsed.typeDesc
            ? {
                id: (
                  parsed.CityId ||
                  parsed.StateId ||
                  parsed.CountryId ||
                  parsed.CountyId ||
                  0
                ).toString(),
                name: parsed.CityName,
                description: '',
                type: parsed.typeDesc === 'city' ? 1 : 0,
                typeDesc: parsed.typeDesc,
                entityId:
                  parsed.CityId || parsed.StateId || parsed.CountryId || parsed.CountyId || 0,
              }
            : null;

        setSelectedCityObject(cityObject);
        setValue('CityName', parsed.CityName || '');
        setValue('typeDesc', parsed.typeDesc || '');
        setValue('CityId', parsed.typeDesc === 'city' ? parsed.CityId : undefined);
        setValue('StateId', parsed.typeDesc === 'state' ? parsed.StateId : undefined);
        setValue('CountryId', parsed.typeDesc === 'country' ? parsed.CountryId : undefined);
        setValue('CountyId', parsed.typeDesc === 'county' ? parsed.CountyId : undefined);
        setValue(
          'CheckInDate',
          parsed.CheckInDate ? new Date(parsed.CheckInDate) : selectionRange.startDate || today
        );
        setValue(
          'CheckOutDate',
          parsed.CheckOutDate
            ? new Date(parsed.CheckOutDate)
            : selectionRange.endDate || sevenDaysFromNow
        );
      } catch (error) {
        console.error('Error parsing search-form-storage:', error);
      }
    }
    // }, [setValue, travelers, selectionRange.startDate, selectionRange.endDate]);
  }, [setValue, selectionRange.startDate, selectionRange.endDate]);

  const updateLocalStorage = (data: SearchFormData) => {
    const storedData = localStorage.getItem('search-form-storage');
    let storageData: SearchFormStorage;

    if (storedData) {
      const parsed: SearchFormStorage = JSON.parse(storedData);
      storageData = {
        CityName: parsed.CityName || defaultLocation.CityName,
        typeDesc: parsed.typeDesc || defaultLocation.typeDesc,
        CityId: parsed.typeDesc === 'city' ? parsed.CityId : undefined,
        StateId: parsed.typeDesc === 'state' ? parsed.StateId : undefined,
        CountryId: parsed.typeDesc === 'country' ? parsed.CountryId : undefined,
        CountyId: parsed.typeDesc === 'county' ? parsed.CountyId : undefined,
        CheckInDate: data.CheckInDate?.toISOString(),
        CheckOutDate: data.CheckOutDate?.toISOString(),
        Guests: data.Guests,
        pageNumber: 1,
        pageSize: 10,
      };

      if (
        !storageData.CityId &&
        !storageData.StateId &&
        !storageData.CountryId &&
        !storageData.CountyId
      ) {
        storageData.CityName = defaultLocation.CityName;
        storageData.typeDesc = defaultLocation.typeDesc;
        storageData.CityId = defaultLocation.CityId;
      }
    } else {
      storageData = {
        CityName: defaultLocation.CityName,
        typeDesc: defaultLocation.typeDesc,
        CityId: defaultLocation.CityId,
        CheckInDate: data.CheckInDate?.toISOString(),
        CheckOutDate: data.CheckOutDate?.toISOString(),
        Guests: data.Guests,
        pageNumber: 1,
        pageSize: 10,
      };
    }

    localStorage.setItem('search-form-storage', JSON.stringify(storageData));
  };

  useEffect(() => {
    setValue('Guests', guests);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('adults', guests.adults.toString());
        next.set('children', guests.children.toString());
        next.set('infants', guests.infants.toString());
        next.set('pets', guests.pets.toString());
        return next;
      },
      { replace: true }
    );
    updateLocalStorage({
      CityName: selectedCityObject?.name,
      typeDesc: selectedCityObject?.typeDesc,
      CityId: selectedCityObject?.typeDesc === 'city' ? selectedCityObject.entityId : undefined,
      StateId: selectedCityObject?.typeDesc === 'state' ? selectedCityObject.entityId : undefined,
      CountryId:
        selectedCityObject?.typeDesc === 'country' ? selectedCityObject.entityId : undefined,
      CountyId: selectedCityObject?.typeDesc === 'county' ? selectedCityObject.entityId : undefined,
      CheckInDate: selectionRange.startDate || today,
      CheckOutDate: selectionRange.endDate || sevenDaysFromNow,
      Guests: guests,
    });
  }, [guests, setValue]);

  useEffect(() => {
    setValue('CheckInDate', selectionRange.startDate);
    setValue('CheckOutDate', selectionRange.endDate);
    if (selectionRange.startDate && selectionRange.endDate) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('checkIn', format(selectionRange.startDate!, 'yyyy-MM-dd'));
          next.set('checkOut', format(selectionRange.endDate!, 'yyyy-MM-dd'));
          return next;
        },
        { replace: true }
      );
    }
    updateLocalStorage({
      CityName: selectedCityObject?.name,
      typeDesc: selectedCityObject?.typeDesc,
      CityId: selectedCityObject?.typeDesc === 'city' ? selectedCityObject.entityId : undefined,
      StateId: selectedCityObject?.typeDesc === 'state' ? selectedCityObject.entityId : undefined,
      CountryId:
        selectedCityObject?.typeDesc === 'country' ? selectedCityObject.entityId : undefined,
      CountyId: selectedCityObject?.typeDesc === 'county' ? selectedCityObject.entityId : undefined,
      CheckInDate: selectionRange.startDate || today,
      CheckOutDate: selectionRange.endDate || sevenDaysFromNow,
      Guests: guests,
    });
  }, [selectionRange, setValue]);

  useEffect(() => {
    if (autoOpenDate && checkInRef.current) {
      setAutoOpenDate(false);
      setTimeout(() => {
        setGuestAnchorEl(null);
        setDateAnchorEl(checkInRef.current);
      }, 140);
    }
  }, [autoOpenDate]);

  useEffect(() => {
    if (autoOpenGuests && guestsRef.current) {
      setAutoOpenGuests(false);
      setGuestAnchorEl(guestsRef.current);
      setDateAnchorEl(null);
    }
  }, [autoOpenGuests]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestPopoverRef.current &&
        !guestPopoverRef.current.contains(event.target as Node) &&
        guestsRef.current &&
        !guestsRef.current.contains(event.target as Node)
      ) {
        setGuestAnchorEl(null);
      }
    };

    if (openGuestsPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openGuestsPopover]);

  const handleGuestClick = () => {
    setGuestAnchorEl(guestsRef.current);
    setDateAnchorEl(null);
  };

  const handleGuestChange = (key: keyof Guests, delta: number) => {
    setGuests((prev) => {
      let updated = { ...prev };

      // Bloquear incremento de adultos o niños si ya se alcanzó maxGuests
      if (
        (key === 'adults' || key === 'children') &&
        delta > 0 &&
        prev.adults + prev.children >= maxGuests
      ) {
        showNotification(
          'warning',
          'Reserva',
          `Esta propiedad tiene una capacidad máxima de ${maxGuests > 1 ? maxGuests + ' huéspedes' : maxGuests + ' huésped'}`
        );
        return prev;
      }

      if (key === 'pets' && delta > 0 && maxPets !== null && prev.pets >= parseInt(maxPets)) {
        showNotification(
          'warning',
          'Reserva',
          `El número máximo de mascotas es ${parseInt(maxPets) > 1 ? parseInt(maxPets) + ' mascotas' : parseInt(maxPets) + ' mascota'}`
        );
        return prev;
      }

      // Calcular nuevo valor
      const newValue = Math.max(0, prev[key] + delta);
      updated[key] = newValue;

      // === LÓGICA AIRBNB ===
      const hasDependents = updated.children > 0 || updated.infants > 0 || updated.pets > 0;

      if (hasDependents && updated.adults === 0) {
        // Regla 2: Si hay dependientes → forzar mínimo 1 adulto
        updated.adults = 1;
      }

      return updated;
    });
  };

  const formatDate = (date: Date | null | undefined, forDisplay: boolean = false) => {
    if (!date || isNaN(date.getTime())) return '';
    return forDisplay ? format(date, 'dd MMM yyyy', { locale: es }) : format(date, 'yyyy-MM-dd');
  };

  const handleDateRangeClose = () => {
    setDateAnchorEl(null);
    if (selectionRange.endDate) {
      setTimeout(() => setAutoOpenGuests(true), 0);
    }
  };

  const handleBook = () => {
    if (!isGuestAuthenticated) {
      setIsModalLogin(true);
      setLoginType('login');
    } else {
      //
      PriceCalculationCard(
        {
          startDate: selectionRange.startDate,
          endDate: selectionRange.endDate,
          guests: guests.adults + guests.children,
          existChilds: guests.children > 0,
          existPets: guests.pets > 0,
          adtCount: guests.adults,
          chdCount: guests.children,
          infCount: guests.infants,
          petCount: guests.pets,
        },
        {
          onSuccess: async (data) => {
            const { statusCode, resultError, data: responseData } = data;
            if (statusCode == '200') {
              setDataCalcPriceCard(responseData);
              setShowDetail(true);
              changeDisponibility(true);
              updateLocalStorage({
                CityName: selectedCityObject?.name,
                typeDesc: selectedCityObject?.typeDesc,
                CityId:
                  selectedCityObject?.typeDesc === 'city' ? selectedCityObject.entityId : undefined,
                StateId:
                  selectedCityObject?.typeDesc === 'state'
                    ? selectedCityObject.entityId
                    : undefined,
                CountryId:
                  selectedCityObject?.typeDesc === 'country'
                    ? selectedCityObject.entityId
                    : undefined,
                CountyId:
                  selectedCityObject?.typeDesc === 'county'
                    ? selectedCityObject.entityId
                    : undefined,
                CheckInDate: selectionRange.startDate || today,
                CheckOutDate: selectionRange.endDate || sevenDaysFromNow,
                Guests: guests,
              });
            } else {
              showNotification(
                'info',
                'Reserva',
                resultError?.message || 'Error al calcular el precio'
              );
            }
          },
          onError: async (error) => {
            showNotification('error', 'Reserva', error?.message || 'Error al calcular el precio');
          },
        }
      );
    }
  };

  const handleReserveNow = () => {
    const params = new URLSearchParams(searchParams);
    params.set('adults', guests.adults.toString());
    params.set('children', guests.children.toString());
    params.set('infants', guests.infants.toString());
    params.set('pets', guests.pets.toString());
    params.set('adtCount', guests.adults.toString());
    params.set('chdCount', guests.children.toString());
    params.set('infCount', guests.infants.toString());
    params.set('petsCount', guests.pets.toString());
    navigate(`/messages/host/${listingRentId}/false?${params.toString()}`);
  };

  const onSubmit = (formData: SearchFormData) => {
    if (!formData.CityId && !formData.StateId && !formData.CountryId && !formData.CountyId) {
      console.error('Por favor, selecciona una ubicación antes de buscar.');
      return;
    }

    const params = new URLSearchParams();
    if (formData.CityId) params.set('CityId', formData.CityId.toString());
    if (formData.StateId) params.set('StateId', formData.StateId.toString());
    if (formData.CountryId) params.set('CountryId', formData.CountryId.toString());
    if (formData.CountyId) params.set('CountyId', formData.CountyId.toString());
    if (formData.CheckInDate) params.set('checkIn', formatDate(formData.CheckInDate, false));
    if (formData.CheckOutDate) params.set('checkOut', formatDate(formData.CheckOutDate, false));
    const totalGuests = formData.Guests.adults + formData.Guests.children;
    if (totalGuests > 0) params.set('guests', totalGuests.toString());

    updateLocalStorage(formData);
    changeDisponibility(!disponibility);
    navigate(`/booking?${params.toString()}`);
  };

  const totalGuests = guests.adults + guests.children;
  const dataCalcPriceCard = priceCalculationCardStore((state) => state.dataCalcPriceCard);

  const breakdownArray = JSON.parse(dataCalcPriceCard?.breakdownInfo || '[]');
  const arrayDataCalcPriceCard = Object.values(
    breakdownArray.reduce((acumulador: Record<string, any>, item: any) => {
      // Creamos la clave única
      if (item.Type === 'PLATFORM_HOST_FEE') return acumulador;
      const clave = `${item.Type}|${item.Description}`;

      if (!acumulador[clave]) {
        // Si es la primera vez que vemos este grupo, lo guardamos
        acumulador[clave] = { ...item, subItems: [item] };
      } else {
        // Si ya existe, solo sumamos el monto y acumulamos sub-items
        acumulador[clave].Amount += item.Amount;
        acumulador[clave].subItems.push(item);
      }

      return acumulador;
    }, {})
  );

  // Asumiendo que obtienes estos colores de tu theme o props
  const brandColor = theme.palette.primary.main; // O el color de tu marca
  // Color del borde sutil basado en el brandColor
  const subtleBorderColor = alpha(brandColor, 0.25);
  // Color de fondo sutil al hacer hover
  const hoverBgColor = alpha(brandColor, 0.04);

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      position={{ xs: 'fixed', md: 'sticky' }}
      bottom={{ xs: 0, md: 'auto' }}
      top={{ xs: 'auto', md: 88 }}
      left={{ xs: 0, md: 'auto' }}
      right={{ xs: 0, md: 'auto' }}
      width={{ xs: '100%', md: 'auto' }}
      sx={{
        zIndex: { xs: 1200, md: 10 },
        px: { xs: 0, md: 0 },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Card
        elevation={0}
        sx={{
          p: { xs: isExpanded ? 3 : 1.5, md: 4 },
          borderRadius: { xs: isExpanded ? '16px 16px 0 0' : '16px 16px 0 0', md: '24px' },
          border: { xs: 'none', md: `1px solid ${alpha(brandColor, 0.15)}` },
          width: { xs: '100%', md: '95%' },
          boxShadow: {
            xs: '0px -4px 16px rgba(0, 0, 0, 0.1)',
            md: '0px 8px 24px rgba(0, 0, 0, 0.08)',
          },
          maxHeight: { xs: isExpanded ? '80vh' : 'auto', md: 'auto' },
          overflow: { xs: isExpanded ? 'auto' : 'visible', md: 'visible' },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            {/* Vista compacta para móvil (colapsado) */}
            {!isExpanded && isMobile && (
              <Box
                onClick={() => setIsExpanded(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 0.5,
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {dataCalcPriceCard?.currencyCode ? (
                        <span>{`${pricePerNight} ${dataCalcPriceCard.currencyCode}/noche`}</span>
                      ) : (
                        <>
                          <span
                            style={{ fontSize: '1.5rem', fontWeight: 700 }}
                          >{`${pricePerNight} BOB`}</span>
                          <span style={{ fontSize: '1rem', color: '#64748b' }}>{`/noche`}</span>
                        </>
                      )}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <StarIcon sx={{ color: theme.palette.primary.main, fontSize: '16px' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {rating}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <ExpandMoreIcon
                  sx={{ fontSize: 28, color: 'text.secondary', transform: 'rotate(180deg)' }}
                />
              </Box>
            )}

            {/* Vista completa (desktop siempre, móvil solo cuando expandido) */}
            <Box sx={{ display: { xs: isExpanded ? 'block' : 'none', md: 'block' } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {dataCalcPriceCard?.currencyCode ? (
                        <span>{`${pricePerNight} ${dataCalcPriceCard.currencyCode}/${t('searchMenu.night')}`}</span>
                      ) : (
                        <>
                          <span
                            style={{ fontSize: '1.5rem', fontWeight: 700 }}
                          >{`${pricePerNight} BOB`}</span>
                          <span
                            style={{ fontSize: '1rem', color: '#64748b' }}
                          >{`/${t('searchMenu.night')}`}</span>
                        </>
                      )}
                    </Typography>
                  </Box>
                  <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                    <StarIcon sx={{ color: theme.palette.primary.main, fontSize: '20px' }} />
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>
                      {rating}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  {/* AVATAR REINCORPORADO */}
                  <Avatar
                    src={avatarUrl}
                    alt={''}
                    sx={{
                      width: 52,
                      height: 52,
                      border: `2px solid ${alpha(brandColor, 0.2)}`,
                    }}
                  />
                  {isMobile && isExpanded && (
                    <ExpandMoreIcon
                      onClick={() => setIsExpanded(false)}
                      sx={{
                        fontSize: 28,
                        color: 'text.secondary',
                        cursor: 'pointer',
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* --- INPUTS UNIDOS (Los 3 rectángulos) --- */}
              <Box
                sx={{
                  border: `1px solid ${subtleBorderColor}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  mb: 3,
                }}
              >
                {/* Fila Superior: Fechas */}
                <Box display="flex" sx={{ height: '100%' }}>
                  {/* CHECK-IN */}
                  <Box
                    ref={checkInRef}
                    onClick={() => {
                      setGuestAnchorEl(null);
                      setDateAnchorEl(checkInRef.current);
                      setShowDetail(false);
                    }}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: hoverBgColor },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <IoCalendarOutline size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('searchMenu.arrive')}
                      </Typography>
                    </Box>
                    <Controller
                      name="CheckInDate"
                      control={control}
                      render={({ field }) => (
                        <Typography
                          sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem', pl: '24px' }}
                        >
                          {field.value ? formatDate(selectionRange.startDate, true) : 'Seleccionar'}
                        </Typography>
                      )}
                    />
                  </Box>

                  {/* Divisor Vertical */}
                  <Box sx={{ width: '1px', bgcolor: subtleBorderColor }} />

                  {/* CHECK-OUT */}
                  <Box
                    ref={checkOutRef}
                    onClick={() => {
                      setGuestAnchorEl(null);
                      setDateAnchorEl(checkOutRef.current);
                      setShowDetail(false);
                    }}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: hoverBgColor },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <IoCalendarOutline size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('searchMenu.departure')}
                      </Typography>
                    </Box>
                    <Controller
                      name="CheckOutDate"
                      control={control}
                      render={({ field }) => (
                        <Typography
                          sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem', pl: '24px' }}
                        >
                          {field.value ? formatDate(selectionRange.endDate, true) : 'Seleccionar'}
                        </Typography>
                      )}
                    />
                  </Box>
                </Box>

                {/* Divisor Horizontal */}
                <Divider sx={{ borderColor: subtleBorderColor }} />

                {/* Fila Inferior: Huéspedes */}
                <Box
                  ref={guestsRef}
                  onClick={handleGuestClick}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: hoverBgColor },
                  }}
                >
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <BiUser size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('searchMenu.guests')}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem', pl: '24px' }}
                    >
                      {/* Lógica simplificada para visualización */}
                      {(() => {
                        const summary =
                          totalGuests > 0
                            ? `${totalGuests} huésped${totalGuests !== 1 ? 'es' : ''}` +
                              (guests.infants > 0
                                ? `, ${guests.infants} bebé${guests.infants !== 1 ? 's' : ''}`
                                : '') +
                              (guests.pets > 0
                                ? `, ${guests.pets} mascota${guests.pets !== 1 ? 's' : ''}`
                                : '')
                            : t('searchMenu.textGuests');
                        return summary;
                      })()}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* --- DETALLES DE PRECIO (Expandible) --- */}
              {showDetail && dataCalcPriceCard?.guestResume && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 3 }}>
                  {/* ── Hospedaje ── */}
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1.5,
                      display: 'block',
                    }}
                  >
                    Hospedaje
                  </Typography>

                  {(() => {
                    const acc = dataCalcPriceCard.guestResume.accommodation;
                    const weekendNights = acc?.weekend_NightsCount ?? 0;
                    const weekdayNights = (acc?.nightsCount ?? 0) - weekendNights;

                    // Items del breakdownInfo con desglose por fecha (día a día)
                    const itemsWithDates = (arrayDataCalcPriceCard as any[]).filter((item: any) =>
                      item.subItems?.some((s: any) => !!s?.Date)
                    );
                    const weekdayAccItem: any = itemsWithDates[0] ?? null;
                    const weekendAccItem: any = itemsWithDates[1] ?? null;

                    // Helper reutilizable para filas con tooltip de desglose
                    const renderAccRow = (
                      label: string,
                      amount: number | undefined,
                      breakdownItem: any,
                      rowKey: number
                    ) => {
                      const count = breakdownItem?.subItems?.length ?? 0;
                      const showTooltip = count > 1;

                      const labelNode = (
                        <Typography
                          component="span"
                          variant="body2"
                          color="#64748b"
                          sx={
                            showTooltip
                              ? { cursor: 'help', textDecoration: 'underline dotted' }
                              : {}
                          }
                        >
                          {label}
                        </Typography>
                      );

                      const mobilePanel = showTooltip && (
                        <Box
                          sx={{
                            mt: 1,
                            mb: 0.5,
                            bgcolor: '#1e293b',
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              px: 2,
                              py: 0.75,
                              bgcolor: 'rgba(255,255,255,0.06)',
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.6px',
                              }}
                            >
                              {breakdownItem?.Description ?? ''}
                            </Typography>
                          </Box>
                          <Box sx={{ px: 2, py: 1 }}>
                            {breakdownItem?.subItems.map((sub: any, i: number) => (
                              <Box
                                key={i}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                                sx={{
                                  py: 0.5,
                                  borderBottom:
                                    i < breakdownItem.subItems.length - 1
                                      ? '1px solid rgba(255,255,255,0.06)'
                                      : 'none',
                                }}
                              >
                                <Typography sx={{ fontSize: '0.78rem', color: '#cbd5e1', flex: 1 }}>
                                  {sub?.Date
                                    ? sub.Date.split('T')[0].split('-').reverse().join('-')
                                    : (sub?.Description ?? '')}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#f1f5f9',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {sub?.Amount?.toFixed(2)} {dataCalcPriceCard?.currencyCode}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      );

                      return (
                        <Box key={rowKey} mb={1.5}>
                          <Box display="flex" justifyContent="space-between">
                            {showTooltip ? (
                              isMobile ? (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="#64748b"
                                  sx={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                                  onClick={() =>
                                    setOpenBreakdownIndex(
                                      openBreakdownIndex === rowKey ? null : rowKey
                                    )
                                  }
                                >
                                  {label}
                                </Typography>
                              ) : (
                                <Tooltip
                                  placement="left"
                                  arrow
                                  slotProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: '#1e293b',
                                        color: '#f8fafc',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                        p: 0,
                                        minWidth: 220,
                                        maxWidth: 280,
                                        overflow: 'hidden',
                                      },
                                    },
                                    arrow: { sx: { color: '#1e293b' } },
                                  }}
                                  title={
                                    <Box>
                                      <Box
                                        sx={{
                                          px: 2,
                                          py: 1,
                                          bgcolor: 'rgba(255,255,255,0.06)',
                                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: '#94a3b8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.6px',
                                          }}
                                        >
                                          {breakdownItem?.Description ?? ''}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ px: 2, py: 1.5 }}>
                                        {breakdownItem?.subItems.map((sub: any, i: number) => (
                                          <Box
                                            key={i}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            gap={3}
                                            sx={{
                                              py: 0.5,
                                              borderBottom:
                                                i < breakdownItem.subItems.length - 1
                                                  ? '1px solid rgba(255,255,255,0.06)'
                                                  : 'none',
                                            }}
                                          >
                                            <Typography
                                              sx={{ fontSize: '0.8rem', color: '#cbd5e1', flex: 1 }}
                                            >
                                              {sub?.Date
                                                ? sub.Date.split('T')[0]
                                                    .split('-')
                                                    .reverse()
                                                    .join('-')
                                                : (sub?.Description ?? '')}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                color: '#f1f5f9',
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              {sub?.Amount?.toFixed(2)}{' '}
                                              {dataCalcPriceCard?.currencyCode}
                                            </Typography>
                                          </Box>
                                        ))}
                                      </Box>
                                    </Box>
                                  }
                                >
                                  {labelNode}
                                </Tooltip>
                              )
                            ) : (
                              labelNode
                            )}
                            <Typography variant="body2" fontWeight={600} color="#334155">
                              {amount?.toFixed(2)} {dataCalcPriceCard.guestResume.currencyCode}
                            </Typography>
                          </Box>
                          {isMobile && openBreakdownIndex === rowKey && mobilePanel}
                        </Box>
                      );
                    };

                    return (
                      <>
                        {/* Precio por noche (días de semana) */}
                        {renderAccRow(
                          `Precio por noche (×${weekdayNights})`,
                          acc?.baseAmount,
                          weekdayAccItem,
                          0
                        )}

                        {/* Precio fin de semana (solo si existen noches de fin de semana) */}
                        {weekendNights > 0 &&
                          renderAccRow(
                            `Precio fin de semana (×${weekendNights})`,
                            acc?.weekend_BaseAmount,
                            weekendAccItem,
                            1
                          )}

                        {/* Descuento aplicado */}
                        {(acc?.appliedDiscount ?? 0) > 0 && (
                          <Box display="flex" justifyContent="space-between" mb={1.5}>
                            <Typography variant="body2" color="#64748b">
                              Descuento aplicado
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="#334155">
                              -{acc?.appliedDiscount?.toFixed(2)}{' '}
                              {dataCalcPriceCard.guestResume.currencyCode}
                            </Typography>
                          </Box>
                        )}

                        {/* discountedAmount — siempre visible */}
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            {(acc?.appliedDiscount ?? 0) > 0
                              ? 'Hospedaje con descuento'
                              : 'Total alojamiento'}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {acc?.discountedAmount?.toFixed(2)}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      </>
                    );
                  })()}

                  {/* ── Cargos adicionales ── */}
                  {((dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee ?? 0) > 0 ||
                    (dataCalcPriceCard.guestResume.additionalCharges?.petFee ?? 0) > 0 ||
                    (dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee ?? 0) > 0 ||
                    (dataCalcPriceCard.guestResume.additionalCharges?.otherFees ?? 0) > 0) && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mt: 2,
                          mb: 1.5,
                          display: 'block',
                        }}
                      >
                        Cargos adicionales
                      </Typography>

                      {(dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee ?? 0) >
                        0 && (
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            Huéspedes extra
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee?.toFixed(
                              2
                            )}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}

                      {(dataCalcPriceCard.guestResume.additionalCharges?.petFee ?? 0) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            Mascota
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {dataCalcPriceCard.guestResume.additionalCharges?.petFee?.toFixed(2)}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}

                      {(dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee ?? 0) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            Limpieza
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee?.toFixed(
                              2
                            )}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}

                      {(dataCalcPriceCard.guestResume.additionalCharges?.otherFees ?? 0) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            Otros cargos
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {dataCalcPriceCard.guestResume.additionalCharges?.otherFees?.toFixed(2)}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  {/* ── Contenedor: Subtotal + Comisión + Total ── */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: alpha(brandColor, 0.06),
                      borderRadius: 2,
                      border: `1px solid ${alpha(brandColor, 0.15)}`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="#475569">
                        Subtotal:
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {dataCalcPriceCard.guestResume.subtotal?.toFixed(2)}{' '}
                        {dataCalcPriceCard.guestResume.currencyCode}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                      <Typography variant="body2" color="#475569">
                        {`Comisión JOM anfitrión ${dataCalcPriceCard.guestResume.guestCommissionPercent ?? 15}%:`}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {dataCalcPriceCard.guestResume.guestCommission?.toFixed(2)}{' '}
                        {dataCalcPriceCard.guestResume.currencyCode}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: alpha(brandColor, 0.2), mb: 1.5 }} />

                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight={800} color="#0f172a">
                        Total:
                      </Typography>
                      <Typography fontWeight={800} color="#0f172a">
                        {dataCalcPriceCard.guestResume.total?.toFixed(2)}{' '}
                        {dataCalcPriceCard.guestResume.currencyCode}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* --- BOTÓN DE ACCIÓN PRINCIPAL (Estilo solicitado) --- */}
              {!showDetail ? (
                <Button
                  variant="primary"
                  onClick={handleBook}
                  fullWidth
                  disabled={isPendingCalculationCard}
                >
                  {isPendingCalculationCard ? (
                    <CircularProgress size={24} sx={{ color: 'background.paper' }} />
                  ) : (
                    t('bookingCard.buttonDisponibility2')
                  )}
                </Button>
              ) : (
                <Button variant="primary" fullWidth onClick={handleReserveNow}>
                  Reservar ahora
                </Button>
              )}
            </Box>
          </CardContent>
        </form>
        {/* Guests Popover */}
        <Popover
          open={openGuestsPopover}
          anchorEl={guestAnchorEl}
          onClose={() => {
            setGuestAnchorEl(null);
            // setActiveSection(null);
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            mt: 2,
            '& .MuiPopover-paper': {
              borderRadius: 3,
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              width: 400,
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Adults */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Box width={'100%'}>
                <Typography sx={{ fontSize: theme.typography.paragraph1Medium, color: '#000000' }}>
                  {t('searchMenu.adults')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.paragraph1SRegular,
                    color: 'gray',
                  }}
                >
                  {t('searchMenu.ageAdults')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('adults', -1)}
                  disabled={guests.adults === 0}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.adults}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('adults', 1)}
                  disabled={
                    guests.adults + guests.children == 0
                      ? false
                      : guests.adults + guests.children >= maxGuests
                  }
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Children */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Box>
                <Typography sx={{ fontSize: theme.typography.paragraph1Medium, color: '#000000' }}>
                  {t('searchMenu.children')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.paragraph1SRegular,
                    color: 'gray',
                  }}
                >
                  {t('searchMenu.ageChildren')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('children', -1)}
                  disabled={guests.children === 0}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.children}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('children', 1)}
                  disabled={guests.adults + guests.children >= maxGuests}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Infants */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Box>
                <Typography sx={{ fontSize: theme.typography.paragraph1Medium, color: '#000000' }}>
                  {t('searchMenu.babies')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.paragraph1SRegular,
                    color: 'gray',
                  }}
                >
                  {t('searchMenu.ageBaby')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('infants', -1)}
                  disabled={guests.infants === 0}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.infants}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('infants', 1)}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Pets */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontSize: theme.typography.paragraph1Medium, color: '#000000' }}>
                  {t('searchMenu.pets')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.paragraph1SRegular,
                    color: 'gray',
                  }}
                >
                  {t('searchMenu.textPets')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('pets', -1)}
                  disabled={guests.pets === 0}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.pets}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('pets', 1)}
                  disabled={maxPets !== null && guests.pets >= parseInt(maxPets)}
                  // sx comentado removido
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
            {/* Close button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="secondary" onClick={() => setGuestAnchorEl(null)}>
                Cerrar
              </Button>
            </Box>
          </Box>
        </Popover>
        <Popover
          open={openDatePopover}
          anchorEl={dateAnchorEl}
          onClose={handleDateRangeClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              borderRadius: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px',
              p: 2,
              width: { xs: '100%', md: 'auto' },
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <DateRange
              className="custom-date-range"
              ranges={[selectionRange]}
              onChange={onSelect}
              months={2}
              direction={isMobile ? 'vertical' : 'horizontal'}
              rangeColors={[theme.palette.customColors.primary[1]]}
              showDateDisplay={false}
              locale={es}
              minDate={new Date()}
              editableDateInputs={false}
              disabledDay={(date) =>
                disabledDates.some(
                  (d: Date) =>
                    date.getFullYear() === d.getFullYear() &&
                    date.getMonth() === d.getMonth() &&
                    date.getDate() === d.getDate()
                )
              }
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                px: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  onClick={onClear}
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#222',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#000',
                    },
                  }}
                >
                  {t('searchMenu.clearDate')}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="primary"
                  onClick={handleDateRangeClose}
                  sx={{ textTransform: 'none', minWidth: 120 }}
                >
                  {t('bookingCard.buttonClose')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Popover>
      </Card>
      <SignInForm open={isModalLogin} onClose={handleCloseModal} typeLogin={loginType} />
    </Box>
  );
};

export default BookingDisponibilityCard;
