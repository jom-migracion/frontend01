import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useTranslation } from 'react-i18next';
import { BiUser } from 'react-icons/bi';
import { IoCalendarOutline } from 'react-icons/io5';

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface BookingCalendarProps {
  selectionRange: Range;
  onChange: (ranges: RangeKeyDict) => void;
  guests: Guests;
  onGuestsChange: (guests: Guests) => void;
  disabledDates?: Date[];
}

const BookingCalendar = ({ selectionRange, guests }: BookingCalendarProps) => {
  const { t /*, i18n*/ } = useTranslation();
  const theme = useTheme();
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const guestPopoverRef = useRef<HTMLDivElement>(null);
  const openGuestsPopover = Boolean(guestAnchorEl);

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

  //const currentLocale = i18n.language.startsWith('es') ? es : enUS;

  const formatDate = (date: Date | null | undefined, forDisplay: boolean = false) => {
    if (!date || isNaN(date.getTime())) return '';
    return forDisplay ? format(date, 'dd MMM yyyy', { locale: es }) : format(date, 'yyyy-MM-dd');
  };

  const totalGuests = guests.adults + guests.children;

  // Función para formatear el texto de los huéspedes de forma dinámica y limpia
  const getGuestText = () => {
    if (totalGuests === 0) return t('BookingCalendar.noGuests');

    const parts = [];
    parts.push(t('BookingCalendar.guest', { count: totalGuests }));
    if (guests.infants > 0) parts.push(t('BookingCalendar.infant', { count: guests.infants }));
    if (guests.pets > 0) parts.push(t('BookingCalendar.pet', { count: guests.pets }));

    return parts.join(', ');
  };

  return (
    <Box display="flex" justifyContent="flex-end" position="sticky" top={70}>
      <Box>
        <Box display="flex" gap={0} mb={0}>
          <Box
            ref={checkInRef}
            borderTop={'1px solid gray'}
            borderLeft={'1px solid gray'}
            borderRight={'1px solid gray'}
            borderBottom={'1px solid gray'}
            borderRadius={'20px 0px 0px 0px'}
            p={1.5}
            flex={1}
            sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              <IoCalendarOutline size={24} />
              <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
                {t('BookingCalendar.checkIn')}
              </Typography>
            </Box>
            <TextField
              variant="standard"
              value={formatDate(selectionRange.startDate, true)}
              placeholder={t('BookingCalendar.checkInPlaceholder')}
              fullWidth
              sx={{
                ...dateTextFieldStyles,
                '& .MuiInputBase-root': {
                  ...dateTextFieldStyles['& .MuiInputBase-root'],
                  cursor: 'default',
                },
                '& .MuiInputBase-input': {
                  ...dateTextFieldStyles['& .MuiInputBase-input'],
                  cursor: 'default',
                },
              }}
              slotProps={{ input: { disableUnderline: true, readOnly: true } }}
              disabled
            />
          </Box>
          <Box
            ref={checkOutRef}
            borderTop={'1px solid gray'}
            borderLeft={'none'}
            borderRight={'1px solid gray'}
            borderBottom={'1px solid gray'}
            borderRadius={'0px 20px 0px 0px'}
            p={1.5}
            flex={1}
            sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              <IoCalendarOutline size={24} />
              <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
                {t('BookingCalendar.checkOut')}
              </Typography>
            </Box>
            <TextField
              variant="standard"
              value={formatDate(selectionRange.endDate, true)}
              placeholder={t('BookingCalendar.checkOutPlaceholder')}
              fullWidth
              sx={{
                ...dateTextFieldStyles,
                '& .MuiInputBase-root': {
                  ...dateTextFieldStyles['& .MuiInputBase-root'],
                  cursor: 'default',
                },
                '& .MuiInputBase-input': {
                  ...dateTextFieldStyles['& .MuiInputBase-input'],
                  cursor: 'default',
                },
              }}
              slotProps={{ input: { disableUnderline: true, readOnly: true } }}
              disabled
            />
          </Box>
        </Box>

        {/* Guests */}
        <Box
          ref={guestsRef}
          borderTop={'none'}
          borderLeft={'1px solid gray'}
          borderRight={'1px solid gray'}
          borderBottom={'1px solid gray'}
          borderRadius={'0px 0px 20px 20px'}
          p={1.5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            width: '100%',
            cursor: 'default',
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5} pl={1}>
            <BiUser size={24} />
            <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
              {t('BookingCalendar.guestsTitle')}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: theme.typography.paragraph1Regular,
              color: theme.palette.customColors.lights[5],
              pl: 5,
            }}
          >
            {getGuestText()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const dateTextFieldStyles = {
  '& .MuiInputBase-root': {
    color: '#000',
    paddingRight: 0,
    '&:hover:not(.Mui-disabled):before, &:before, &:after': {
      borderBottom: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '4px 0 4px 40px',
    color: '#000',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    '&::placeholder': {
      fontFamily: 'inherit',
      color: '#000',
      opacity: 1,
    },
  },
};

export default BookingCalendar;
