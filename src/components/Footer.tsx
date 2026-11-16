import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AiFillInstagram, AiFillTikTok } from 'react-icons/ai';
import { MdFacebook } from 'react-icons/md';
import React from 'react';
import ScrollTop from './ScrollTop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router';
import Jom from '@/assets/jom.png';

const Footer: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const goHome = () => navigate('/');
  const goToPrivacyPolicy = () => navigate('/privacy-policy');
  const goToTermsAndConditions = () => navigate('/terms-and-conditions');
  const handleOpenFacebook = () =>
    window.open('https://www.facebook.com/', '_blank', 'noopener,noreferrer');
  const handleOpenInstagram = () =>
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  const handleOpenTiktok = () =>
    window.open('https://www.tiktok.com/en/', '_blank', 'noopener,noreferrer');

  return (
    <Container maxWidth={matches ? 'xl' : 'lg'} sx={{ padding: '0px 0px !important' }}>
      <Box
        component="footer"
        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 0 }}
      >
        <Box>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', md: 'flex-start' }}
            sx={{
              px: { xs: 2, md: 6 },
              color: theme.palette.customColors.lights[4],
              mt: 2,
            }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 200 }}>
              <Box sx={{ cursor: 'pointer' }}>
                <img onClick={goHome} src={Jom} alt="Logo" width={220} />
              </Box>
              <Typography
                sx={{
                  fontFamily: theme.typography.paragraph1Regular,
                  mt: 1,
                }}
              >
                Únete a la experiencia de hospedarte con comodidad y seguridad.
              </Typography>
              <Box mt={2}>
                <MdFacebook
                  onClick={handleOpenFacebook}
                  size={30}
                  style={{ marginRight: 6, cursor: 'pointer' }}
                />
                <AiFillInstagram
                  onClick={handleOpenInstagram}
                  size={30}
                  style={{ marginRight: 6, cursor: 'pointer' }}
                />
                <AiFillTikTok onClick={handleOpenTiktok} size={30} style={{ cursor: 'pointer' }} />
              </Box>
            </Box>

            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography sx={{ fontSize: 16, p: '30px 0', fontFamily: theme.typography.h5Medium }}>
                Términos y configuración
              </Typography>
              <Typography
                onClick={goToPrivacyPolicy}
                sx={{
                  fontSize: 12,
                  mt: 1,
                  fontFamily: theme.typography.paragraph1Regular,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Privacidad y cookies
              </Typography>
              <Typography
                onClick={goToTermsAndConditions}
                sx={{
                  fontSize: 12,
                  mb: 1,
                  fontFamily: theme.typography.paragraph1Regular,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Términos y condiciones
              </Typography>
            </Box>

            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography sx={{ fontSize: 16, p: '30px 0', fontFamily: theme.typography.h5Medium }}>
                Información
              </Typography>
              <Typography
                sx={{ fontSize: 12, mt: 1, fontFamily: theme.typography.paragraph1Regular }}
              >
                Sobre Assert
              </Typography>
              <Typography
                sx={{ fontSize: 12, mb: 0, fontFamily: theme.typography.paragraph1Regular }}
              >
                Cómo trabajamos
              </Typography>
              <Typography
                sx={{ fontSize: 12, mb: 1, fontFamily: theme.typography.paragraph1Regular }}
              >
                Contacto
              </Typography>
            </Box>
          </Stack>
        </Box>

        <ScrollTop>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
        <Divider
          sx={{
            my: 2,
            mx: { xs: 2, md: 6 },
            backgroundColor: theme.palette.customColors.lights[4],
          }}
        />
        <Box>
          <Typography
            sx={{
              mt: '20px',
              mb: '0px',
              pt: 0,
              pb: 0,
              textAlign: 'center',
              fontFamily: theme.typography.paragraph1Regular,
              color: theme.palette.customColors.lights[4],
              px: 2,
            }}
          >
            © 2026 Assert srl. Central de Privacidad. Términos del servicio. Mapa del sitio.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Footer;
