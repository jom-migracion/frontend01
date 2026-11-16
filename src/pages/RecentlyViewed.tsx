import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import { useQuery } from '@tanstack/react-query';
import AirbnbCard from '@/components/AirbnbCard';
import AirbnbCardSkeleton from '@/components/AirbnbCardSkeleton';
import FavoriteListsModal, { CardItem } from '@/components/FavoriteListsModal';
import { ApiService } from '@/services/ApiService';
import Images from '@/assets/Imagens';
import { Listing } from '@/models/interfaces/Listing';
import { useTranslation } from 'react-i18next';
import { GoBack } from '@/components/GoBack';

interface ApiResponse<T> {
  data: T;
  statusCode: string;
  hasError: boolean;
  resultError: any;
  pagination?: {
    totalItemCount: number;
    totalPageCount: number;
    pageSize: number;
    currentPage: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

const RecentlyViewed: React.FC = () => {
  const theme = useTheme();
  // const matches = useMediaQuery(theme.breakpoints.up('md'));
  const titleRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  // agregar para traducir
  const { t } = useTranslation();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse<Listing[]>>({
    queryKey: ['views-history-all', { pageNumber: 1, pageSize: 1000 }],
    queryFn: async () => {
      const params = new URLSearchParams({
        pageNumber: '1',
        pageSize: '1000',
      }).toString();
      return await ApiService.get<ApiResponse<Listing[]>>(`/ListingRent/ViewsHistory?${params}`);
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const listings: Listing[] = Array.isArray(response?.data) ? response.data : [];
  console.log(listings, 'listings');

  const removeId = async (id: string) => {
    try {
      setTogglingFavoriteId(id);
      await ApiService.delete(`/ListingRent/Favorite/${id}`);
      refetch();
    } catch (error) {
      console.error(`Error al eliminar el favorito con ID: ${id}`, error);
    } finally {
      setTogglingFavoriteId(null);
    }
  };

  const handleFavoriteChange = (id: string, makeFav: boolean) => {
    if (!makeFav) {
      removeId(id);
    }
  };

  const openFolderModal = (card: CardItem) => {
    setSelectedCard(card);
    setTogglingFavoriteId(card.id);
    setModalOpen(true);
  };

  const closeFolderModal = (clearCard = false) => {
    setModalOpen(false);
    setTogglingFavoriteId(null);
    if (clearCard) {
      setSelectedCard(null);
    }
    refetch();
  };

  const reopenModal = () => {
    if (selectedCard) {
      setModalOpen(true);
      setTogglingFavoriteId(selectedCard.id);
    }
  };

  const getSkeletonCount = () => {
    if (isLargeScreen) {
      return 15; // xl: 5 cards por fila × 3 filas
    }
    if (theme.breakpoints.values.lg && window.innerWidth >= theme.breakpoints.values.lg) {
      return 12; // lg: 4 cards por fila × 3 filas
    }
    if (theme.breakpoints.values.md && window.innerWidth >= theme.breakpoints.values.md) {
      return 9; // md: 3 cards por fila × 3 filas
    }
    if (theme.breakpoints.values.sm && window.innerWidth >= theme.breakpoints.values.sm) {
      return 4; // sm: 2 cards por fila × 2 filas
    }
    return 2; // xs: 1 card por fila × 2 filas
  };

  // Group listings by month and year
  // const groupedByDate = listings.reduce(
  //   (acc, listing) => {
  //     if (!listing.viewDate) {
  //       // Si no hay fecha, usar "Sin fecha"
  //       const dateString = 'Sin fecha';
  //       if (!acc[dateString]) acc[dateString] = { date: null, listings: [] };
  //       acc[dateString].listings.push(listing);
  //       return acc;
  //     }

  //     const date = new Date(listing.viewDate);

  //     // Verificar si la fecha es válida
  //     if (isNaN(date.getTime())) {
  //       const dateString = 'Sin fecha';
  //       if (!acc[dateString]) acc[dateString] = { date: null, listings: [] };
  //       acc[dateString].listings.push(listing);
  //       return acc;
  //     }

  //     const dateString = date.toLocaleDateString('es-BO', {
  //       month: 'long',
  //       year: 'numeric',
  //     });

  //     if (!acc[dateString]) acc[dateString] = { date: date, listings: [] };
  //     acc[dateString].listings.push(listing);
  //     return acc;
  //   },
  //   {} as { [key: string]: { date: Date | null; listings: Listing[] } }
  // );
  // Group listings by month and year (usando viewDate)
  const groupedByDate = listings.reduce(
    (acc, listing) => {
      // Usar viewDate (fecha de visualización)
      if (!listing.viewDate) {
        const dateString = 'Sin fecha';
        if (!acc[dateString]) acc[dateString] = { date: null, listings: [] };
        acc[dateString].listings.push(listing);
        return acc;
      }

      const date = new Date(listing.viewDate);

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        const dateString = 'Sin fecha';
        if (!acc[dateString]) acc[dateString] = { date: null, listings: [] };
        acc[dateString].listings.push(listing);
        return acc;
      }

      const dateString = date.toLocaleDateString('es-BO', {
        month: 'long',
        year: 'numeric',
      });

      if (!acc[dateString]) acc[dateString] = { date: date, listings: [] };
      acc[dateString].listings.push(listing);
      return acc;
    },
    {} as { [key: string]: { date: Date | null; listings: Listing[] } }
  );

  // Ordenar por fecha descendente (más reciente primero)
  const sortedGroupedDates = Object.entries(groupedByDate).sort((a, b) => {
    const dateA = a[1].date;
    const dateB = b[1].date;

    // "Sin fecha" va al final
    if (!dateA) return 1;
    if (!dateB) return -1;

    // Ordenar de más reciente a más antiguo
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 3, md: isLargeScreen ? 5 : 4 }, mt: { xs: 2, md: 6 } }}
    >
      <Stack direction="column">
        <Box ref={titleRef} sx={{ scrollMarginTop: { xs: '70px', sm: '80px' } }}>
          <Typography sx={{ fontFamily: theme.typography.h2, color: theme.palette.text.primary }}>
            {t('recentlyViewed.title')}
          </Typography>
        </Box>
        <Box>
          <GoBack />
        </Box>

        <FavoriteListsModal
          open={modalOpen}
          onClose={(clearCard = true) => closeFolderModal(clearCard)}
          selectedCard={selectedCard}
          onCardAssigned={reopenModal}
          onFavoriteChange={handleFavoriteChange}
          onFavoriteAdded={() => setTogglingFavoriteId(null)}
          onReopenWithCard={openFolderModal}
        />

        <Box>
          {isLoading ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fill, minmax(200px, 1fr))',
                  sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                  md: 'repeat(auto-fill, minmax(240px, 1fr))',
                  lg: 'repeat(auto-fill, minmax(260px, 1fr))',
                },
                gap: { xs: 2, sm: 3, md: 3 },
                alignItems: 'start',
                mt: 2,
              }}
            >
              {Array.from({ length: getSkeletonCount() }).map((_, index) => (
                <Box key={index}>
                  <AirbnbCardSkeleton />
                </Box>
              ))}
            </Box>
          ) : isError ? (
            <Typography color="error">Error: {error?.message}</Typography>
          ) : sortedGroupedDates.length === 0 ? (
            <Typography>{t('recentlyViewed.text')}</Typography>
          ) : (
            sortedGroupedDates.map(([dateString, { listings: dateListings }]) => (
              <Box key={dateString} mb={4}>
                <Chip
                  label={dateString.charAt(0).toUpperCase() + dateString.slice(1)}
                  variant="filled"
                  sx={{
                    fontSize: theme.typography.h6Bold,
                    mb: 3,
                    mt: 2,
                    backgroundColor: 'rgba(91, 76, 160, 0.1)',
                    color: theme.palette.customColors?.primary?.[1] || theme.palette.primary.main,
                  }}
                />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(auto-fill, minmax(200px, 1fr))',
                      sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                      md: 'repeat(auto-fill, minmax(240px, 1fr))',
                      lg: 'repeat(auto-fill, minmax(260px, 1fr))',
                    },
                    gap: { xs: 2, sm: 3, md: 3 },
                    alignItems: 'start',
                  }}
                >
                  {dateListings.map((listing, index) => {
                    // Buscar la imagen principal
                    const principalImage = listing.photos?.find(
                      (photo) => photo.isPrincipal
                    )?.photoLink;

                    // Construir array de imágenes con la principal primero
                    const images =
                      listing.photos && listing.photos.length > 0
                        ? [
                            principalImage || listing.photos[0].photoLink, // Principal primero
                            ...listing.photos
                              .filter((photo) => photo.photoLink !== principalImage) // Resto de imágenes
                              .map((photo) => photo.photoLink),
                          ]
                        : Images[index % Images.length];

                    return (
                      <Box key={listing.listingRentId}>
                        <AirbnbCard
                          listingRentId={listing.listingRentId}
                          images={images}
                          location={listing.property?.address?.address1 ?? listing.name}
                          country={listing.property?.address?.city?.city ?? ''}
                          title={listing.name || 'Alojamiento'}
                          price={
                            listing.price?.priceNightly ? `${listing.price.priceNightly} ` : '0'
                          }
                          rating={Math.floor(listing.valoration * 10) / 10}
                          bedrooms={listing.bedrooms}
                          bathrooms={listing.bathrooms}
                          beds={listing.beds}
                          isFavorite={listing.isFavorite}
                          isTogglingFavorite={
                            togglingFavoriteId === listing.listingRentId.toString()
                          }
                          onToggleFavorite={() =>
                            openFolderModal({
                              id: listing.listingRentId.toString(),
                              title: listing.name || 'Alojamiento',
                              image: principalImage || (Array.isArray(images) ? images[0] : images),
                            })
                          }
                          setIsFavorite={(isFav: boolean) =>
                            handleFavoriteChange(listing.listingRentId.toString(), isFav)
                          }
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default RecentlyViewed;
