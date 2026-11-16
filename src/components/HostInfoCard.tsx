import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import { useAuthContext } from '@/modules/_auth/context';
import { useHostStore } from '@/store/useHostStore';
import Jom from '@/assets/LogoJOM-BLANCO.svg';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SignInForm from './SignInForm';
import { useGet2 } from '@/hooks/api';

interface Owner {
  listingRentId?: number;
  name?: string;
  lastName?: string;
  favoriteName?: string;
  photoLink?: string;
  gender?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  phoneCode?: string | null;
  emergencyContact?: string | null;
  documents?: any[];
  phones?: any[];
  profilePhotos?: any[];
  registerDate?: string;
  registerDateDays?: number;
  registerDateMonths?: number;
  registerDateYears?: number;
  hostId?: number;
  userId: number;
  rating?: number;
  countReviews?: number;
  isDocumentVerified?: boolean;
  isSuperHost?: boolean;
}

export interface UserProfileData {
  additionalProfileDataId: number;
  userId: number;
  lastName: string;
  name: string;
  whatIDo: string;
  wantedToGo: string;
  pets: string | null;
  birthday: string;
  languages: Language[];
  liveAt: LiveAt;
  introduceYourself: null | string;
}
export interface Language {
  languageId: number;
  code: string;
  detail: string;
}

export interface LiveAt {
  cityId: number;
  cityName: string;
  location: string;
  liveAtShow: string;
}
const HostInfoCard = ({
  listingRentId,
  photoLink,
  name,
  lastName,
  registerDateMonths,
  hostId,
  userId,
  rating,
  countReviews,
  isDocumentVerified = false,
}: Owner) => {
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [loginType, setLoginType] = useState<'registration' | 'login'>('login');
  const handleRouteLink = useHandleRouteLink();
  const { isGuestAuthenticated } = useAuthContext();
  const theme = useTheme();
  const setHostId = useHostStore((state) => state.setHostId);
  const setUserId = useHostStore((state) => state.setUserId);
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const { t } = useTranslation();

  const handleCloseModal = () => {
    setIsModalLogin(false);
  };
  const {
    data: hostProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useGet2<UserProfileData>(
    ['host-profile-detail', hostId],
    `/GetAdditionalProfileDataByUserId/${hostId}`
  );
  if (isLoadingProfile) return <Typography>loading data...</Typography>;
  if (isErrorProfile) return <Typography>Error data...</Typography>;

  let url = photoLink;
  const photo = url?.replace('https://localhost:44317', 'http://assert-dev.runasp.net');
  return (
    <Box sx={{ position: 'relative', py: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.15,
          zIndex: 0,
          animation: 'pulseAura 8s infinite ease-in-out',
          '@keyframes pulseAura': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.15 },
            '50%': { transform: 'scale(1.2)', opacity: 0.25 },
          },
        }}
      />
      <Grid container spacing={{ xs: 2, md: 4 }} alignItems="stretch">
        <Grid size={{ xs: 12, md: isLargeScreen ? 4 : 5 }}>
          <Card
            elevation={0}
            onClick={() => {
              if (!isGuestAuthenticated) {
                setIsModalLogin(true);
                setLoginType('login');
              } else {
                hostId && handleRouteLink(`/show-profile/${hostId}/${listingRentId}`);
              }
            }}
            sx={{
              backgroundColor: '#ffffff',
              color: '#fff',
              p: { xs: 3, md: 5 },
              borderRadius: 6,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: { xs: 'auto', md: 'auto' },
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Box
              component="img"
              src={Jom}
              sx={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                width: 150,
                opacity: 0.1,
                filter: 'grayscale(1)',
              }}
            />
            <Box display="flex" height="100%" justifyContent={'center'}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ position: 'relative', zIndex: 1 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 130, md: 170 },
                    height: { xs: 130, md: 170 },
                    mb: 1.5,
                  }}
                >
                  <Avatar
                    src={photo}
                    sx={{
                      width: '100%',
                      height: '100%',
                      border: '6px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 0 20px rgba(0,0,0,0.2)',
                    }}
                  />
                  {isDocumentVerified && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        right: -4,
                        width: 48,
                        height: 58,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                      >
                        <path
                          d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"
                          fill="white"
                        />
                        <path
                          d="M12 2.5L5 6V11C5 15.52 8.02 19.69 12 20.93C15.98 19.69 19 15.52 19 11V6L12 2.5Z"
                          fill="#5B55C8"
                        />
                        <path
                          d="M10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.59L10 14.17Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  )}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                    fontSize: { xs: '0.9rem', md: '1.05rem' },
                    lineHeight: 1.2,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {name} {lastName}
                </Typography>
                <Chip
                  label={'Anfitrión'}
                  size="medium"
                  sx={{
                    mt: 1,
                    pr: 2,
                    pl: 2,
                    backgroundColor: '#EFEEFF',
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    fontSize: { xs: '0.72rem', md: '0.85rem' },
                    borderRadius: '20px',
                    height: 'auto',
                    px: 0.5,
                    '& .MuiChip-label': { px: 1.5, py: 0.4 },
                  }}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
                width="45%"
                pl={4.5}
                sx={{ position: 'relative', zIndex: 1 }}
              >
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.6rem', md: '1.8rem' },
                      lineHeight: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {countReviews}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      opacity: 0.85,
                      // textTransform: 'uppercase',
                      mt: 0.7,
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {t('hostInfoCard.review')}
                  </Typography>
                  <Divider
                    sx={{
                      mt: 1.2,
                      width: '100px',
                      borderColor: theme.palette.divider,
                      borderWidth: '1.5px',
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.6rem', md: '1.8rem' },
                      lineHeight: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {rating} ★
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      opacity: 0.85,
                      // textTransform: 'uppercase',
                      mt: 0.7,
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {t('hostInfoCard.score')}
                  </Typography>
                  <Divider
                    sx={{
                      mt: 1.2,
                      width: '100px',
                      borderColor: theme.palette.divider,
                      borderWidth: '1.5px',
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.6rem', md: '1.8rem' },
                      lineHeight: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {registerDateMonths}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      opacity: 0.85,
                      // textTransform: 'uppercase',
                      mt: 0.7,
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {t('hostInfoCard.monthsOnPlatform')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: isLargeScreen ? 8 : 7 }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#1e293b',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              {t('hostInfoCard.hostInfoTitle')}
            </Typography>

            <Typography
              sx={{
                color: '#64748b',
                lineHeight: 1.8,
                mb: 3,
                maxWidth: '90%',
                fontSize: '1.05rem',
              }}
            >
              {`Mi nombre es ${hostProfile?.data?.name || 'Nombre desconocido'} ${hostProfile?.data?.lastName || ''}`}
              <br />
              {`Vivo en ${hostProfile?.data?.liveAt?.liveAtShow || 'Ubicacion desconocida'} •`}
              {(hostProfile?.data?.languages?.length ?? 0) > 0 &&
                ` Hablo  ${hostProfile!.data.languages.map((l) => l.detail).join('   - ')}`}
            </Typography>

            <Button
              variant="primary"
              fullWidth={false}
              sx={{
                mb: 3,
                width: '250px',
              }}
              onClick={() => {
                if (!isGuestAuthenticated) {
                  setIsModalLogin(true);
                  setLoginType('login');
                }

                if (hostId && userId) {
                  setHostId(hostId);
                  setUserId(userId);
                  if (!isGuestAuthenticated) {
                    setIsModalLogin(true);
                    setLoginType('login');
                  } else {
                    handleRouteLink(`/messages/host/${listingRentId}/true`);
                  }
                }
              }}
            >
              {t('hostInfoCard.contactButton')}
            </Button>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '16px',
                padding: '1rem',
              }}
            >
              <Box display={'flex'} gap={1} alignItems={'center'} mb={0}>
                <LocalPoliceOutlinedIcon
                  sx={{ color: '#64748b', fontSize: '1.2rem', flexShrink: 0 }}
                />
                <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5, fontSize: '1rem' }}>
                  {t('hostInfoCard.securityTitle')}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}
                >
                  {t('hostInfoCard.securityText')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <SignInForm open={isModalLogin} onClose={handleCloseModal} typeLogin={loginType} />
    </Box>
  );
};

export default HostInfoCard;
