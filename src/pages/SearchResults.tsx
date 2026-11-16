import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterListIcon from '@mui/icons-material/FilterList';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ModalFilter from '@/components/ModalFilter';
import CustomCard from '@/components/CustomCard';
import AirbnbCard from '@/components/AirbnbCard';
import FavoriteListsModal, { CardItem } from '@/components/FavoriteListsModal';
import SearchResultsBar from '@/components/SearchResultsBar';
import MobileSearchResultsBar from '@/components/MobileSearchResultsBar';
import Images from '@/assets/Imagens';
import assertEnv from '@/config/env';
import { ApiService } from '@/services/ApiService';
import { Listing, Photo } from '@/models/interfaces/Listing';
import Grid from '@mui/material/Grid2';
import { useSearchParams } from 'react-router';
import { GoogleMap, Marker, OverlayView, useLoadScript, InfoWindowF } from '@react-google-maps/api';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import SearchResultsSkeleton from '@/components/SearchResultSkeleton';
import { normalizeDate } from '@/utilities/dateUtils';
import theme from '@/themes/theme';
import AirbnbCardSkeleton from '@/components/AirbnbCardSkeleton';
import { useAuthContext } from '@/modules/_auth/context';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import EmptyState from '@/components/EmptyState';
import SearchIcon from '@mui/icons-material/Search';
import SignInForm from '@/components/SignInForm';
import { JomMarker } from '@/components/JomMarker';
import MapViewComponent from '@/components/MapViewComponent';
import TuneIcon from '@mui/icons-material/Tune';

interface FilterParams {
  PropertyTypeId?: number;
  MinPrice?: number;
  MaxPrice?: number;
  Bedrooms?: number;
  Bathrooms?: number;
  Beds?: number;
  AmenityIds?: number[];
}

interface SearchFormData {
  Latitude?: number;
  Longitude?: number;
  CheckInDate?: string | null;
  CheckOutDate?: string | null;
  Guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  AdtCount?: number;
  ChdCount?: number;
  InfCount?: number;
  PetsCount?: number;
  PropertyTypeId?: number | null;
  pageNumber?: number;
  pageSize?: number;
  Street?: string;
  City?: string;
  County?: string;
  State?: string;
  Country?: string;
  PostalCode?: string;
}

interface QueryParams {
  CheckInDate?: string;
  CheckOutDate?: string;
  Guests?: number;
  AdtCount?: number;
  ChdCount?: number;
  InfCount?: number;
  PetsCount?: number;
  PropertyTypeId?: number | null;
  MinPrice?: number;
  MaxPrice?: number;
  Bedrooms?: number;
  Bathrooms?: number;
  Beds?: number;
  AmenityIds?: number[];
  pageNumber: number;
  pageSize: number;
  Street?: string;
  City?: string;
  County?: string;
  State?: string;
  Country?: string;
  PostalCode?: string;
  Latitude?: number;
  Longitude?: number;
}

interface PaginationData {
  totalItemCount: number;
  totalPageCount: number;
  pageSize: number;
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

type LatLng = { lat: number; lng: number };

const buildQueryString = (params: QueryParams): string => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;
    if (key === 'AmenityIds' && Array.isArray(value)) {
      value.forEach((item) => sp.append(key, item.toString()));
    } else {
      sp.append(key, value.toString());
    }
  });
  return sp.toString();
};

const SearchResults: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({});
  const [selected, setSelected] = useState<Listing | null>(null);
  const [_hoveredListing, setHoveredListing] = useState<Listing | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData | null>(null);
  const [pendingSearchData, setPendingSearchData] = useState<SearchFormData | null>(null);
  const [center, setCenter] = useState<LatLng>({ lat: -17.786, lng: -63.181 });
  const [zoom, setZoom] = useState<number>(12);
  const [userMarker, _setUserMarker] = useState<LatLng | null>(null);
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [loginType, setLoginType] = useState<'registration' | 'login'>('login');
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [modalFavoritesOpen, setModalFavoritesOpen] = useState(false);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const { isGuestAuthenticated } = useAuthContext();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const showSnackbar = useSnackbar();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: ['places'],
    language: 'es',
  });

  const getColumnsCount = () => {
    if (matches) return 2;
    return 1;
  };

  const columns = getColumnsCount();
  const pageSize = columns * 6;
  const headerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const isProcessingSearch = useRef(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Street = searchParams.get('Street');
  const City = searchParams.get('City');
  const State = searchParams.get('State');
  const Country = searchParams.get('Country');
  const County = searchParams.get('County');
  const checkIn = searchParams.get('checkIn') || undefined;
  const checkOut = searchParams.get('checkOut') || undefined;
  const guests = Number(searchParams.get('guests') || '0');
  const adtCount = Number(searchParams.get('adtCount') || '0');
  const chdCount = Number(searchParams.get('chdCount') || '0');
  const infCount = Number(searchParams.get('infCount') || '0');
  const petsCount = Number(searchParams.get('petsCount') || '0');
  const Latitude = Number(searchParams.get('Latitude') || '0');
  const Longitude = Number(searchParams.get('Longitude') || '0');
  const PropertyTypeId = Number(searchParams.get('PropertyTypeId') || null);
  const currentPage = Number(searchParams.get('page') ?? 1);

  const { t } = useTranslation();

  useEffect(() => {
    setPageNumber(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mapContainer = document.querySelector('.gm-style');
      if (mapContainer && !mapContainer.contains(event.target as Node)) {
        setSelected(null);
        setHoveredListing(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const searchFormDataMemo = useMemo(() => {
    const stored = localStorage.getItem('search-form-storage');
    const queryBasedData: SearchFormData = {
      CheckInDate: checkIn ? normalizeDate(checkIn) : null,
      CheckOutDate: checkOut ? normalizeDate(checkOut) : null,
      Guests: {
        adults: adtCount || guests,
        children: chdCount,
        infants: infCount,
        pets: petsCount,
      },
      AdtCount: adtCount || guests || 0,
      ChdCount: chdCount || 0,
      InfCount: infCount || 0,
      PetsCount: petsCount || 0,
      Latitude,
      Longitude,
      Street: Street ? Street : '',
      City: City ? City : '',
      County: County ? County : '',
      State: State ? State : '',
      Country: Country ? Country : '',
      PropertyTypeId,
      pageNumber: currentPage,
      pageSize,
    };
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SearchFormData;
        return {
          ...parsed,
          ...queryBasedData,
          // Guests: { ...parsed.Guests, adults: guests || parsed.Guests.adults },
          AdtCount: parsed.AdtCount || undefined,
          ChdCount: parsed.ChdCount || undefined,
          InfCount: parsed.InfCount || undefined,
          PetsCount: parsed.PetsCount || undefined,
          CheckInDate:
            queryBasedData.CheckInDate || parsed.CheckInDate
              ? normalizeDate(queryBasedData.CheckInDate || parsed.CheckInDate)
              : null,
          CheckOutDate:
            queryBasedData.CheckOutDate || parsed.CheckOutDate
              ? normalizeDate(queryBasedData.CheckOutDate || parsed.CheckOutDate)
              : null,
          Street: queryBasedData.Street || parsed.Street,
          City: queryBasedData.City || parsed.City,
          County: queryBasedData.County || parsed.County,
          State: queryBasedData.State || parsed.State,
          Country: queryBasedData.Country || parsed.Country,
          PostalCode: queryBasedData.PostalCode || parsed.PostalCode,
        };
      } catch {
        localStorage.removeItem('search-form-storage');
        return queryBasedData;
      }
    }
    return queryBasedData;
  }, [
    checkIn,
    checkOut,
    guests,
    adtCount,
    chdCount,
    infCount,
    petsCount,
    PropertyTypeId,
    currentPage,
    pageSize,
    Street,
    City,
    County,
    State,
    Country,
  ]);

  // Efecto 1: sincronizar searchFormData desde la URL (carga inicial, paginación, navegación)
  useEffect(() => {
    if (!isProcessingSearch.current) {
      setSearchFormData(searchFormDataMemo);
      setCenter({
        lat: searchFormDataMemo.Latitude ?? -17.786,
        lng: searchFormDataMemo.Longitude ?? -63.181,
      });
    }
  }, [searchFormDataMemo]);

  // Efecto 2: procesar búsqueda cuando el usuario presiona el botón
  useEffect(() => {
    if (!pendingSearchData || isProcessingSearch.current) return;
    isProcessingSearch.current = true;
    setSearchFormData(pendingSearchData);
    setCenter({
      lat: pendingSearchData.Latitude ?? -17.786,
      lng: pendingSearchData.Longitude ?? -63.181,
    });
    setZoom(12);
    const params: { [key: string]: string } = {
      ...(pendingSearchData.Latitude && { Latitude: pendingSearchData.Latitude.toString() }),
      ...(pendingSearchData.Longitude && { Longitude: pendingSearchData.Longitude.toString() }),
      ...(pendingSearchData.Street && { Street: pendingSearchData.Street }),
      ...(pendingSearchData.City && { City: pendingSearchData.City }),
      ...(pendingSearchData.County && { County: pendingSearchData.County }),
      ...(pendingSearchData.State && { State: pendingSearchData.State }),
      ...(pendingSearchData.Country && { Country: pendingSearchData.Country }),
      ...(pendingSearchData.PostalCode && { PostalCode: pendingSearchData.PostalCode }),
      ...(pendingSearchData.CheckInDate && { checkIn: pendingSearchData.CheckInDate }),
      ...(pendingSearchData.CheckOutDate && { checkOut: pendingSearchData.CheckOutDate }),
      ...(pendingSearchData.AdtCount && { adtCount: pendingSearchData.AdtCount.toString() }),
      ...(pendingSearchData.ChdCount && { chdCount: pendingSearchData.ChdCount.toString() }),
      ...(pendingSearchData.InfCount && { infCount: pendingSearchData.InfCount.toString() }),
      ...(pendingSearchData.PetsCount && { petsCount: pendingSearchData.PetsCount.toString() }),
      page: '1',
    };
    setSearchParams(params);
    localStorage.setItem('search-form-storage', JSON.stringify(pendingSearchData));
    setFilters({});
    localStorage.removeItem('searchFilters');
    queryClient.invalidateQueries({ queryKey: ['results'] });
    setPendingSearchData(null);
    setTimeout(() => {
      isProcessingSearch.current = false;
    }, 100);
  }, [pendingSearchData, setSearchParams, queryClient]);

  const handleSearch = useCallback(
    (searchData: SearchFormData) => {
      if (isProcessingSearch.current) return;
      setPendingSearchData({
        ...searchData,
        CheckInDate: searchData.CheckInDate ? normalizeDate(searchData.CheckInDate) : checkIn,
        CheckOutDate: searchData.CheckOutDate ? normalizeDate(searchData.CheckOutDate) : checkOut,
        //  Guests: { ...searchData.Guests, adults: searchData.Guests.adults || guests },
        AdtCount: searchData.AdtCount || 0,
        ChdCount: searchData.ChdCount || 0,
        InfCount: searchData.InfCount || 0,
        PetsCount: searchData.PetsCount || 0,
        Longitude: searchData.Longitude || Longitude,
        Latitude: searchData.Latitude || Latitude,
        PropertyTypeId: searchData.PropertyTypeId || PropertyTypeId,
        Street: searchData.Street ? searchData.Street : Street ? Street : '',
        City: searchData.City ? searchData.City : City ? City : '',
        County: searchData.County ? searchData.County : County ? County : '',
        State: searchData.State ? searchData.State : State ? State : '',
        Country: searchData.Country ? searchData.Country : Country ? Country : '',
        PostalCode: searchData.PostalCode,
        pageNumber: 1,
        pageSize,
      });
    },
    [
      checkIn,
      checkOut,
      guests,
      Latitude,
      Longitude,
      PropertyTypeId,
      Street,
      City,
      County,
      State,
      Country,
      pageSize,
    ]
  );

  useEffect(() => {
    const newSearchKey = [checkIn, checkOut, guests, PropertyTypeId].join('|');
    const storedSearchKey = localStorage.getItem('last-search-key');
    if (newSearchKey !== storedSearchKey) {
      setFilters({});
      setPageNumber(1);
      setSearchParams((prev) => ({ ...Object.fromEntries(prev), page: '1' }));
      localStorage.setItem('last-search-key', newSearchKey);
      localStorage.removeItem('searchFilters');
      queryClient.invalidateQueries({ queryKey: ['results'] });
    }

    const storedFilters = localStorage.getItem('searchFilters');
    if (storedFilters) {
      try {
        const parsed = JSON.parse(storedFilters);
        setFilters({
          PropertyTypeId: parsed.category || undefined,
          MinPrice: parsed.minPrice,
          MaxPrice: parsed.maxPrice,
          Bedrooms: parsed.roomCounts?.habitaciones || undefined,
          Bathrooms: parsed.roomCounts?.banos || undefined,
          Beds: parsed.roomCounts?.camas || undefined,
          AmenityIds: parsed.services?.length ? parsed.services : undefined,
        });
      } catch {
        localStorage.removeItem('searchFilters');
      }
    }
  }, [checkIn, checkOut, guests, PropertyTypeId, queryClient, setSearchParams]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const newParams = {
        ...Object.fromEntries(searchParams),
        ...(filters.PropertyTypeId && { PropertyTypeId: filters.PropertyTypeId.toString() }),
        ...(filters.MinPrice && { MinPrice: filters.MinPrice.toString() }),
        ...(filters.MaxPrice && { MaxPrice: filters.MaxPrice.toString() }),
        ...(filters.Bedrooms && { Bedrooms: filters.Bedrooms.toString() }),
        ...(filters.Bathrooms && { Bathrooms: filters.Bathrooms.toString() }),
        ...(filters.Beds && { Beds: filters.Beds.toString() }),
        ...(filters.AmenityIds && { AmenityIds: filters.AmenityIds.join(',') }),
        page: '1',
      };
      const currentParams = Object.fromEntries(searchParams);
      if (JSON.stringify(newParams) !== JSON.stringify(currentParams)) {
        setSearchParams(newParams);
      }
    }
  }, [filters, searchParams, setSearchParams]);

  const { data, isLoading, isError, error, refetch } = useQuery<{
    pagination: PaginationData;
    statusCode: string;
    data: Listing[];
    hasError: boolean;
    resultError: null;
  }>({
    queryKey: [
      'results',
      checkIn,
      checkOut,
      Latitude,
      Longitude,
      guests,
      adtCount,
      chdCount,
      infCount,
      petsCount,
      filters.PropertyTypeId,
      filters.MinPrice,
      filters.MaxPrice,
      filters.Bedrooms,
      filters.Bathrooms,
      filters.Beds,
      filters.AmenityIds?.join(','),
      pageNumber,
      pageSize,
      searchFormData?.Street,
      searchFormData?.City,
      searchFormData?.County,
      searchFormData?.State,
      searchFormData?.Country,
      searchFormData?.PostalCode,
    ],
    queryFn: async () => {
      const params: QueryParams = {
        CheckInDate: checkIn,
        CheckOutDate: checkOut,
        Latitude,
        Longitude,
        //Guests: guests > 0 ? guests : undefined,
        // AdtCount: searchFormData?.AdtCount == 0 ? undefined : searchFormData?.AdtCount,
        // ChdCount: searchFormData?.ChdCount == 0 ? undefined : searchFormData?.ChdCount,
        // InfCount: searchFormData?.InfCount == 0 ? undefined : searchFormData?.InfCount,
        // PetsCount: searchFormData?.PetsCount == 0 ? undefined : searchFormData?.PetsCount,
        AdtCount: adtCount > 0 ? adtCount : undefined,
        ChdCount: chdCount > 0 ? chdCount : undefined,
        InfCount: infCount > 0 ? infCount : undefined,
        PetsCount: petsCount > 0 ? petsCount : undefined,
        PropertyTypeId: null, //filters.PropertyTypeId || PropertyTypeId,
        MinPrice: filters.MinPrice,
        MaxPrice: filters.MaxPrice,
        Bedrooms: filters.Bedrooms || undefined,
        Bathrooms: filters.Bathrooms || undefined,
        Beds: filters.Beds || undefined,
        AmenityIds: filters.AmenityIds,
        pageNumber,
        pageSize,
        Street: searchFormData?.Street,
        City: searchFormData?.City,
        County: searchFormData?.County,
        State: searchFormData?.State,
        Country: searchFormData?.Country,
        PostalCode: searchFormData?.PostalCode,
      };
      const endpoint = `/ListingRent/SearchV2?${buildQueryString(params)}`;
      const resp = await ApiService.get<{
        pagination: PaginationData;
        statusCode: string;
        data: Listing[];
        hasError: boolean;
        resultError: null;
      }>(endpoint);
      return resp;
    },
    enabled: Boolean(
      (Latitude != null ||
        Longitude != null ||
        searchFormData?.Street ||
        searchFormData?.City ||
        searchFormData?.County ||
        searchFormData?.State ||
        searchFormData?.Country ||
        searchFormData?.PostalCode) &&
        isLoaded
    ),
    staleTime: 0,
    gcTime: 0,
  });

  const handleFavoriteChange = (id: string, isFavorite: boolean) => {
    if (!isGuestAuthenticated) {
      setIsModalLogin(true);
      setLoginType('login');
    } else {
      if (isFavorite) {
        deleteFromFavorite(id);
      } else {
        openFolderModal(id);
      }
      // Cerrar el card emergente con un pequeño retraso
      setTimeout(() => {
        setSelected(null);
        setHoveredListing(null);
      }, 300);
    }
  };

  const deleteFromFavorite = async (id: string) => {
    try {
      setTogglingFavoriteId(id);
      await ApiService.delete(`/ListingRent/Favorite/${id}`);
      showSnackbar(t('home.snackbar.removedFromFavorites'), 'success');
      await refetch();
    } catch (error) {
      showSnackbar(t('home.snackbar.errorRemoving'), 'error');
    } finally {
      setTogglingFavoriteId(null);
    }
  };

  const openFolderModal = useCallback(
    (id: string) => {
      if (togglingFavoriteId) return;
      setTogglingFavoriteId(id);
      try {
        const listing = data?.data?.find((l: Listing) => l.listingRentId.toString() === id);
        if (listing) {
          const sortedImage =
            listing.photos.slice().sort((a: Photo, b: Photo) => {
              if (a.isPrincipal) return -1;
              if (b.isPrincipal) return 1;
              return (a.position ?? Infinity) - (b.position ?? Infinity);
            })[0]?.photoLink || '';

          setSelectedCard({
            id: listing.listingRentId.toString(),
            title: listing.name,
            image: sortedImage,
          });
          setModalFavoritesOpen(true);
        }
      } finally {
        setTogglingFavoriteId(null);
      }
    },
    [togglingFavoriteId, data?.data]
  );

  const closeFolderModal = (clearCard = false) => {
    setModalFavoritesOpen(false);
    setTogglingFavoriteId(null);
    if (clearCard) {
      setSelectedCard(null);
    }
    refetch();
  };

  const reopenModal = (card: CardItem) => {
    setSelectedCard(card);
    setTogglingFavoriteId(card.id);
    setTimeout(() => {
      setModalFavoritesOpen(true);
    }, 100);
  };

  const handleFavoriteChangeModal = (id: string, makeFav: boolean) => {
    if (!makeFav) {
      deleteFromFavorite(id);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleFilterSubmit = (nf: any) => {
    setFilters({
      PropertyTypeId: nf.category || undefined,
      MinPrice: nf.minPrice,
      MaxPrice: nf.maxPrice,
      Bedrooms: nf.roomCounts?.habitaciones,
      Bathrooms: nf.roomCounts?.banos,
      Beds: nf.roomCounts?.camas,
      AmenityIds: nf.services,
    });
    setPageNumber(1);
    setSearchParams({ ...Object.fromEntries(searchParams), page: '1' });
    setOpen(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setPageNumber(page);
    setSearchParams({ ...Object.fromEntries(searchParams), page: page.toString() });
    setTimeout(() => {
      headerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleMapClick = (_: google.maps.MapMouseEvent) => {
    // Solo cerrar si se hace click directamente en el mapa, no en overlays
    setSelected(null);
    setHoveredListing(null);
  };

  const markers = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return data.data
      .filter((l) => {
        const lat = l.latitude ?? l.property?.latitude;
        const lng = l.longitude ?? l.property?.longitude;
        return lat != null && lng != null;
      })
      .map((l) => ({
        listing: l,
        position: {
          lat: (l.latitude ?? l.property?.latitude)!,
          lng: (l.longitude ?? l.property?.longitude)!,
        },
        label: { text: `BOB ${l.price.priceNightly}`, color: '#000000' },
        isFavorite: l.isFavorite || false,
      }));
  }, [data?.data]);

  const keepOpen = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const scheduleClose = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredListing(null);
    }, 200);
  }, []);

  const handleMouseOver = useCallback(
    (listing: Listing) => {
      keepOpen();
      setHoveredListing(listing);
    },
    [keepOpen]
  );

  const handleMouseOut = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (loadError) return <Typography color="error">{t('searchResults.mapError')}</Typography>;
  if (!isLoaded) return <SearchResultsSkeleton />;
  if (
    !Latitude &&
    !Longitude &&
    !searchFormData?.Street &&
    !searchFormData?.City &&
    !searchFormData?.County &&
    !searchFormData?.State &&
    !searchFormData?.Country &&
    !searchFormData?.PostalCode
  ) {
    return (
      <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
        {t('searchMenu.text3Menu')}
      </Typography>
    );
  }
  if (error) {
    console.error('Error fetching search results:', error);
    return (
      <Typography color="error" variant="h6" textAlign="center" sx={{ mt: 4 }}>
        Error al cargar resultados: {(error as Error).message}
      </Typography>
    );
  }

  const defaultImage = Images[0]?.[0] || 'https://via.placeholder.com/300';

  const handleCloseModal = () => {
    setIsModalLogin(false);
  };

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 0, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: '24px' }}
    >
      <FavoriteListsModal
        open={modalFavoritesOpen}
        onClose={closeFolderModal}
        selectedCard={selectedCard}
        onCardAssigned={() => {
          closeFolderModal(true);
        }}
        onFavoriteChange={handleFavoriteChangeModal}
        onFavoriteAdded={() => {
          closeFolderModal(true);
        }}
        onReopenWithCard={reopenModal}
      />
      <Stack direction="column">
        {/* Buscador encima del mapa — solo visible en SM */}
        <Box sx={{ display: { xs: 'none', sm: 'block', md: 'none' }, px: 0, pt: 1, pb: 1 }}>
          <MobileSearchResultsBar
            onSearch={handleSearch}
            initialData={searchFormData}
            isLoaded={isLoaded}
            onDialogStateChange={setIsSearchDialogOpen}
          />
        </Box>
        <Box sx={{ flex: 1, width: '100%', display: 'flex', borderRadius: 6 }}>
          <Grid container spacing={0} sx={{ flex: 1 }}>
            {/* Columna derecha: Mapa sticky y full height (solo md+) */}
            {matches && (
              <Grid
                size={{ xs: 12, md: isMapFullScreen ? 12 : 5 }}
                sx={{
                  height:
                    isMapFullScreen && isMobile
                      ? '100vh'
                      : { xs: '400px', md: 'calc(100vh - 48px)' },
                  position:
                    isMapFullScreen && isMobile ? 'fixed' : { xs: 'relative', md: 'sticky' },
                  top: isMapFullScreen && isMobile ? 0 : { md: 0 },
                  left: isMapFullScreen && isMobile ? 0 : 'auto',
                  right: isMapFullScreen && isMobile ? 0 : 'auto',
                  alignSelf: { md: 'flex-start' },
                  order: { xs: 1, md: 2 },
                  zIndex: isMapFullScreen && isMobile ? 9999 : 'auto',
                  transition: 'all 0.4s ease-in-out',
                  bgcolor: isMapFullScreen && isMobile ? 'white' : 'transparent',
                  pb: 8,
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: '100%',
                  }}
                >
                  {/* Botón flotante para toggle del mapa */}
                  {!isMobile && (
                    <Tooltip
                      title={
                        isMapFullScreen ? t('searchResults.showList') : t('searchResults.fullMap')
                      }
                    >
                      <IconButton
                        onClick={() => setIsMapFullScreen(!isMapFullScreen)}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 26,
                          zIndex: 10,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          boxShadow: 3,
                          '&:hover': {
                            bgcolor: theme.palette.primary.main,
                          },
                        }}
                      >
                        {isMapFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Botón flotante para toggle del mapa en mobile */}
                  {isMobile && (
                    <Tooltip title={isMapFullScreen ? 'Mostrar lista' : 'Ver mapa completo'}>
                      <IconButton
                        onClick={() => setIsMapFullScreen(!isMapFullScreen)}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          zIndex: 10,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          boxShadow: 3,
                          '&:hover': {
                            bgcolor: theme.palette.primary.main,
                          },
                        }}
                      >
                        {isMapFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                      </IconButton>
                    </Tooltip>
                  )}
                  <GoogleMap
                    mapContainerStyle={{
                      width: '100%',
                      height: '100%',
                      borderRadius: isMobile && isMapFullScreen ? '0' : '16px',
                    }}
                    center={center}
                    zoom={zoom}
                    onLoad={onMapLoad}
                    onClick={handleMapClick}
                    options={{
                      fullscreenControl: false,
                      streetViewControl: false,
                      mapTypeControl: false,
                      zoomControl: true,
                      clickableIcons: false,
                      gestureHandling: 'greedy',
                    }}
                  >
                    {userMarker && <Marker position={userMarker} />}
                    {markers.map(({ listing, position, isFavorite }) => (
                      <OverlayView
                        key={listing.listingRentId}
                        position={position}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={(width, height) => ({
                          x: -(width / 2),
                          y: -(height / 2),
                        })}
                      >
                        <div
                          onMouseEnter={() => handleMouseOver(listing)}
                          onMouseLeave={handleMouseOut}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            whiteSpace: 'nowrap',
                            zIndex: selected?.listingRentId === listing.listingRentId ? 200 : 100,
                            position: 'relative',
                          }}
                        >
                          <JomMarker
                            price={`BOB ${listing.price.priceNightly}`}
                            selected={selected?.listingRentId === listing.listingRentId}
                            isFavorite={isFavorite}
                            onClick={() => {
                              // Toggle: si ya está seleccionado, ocultarlo; sino mostrarlo
                              setSelected(
                                selected?.listingRentId === listing.listingRentId ? null : listing
                              );
                            }}
                          />
                        </div>
                      </OverlayView>
                    ))}
                    {selected && (
                      <InfoWindowF
                        position={{
                          lat: (selected.latitude ?? selected.property?.latitude)!,
                          lng: (selected.longitude ?? selected.property?.longitude)!,
                        }}
                        onCloseClick={() => setSelected(null)}
                        options={{
                          disableAutoPan: false,
                          pixelOffset: new google.maps.Size(0, -15),
                          maxWidth: 320,
                          zIndex: 1000,
                        }}
                      >
                        <Paper
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            backgroundColor: 'transparent',
                            width: { xs: '260px', sm: '280px' },
                            borderRadius: '24px',
                            boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
                            zIndex: 1000,
                            position: 'relative',
                          }}
                        >
                          <CustomCard
                            compact
                            images={
                              selected.photos?.length
                                ? selected.photos
                                    .slice()
                                    .sort((a, b) => {
                                      if (a.isPrincipal) return -1;
                                      if (b.isPrincipal) return 1;
                                      return (a.position ?? Infinity) - (b.position ?? Infinity);
                                    })
                                    .map((p) => p.photoLink)
                                : [defaultImage]
                            }
                            location={
                              selected.property.address?.address1 ||
                              selected.property.address?.city?.state ||
                              searchFormData?.City ||
                              searchFormData?.State ||
                              'Ubicación desconocida'
                            }
                            country={
                              selected.property.address?.city?.country ||
                              searchFormData?.Country ||
                              ''
                            }
                            title={selected.name}
                            price={`${selected.price.priceNightly} BOB`}
                            rating={selected.valoration || 0}
                            refDetail={selected.listingRentId.toString()}
                            isFavorite={selected.isFavorite || false}
                            setIsFavorite={() =>
                              handleFavoriteChange(
                                selected.listingRentId.toString(),
                                selected.isFavorite || false
                              )
                            }
                            onToggleFavorite={() =>
                              handleFavoriteChange(
                                selected.listingRentId.toString(),
                                selected.isFavorite || false
                              )
                            }
                          />
                        </Paper>
                      </InfoWindowF>
                    )}
                  </GoogleMap>
                </Box>
              </Grid>
            )}
            {!matches && isMapFullScreen && (
              <Grid
                size={{ xs: 12, md: isMapFullScreen ? 12 : 5 }}
                sx={{
                  height:
                    isMapFullScreen && !matches
                      ? '100vh'
                      : { xs: '400px', md: 'calc(100vh - 48px)' },
                  position:
                    isMapFullScreen && !matches ? 'fixed' : { xs: 'relative', md: 'sticky' },
                  top: isMapFullScreen && !matches ? 0 : { md: 0 },
                  left: isMapFullScreen && !matches ? 0 : 'auto',
                  right: isMapFullScreen && !matches ? 0 : 'auto',
                  alignSelf: { md: 'flex-start' },
                  order: { xs: 1, md: 2 },
                  zIndex: isMapFullScreen && !matches ? 9999 : 'auto',
                  transition: 'all 0.4s ease-in-out',
                  bgcolor: isMapFullScreen && !matches ? 'white' : 'transparent',
                  pb: isMapFullScreen && !matches ? 0 : 8,
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: '100%',
                  }}
                >
                  {/* Botón flotante para toggle del mapa en mobile/sm */}
                  <Tooltip title={isMapFullScreen ? 'Mostrar lista' : 'Ver mapa completo'}>
                    <IconButton
                      onClick={() => setIsMapFullScreen(!isMapFullScreen)}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 10,
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        boxShadow: 3,
                        '&:hover': {
                          bgcolor: theme.palette.primary.main,
                        },
                      }}
                    >
                      {isMapFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Tooltip>
                  <GoogleMap
                    mapContainerStyle={{
                      width: '100%',
                      height: '100%',
                      borderRadius: !matches && isMapFullScreen ? '0' : '16px',
                    }}
                    center={center}
                    zoom={zoom}
                    onLoad={onMapLoad}
                    onClick={handleMapClick}
                    options={{
                      fullscreenControl: false,
                      streetViewControl: false,
                      mapTypeControl: false,
                      zoomControl: true,
                      clickableIcons: false,
                      gestureHandling: 'greedy',
                    }}
                  >
                    {userMarker && <Marker position={userMarker} />}
                    {markers.map(({ listing, position, isFavorite }) => (
                      <OverlayView
                        key={listing.listingRentId}
                        position={position}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={(width, height) => ({
                          x: -(width / 2),
                          y: -(height / 2),
                        })}
                      >
                        <div
                          onMouseEnter={() => handleMouseOver(listing)}
                          onMouseLeave={handleMouseOut}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            whiteSpace: 'nowrap',
                            zIndex: selected?.listingRentId === listing.listingRentId ? 200 : 100,
                            position: 'relative',
                          }}
                        >
                          <JomMarker
                            price={`BOB ${listing.price.priceNightly}`}
                            selected={selected?.listingRentId === listing.listingRentId}
                            isFavorite={isFavorite}
                            onClick={() => {
                              // Toggle: si ya está seleccionado, ocultarlo; sino mostrarlo
                              setSelected(
                                selected?.listingRentId === listing.listingRentId ? null : listing
                              );
                            }}
                          />
                        </div>
                      </OverlayView>
                    ))}
                    {selected && (
                      <InfoWindowF
                        position={{
                          lat: (selected.latitude ?? selected.property?.latitude)!,
                          lng: (selected.longitude ?? selected.property?.longitude)!,
                        }}
                        onCloseClick={() => setSelected(null)}
                        options={{
                          disableAutoPan: false,
                          pixelOffset: new google.maps.Size(0, -15),
                          maxWidth: 320,
                          zIndex: 1000,
                        }}
                      >
                        <Paper
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            backgroundColor: 'transparent',
                            width: { xs: '260px', sm: '280px' },
                            borderRadius: '24px',
                            boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
                            zIndex: 1000,
                            position: 'relative',
                          }}
                        >
                          <CustomCard
                            compact
                            images={
                              selected.photos?.length
                                ? selected.photos
                                    .slice()
                                    .sort((a, b) => {
                                      if (a.isPrincipal) return -1;
                                      if (b.isPrincipal) return 1;
                                      return (a.position ?? Infinity) - (b.position ?? Infinity);
                                    })
                                    .map((p) => p.photoLink)
                                : [defaultImage]
                            }
                            location={
                              selected.property.address?.address1 ||
                              selected.property.address?.city?.state ||
                              searchFormData?.City ||
                              searchFormData?.State ||
                              'Ubicación desconocida'
                            }
                            country={
                              selected.property.address?.city?.country ||
                              searchFormData?.Country ||
                              ''
                            }
                            title={selected.name}
                            price={`${selected.price.priceNightly??0}`}
                            rating={selected.valoration || 0}
                            refDetail={selected.listingRentId}
                            isFavorite={selected.isFavorite || false}
                            setIsFavorite={() =>
                              handleFavoriteChange(
                                selected.listingRentId.toString(),
                                selected.isFavorite || false
                              )
                            }
                            onToggleFavorite={() =>
                              handleFavoriteChange(
                                selected.listingRentId.toString(),
                                selected.isFavorite || false
                              )
                            }
                          />
                        </Paper>
                      </InfoWindowF>
                    )}
                  </GoogleMap>
                </Box>
              </Grid>
            )}
            {/* Columna izquierda: Lista con scroll */}
            {!isMapFullScreen && (
              <Grid
                size={{ xs: 12, md: 7 }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mt: !matches ? 5 : 0,
                  order: { xs: 2, md: 1 },
                  transition: 'all 0.4s ease-in-out',
                  animation: 'fadeIn 0.4s ease-in-out',
                  height: { xs: 'auto', md: 'calc(100vh - 100px)' },
                  overflow: 'hidden',
                  '@keyframes fadeIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateX(20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                }}
              >
                {/* Buscador en la parte superior (oculto en SM, que ya aparece arriba del mapa) */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    flexShrink: 0,
                    display: { xs: 'block', sm: 'none', md: 'block' },
                  }}
                  ref={headerRef}
                >
                  {isMobile ? (
                    <MobileSearchResultsBar
                      onSearch={handleSearch}
                      initialData={searchFormData}
                      isLoaded={isLoaded}
                      onDialogStateChange={setIsSearchDialogOpen}
                    />
                  ) : (
                    <SearchResultsBar
                      onSearch={handleSearch}
                      initialData={searchFormData}
                      isLoaded={isLoaded}
                    />
                  )}
                </Box>

                {/* Cabecera fija con resultados y filtros */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    pb: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{ fontFamily: theme.typography.paragraph1Regular, fontWeight: 600 }}
                  >
                    {data?.pagination?.totalItemCount} {t('searchResults.resultProperties')}
                  </Typography>
                  {!matches ? (
                    <IconButton onClick={handleOpen} sx={{ color: '#6B7280' }}>
                      <TuneIcon />
                    </IconButton>
                  ) : (
                    <Button variant="secondary" startIcon={<FilterListIcon />} onClick={handleOpen}>
                      {t('searchResults.button')}
                    </Button>
                  )}
                  <ModalFilter open={open} onClose={handleClose} onSubmit={handleFilterSubmit} />
                </Box>

                {/* Grid de tarjetas (flexGrow para que crezca) */}
                <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', overflowX: 'hidden' }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      // Asegurar que las cards en hover se vean completamente
                      '& > *': {
                        isolation: 'isolate',
                      },
                    }}
                  >
                    {isLoading ? (
                      Array.from({ length: pageSize }).map((_, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                          <AirbnbCardSkeleton />
                        </Grid>
                      ))
                    ) : isError ? (
                      <Grid size={{ xs: 12 }}>
                        <Box>Error: {error}</Box>
                      </Grid>
                    ) : Array.isArray(data?.data) && data.data.length > 0 ? (
                      <>
                        {data.data.map((listing) => (
                          <Grid key={listing.listingRentId} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                            <AirbnbCard
                              key={listing.listingRentId}
                              listingRentId={listing.listingRentId.toString()}
                              images={
                                listing.photos?.length > 0
                                  ? listing.photos
                                      .slice()
                                      .sort((a, b) => {
                                        if (a.isPrincipal) return -1;
                                        if (b.isPrincipal) return 1;
                                        return (a.position ?? Infinity) - (b.position ?? Infinity);
                                      })
                                      .map((p) => p.photoLink)
                                  : [defaultImage]
                              }
                              location={
                                listing.property.address?.address1 ||
                                listing.property.address?.city?.state ||
                                searchFormData?.City ||
                                searchFormData?.State ||
                                'Ubicación desconocida'
                              }
                              country={
                                listing.property.address?.city?.country ||
                                searchFormData?.Country ||
                                ''
                              }
                              title={listing.name}
                              price={`${listing.price.priceNightly} `}
                              rating={listing.valoration || 0}
                              bedrooms={listing.bedrooms}
                              bathrooms={listing.bathrooms}
                              beds={listing.beds}
                              isFavorite={listing.isFavorite || false}
                              isTogglingFavorite={
                                togglingFavoriteId === listing.listingRentId.toString()
                              }
                              onToggleFavorite={() => {
                                const sortedImage =
                                  listing.photos?.slice().sort((a, b) => {
                                    if (a.isPrincipal) return -1;
                                    if (b.isPrincipal) return 1;
                                    return (a.position ?? Infinity) - (b.position ?? Infinity);
                                  })[0]?.photoLink || defaultImage;

                                openFolderModal(listing.listingRentId.toString());
                                setSelectedCard({
                                  id: listing.listingRentId.toString(),
                                  title: listing.name || 'Alojamiento',
                                  image: sortedImage,
                                });
                              }}
                              setIsFavorite={(isFav: boolean) =>
                                handleFavoriteChange(listing.listingRentId.toString(), isFav)
                              }
                            />
                          </Grid>
                        ))}
                      </>
                    ) : (
                      <Grid size={{ xs: 12 }}>
                        <Box
                          sx={{
                            mt: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minHeight: '50vh',
                          }}
                        >
                          <EmptyState
                            title={t('searchResults.emptyTitle')}
                            description={t('searchResults.emptyDescription')}
                            icon={SearchIcon}
                          />
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Paginación INTERNA fija abajo de la lista scrollable */}
                {(data?.pagination?.totalItemCount ?? 0) > 18 &&
                  (data?.pagination?.totalPageCount ?? 0) > 1 && (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        flexShrink: 0,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        mt: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: isMobile ? 340 : undefined,
                            mx: isMobile ? 'auto' : 0,
                            overflowX: isMobile ? 'auto' : 'visible',
                            display: 'inline-block',
                          }}
                        >
                          <Pagination
                            count={data?.pagination?.totalPageCount}
                            page={pageNumber}
                            onChange={handlePageChange}
                            color="primary"
                            size={isMobile ? 'medium' : 'large'}
                            showFirstButton
                            showLastButton
                            siblingCount={0}
                            boundaryCount={1}
                            variant="text"
                            sx={{
                              '.MuiPagination-ul': {
                                flexWrap: 'nowrap',
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
              </Grid>
            )}
          </Grid>
        </Box>
        {!matches && (
          <MapViewComponent
            isMapFullScreen={isMapFullScreen}
            setIsMapFullScreen={setIsMapFullScreen}
            isSearchDialogOpen={isSearchDialogOpen}
          />
        )}
        <SignInForm open={isModalLogin} onClose={handleCloseModal} typeLogin={loginType} />
      </Stack>
    </Container>
  );
};

export default SearchResults;
