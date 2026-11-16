import { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HowWorkHero from './HowWorkHero';
import HowWorkSidebar from './HowWorkSidebar';
import HowWorkContent from './HowWorkContent';

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

export const HowWorkLayout = () => {
  const { t } = useTranslation();
  const pageData = t('howWork', { returnObjects: true }) as any;

  const sectionIds = useMemo(
    () => pageData?.sections?.map((s: any) => s.id) ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageData?.sections?.length]
  );

  const defaultId = sectionIds[0] ?? '';
  const activeSectionId = useScrollSpy(sectionIds, defaultId);

  if (!pageData?.title) return null;

  return (
    <Box sx={{ bgcolor: '#FFF', minHeight: '100vh', pb: 12 }}>
      <HowWorkHero data={pageData} />

      <Container maxWidth="lg" sx={{ pt: 6, px: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 0, lg: 6 }, alignItems: 'flex-start' }}>
          <HowWorkSidebar
            sections={pageData.sections}
            activeSectionId={activeSectionId}
            sidebarData={pageData.sidebar}
          />
          <HowWorkContent sections={pageData.sections} />
        </Box>
      </Container>
    </Box>
  );
};

export default HowWorkLayout;
