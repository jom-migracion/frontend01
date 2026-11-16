import { useState } from 'react';
import Images from '@/assets/Imagens';
import AirbnbCard from '@/components/AirbnbCard';
import AirbnbCardSkeleton from '@/components/AirbnbCardSkeleton';
import { Stack, Typography, useMediaQuery, useTheme, Container, Box } from '@mui/material';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/ApiService';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import EmptyState from '@/components/EmptyState';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import { GoBack } from '@/components/GoBack';

// --- Interfaces ---
export interface ApiResponse<T> {
  data: T;
  statusCode: string;
  hasError: boolean;
  resultError: any;
}

export interface FavoriteGroupResponse {
  favoriteGroupListingId: number;
  userId: number;
  favoriteGroupName: string;
  creationDate: string;
  groupStatus: number;
  tlListingFavorites: FavoriteListing[];
  totalRegisters: number;
}

export interface FavoriteListing {
  favoriteListingId: number;
  listingRentId: number;
  userId: number;
  createAt: string;
  favoriteGroupId: number;
  listingRent: ListingRent;
}

export interface ListingRent {
  listingRentConfirmationDate: string;
  listingRentId: number;
  status: string | null;
  name: string;
  description: string;
  minimunRentalPerDay: RentalValue;
  approvalRequestDays: number;
  phoneNumber: string | null;
  ownerUserId: number;
  listingStatusId: number;
  stepsCount: number;
  cancelationPolicyTypeId: number;
  approvalPolicyTypeId: number;
  accomodationTypeId: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  allDoorsLocked: boolean;
  beds: number;
  externalCameras: boolean | null;
  presenceOfWeapons: boolean | null;
  noiseDesibelesMonitor: boolean | null;
  accomodationType: any;
  approvalPolicy: any;
  cancelationPolicy: any;
  owner: any;
  property: any;
  price: Price;
  checkInOutPolicies: any[];
  amenities: any[];
  featuredAspects: any;
  photos: any[];
  rentRules: any[];
  reviews: any[];
  securityItems: any[];
  spaces: any[];
  stayPresences: any;
  valoration: number;
  historyDate: string | null;
  isFavorite: boolean;
}

export interface RentalValue {
  source: string;
  parsedValue: number;
}

export interface Price {
  priceNightly: number | null;
  securityDepositPrice: number | null;
  currency: string | null;
  currencyCode: string | null;
  tlListingDiscountForRates: any[];
  specialDatePrices: any;
}

const DetailWishList: React.FC = () => {
  const theme = useTheme();
  const { id: groupIdParam } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const showSnackbar = useSnackbar();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { t } = useTranslation();

  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  // --- Fetch favoritos por grupo ---
  const {
    data: response,
    isLoading,
    error,
  } = useQuery<ApiResponse<FavoriteGroupResponse>>({
    queryKey: ['favorite-group', groupIdParam],
    queryFn: () =>
      ApiService.get<ApiResponse<FavoriteGroupResponse>>(`/ListingRent/Favorites/${groupIdParam}`),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!groupIdParam,
  });

  const favoriteList = response?.data;

  // --- Mutación para eliminar favorito ---
  const deleteFavoriteMutation = useMutation({
    mutationFn: async ({ listingRentId, groupId }: { listingRentId: string; groupId: number }) => {
      return ApiService.delete(`/ListingRent/${listingRentId}/Favorite`, {
        params: { groupId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-group', groupIdParam] });
      setSelectedListingId(null);
      showSnackbar(t('detailWishList.deleteSuccess'), 'success');
    },
    onError: (err) => {
      console.error('Error al eliminar favorito:', err);
      setSelectedListingId(null);
      showSnackbar(t('detailWishList.deleteError'), 'error');
    },
  });

  const handleFavoriteChange = (listingId: string, isFavorited: boolean) => {
    // Si isFavorited es true, significa que el card ES favorito y se debe eliminar
    if (isFavorited && favoriteList) {
      setSelectedListingId(listingId);
      deleteFavoriteMutation.mutate({
        listingRentId: listingId.toString(),
        groupId: favoriteList.favoriteGroupListingId,
      });
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

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: isMobile ? 1 : 6 }}
    >
      <Stack direction="column">
        <Typography
          sx={{ fontFamily: theme.typography.h2, color: theme.palette.text.primary, mb: 0 }}
        >
          {`${t('detailWishList.title')}:  ${favoriteList?.favoriteGroupName ?? ''}`}
        </Typography>
        <Box>
          <GoBack />
        </Box>
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
            }}
          >
            {[...Array(getSkeletonCount())].map((_, i) => (
              <AirbnbCardSkeleton key={i} />
            ))}
          </Box>
        ) : error ? (
          <Typography color="error">
            {error instanceof Error ? error.message : t('detailWishList.loadingError')}
          </Typography>
        ) : !favoriteList || favoriteList.tlListingFavorites.length === 0 ? (
          <EmptyState
            title={t('detailWishList.emptyStateTitle')}
            description={t('detailWishList.emptyStateDescription')}
            icon={FavoriteBorderIcon}
            buttonRoute={AssertRoutes.HOME}
            buttonLabel={t('detailWishList.exploreLodgings')}
          />
        ) : (
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
            {favoriteList.tlListingFavorites.map((favorite, idx) => {
              const rent = favorite.listingRent;
              if (!rent) return null;

              const principalPhoto = rent.photos?.find((p: any) => p.isPrincipal)?.photoLink;
              const mainImage =
                principalPhoto ??
                rent.photos?.[0]?.photoLink ??
                (Images[idx % Images.length] as unknown as string);

              const sortedImages = rent.photos?.length
                ? [
                    ...rent.photos.filter((p: any) => p.isPrincipal).map((p: any) => p.photoLink),
                    ...rent.photos.filter((p: any) => !p.isPrincipal).map((p: any) => p.photoLink),
                  ]
                : [mainImage];

              return (
                <AirbnbCard
                  key={favorite.favoriteListingId}
                  listingRentId={rent.listingRentId.toString()}
                  images={sortedImages}
                  location={
                    rent.property?.address?.city?.city ??
                    rent.property?.address?.city?.state ??
                    'Desconocido'
                  }
                  country={rent.property?.countryName ?? 'Bolivia'}
                  title={rent.name}
                  price={rent.price?.priceNightly ? `${rent.price.priceNightly} ` : '0'}
                  rating={rent.valoration ?? 0}
                  bedrooms={rent.bedrooms}
                  bathrooms={rent.bathrooms}
                  beds={rent.beds}
                  isFavorite={true}
                  isTogglingFavorite={
                    deleteFavoriteMutation.isPending &&
                    selectedListingId?.toString() === rent.listingRentId.toString()
                  }
                  onToggleFavorite={() => {}}
                  setIsFavorite={(isFav) =>
                    handleFavoriteChange(rent.listingRentId.toString(), isFav)
                  }
                />
              );
            })}
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default DetailWishList;
