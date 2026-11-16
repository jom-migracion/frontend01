import AirbnbCard from '@/components/AirbnbCard';
import AirbnbCardSkeleton from '@/components/AirbnbCardSkeleton';
import AirbnbSearchBar from '@/components/AirbnbSearchBar';
import EmptyState from '@/components/EmptyState';
import { CardItem } from '@/components/FavoriteListsModal';
import MobileAirbnbSearchBar from '@/components/MobileAirbnbSearchBar';
import SkeletonPagination from '@/components/SkeletonPagination';
import { useSnackbar } from '@/context/SnackbarContext';
import { useGet3 } from '@/hooks/api';
import { Listing } from '@/models/interfaces/Listing';
import { useAuthContext } from '@/modules/_auth/context';
import { ApiService } from '@/services/ApiService';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { keepPreviousData } from '@tanstack/react-query';
import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Helmet } from 'react-helmet';

const FavoriteListsModal = lazy(() => import('@/components/FavoriteListsModal'));

interface PaginationData {
  totalItemCount: number;
  totalPageCount: number;
  pageSize: number;
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

const Home: React.FC = () => {
  const [isRefetchingFavorites, setIsRefetchingFavorites] = useState(false);
  const { isHostAuthenticated, isAuthenticated } = useAuthContext();
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);
  const theme = useTheme();
  const prevPageRef = useRef<number>(1);
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const titleRef = useRef<HTMLDivElement>(null);
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();

  const pageSize = isLargeScreen ? 15 : 12;

  const {
    data: listingRent,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGet3<{
    pagination: PaginationData;
    statusCode: string;
    data: Listing[];
    hasError: boolean;
    resultError: null;
  }>(
    ['listingRent', isHostAuthenticated, currentPage, pageSize],
    '/ListingRent/Featureds',
    { pageNumber: currentPage, pageSize },
    {
      enabled: isAuthenticated || isHostAuthenticated,
      placeholderData: keepPreviousData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const removeId = async (id: string) => {
    try {
      setTogglingFavoriteId(id);
      setIsRefetchingFavorites(true);
      await ApiService.delete(`/ListingRent/Favorite/${id}`);
      await refetch();
      showSnackbar(t('home.snackbar.removedFromFavorites'), 'success');
    } catch (error) {
      showSnackbar(t('home.snackbar.errorRemoving'), 'error');
    } finally {
      setTogglingFavoriteId(null);
      setIsRefetchingFavorites(false);
    }
  };

  const handleFavoriteChange = (id: string, isFavorite: boolean) => {
    if (isFavorite) {
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
  };

  const reopenModal = () => {
    if (selectedCard) {
      setModalOpen(true);
      setTogglingFavoriteId(selectedCard.id);
    }
  };

  useEffect(() => {
    localStorage.removeItem('search-form-storage');
    localStorage.removeItem('searchFilters');
    localStorage.removeItem('last-search-key');
    localStorage.removeItem('last-city');
    localStorage.removeItem('locationData');
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    if (currentPage !== prevPageRef.current && !isFetching) {
      requestAnimationFrame(() => {
        titleRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });

      prevPageRef.current = currentPage;
    }
  }, [currentPage, isFetching]);

  return (
    <Box>
      <Helmet>
        <title>{t('home.title')}</title>
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          background: `linear-gradient(to bottom, #fafaff 0%, #f1f2ff 100%)`,
          height: isMobile ? '30vh' : pageSize === 12 ? '50vh' : '42vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            px: { xs: 2, sm: 4, md: 0 },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              mb: '8px',
              fontSize: { xs: '1.2rem', sm: '1.6rem', md: undefined },
              lineHeight: { xs: 1.3, md: undefined },
            }}
          >
            {t('home.hero.title1')}{' '}
            <span style={{ color: theme.palette.primary.main }}>{t('home.hero.title2')}</span>
          </Typography>
          <Typography
            variant="h1"
            sx={{
              mb: '8px',
              fontSize: { xs: '1.2rem', sm: '1.6rem', md: undefined },
              lineHeight: { xs: 1.3, md: undefined },
            }}
          >
            {!isMobile ? t('home.hero.title3') : t('home.hero.title3')}
          </Typography>
        </Box>
        <Box display={'flex'}>{isMobile ? <MobileAirbnbSearchBar /> : <AirbnbSearchBar />}</Box>
      </Box>
      <Box>
        <Container
          maxWidth={isLargeScreen ? 'xl' : 'lg'}
          sx={{ px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: '64px' }}
        >
          <Stack direction="column" spacing={0}>
            <Box ref={titleRef} sx={{ scrollMarginTop: { xs: '85px', sm: '95px', md: '110px' } }} />
            <Suspense fallback={null}>
              <FavoriteListsModal
                open={modalOpen}
                onClose={(clearCard = true) => closeFolderModal(clearCard)}
                selectedCard={selectedCard}
                onCardAssigned={reopenModal}
                onFavoriteChange={handleFavoriteChange}
                onFavoriteAdded={async () => {
                  setTogglingFavoriteId(null);
                  setIsRefetchingFavorites(true);
                  try {
                    await refetch();
                  } finally {
                    setIsRefetchingFavorites(false);
                  }
                }}
                onReopenWithCard={openFolderModal}
              />
            </Suspense>
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
              {isLoading || (isFetching && !isRefetchingFavorites) ? (
                Array.from({ length: pageSize }).map((_, i) => <AirbnbCardSkeleton key={i} />)
              ) : isError ? (
                <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 8 }}>
                  <Typography color="error">
                    {t('home.error.loadingProperties')} {error?.message}
                  </Typography>
                </Box>
              ) : !Array.isArray(listingRent?.data) || listingRent.data.length === 0 ? (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <EmptyState
                    title={t('home.noPublishedListings.title')}
                    description={t('home.noPublishedListings.description')}
                    icon={HomeOutlinedIcon}
                  />
                </Box>
              ) : (
                listingRent.data.map((listing: Listing, index: number) => {
                  const images =
                    listing.photos && listing.photos.length > 0
                      ? listing.photos
                          .slice()
                          .sort((a, b) => {
                            if (a.isPrincipal) return -1;
                            if (b.isPrincipal) return 1;
                            return (a.position ?? Infinity) - (b.position ?? Infinity);
                          })
                          .map((photo) => photo.photoLink)
                      : ['https://via.placeholder.com/300x200'];

                  return (
                    <Box key={listing.listingRentId}>
                      <AirbnbCard
                        key={listing.listingRentId}
                        listingRentId={listing.listingRentId}
                        bathrooms={listing.bathrooms}
                        bedrooms={listing.bedrooms}
                        beds={listing.beds}
                        images={images}
                        location={
                          listing.property?.address?.city?.city ??
                          listing.property?.address?.city?.state ??
                          'Desconocido'
                        }
                        country={listing.property?.address?.city?.country ?? 'Bolivia'}
                        title={listing.name || t('home.card.fallbackTitle')}
                        price={listing.price?.priceNightly ? `${listing.price.priceNightly} ` : '0'}
                        rating={Math.floor((listing.valoration ?? 0) * 10) / 10}
                        isFavorite={listing.isFavorite}
                        onToggleFavorite={() =>
                          openFolderModal({
                            id: listing.listingRentId.toString(),
                            title: listing.name || 'Alojamiento',
                            image: images[0],
                          })
                        }
                        setIsFavorite={(isFav: boolean) =>
                          handleFavoriteChange(listing.listingRentId.toString(), isFav)
                        }
                        isTogglingFavorite={togglingFavoriteId === listing.listingRentId.toString()}
                        //priority={index < 4}
                        priority={index === 0}
                      />
                    </Box>
                  );
                })
              )}
            </Box>

            {/* Paginación */}
            {isLoading || (isFetching && !isRefetchingFavorites) ? (
              <SkeletonPagination />
            ) : (
              listingRent?.pagination && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <Box
                    sx={{
                      minWidth: isMobile ? 340 : undefined,
                      mx: 'auto',
                      overflowX: isMobile ? 'auto' : 'visible',
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <Pagination
                      count={listingRent.pagination.totalPageCount}
                      page={listingRent.pagination.currentPage}
                      onChange={handlePageChange}
                      size={isMobile ? 'medium' : 'large'}
                      showFirstButton
                      showLastButton
                      siblingCount={1}
                      boundaryCount={1}
                      color="primary"
                      variant="text"
                    />
                  </Box>
                </Box>
              )
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
