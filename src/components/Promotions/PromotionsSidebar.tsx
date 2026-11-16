import { Box, Typography, Button, useTheme } from '@mui/material';

interface SidebarProps {
  sections: { id: string; shortTitle: string }[];
  activeSectionId: string;
  sidebarData: any;
}

const PromotionsSidebar = ({ sections, activeSectionId, sidebarData }: SidebarProps) => {
  const theme = useTheme();

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <Box component="aside" sx={{ display: { xs: 'none', lg: 'block' }, width: '220px', flexShrink: 0, position: 'sticky', top: '88px', maxHeight: 'calc(100vh - 112px)', overflowY: 'auto' }}>
      <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 1.25, opacity: 0.8 }}>
        {sidebarData.content}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {sections.map((section) => {
          const isActive = activeSectionId === section.id;
          return (
            <Box
              key={section.id} component="a" onClick={() => handleScroll(section.id)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.25, p: '7px 10px', borderRadius: '8px',
                fontSize: '13px', fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                bgcolor: isActive ? theme.palette.softHighlight : 'transparent',
                transition: 'background 0.12s, color 0.12s',
                '&:hover': { bgcolor: isActive ? theme.palette.softHighlight : '#F3F4F6', color: theme.palette.text.primary }
              }}
            >
              {section.shortTitle}
            </Box>
          );
        })}
      </Box>

      {/* CTA Box */}
      <Box sx={{ bgcolor: theme.palette.softHighlight, border: `1px solid ${theme.palette.primary.main}26`, borderRadius: '12px', p: 2, mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: theme.palette.text.primary, mb: 0.5, textAlign: 'center' }}>
          {sidebarData.helpTitle}
        </Typography>
        <Button 
          variant="primary" 
          component="a" 
          href={`mailto:${sidebarData.contactEmail}`}
          target="_blank"
          rel="noopener noreferrer" 
          sx={{ minHeight: '36px', height: 'auto', py: 1, px: 1.5, fontSize: '12px', lineHeight: 1.3, textAlign: 'center' }}
        >
          {sidebarData.contactButton || "Contactar soporte"}
        </Button>
      </Box>
    </Box>
  );
};

export default PromotionsSidebar;