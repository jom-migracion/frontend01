import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ReviewCard from '../components/ReviewCard';
import CardProfile from '../components/CardProfile';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import ReviewModal from '../components/ReviewModal';
import { usePost } from '@/hooks/api';
import { ProfileInfo } from '@/models/interfaces/ProfileInfo';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '@/modules/_auth/context';
import { ProfileCardProps } from '@/models/interfaces/profile/ProfileCardProps';
import EmptyState from '@/components/EmptyState';
//import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const [openReview, setOpenReview] = useState(false);
  const [openReviewHost, setOpenReviewHost] = useState(false);
  const handleRouteLink = useHandleRouteLink();
  const { isGuestAuthenticated, isHostAuthenticated } = useAuthContext();
  const [profileData, setProfileData] = useState<ProfileCardProps>({
    role: '',
    name: '',
    hostings: 0,
    reviews: 0,
    rating: 0,
    timeInAssert: '',
    guestHostingsTotal: 0,
    avatarSrc: '',
    isDocumentVerified: false,
  });
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const [reviewsHostData, setReviewsHostData] = useState<any>([]);
  const [reviewsGuestData, setReviewsGuestData] = useState<any>([]);
  const [countReviewsHost, setCountReviewsHost] = useState<number>(0);
  const [countReviewsGuest, setCountReviewsGuest] = useState<number>(0);

  const { mutate: ProfileInfoPost } = usePost<ProfileInfo>('/GetProfile');
  useEffect(() => {
    handleSubmitListingRent();
  }, []);

  const handleSubmitListingRent = async () => {
    ProfileInfoPost(
      {},
      {
        onSuccess: (responseData) => {
          if (isGuestAuthenticated) {
            setProfileData({
              role: 'guest',
              name: `${responseData.data.name} ${responseData.data.lastName}`,
              hostings: responseData.data.guestHostingsTotal,
              reviews: responseData.data.countReviewsGuest,
              rating: responseData.data.guestReviewCalification,
              timeInAssert: responseData.data.timeInAssert || '',
              guestHostingsTotal: responseData.data.guestHostingsTotal || 0,
              avatarSrc: responseData.data.avatar,
              isDocumentVerified: responseData.data.isDocumentVerified || false,
            });
            setReviewsGuestData(responseData.data?.guestReviews || []);
            setCountReviewsGuest(responseData.data?.countReviewsGuest || 0);
          } else if (isHostAuthenticated) {
            setProfileData({
              role: 'host',
              name: `${responseData.data.name} ${responseData.data.lastName}`,
              hostings: responseData.data.hostHostingsTotal,
              reviews: responseData.data.countReviewsHost,
              rating: responseData.data.hostReviewCalification,
              timeInAssert: responseData.data.timeInAssert || '',
              guestHostingsTotal: responseData.data.guestHostingsTotal || 0,
              avatarSrc: responseData.data.avatar,
              isDocumentVerified: responseData.data.isDocumentVerified || false,
            });
            setReviewsHostData(responseData.data?.hostReviews || []);
            setCountReviewsHost(responseData.data?.countReviewsHost || 0);
          } else {
            setProfileData({
              role: 'guest',
              name: '',
              hostings: 0,
              reviews: 0,
              timeInAssert: '',
              avatarSrc: '',
              isDocumentVerified: false,
            });
          }
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <Container
      maxWidth={isMobile ? 'sm' : isLargeScreen ? 'xl' : 'lg'}
      sx={{
        px: { xs: 2, sm: 4, md: isMobile ? 5 : 4 },
        mt: '40px',
      }}
    >
      <Box>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: isLargeScreen ? 4 : 5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontFamily: theme.typography.h2,
                  color: theme.palette.text.primary,
                }}
              >
                {t('myProfile.title')}
              </Typography>
              <Button
                variant="secondary"
                sx={{ mb: 2, mt: 1 }}
                onClick={() => handleRouteLink(AssertRoutes.ACCOUNT_PROFILE_EDIT)}
              >
                {t('commonNames.edit')}
              </Button>
            </Box>
            <CardProfile {...profileData} />
          </Grid>
          <Grid size={{ xs: 12, md: isLargeScreen ? 8 : 7 }}>
            {isGuestAuthenticated && (
              <Box sx={{ p: 2 }}>
                <Typography
                  sx={{
                    fontFamily: theme.typography.h2,
                    color: theme.palette.text.primary,
                    mt: '6px',
                    mb: 2,
                  }}
                >
                  {t('myProfile.guestReviews')}{' '}
                  {countReviewsGuest == 0 ? '' : `(${countReviewsGuest})`}
                </Typography>
                <Box display={'flex'} flexDirection={'column'}>
                  <Box display={'flex'} flexDirection={'column'}>
                    <Divider />
                  </Box>
                </Box>

                {profileData.reviews == 0 ? (
                  <Box>
                    <EmptyState
                      title={t('myProfile.noGuestReviews.title')}
                      description={t('myProfile.noGuestReviews.description')}
                      icon={StarIcon}
                      align="left"
                    />
                  </Box>
                ) : (
                  <>
                    {reviewsGuestData.map((review: any, index: number) => (
                      <React.Fragment key={index}>
                        <ReviewCard {...review} />
                        {index < reviewsGuestData.length - 1 && (
                          <Divider
                            sx={{
                              width: '100%',
                              mx: 'auto',
                              borderColor: 'rgba(15, 23, 42, 0.2)',
                              borderBottomWidth: 1,
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                    {countReviewsGuest > 0 && (
                      <Button variant="secondary" onClick={() => setOpenReview(true)}>
                        {t('myProfile.showAllReviews')}
                      </Button>
                    )}
                    <ReviewModal
                      open={openReview}
                      data={reviewsGuestData}
                      onClose={() => setOpenReview(false)}
                      isHost={false}
                    />
                  </>
                )}
              </Box>
            )}
            {isHostAuthenticated && (
              <Box sx={{ p: 2 }}>
                <Typography
                  sx={{
                    fontFamily: theme.typography.h2,
                    color: theme.palette.text.primary,
                    mb: 2,
                    mt: 1,
                  }}
                >
                  {t('myProfile.hostReviews')} ({countReviewsHost})
                </Typography>
                <Box display={'flex'} flexDirection={'column'}>
                  <Box display={'flex'} flexDirection={'column'}>
                    <Divider />
                  </Box>
                </Box>
                {profileData.reviews == 0 ? (
                  <Box>
                    <EmptyState
                      title={t('myProfile.noGuestReviews.title')}
                      description={t('myProfile.noGuestReviews.description')}
                      icon={StarIcon}
                      align="left"
                    />
                  </Box>
                ) : (
                  <>
                    {reviewsHostData.map((review: any, index: number) => (
                      <React.Fragment key={index}>
                        <ReviewCard {...review} />
                        {index == reviewsHostData.length - 1 ? null : (
                          <Divider
                            sx={{
                              width: '100%',
                              mx: 'auto',
                              borderColor: 'rgba(15, 23, 42, 0.2)',
                              borderBottomWidth: 1,
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                    {countReviewsHost > 0 && (
                      <Button variant="secondary" onClick={() => setOpenReviewHost(true)}>
                        {t('myProfile.showAllReviews')}
                      </Button>
                    )}
                    <ReviewModal
                      open={openReviewHost}
                      data={reviewsHostData}
                      onClose={() => setOpenReviewHost(false)}
                      isHost={true}
                    />
                  </>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProfilePage;
