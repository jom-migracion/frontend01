import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { useTranslation } from 'react-i18next';

interface TermSection {
  title: string;
  content?: string;
  isHeader?: boolean;
}

const TermsAndConditions: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { t } = useTranslation();

  const termsSections = t('terms.sections', { returnObjects: true }) as TermSection[];
  const sectionsToRender = Array.isArray(termsSections) ? termsSections : [];

  return (
    <Container maxWidth={matches ? 'lg' : 'md'} sx={{ py: 6 }}>
      <Box>
        <Typography
          variant="h3"
          fontWeight={700}
          mb={4}
          align="center"
          sx={{ color: theme.palette.customColors.primary[1] }}
        >
          {t('terms.title')}
        </Typography>

        <Typography variant="body1" mb={3} sx={{ color: theme.palette.customColors.primary[2] }}>
          {t('terms.lastUpdate')}{' '}
          {new Date().toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>

        <Box mb={4}>
          <Typography
            variant="body1"
            mb={2}
            sx={{
              color: theme.palette.customColors.primary[2],
              whiteSpace: 'pre-line',
              textAlign: 'justify',
            }}
          >
            {t('terms.intro')}
          </Typography>
        </Box>

        {sectionsToRender.map((section, index) => {
          if (section.isHeader) {
            return (
              <Box key={index} mt={6} mb={3}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  align="center"
                  sx={{ color: theme.palette.customColors.primary[1], textTransform: 'uppercase' }}
                >
                  {section.title}
                </Typography>
              </Box>
            );
          }

          // CASO B: Es una sección numerada normal (Ej: "1. Búsqueda...")
          return (
            <Box key={index} mb={4}>
              <Typography
                variant="h5"
                fontWeight={600}
                mb={2}
                sx={{ color: theme.palette.customColors.primary[1] }}
              >
                {section.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.customColors.primary[2],
                  textAlign: 'justify',
                  whiteSpace: 'pre-line',
                }}
              >
                {section.content}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};

export default TermsAndConditions;
