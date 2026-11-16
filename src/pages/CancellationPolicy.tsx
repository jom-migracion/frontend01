import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const CancellationPolicy: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { t } = useTranslation();

  // Scroll al inicio al cargar la página
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth={matches ? 'lg' : 'md'} sx={{ py: 6 }}>
      <Box>
        {/* TÍTULO PRINCIPAL */}
        <Typography
          variant="h3"
          fontWeight={700}
          mb={4}
          sx={{ color: theme.palette.customColors.primary[1] }}
        >
          {t('cancellationPolicy.title')}
        </Typography>

        {/* FECHA DE ACTUALIZACIÓN */}
        <Typography variant="body1" mb={3} sx={{ color: theme.palette.customColors.primary[2] }}>
          {t('cancellationPolicy.lastUpdate')}{' '}
          {new Date().toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>

        {/* SECCIÓN 1: Plazos */}
        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            {t('cancellationPolicy.section1.title')}
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            {t('cancellationPolicy.section1.description')}
          </Typography>
          <Typography
            variant="body1"
            component="ul"
            sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}
          >
            <li>{t('cancellationPolicy.section1.list.free')}</li>
            <li>{t('cancellationPolicy.section1.list.partial')}</li>
            <li>{t('cancellationPolicy.section1.list.noRefund')}</li>
          </Typography>
        </Box>

        {/* SECCIÓN 2: Reembolsos */}
        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            {t('cancellationPolicy.section2.title')}
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            {t('cancellationPolicy.section2.description')}
          </Typography>
          <Typography
            variant="body1"
            component="ul"
            sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}
          >
            <li>{t('cancellationPolicy.section2.list.item1')}</li>
            <li>{t('cancellationPolicy.section2.list.item2')}</li>
            <li>{t('cancellationPolicy.section2.list.item3')}</li>
          </Typography>
        </Box>

        {/* SECCIÓN 3: No Show */}
        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            {t('cancellationPolicy.section3.title')}
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            {t('cancellationPolicy.section3.description')}
          </Typography>
          <Typography
            variant="body1"
            component="ul"
            sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}
          >
            <li>{t('cancellationPolicy.section3.list.item1')}</li>
            <li>{t('cancellationPolicy.section3.list.item2')}</li>
          </Typography>
        </Box>

        {/* SECCIÓN 4: Cancelación Anfitrión */}
        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            {t('cancellationPolicy.section4.title')}
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            {t('cancellationPolicy.section4.description')}
          </Typography>
          <Typography
            variant="body1"
            component="ul"
            sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}
          >
            <li>{t('cancellationPolicy.section4.list.item1')}</li>
            <li>{t('cancellationPolicy.section4.list.item2')}</li>
          </Typography>
        </Box>

        {/* SECCIÓN 5: Fuerza Mayor */}
        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            {t('cancellationPolicy.section5.title')}
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            {t('cancellationPolicy.section5.description')}
          </Typography>
        </Box>

        {/* SECCIÓN 6: Contacto */}
        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            {t('cancellationPolicy.section6.title')}
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            {t('cancellationPolicy.section6.description')}
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}>
            {t('cancellationPolicy.section6.details')}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default CancellationPolicy;
