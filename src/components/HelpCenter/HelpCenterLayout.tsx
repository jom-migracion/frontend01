import React, { useState, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HelpCenterHero from './HelpCenterHero';
import HelpCenterSidebar from './HelpCenterSidebar';
import HelpCenterContent from './HelpCenterContent';
import { Helmet } from 'react-helmet-async';

// Hook para el Scroll Spy
const useScrollSpy = (groupIds: string[]) => {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveId(entry.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    groupIds.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [groupIds]);
  return activeId;
};

// Hook para la barra de progreso
const useProgressBar = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setProgress(Number(scroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return progress;
};

export const HelpCenterLayout: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const pageData = t('helpCenter', { returnObjects: true }) as any;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'guest' | 'host'>('all');
  
  const progress = useProgressBar();

  // Recopilar todos los IDs de los grupos para el Scroll Spy
  const groupIds: string[] = [];
  if (pageData?.faqData) {
    Object.values(pageData.faqData).forEach((cat: any) => {
      cat.groups.forEach((g: any) => groupIds.push(g.id));
    });
  }
  const activeSectionId = useScrollSpy(groupIds);

  if (!pageData?.title) return null;

  return (
    <Box sx={{ bgcolor: '#FFF', minHeight: '100vh', pb: 12 }}>
      <Helmet>
        <title>Centro de Ayuda</title>
        <meta name="centro de ayuda" content="Página del centro de ayuda" />
      </Helmet>
      {/* Barra de Progreso Superior */}
      <Box sx={{ height: '3px', bgcolor: theme.palette.primary.main, position: 'fixed', top: 0, left: 0, zIndex: 1000, width: `${progress}%`, transition: 'width 0.1s' }} />

      <HelpCenterHero 
        data={pageData} 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        activeTab={activeTab} setActiveTab={setActiveTab}
      />

      <Container maxWidth="lg" sx={{ pt: 6, px: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 0, lg: 6 }, alignItems: 'flex-start' }}>
          
          <HelpCenterSidebar 
            faqData={pageData.faqData} 
            activeSectionId={activeSectionId}
            sidebarCta={pageData.sidebarCta}
          />

          <HelpCenterContent 
            faqData={pageData.faqData}
            activeCategory={activeTab}
            searchQuery={searchQuery}
            emptyStateData={pageData.emptyState}
          />

        </Box>
      </Container>
    </Box>
  );
};

export default HelpCenterLayout;