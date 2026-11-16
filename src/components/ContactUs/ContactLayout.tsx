import { useState, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContactHero from './ContactHero';
import ContactSidebar from './ContactSidebar';
import ContactContent from './ContactContent';

const useScrollSpy = (sectionIds: string[]) => {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);
  return activeId;
};

export const ContactLayout = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const pageData = t('contact', { returnObjects: true }) as any;

  const sectionIds = pageData?.sections?.map((s: any) => s.id) || [];
  const activeSectionId = useScrollSpy(sectionIds);

  if (!pageData?.title) return null;

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: '100vh', pb: 12 }}>
      <ContactHero data={pageData} />

      <Container maxWidth="lg" sx={{ pt: 6, px: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 0, lg: 6 }, alignItems: 'flex-start' }}>
          <ContactSidebar
            sections={pageData.sections}
            activeSectionId={activeSectionId}
            sidebarData={pageData.sidebar}
          />
          <ContactContent sections={pageData.sections} />
        </Box>
      </Container>
    </Box>
  );
};

export default ContactLayout;