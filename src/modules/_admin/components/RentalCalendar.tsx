import React, { useState, useRef, useMemo } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react'; // Importa el tipo correcto de MouseEvent de 'react' y le damos un alias para mejorar.
import {
  Box,
  Button,
  Typography,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  format,
  subWeeks,
  addWeeks,
  startOfWeek,
  eachDayOfInterval,
  subDays,
  addDays,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useListingsRent } from '@/modules/_admin/hooks/useOwnerProperties';
import { useMockRentals } from '@/modules/_admin/hooks/useMockRentals';
import Listing from '@/models/interfaces/Listing';
import CloseIcon from '@mui/icons-material/Close';
import AssertModal from '@/components/AssertModal';

const normalizeValue = (value: any): string => {
  return value === null || value === undefined || value === '' ? 'none' : value;
};

const normalizeListing = (listing: Listing): Listing => ({
  ...listing,
  name: normalizeValue(listing.name),
  property: {
    ...listing.property,
    city: normalizeValue(listing.property?.city),
    country: normalizeValue(listing.property?.country),
  },
  photos:
    listing.photos?.length > 0
      ? listing.photos.map((p) => ({ ...p, url: normalizeValue(p.url) }))
      : [{ url: 'none' }],
});

const RentalCalendar: React.FC = () => {
  const { data, isError, error } = useListingsRent(true);
  const rentalsByListing = useMockRentals();

  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenuData, setContextMenuData] = useState<{
    listingId: number;
    dateStr: string;
  } | null>(null);
  const [openAboutSpace, setOpenAboutSpace] = useState(false);

  const goToPreviousWeek = () => setCurrentWeek((prev) => subWeeks(prev, 1));
  const goToNextWeek = () => setCurrentWeek((prev) => addWeeks(prev, 1));
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const calendarStart = subDays(weekStart, 3);
  const calendarEnd = addDays(weekStart, 90);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  if (!data) return <CircularProgress />;
  if (isError) return <Typography color="error">{error?.message}</Typography>;

  const listings = useMemo(() => data.data.map(normalizeListing), [data]);
  console.log('listings-1', listings);
  const alojamientosFiltrados = Array.isArray(listings)
    ? listings.filter((item: any) => item.listingStatusId === 3)
    : [];
  console.log('listings-2', alojamientosFiltrados);
  const filteredListings = alojamientosFiltrados.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log('filteredListings', filteredListings);
  // const monthNames = Array.from(new Set(days.map((d) => format(d, 'MMMM yyyy', { locale: es }).toUpperCase())));

  const handleDateSelection = (listingId: number, dateStr: string, isDisabled: boolean) => {
    if (isDisabled) return;
    if (selectedListingId !== listingId) {
      setSelectedListingId(listingId);
      setSelectedDates([dateStr]);
    } else {
      if (selectedDates.includes(dateStr)) {
        setSelectedDates((prev) => prev.filter((d) => d !== dateStr));
      } else {
        setSelectedDates((prev) => [...prev, dateStr].sort());
      }
    }
  };

  // --- Función para abrir el menú contextual con anclaje a un elemento ---
  const handleContextMenu = (
    event: ReactMouseEvent<HTMLDivElement>, // Usa el tipo correcto de MouseEvent de React
    listingId: number,
    dateStr: string,
    isSelected: boolean
  ) => {
    event.preventDefault(); // Evita el menú contextual por defecto del navegador

    if (isSelected) {
      setAnchorEl(event.currentTarget); // El currentTarget es el elemento <Box> sobre el que se hizo clic
      setContextMenuData({ listingId, dateStr });
    }
  };

  // --- Función para cerrar el menú contextual ---
  const handleCloseContextMenu = () => {
    setAnchorEl(null);
    setContextMenuData(null);
  };

  // --- Función para manejar las acciones del menú ---
  const handleMenuItemClick = (action: string) => {
    if (contextMenuData) {
      console.log(
        `Acción: ${action} para Alojamiento ID: ${contextMenuData.listingId}, Fecha: ${contextMenuData.dateStr}`
      );
      // Aquí puedes añadir la lógica para cada acción, usando contextMenuData
      if (action === 'Bloquear Fecha') {
        alert(
          `Bloqueando fecha ${contextMenuData.dateStr} para el alojamiento ${contextMenuData.listingId}`
        );
        setOpenAboutSpace(true);
      } else if (action === 'Desbloquear Fecha') {
        alert(
          `Desbloqueando fecha ${contextMenuData.dateStr} para el alojamiento ${contextMenuData.listingId}`
        );
      } else if (action === 'Editar Renta') {
        alert(
          `Editando renta para la fecha ${contextMenuData.dateStr} del alojamiento ${contextMenuData.listingId}`
        );
      }
    }
    handleCloseContextMenu();
  };

  return (
    <>
      <Box p={2} position="relative">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            {''}
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={goToPreviousWeek}>
              Semana anterior
            </Button>
            <Button variant="outlined" onClick={goToNextWeek}>
              Semana siguiente
            </Button>
          </Box>
        </Box>

        <IconButton
          onClick={scrollLeft}
          sx={{
            position: 'absolute',
            left: 320,
            top: '45%',
            zIndex: 5,
            backgroundColor: 'white',
            boxShadow: 1,
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={scrollRight}
          sx={{
            position: 'absolute',
            right: 20,
            top: '45%',
            zIndex: 5,
            backgroundColor: 'white',
            boxShadow: 1,
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        <Box display="flex">
          <Box
            sx={{
              width: 300,
              minWidth: 300,
              position: 'sticky',
              left: 0,
              zIndex: 3,
              backgroundColor: 'white',
              borderRight: '1px solid #ccc',
            }}
          >
            <Box
              p={1}
              borderBottom="1px solid #ccc"
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ minHeight: 90 }}
            >
              <TextField
                size="small"
                placeholder="Buscar propiedad"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                variant="standard"
                fullWidth
                sx={{
                  '& .MuiInput-underline:before': { borderBottom: '1px solid #ccc' },
                  '& .MuiInput-underline:after': { borderBottom: '2px solid #000' },
                }}
              />
              <IconButton
                onClick={() => setSearchTerm(filter)}
                sx={{
                  backgroundColor: 'black',
                  borderRadius: '50%',
                  padding: '5px',
                  '&:hover': { backgroundColor: '#333' },
                }}
              >
                <SearchIcon sx={{ color: 'white' }} />
              </IconButton>
            </Box>

            {filteredListings.map((listing) => (
              <Box
                key={listing.listingRentId}
                display="flex"
                alignItems="center"
                gap={2}
                p={1}
                borderBottom="1px solid #eee"
                sx={{ minHeight: 90 }}
              >
                <Avatar
                  src={listing.photos[0]?.photoLink || 'none'}
                  variant="rounded"
                  sx={{ width: 74, height: 64 }}
                />
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    noWrap
                    sx={{ fontSize: '0.9rem', maxWidth: '180px' }}
                  >
                    {listing.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ fontSize: '0.75rem', maxWidth: '180px' }}
                  >
                    {listing.property.address.city.city},{' '}
                    {listing.property.address.city.country || 'Bolivia'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box ref={scrollRef} sx={{ overflowX: 'auto', width: '100%' }}>
            <Box display="flex" borderBottom="1px solid #ccc" sx={{ minHeight: 90 }}>
              {days.map((day) => {
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
                return (
                  <Box
                    key={day.toString()}
                    sx={{
                      minWidth: 100,
                      textAlign: 'center',
                      p: 1,
                      backgroundColor: isToday ? 'black' : 'white',
                      color: isToday ? 'white' : 'inherit',
                      borderLeft: '1px solid #ccc',
                      borderRight: '1px solid #ccc',
                    }}
                  >
                    <Typography variant="body2">
                      {capitalize(format(day, 'EEE', { locale: es }))}
                    </Typography>
                    <Typography fontWeight="bold">{format(day, 'dd')}</Typography>
                  </Box>
                );
              })}
            </Box>

            {filteredListings.map((listing) => {
              const rentals = rentalsByListing[listing.listingRentId] || [];
              const rentOnly = rentals.filter((r) => r.action === 'rent');

              return (
                <Box
                  key={listing.listingRentId}
                  display="flex"
                  borderBottom="1px solid #eee"
                  sx={{ minHeight: 90, position: 'relative' }}
                >
                  {days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const rental = rentals.find((r) => r.date === dateStr);
                    const isBlockedOrRented =
                      rental?.action === 'rent' || rental?.action === 'blocked';
                    const isSelected =
                      selectedListingId === listing.listingRentId &&
                      selectedDates.includes(dateStr);

                    const bg = isSelected
                      ? 'black'
                      : rental?.action === 'blocked'
                        ? '#bbb'
                        : rental?.action === 'rent'
                          ? '#eee'
                          : 'transparent';

                    const color = isSelected ? 'white' : 'inherit';

                    return (
                      <Box
                        key={dateStr}
                        sx={{
                          minWidth: 100,
                          textAlign: 'center',
                          p: 1,
                          borderLeft: '1px solid #ccc',
                          borderRight: '1px solid #ccc',
                          backgroundColor: bg,
                          color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isBlockedOrRented ? 'not-allowed' : 'pointer',
                          userSelect: 'none',
                        }}
                        onClick={(e) => {
                          if (e.button === 0) {
                            handleDateSelection(listing.listingRentId, dateStr, isBlockedOrRented);
                          }
                        }}
                        onContextMenu={(ev) =>
                          handleContextMenu(ev, listing.listingRentId, dateStr, isSelected)
                        } // <--- Aquí se añade el evento onContextMenu wiii
                      >
                        <Typography variant="body2">
                          {rental ? `${rental.amount} BOB` : '0 BOB'}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>
        {/* --- Menú Contextual de Material-UI --- */}
        <Menu
          open={Boolean(anchorEl)} // El menú está abierto si anchorEl no es null :P
          onClose={handleCloseContextMenu}
          anchorEl={anchorEl} // <--- ¡Aquí pasamos el elemento DOM como anclaje! x,y sobre el rectangulo
          // No necesitamos anchorReference="none" ni anchorPosition
          // porque estamos usando anchorEl
        >
          {contextMenuData && ( // Renderiza los MenuItem solo si tenemos datos contextuales
            <MenuList>
              {rentalsByListing[contextMenuData.listingId]?.find(
                (r) => r.date === contextMenuData.dateStr && r.action === 'blocked'
              ) ? (
                <MenuItem onClick={() => handleMenuItemClick('Desbloquear Fecha')}>
                  Desbloquear Fecha
                </MenuItem>
              ) : (
                <MenuItem onClick={() => handleMenuItemClick('Bloquear Fecha')}>
                  Bloquear Fecha
                </MenuItem>
              )}
              <MenuItem onClick={() => handleMenuItemClick('Ver Historial')}>
                Ver Historial
              </MenuItem>
            </MenuList>
          )}
        </Menu>
      </Box>
      <AssertModal
        title={'Cambiar Fecha'}
        content={ null
          // <FormLockCalendar
          //   initialWhatIDo={isUpdated ? dataItem || '' : value || ''}
          //   initialId={aditionalId}
          //   onSave={handleSave}
          // />
        }
        open={openAboutSpace}
        showCloseLeft={false}
        onClose={() => setOpenAboutSpace(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
    </>
  );
};

export default RentalCalendar;
