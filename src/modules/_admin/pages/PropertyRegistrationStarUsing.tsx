import { Box, Typography, Button, styled, Chip } from '@mui/material';
import React, { useEffect } from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '@/modules/_auth/context';

const StepContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  position: 'relative',
  paddingBottom: theme.spacing(4),
  '&:not(:last-child)::after': {
    content: '""',
    position: 'absolute',
    left: 27,
    top: 56,
    bottom: 0,
    width: 2,
    backgroundColor: theme.palette.divider,
  },
}));

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

const PropertyRegistrationStarUsing: React.FC = () => {
  // hooks
  const navigate = useNavigate();
  const { isHostAuthenticated } = useAuthContext();
  const { t } = useTranslation('tralation', { keyPrefix: 'admin.registerProperty' });

  // const
  const steps: Step[] = [
    {
      title: t('iniSteps.0.title', { defaultValue: 'Información' }),
      description: t('iniSteps.0.description', { defaultValue: 'Agrega tipo, ubicación y capacidad' }),        
      icon: HomeOutlinedIcon,
      iconBgColor: '#5b55c80d',
      iconColor: '#5b55c8',
    },
    {
      title: t('iniSteps.1.title', { defaultValue: 'Descripción' }),
      description: t('iniSteps.1.description', { defaultValue: 'Sube fotos y describe tu espacio' }),   
      icon: CameraAltOutlinedIcon,
      iconBgColor: '#5b55c80d',
      iconColor: '#5b55c8',
    },
    {
      title: t('iniSteps.2.title', { defaultValue: 'Configuración' }),
      description: t('iniSteps.2.description', { defaultValue: 'Define precio, reglas y publica' }),
      icon: SettingsOutlinedIcon,
      iconBgColor: '#5b55c80d',
      iconColor: '#5b55c8',
    },
  ];

  useEffect(() => {
    if (!isHostAuthenticated) {
      navigate(`/`);
    }
  }, [isHostAuthenticated, navigate]);  

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', bgcolor: '#F8F9FC', justifyContent: 'center', alignItems: 'center', px: { xs: 2, sm: 4 }, py: { xs: 8, md: 15 } }}>
      <Grid container spacing={4} alignItems="stretch" justifyContent="center" sx={{ maxWidth: 1400, mx: 'auto', bgcolor: '#faf9ff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        {/* Lado Izquierdo: Contenido Principal */}
        <Grid size={{ xs: 12, md: 6 }} sx={{height: { xs: 'auto', md: 620}}}>
          <Box
            sx={{
              backgroundColor: '#ffffff',
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
              width: { xs: '100%', md: '95%' },
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Badge Superior */}
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
              label={t('badgeHostOpportunity', { defaultValue: 'OPORTUNIDAD DE ANFITRIÓN' })}
              sx={{
                bgcolor: '#5b55c80d',
                color: '#5b55c8',
                width: 'fit-content',
                border: 'none',
                fontSize: { xs: '11px', sm: '10px' },
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 2,
                '& .MuiChip-icon': {
                  color: '#5b55c8',
                },
                justifyContent: 'flex-start',
              }}
            />

            {/* Título Principal */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.25rem' },
                fontWeight: 700,
                mb: 2,
                lineHeight: 1.2,
                color: '#1A1A1A',
              }}
            >
              {t('easyPublishTitle', { defaultValue: 'Publicar es más fácil de lo que imaginas' })}
            </Typography>

            {/* Subtítulo */}
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.125rem',
                color: '#666',
                mb: 4,
              }}
            >
              {t('threeStepsSubtitle', { defaultValue: 'Solo 3 pasos y tu anuncio estará en línea.' })}
            </Typography>

            {/* Botón Principal */}
            <Button
              variant="contained"
              sx={{
                bgcolor: '#5b55c8',
                color: 'white',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                mb: 3,
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={() => navigate(`/host/register`)}
            >
              {t('startNowBtn', { defaultValue: 'Comienza ahora' })}
            </Button>

            {/* Nota con Check */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: '0.875rem',
                }}
              >
                {t('editAnytimeNote', { defaultValue: 'Podés volver atrás y editar en cualquier momento.' })}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Lado Derecho: Pasos */}
        <Grid size={{ xs: 12, md: 6 }} sx={{
          height: { xs: 'auto', md: '100%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          position: 'relative',
          top: { xs: 0, md: '120px' },
          left: { xs: 0, md: '100px' }
        }}>
          <Box sx={{ 
            backgroundColor: '#ffffff',
            p: { xs: 3, sm: 4, md: 3 },
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            height: { xs: 'auto', md: '100%' },
            width: { xs: '100%', md: '65%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            {steps.map((step, index) => (
              <StepContainer key={index}>
                {/* Icono en Círculo */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: step.iconBgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <step.icon
                    sx={{
                      fontSize: 28,
                      color: step.iconColor,
                    }}
                  />
                </Box>

                {/* Contenido del Paso */}
                <Box sx={{ flex: 1, pt: 0.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      mb: 0.5,
                      color: '#1A1A1A',
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      fontSize: '0.875rem',
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </StepContainer>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyRegistrationStarUsing;