import React, { useState } from 'react';
import { Box, Typography, Collapse, useTheme, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

// Sub-componente: El Acordeón individual
const FaqItem = ({ faq, isOpen, onToggle }: any) => {
  const theme = useTheme();

  // Función helper para procesar listas con viñetas desde el string del JSON
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('•')) {
        return (
          <Box key={i} sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Box sx={{ width: '6px', height: '6px', borderRadius: '50%', bgcolor: theme.palette.primary.main, flexShrink: 0, mt: '8px' }} />
            <Typography sx={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6 }}>{line.replace('• ', '')}</Typography>
          </Box>
        );
      }
      return <Typography key={i} sx={{ fontSize: '14px', lineHeight: 1.7, color: '#4B5563', mb: line ? 1 : 0 }}>{line}</Typography>;
    });
  };

  return (
    <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, '&:last-child': { borderBottom: 'none' } }}>
      <Box
        onClick={onToggle}
        sx={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, p: '16px 22px',
          cursor: 'pointer', bgcolor: isOpen ? theme.palette.softHighlight : 'transparent',
          transition: 'background 0.15s', '&:hover': { bgcolor: isOpen ? theme.palette.softHighlight : theme.palette.background.default }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: theme.palette.primary.main, opacity: isOpen ? 1 : 0.6, minWidth: '22px', letterSpacing: '0.04em' }}>
            {faq.num}
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: isOpen ? theme.palette.primary.main : theme.palette.text.primary, lineHeight: 1.35 }}>
            {faq.question}
          </Typography>
        </Box>
        <ExpandMoreIcon sx={{ color: isOpen ? theme.palette.primary.main : theme.palette.text.secondary, transition: 'transform 0.25s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </Box>
      <Collapse in={isOpen}>
        <Box sx={{ p: '0 22px 20px 58px' }}>
          {renderFormattedText(faq.answer)}
          {faq.noticeInfo && (
             <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, bgcolor: '#EFF6FF', borderLeft: '3px solid #3B82F6', borderRadius: '0 8px 8px 0', p: '10px 14px', mt: 1.5 }}>
               <Typography sx={{ fontSize: '13px', color: '#1E40AF', lineHeight: 1.6 }}>{faq.noticeInfo}</Typography>
             </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

// Componente Principal del Contenido
const HelpCenterContent = ({ faqData, activeCategory, searchQuery, emptyStateData }: any) => {
  const theme = useTheme();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  let hasResults = false;

  const content = Object.keys(faqData).map((catKey) => {
    // Filtrado de Pestañas
    if (activeCategory !== 'all' && activeCategory !== catKey && !searchQuery) return null;

    const categoryData = faqData[catKey];
    
    const renderedGroups = categoryData.groups.map((group: any, index: number) => {
      // Filtrado por Buscador
      const filteredFaqs = group.faqs.filter((faq: any) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return faq.question.toLowerCase().includes(query) || faq.keywords?.toLowerCase().includes(query);
      });

      if (filteredFaqs.length === 0) return null;
      hasResults = true;

      return (
        <Box key={group.id} id={group.id} sx={{ mb: 6, opacity: 0, animation: `fadeUp 0.35s ease forwards`, animationDelay: `${index * 0.05}s`, '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.75 }}>
            <Typography variant="h2" sx={{ fontSize: '17px', fontWeight: 700, color: theme.palette.text.primary }}>{group.title}</Typography>
          </Box>
          <Box sx={{ bgcolor: '#fff', border: `1px solid ${theme.palette.divider}`, borderRadius: '16px', overflow: 'hidden' }}>
            {filteredFaqs.map((faq: any) => (
              <FaqItem 
                key={faq.num} faq={faq} 
                isOpen={openFaqId === `${group.id}-${faq.num}`}
                onToggle={() => setOpenFaqId(prev => prev === `${group.id}-${faq.num}` ? null : `${group.id}-${faq.num}`)}
              />
            ))}
          </Box>
        </Box>
      );
    });

    return <React.Fragment key={catKey}>{renderedGroups}</React.Fragment>;
  });

  if (!hasResults) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 8, gap: 2 }}>
        <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: theme.palette.background.default, border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SearchOffIcon sx={{ fontSize: 26, color: theme.palette.text.secondary }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>{emptyStateData.title}</Typography>
          <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary }}>{emptyStateData.subtitle}</Typography>
        </Box>

        <Button
          variant="primary"
          component="a"
          href="mailto:soporte@jom.com"
          sx={{ mt: 1, display: 'flex', gap: 1, px: 3, height: '44px' }}
        >
          <MailOutlineIcon sx={{ fontSize: '18px' }} />
          {emptyStateData.button}
        </Button>

      </Box>
    );
  }

  return <Box sx={{ flex: 1, minWidth: 0 }}>{content}</Box>;
};

export default HelpCenterContent;