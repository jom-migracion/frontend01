import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';
import { useNavigate, useLocation } from 'react-router';
import Jom from '@/assets/LogoJOM-MORADO.svg';
import BrokerWebp from '@/assets/TuBroker.svg';
import ScrollTop from './ScrollTop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LanguageIcon from '@mui/icons-material/Language';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { FaTiktok } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import theme from '@/themes/theme';

const footerColors = {
  bg: '#F9FAFB',
  textMain: '#374151',
  textLight: '#6B7280',
  title: '#111827',
  primary: '#5B4DFF',
};

const FooterJom: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { t } = useTranslation();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const goHome = () => navigate('/');

  const goToLegalCenter = () => navigate('/legal-center');

  const goToPrivacyPolicy = () => navigate('/privacy-policy');
  const goToTermsAndConditions = () => navigate('/terms-and-conditions');
  const goToCancellationPolicy = () => navigate('/cancellation-policy');
  const goToAboutJOM = () => navigate('/about-jom');
  const goToHowWeWork = () => navigate('/how-we-work');
  const goToContact = () => navigate('/contact');
  const goToPromotions = () => navigate('/promociones');
  const goToHelpCenter = () => navigate('/help-center');
  const goToTrustAndSafety = () => navigate('/trust-and-safety');

  const footerLinks = {
    company: [
      { label: t('footer.aboutJom') || 'Sobre Jom', action: goToAboutJOM, path: '/about-jom' },
      {
        label: t('footer.howWork') || 'Cómo trabajamos',
        action: goToHowWeWork,
        path: '/how-we-work',
      },
      { label: t('footer.contact') || 'Contáctanos', action: goToContact, path: '/contact' },
      {
        label: t('footer.promotions') || 'Promociones',
        action: goToPromotions,
        path: '/promociones',
      },
      {
        label: t('footer.unforgivable') || 'Los Imperdonables',
        href: 'https://losimperdonables.com/',
        external: true, // opcional, según cómo renderices
      },
    ],
    legal: [
      {
        label: t('footer.legalCenter') || 'Centro Legal',
        action: goToLegalCenter,
        path: '/legal-center',
      },
      {
        label: t('footer.privacyAndCookies') || 'Privacidad y cookies',
        action: goToPrivacyPolicy,
        path: '/privacy-policy',
      },
      {
        label: t('footer.termsAndConditions') || 'Términos y condiciones',
        action: goToTermsAndConditions,
        path: '/terms-and-conditions',
      },
      {
        label: t('footer.cancellationPolicy') || 'Política de cancelación',
        action: goToCancellationPolicy,
        path: '/cancellation-policy',
      },
    ],
    support: [
      {
        label: t('footer.helpCenter') || 'Centro de Ayuda',
        action: goToHelpCenter,
        path: '/help-center',
      },
      {
        label: t('footer.trustAndSafety') || 'Confianza y seguridad',
        action: goToTrustAndSafety,
        path: '/trust-and-safety',
      },
    ],
  };

  // const LinkItem = ({
  //   label,
  //   onClick,
  //   isActive,
  // }: {
  //   label: string;
  //   action: () => void;
  //   onClick: () => void;
  //   isActive: boolean;
  // }) => (
  //   <Typography
  //     onClick={onClick}
  //     variant="body2"
  //     sx={{
  //       color: isActive ? footerColors.title : footerColors.textLight,
  //       cursor: 'pointer',
  //       mb: 1.5,
  //       fontSize: '0.95rem',
  //       fontWeight: isActive ? 600 : 400,
  //       transition: 'color 0.2s ease',
  //       '&:hover': {
  //         color: footerColors.primary,
  //       },
  //     }}
  //   >
  //     {label}
  //   </Typography>
  // );

  const LinkItem = ({
    label,
    onClick,
    isActive,
    href,
    external = false,
  }: {
    label: string;
    onClick?: () => void;
    isActive?: boolean;
    href?: string;
    external?: boolean;
  }) => {
    const commonSx = {
      color: isActive ? footerColors.title : footerColors.textLight,
      cursor: 'pointer',
      mb: 1.5,
      fontSize: '0.95rem',
      fontWeight: isActive ? 600 : 400,
      transition: 'color 0.2s ease',
      '&:hover': {
        color: footerColors.primary,
      },
    };

    if (external && href) {
      return (
        <Typography
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          sx={{
            ...commonSx,
            textDecoration: 'none',
            display: 'block',
          }}
        >
          {label}
        </Typography>
      );
    }

    return (
      <Typography onClick={onClick} variant="body2" sx={commonSx}>
        {label}
      </Typography>
    );
  };
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: footerColors.bg,
        pt: 8,
        pb: 6,
        position: 'relative',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container
        maxWidth={isLargeScreen ? 'xl' : 'lg'}
        sx={{
          px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 },
          mt: '0px',
        }}
      >
        {/* Sección Superior: Logo y Columnas */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Columna 1: Marca y Descripción */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              onClick={goHome}
              sx={{
                cursor: 'pointer',
                display: 'inline-block',
                mb: 0,
              }}
            >
              <img src={Jom} alt="Jom Logo" style={{ height: 50, width: 'auto' }} />
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: footerColors.textLight,
                maxWidth: 250,
                lineHeight: 1.4,
                fontSize: '0.875rem',
              }}
            >
              {t('footer.text')}
              {/* {t('footer.descriptionJom')} */}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: footerColors.textLight,
                fontWeight: 800,
                maxWidth: 250,
                lineHeight: 1.4,
                fontSize: '0.9rem',
                mt: 2,
              }}
            >
              {t('footer.slogan')}
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 7 }}>
              <Box
                component="a"
                href="https://www.instagram.com/jom.bolivia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar nuestro perfil de Instagram"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  color: '#5b55c8',
                  border: `1.5px solid rgba(91, 77, 255, 0.4)`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(91, 77, 255, 0.08)',
                    borderColor: '#5b55c8',
                  },
                }}
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box
                component="a"
                href="https://www.facebook.com/people/JOM/61583964172831/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar nuestro perfil de Facebook"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  color: '#5b55c8',
                  border: `1.5px solid rgba(91, 77, 255, 0.4)`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(91, 77, 255, 0.08)',
                    borderColor: '#5b55c8',
                  },
                }}
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box
                component="a"
                href="https://www.tiktok.com/@jom.bolivia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar nuestro perfil de tiktok"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  color: '#5b55c8',
                  border: `1.5px solid rgba(91, 77, 255, 0.4)`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(91, 77, 255, 0.08)',
                    borderColor: '#5b55c8',
                  },
                }}
              >
                <FaTiktok size={14.5} />
              </Box>
            </Stack>
          </Grid>
          {/* Columnas de Enlaces */}
          {/* Compañía */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: footerColors.title, fontWeight: 700, mb: 2.5, fontSize: '1rem' }}
            >
              {t('footer.company')}
            </Typography>
            {/* 5. Pasamos el booleano isActive comparando location.pathname con el path del enlace */}
            {/* {footerLinks.company.map((link, index) => (
              <LinkItem
                key={index}
                label={link.label}
                onClick={link.action}
                action={link.action}
                isActive={location.pathname === link.path}
              />
            ))} */}
            {footerLinks.company.map((link, index) => (
              <LinkItem
                key={index}
                label={link.label}
                onClick={link.action}
                href={link.href}
                external={link.external}
                isActive={link.path ? location.pathname === link.path : false}
              />
            ))}
          </Grid>
          {/* Legal */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: footerColors.title, fontWeight: 700, mb: 2.5, fontSize: '1rem' }}
            >
              {t('footer.legal')}
            </Typography>
            {footerLinks.legal.map((link, index) => (
              <LinkItem
                key={index}
                label={link.label}
                onClick={link.action}
                isActive={location.pathname === link.path}
              />
            ))}
          </Grid>
          {/* Soporte */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: footerColors.title, fontWeight: 700, mb: 2.5, fontSize: '1rem' }}
            >
              {t('footer.support')}
            </Typography>
            {footerLinks.support.map((link, index) => (
              <LinkItem
                key={index}
                label={link.label}
                onClick={link.action}
                isActive={location.pathname === link.path}
              />
            ))}
            <Typography
              variant="body2"
              sx={{ fontSize: '0.95rem', color: footerColors.textLight, mt: 4 }}
            >
              {t('footer.insurance')}
            </Typography>
            <Box
              onClick={goHome}
              sx={{
                cursor: 'pointer',
                display: 'inline-block',
                mb: 0,
                ml: 0,
              }}
            >
              <img src={BrokerWebp} alt="Broker" width={160} height={50} style={{ marginTop: 6 }} />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontSize: '0.95rem', color: footerColors.textLight, mt: 0.5 }}
            >
              {t('footer.insuranceContact')} <span style={{ fontWeight: 800 }}>800 10 3070</span>
            </Typography>
          </Grid>
        </Grid>

        {/* Separador */}
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: 4 }} />

        {/* Barra Inferior */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          mt={4}
        >
          {/* Copyright */}
          <Typography variant="body2" sx={{ color: footerColors.textLight, fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} {t('footer.rights')}
          </Typography>

          {/* Idiomas e Iconos */}
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Opción 1: Español */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                color: footerColors.textLight,
                cursor: 'pointer',
                '&:hover': { color: 'footerColors.primary ' },
              }}
            >
              <LanguageIcon fontSize="small" />
              <DonutLargeIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t('footer.languajeSPA')}
              </Typography>
            </Stack>

            {/* Opción 2: Inglés */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                color: footerColors.textLight,
                cursor: 'pointer',
                '&:hover': { color: footerColors.primary },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t('footer.languajeEN')}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      {/* Botón Scroll Top */}
      {!isMobile && (
        <ScrollTop>
          <Fab
            size="medium"
            aria-label="scroll back to top"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': { bgcolor: theme.palette.primary.dark },
              width: { xs: 48, sm: 40 },
              height: { xs: 48, sm: 40 },
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      )}
    </Box>
  );
};

export default FooterJom;
