import { Card, Typography, Box, Avatar, Divider, Link, Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProfileCardProps } from '@/models/interfaces/profile/ProfileCardProps';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CustomDialog from '@/components/CustomDialog';
import { useState } from 'react';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const AccountCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  reviews,
  rating,
  timeInAssert,
  guestHostingsTotal,
  avatarSrc,
  isDocumentVerified = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isVerifiedModalOpen, setIsVerifiedModalOpen] = useState(false);
  const backgroundColor = role === 'host' ? theme.palette.primary.main : '#ffffff';
  const textColor = role === 'host' ? '#fff' : '#000';
  const handleOpenVerifiedModal = () => setIsVerifiedModalOpen(true);
  const handleCloseVerifiedModal = () => setIsVerifiedModalOpen(false);
  const handleRouteLink = useHandleRouteLink();

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: backgroundColor,
        color: textColor,
        borderRadius: '32px',
        py: { xs: 2.5, md: 4 },
        px: { xs: 2.5, md: 4 },
        boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box display={'flex'} alignItems="stretch">
        <Box
          display="flex"
          justifyContent="center"
          mb={0}
          flexDirection={'column'}
          alignItems={'center'}
          width={{ xs: '62%', md: '65%' }}
        >
          <Box
            sx={{ position: 'relative', display: 'inline-block' }}
            onClick={handleOpenVerifiedModal}
          >
            <Avatar
              alt="Host"
              src={avatarSrc?.replace('https://localhost:44317', 'http://assert-dev.runasp.net')}
              sx={{
                width: { xs: 130, md: 150 },
                height: { xs: 130, md: 150 },
                boxShadow: '0 3px 10px rgba(15, 23, 42, 0.15)',
                border: '6px solid #EFEEFF',
              }}
            />
            {isDocumentVerified ? (
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: -8,
                  width: 48,
                  height: 48,
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
            ) : (
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: -4,
                  width: 40,
                  height: 40,
                  background: '#fff',
                  borderRadius: '50%',
                  border: '1px solid #e4e4e4',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <HelpOutlineOutlinedIcon sx={{ fontSize: 26, color: '#929292' }} />
                </div>
              </div>
            )}
          </Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mt: 2.5,
              mb: 1.5,
              textAlign: 'center',
              color:
                role === 'host' ? theme.palette.primary.contrastText : theme.palette.text.primary,
              lineHeight: 1.2,
            }}
          >
            {name || 'JOM'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              background: '#EFEEFF',
              py: 0.5,
              px: 4,
              borderRadius: '999px',
              color: role.toLocaleLowerCase() === 'host' ? theme.palette.text.primary : '#302a9c',
              fontSize: '0.7rem',
            }}
          >
            {role.toLocaleLowerCase() === 'host' ? t('commonNames.host') : t('commonNames.guest')}
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-start"
          mb={0}
          flexDirection={'column'}
          alignItems={'flex-start'}
          width={{ xs: '38%', md: '35%' }}
          pt={{ xs: 1, md: 1.5 }}
        >
          {role !== 'host' && <Box width={'100%'} pb={3}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={
                role === 'host' ? theme.palette.primary.contrastText : theme.palette.text.primary
              }
            >
              {guestHostingsTotal}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.70rem',
                color:
                  role === 'host'
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.secondary,
              }}
            >
              Viaje
            </Typography>
            <Divider sx={{ mt: 1, width: '95%', backgroundColor: 'rgba(148, 163, 184, 0.4)' }} />
          </Box>}
          <Box width={'100%'} pb={3}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={
                role === 'host' ? theme.palette.primary.contrastText : theme.palette.text.primary
              }
            >
              {reviews}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.70rem',
                color:
                  role === 'host'
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.secondary,
              }}
            >
              {t('commonNames.review')}
            </Typography>
            <Divider sx={{ mt: 1, width: '95%', backgroundColor: 'rgba(148, 163, 184, 0.4)' }} />
          </Box>
          {role === 'host' && (
            <Box width={'100%'} pb={3}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={
                  role === 'host' ? theme.palette.primary.contrastText : theme.palette.text.primary
                }
              >
                {rating?.toFixed(1).toString() == '0.0' ? (
                  <span className="text-2xl font-bold text-jom-gray-900">—</span>
                ) : (
                  <>{rating?.toFixed(1)} ★</>
                )}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.70rem',
                  color:
                    role === 'host'
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                }}
              >
                {t('commonNames.score')}
              </Typography>
              <Divider sx={{ mt: 1, width: '95%', backgroundColor: 'rgba(148, 163, 184, 0.4)' }} />
            </Box>
          )}
          <Box width={'100%'}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={
                role === 'host' ? theme.palette.primary.contrastText : theme.palette.text.primary
              }
            >
              {timeInAssert}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.70rem',
                color:
                  role === 'host'
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.secondary,
              }}
            >
              Tiempo en Assert
            </Typography>
          </Box>
        </Box>
      </Box>
      <CustomDialog
        isOpen={isVerifiedModalOpen}
        onClose={handleCloseVerifiedModal}
        maxWidth="sm"
        title=""
      >
        {isDocumentVerified ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            gap={2}
            py={2}
            p={0}
            m={0}
          >
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                backgroundColor: '#6C63FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VerifiedUserIcon sx={{ color: '#fff', fontSize: 44 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>
              {t('accountCard.verifiedModal.verified.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={400}>
              {t('accountCard.verifiedModal.verified.description')}{' '}
              <Link
                href="#"
                underline="always"
                color="inherit"
                onClick={() => handleRouteLink(AssertRoutes.ACCOUNT_SETTINGS)}
              >
                {t('accountCard.verifiedModal.verified.link')}
              </Link>
            </Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            gap={2}
            py={2}
            p={0}
            m={0}
          >
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                backgroundColor: '#6C63FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VerifiedUserIcon sx={{ color: '#fff', fontSize: 44 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>
              {t('accountCard.verifiedModal.unverified.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={400}>
              {t('accountCard.verifiedModal.unverified.description')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleRouteLink(AssertRoutes.ACCOUNT_SETTINGS)}
            >
              {t('accountCard.verifiedModal.unverified.button')}
            </Button>
          </Box>
        )}
      </CustomDialog>
    </Card>
  );
};

export default AccountCard;
