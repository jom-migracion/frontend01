import { AssertRoutes } from '@/common/enum/AssertRoutes';
import CustomDialog from '@/components/CustomDialog';
import EmptyState from '@/components/EmptyState';
import FavoriteListCard from '@/components/FavoriteListCard';
import SkeletonWishListCard from '@/components/SkeletonWishListCard';
import { Listing } from '@/models/interfaces/Listing';
import { ApiService } from '@/services/ApiService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import SearchIcon from '@mui/icons-material/Search';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { GoBack } from '@/components/GoBack';

interface IPhoto {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string;
  position: number;
  spaceType: string | null;
  spaceTypeCode: string | null;
  spaceTypeId: number | null;
  listingPhotoId: number;
}

interface IAccommodationType {
  accommodationName: string;
  accommodationDescription: string;
  accommodationTypeId: number;
  accomodationCode: string;
}

interface IOwner {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender: string | null;
  email: string | null;
  phoneNumber: string | null;
  phoneCode: string | null;
  emergencyContact: string | null;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate: string;
  registerDateDays: number | null;
  registerDateMonths: number | null;
  registerDateYears: number | null;
  cityName: string;
  status: string;
}

interface ICity {
  cityId: number;
  city: string;
  state: string;
  stateCode: string | null;
  country: string;
  countryCode: string | null;
  county: string;
  latitude: number | null;
  longitude: number | null;
}

interface IAddress {
  zipCode: string;
  address1: string;
  address2: string;
  cityId: number;
  countyId: number;
  stateId: number;
  city: ICity;
}

interface IPropertyType {
  subTypeCode: string;
  subType: string;
  subTypeIcon: string;
  type: string;
  typeCode: string;
  typeIcon: string | null;
  propertySubtypeId: number;
}

interface IProperty {
  latitude: number;
  longitude: number;
  address: IAddress | null;
  type: IPropertyType;
  distanceMeters: number;
  cityName: string;
  countyName: string;
  stateName: string;
  countryName: string;
}

interface IPrice {
  priceNightly: number;
  securityDepositPrice: number | null;
  currency: string | null;
  currencyCode: string | null;
  listingPriceId: number;
  listingRentId: number;
  listingPriceOfferId: number | null;
  timeUnitId: number | null;
  currencyId: number;
  weekendNightlyPrice: number;
  tlListingDiscountForRates: any[];
  specialDatePrices: any;
}

interface IReview {
  user: IOwner | null;
  dateTimeReview: string;
  calification: number;
  comment: string;
  userProfilePhoto: string | null;
  isComplete: boolean;
  listingReviewId: number;
  userId: number;
  listingRentId: number;
  bookId: number | null;
  reviewQuestions: any[];
  listingRent: Omit<
    IListingRent,
    | 'tlListingFavorites'
    | 'reviews'
    | 'securityItems'
    | 'spaces'
    | 'stayPresences'
    | 'featuredAspects'
    | 'amenities'
    | 'checkInOutPolicies'
    | 'rentRules'
    | 'accomodationType'
    | 'approvalPolicy'
    | 'cancelationPolicy'
  >;
}

interface IListingRent {
  listingRentId: number;
  status: string | null;
  name: string;
  description: string;
  minimunRentalPerDay: number | null;
  approvalRequestDays: number | null;
  phoneNumber: string | null;
  ownerUserId: number;
  listingStatusId: number;
  stepsCount: number | null;
  cancelationPolicyTypeId: number;
  approvalPolicyTypeId: number;
  accomodationTypeId: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  allDoorsLocked: boolean | null;
  beds: number;
  externalCameras: boolean | null;
  presenceOfWeapons: boolean | null;
  noiseDesibelesMonitor: boolean | null;
  listingRentConfirmationDate: string;
  accomodationType: IAccommodationType;
  approvalPolicy: any;
  cancelationPolicy: any;
  owner: IOwner;
  property: IProperty;
  price: IPrice;
  checkInOutPolicies: any[];
  amenities: any[];
  featuredAspects: any[];
  photos: IPhoto[];
  rentRules: any[];
  reviews: IReview[];
  securityItems: any[];
  spaces: any[];
  stayPresences: any | null;
  valoration: number;
  totalRents: string;
  myProperty: number;
  isFavorite: boolean;
  privateBathroom: number | null;
  privateBathroomLodging: number | null;
  sharedBathroom: number | null;
  avgReviews: number | null;
  minimunStay: number | null;
  maximumStay: number | null;
  minimumNotice: number | null;
  minimumNoticeHour: number | null;
  preparationDays: number | null;
  availabilityWindowMonth: number | null;
  checkInDays: number | null;
  checkOutDays: number | null;
}

interface ITlListingFavorite {
  favoriteListingId: number;
  listingRentId: number;
  userId: number;
  createAt: string | null;
  favoriteGroupId: number | null;
  listingRent: IListingRent;
}

interface FavoriteGroupListing {
  favoriteGroupListingId: number;
  userId: number;
  favoriteGroupName: string;
  creationDate: string | null;
  groupStatus: number;
  tlListingFavorites: ITlListingFavorite[];
  totalRegisters: number;
}

interface ApiResponse<T> {
  data: T;
  statusCode: string;
  hasError: boolean;
  resultError: any | null;
}

const QUERY_KEY = ['favorite-lists'];

const WishList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [_, setDeleteError] = useState<string | null>(null);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    data: response,
    isLoading: isLoadingLists,
    error: listsError,
  } = useQuery<ApiResponse<FavoriteGroupListing[]>>({
    queryKey: QUERY_KEY,
    queryFn: () => ApiService.get<ApiResponse<FavoriteGroupListing[]>>('/ListingRent/Favorites'),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Obtener las últimas 4 propiedades vistas ordenadas por fecha
  const { data: viewsHistoryResponse } = useQuery<ApiResponse<Listing[]>>({
    queryKey: ['views-history-for-card'],
    queryFn: async () => {
      const params = new URLSearchParams({
        pageNumber: '1',
        pageSize: '100',
      }).toString();
      return await ApiService.get<ApiResponse<Listing[]>>(`/ListingRent/ViewsHistory?${params}`);
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: (data) => {
      const sortedData = [...(data.data || [])].sort((a, b) => {
        const dateA = a.historyDate ? new Date(a.historyDate).getTime() : 0;
        const dateB = b.historyDate ? new Date(b.historyDate).getTime() : 0;
        return dateB - dateA;
      });
      return {
        ...data,
        data: sortedData.slice(0, 4),
      };
    },
  });

  const viewsHistory = viewsHistoryResponse?.data ?? [];
  const lists = response?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ApiService.delete<null>(`/favorite/${id}`),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousData = queryClient.getQueryData<ApiResponse<FavoriteGroupListing[]>>(QUERY_KEY);
      queryClient.setQueryData<ApiResponse<FavoriteGroupListing[]>>(QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((list) => list.favoriteGroupListingId !== id),
        };
      });

      return { previousData };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEY, context.previousData);
      }
      setDeleteError(
        (typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          (error as any).response?.data?.message) ||
          (error as any)?.message ||
          'No se pudo eliminar la lista'
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      setOpen(false);
      setSelectedGroupId(null);

      queryClient.invalidateQueries({
        queryKey: ['listingRent'],
        exact: false,
        refetchType: 'active',
      });
    },
  });

  const handleOpenModal = (groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGroupId(groupId);
    setOpen(true);
    setDeleteError(null);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedGroupId(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = () => {
    if (selectedGroupId) {
      setDeleteError(null);
      deleteMutation.mutate(selectedGroupId);
    }
  };

  const favoriteList = (id: string) => {
    id == '-1' ? navigate(`/wishlist/viewed`) : navigate(`detailt/${id}`);
  };

  const getSkeletonCount = () => {
    if (isLargeScreen) {
      return 15;
    }
    if (theme.breakpoints.values.lg && window.innerWidth >= theme.breakpoints.values.lg) {
      return 12;
    }
    if (theme.breakpoints.values.md && window.innerWidth >= theme.breakpoints.values.md) {
      return 9;
    }
    if (theme.breakpoints.values.sm && window.innerWidth >= theme.breakpoints.values.sm) {
      return 4;
    }
    return 2;
  };

  const { t } = useTranslation();

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 3, md: isLargeScreen ? 5 : 4 }, mt: { xs: 2, md: 6 } }}
    >
      <Typography sx={{ fontFamily: theme.typography.h2, color: theme.palette.text.primary }}>
        {t('favorites.title')}
      </Typography>
      <Box>
        <GoBack />
      </Box>

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
        {isLoadingLists ? (
          Array.from({ length: getSkeletonCount() }).map((_, i) => (
            <SkeletonWishListCard key={`skeleton-${i}`} />
          ))
        ) : listsError ? (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
            <Typography color="error">
              {listsError instanceof Error ? listsError.message : `${t('favorites.loadError')}`}
            </Typography>
          </Box>
        ) : lists.length > 0 ? (
          lists.map((list) => (
            <FavoriteListCard
              key={list.favoriteGroupListingId}
              favoriteGroupListingId={list.favoriteGroupListingId}
              favoriteGroupName={
                list.favoriteGroupName == 'Historial de Vistas'
                  ? t('favorites.viewHistory')
                  : list.favoriteGroupName
              }
              totalRegisters={list.totalRegisters}
              tlListingFavorites={
                list.favoriteGroupListingId === -1
                  ? viewsHistory.map((listing) => ({
                      favoriteListingId: 0,
                      listingRentId: listing.listingRentId,
                      userId: 0,
                      createAt: listing.listingRentConfirmationDate,
                      favoriteGroupId: -1,
                      listingRent: listing,
                    }))
                  : list.tlListingFavorites
              }
              onCardClick={favoriteList}
              onDeleteClick={handleOpenModal}
            />
          ))
        ) : (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 0 }}>
            <Box
              sx={{ gridColumn: '1 / -1' }}
              width={'100%'}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <EmptyState
                title={t('travel.noReservationsTitle')}
                description={t('travel.noReservationsDescription')}
                icon={SearchIcon}
                buttonRoute={AssertRoutes.HOME}
                buttonLabel={t('travel.exploreLodgings')}
              />
            </Box>
          </Box>
        )}
      </Box>

      <CustomDialog
        isOpen={open}
        onClose={handleCloseModal}
        title={t('favorites.deleteDialog.title')}
        maxWidth="xs"
      >
        <Box
          sx={{
            borderRadius: 6,
          }}
        >
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            {t('favorites.deleteDialog.text')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            fullWidth
            variant="error"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Stack direction="row" alignItems="center">
                <CircularProgress size={24} style={{ color: 'white' }} />
              </Stack>
            ) : (
              t('favorites.deleteDialog.delete')
            )}
          </Button>
          <Button fullWidth variant="secondary" onClick={handleCloseModal}>
            {t('commonNames.cancel')}
          </Button>
        </Box>
      </CustomDialog>
    </Container>
  );
};

export default WishList;
