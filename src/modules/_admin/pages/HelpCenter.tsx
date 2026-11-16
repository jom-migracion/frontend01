import React from 'react';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CircleIcon from '@mui/icons-material/Circle';
import HelpCenterLayout from '@/components/HelpCenter/HelpCenterLayout';
import TrustSafetyLayout from '@/components/TrustSafety/TrustSafetyLayout';
import ContactLayout from '@/components/ContactUs/ContactLayout';
import CancellationLayout from '@/components/CancellationPolicy/CancellationLayout';
import AboutLayout from '@/components/AboutJom/AboutLayout';
import HowWorkLayout from '@/components/HowWork/HowWorkLayout';
import PromotionsLayout from '@/components/Promotions/PromotionsLayout';
import LegalLayout from '@/components/LegalCenter/LegalLayout';
import PrivacyLayout from '@/components/PrivacyPolicy/PrivacyLayout';
import TermsLayout from '@/components/TermsAndConditions/TermsLayout';

interface SectionItem {
  title?: string;
  content?: string;
  isHeader?: boolean;
  list?: string[] | Record<string, string>;
}

interface PageData {
  title: string;
  lastUpdate?: string;
  intro?: string;
  sections?: SectionItem[];
}

interface InfoPageProps {
  pageKey: string; // La clave del JSON (ej: "terms")
}

const HelpCenter: React.FC<InfoPageProps> = ({ pageKey }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { t } = useTranslation();

  // Datos del archivo de traducción
  const pageData = t(pageKey, { returnObjects: true }) as PageData;

  if (!pageData?.title) return null;

  // Que sea un array
  const sectionsToRender = Array.isArray(pageData.sections) ? pageData.sections : [];

  const primaryColor = theme.palette.customColors?.primary?.[1] || theme.palette.primary.main;
  const secondaryColor = theme.palette.customColors?.primary?.[2] || theme.palette.text.secondary;

  return (
    <Container maxWidth={matches ? 'lg' : 'md'} sx={{ py: 6 }}>
      <Box>
        <Typography
          variant="h3"
          fontWeight={700}
          mb={4}
          align="center"
          sx={{ color: primaryColor }}
        >
          {pageData.title}
        </Typography>

        {pageData.lastUpdate && (
          <Typography variant="body1" mb={3} align="center" sx={{ color: secondaryColor }}>
            {pageData.lastUpdate}{' '}
            {new Date().toLocaleDateString('es-BO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        )}

        {pageData.intro && (
          <Typography
            variant="body1"
            mb={4}
            sx={{ color: secondaryColor, whiteSpace: 'pre-line', textAlign: 'justify' }}
          >
            {pageData.intro}
          </Typography>
        )}

        {sectionsToRender.map((section, index) => {
          // A. Separador / Header grande
          if (section.isHeader) {
            return (
              <Box key={index} mt={6} mb={3}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  align="center"
                  sx={{ color: primaryColor, textTransform: 'uppercase' }}
                >
                  {section.title}
                </Typography>
              </Box>
            );
          }

          // B. Sección Normal
          return (
            <Box key={index} mb={4}>
              {section.title && (
                <Typography variant="h5" fontWeight={600} mb={2} sx={{ color: primaryColor }}>
                  {section.title}
                </Typography>
              )}

              {section.content && (
                <Typography
                  variant="body1"
                  mb={2}
                  sx={{ color: secondaryColor, textAlign: 'justify', whiteSpace: 'pre-line' }}
                >
                  {section.content}
                </Typography>
              )}

              {section.list && (
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {(Array.isArray(section.list) ? section.list : Object.values(section.list)).map(
                    (item, i) => (
                      <Box
                        component="li"
                        key={i}
                        sx={{
                          listStyle: 'none',
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        <CircleIcon
                          sx={{ fontSize: 8, mt: 1, mr: 2, color: primaryColor, flexShrink: 0 }}
                        />
                        <Typography
                          variant="body1"
                          sx={{ color: secondaryColor, textAlign: 'justify' }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};

export default HelpCenter;

export const PrivacyView = () => <PrivacyLayout />;
//export const PrivacyView = () => <InfoPage pageKey="privacyPolicy" />;

export const TermsView = () => <TermsLayout />;
//export const TermsView = () => <InfoPage pageKey="terms" />;

// export const CancellationView = () => <InfoPage pageKey="cancellationPolicy" />;

export const CancellationView = () => <CancellationLayout />;

export const AboutJOMView = () => <AboutLayout />;
//export const AboutJOMView = () => <InfoPage pageKey="aboutJOM" />;

export const HowWeWorkView = () => <HowWorkLayout />;
//export const HowWeWorkView = () => <InfoPage pageKey="howWeWork" />;

export const ContactView = () => <ContactLayout />;
//export const ContactView = () => <InfoPage pageKey="contact" />;

export const PromotionsView = () => <PromotionsLayout />;

export const LegalCenterView = () => <LegalLayout />;

export const HelpCenterView = () => <HelpCenterLayout />;
//export const HelpCenterView = () => <InfoPage pageKey="helpCenter" />;

export const CancellationOptionsView = () => <HelpCenter pageKey="cancellationOptions" />;

export const TrustSafetyView = () => <TrustSafetyLayout />;
//export const TrustSafetyView = () => <InfoPage pageKey="trustAndSafety" />;
