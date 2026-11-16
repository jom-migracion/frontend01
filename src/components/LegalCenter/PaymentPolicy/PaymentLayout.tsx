import { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PaymentHero from './PaymentHero';
import PaymentSidebar from './PaymentSidebar';
import PaymentContent from './PaymentContent';

const useScrollSpy = (sectionIds: string[], defaultId: string) => {
  const [activeId, setActiveId] = useState(defaultId);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && defaultId) {
      setActiveId(defaultId);
      initialized.current = true;
    }
  }, [defaultId]);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: '-10% 0px -75% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds]);

  return activeId;
};

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

export const PaymentLayout = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const pageData = t('paymentPolicy', { returnObjects: true }) as any;

  const sectionIds = useMemo(
    () => pageData?.sections?.map((s: any) => s.id) ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageData?.sections?.length]
  );

  const defaultId = sectionIds[0] ?? '';
  const activeSectionId = useScrollSpy(sectionIds, defaultId);
  const progress = useProgressBar();

  if (!pageData?.title) return null;

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: '100vh', pb: 12, position: 'relative' }}>
      <Box sx={{ height: '3px', bgcolor: theme.palette.primary.main, position: 'fixed', top: 0, left: 0, zIndex: 1000, width: `${progress}%`, transition: 'width 0.1s' }} />

      <PaymentHero data={pageData} />

      <Container maxWidth="lg" sx={{ pt: 6, px: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 0, lg: 6 }, alignItems: 'flex-start' }}>
          <PaymentSidebar
            sections={pageData.sections}
            activeSectionId={activeSectionId}
            sidebarData={pageData.sidebar}
          />
          <PaymentContent sections={pageData.sections} />
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentLayout;