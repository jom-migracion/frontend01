import React from 'react';
import { Avatar, Box, Divider, Grid2, Link, Stack, Typography } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';

interface HostAboutSectionProps {
  owner?: {
    name?: string;
    lastName?: string;
    photoLink?: string;
  } | null;
  additionalInformation?: any;
  introduceYourself?: string | null;
}

const HostAboutSection: React.FC<HostAboutSectionProps> = ({
  owner,
  additionalInformation,
  introduceYourself,
}) => {
  const { t } = useTranslation();

  const birthday = additionalInformation?.birthday
    ? format(parseISO(additionalInformation.birthday), 'dd/MM/yyyy')
    : t('reservationCommon.noInfo');

  return (
    <Box mt={8}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
          {t('reservationPending.hostTitle')}{' '}
          {`${owner?.name || ''} ${owner?.lastName || ''}`.trim()}
        </Typography>
        <Avatar
          src={owner?.photoLink}
          alt={owner?.name || t('reservationCommon.hostFallback')}
          sx={{ width: 48, height: 48 }}
        />
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <WorkOutlineIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                {t('reservationCommon.hostInfo.whatIDo')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                {additionalInformation?.whatIDo ?? t('reservationCommon.noInfo')}
              </Typography>
            </Box>
          </Stack>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <CakeOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                {t('reservationCommon.hostInfo.birthday')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                {birthday}
              </Typography>
            </Box>
          </Stack>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <PetsOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                {t('reservationCommon.hostInfo.pets')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                {additionalInformation?.pets ?? t('reservationCommon.noInfo')}
              </Typography>
            </Box>
          </Stack>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <LocationOnOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                {t('reservationCommon.hostInfo.whereILive')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                {additionalInformation?.liveAt?.liveAtShow ?? t('reservationCommon.noInfo')}
              </Typography>
            </Box>
          </Stack>
        </Grid2>
      </Grid2>

      <Box
        sx={{
          p: 2.5,
          bgcolor: '#f8fafc',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.100',
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 15, color: 'text.primary' }}>
          {t('reservationPending.aboutHost')}
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
          {introduceYourself || t('reservationPending.noHostInfo')}
        </Typography>
        {introduceYourself && (
          <Link
            href="#"
            underline="hover"
            sx={{
              mt: 1.5,
              display: 'inline-block',
              fontSize: 14,
              fontWeight: 600,
              color: '#5B55C8',
            }}
          >
            {t('reservationPending.showMore')}
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default HostAboutSection;
