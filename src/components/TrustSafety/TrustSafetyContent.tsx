//import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';

const parseBoldText = (text: string, defaultColor: string, strongColor: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Typography key={index} component="strong" sx={{ fontWeight: 600, color: strongColor }}>{part.slice(2, -2)}</Typography>;
    }
    return <Typography key={index} component="span" sx={{ color: defaultColor }}>{part}</Typography>;
  });
};

const TrustSafetyContent = ({ sections }: { sections: any[] }) => {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {sections.map((section, index) => (
        <Box 
          key={section.id} id={section.id} 
          sx={{ 
            py: 5, borderBottom: `1px solid ${theme.palette.divider}`, 
            '&:last-child': { borderBottom: 'none' },
            opacity: 0, animation: `fadeUp 0.35s ease forwards`, animationDelay: `${index * 0.05}s`,
            '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
          }}
        >
          <Typography variant="h2" sx={{ fontSize: '20px', fontWeight: 700, color: '#111827', mb: 2.5, lineHeight: 1.3 }}>
            {section.title}
          </Typography>

          <Box sx={{ mb: 2.25 }}>
            <Typography sx={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.75 }}>
              {parseBoldText(section.content, '#4B5563', '#1F2937')}
            </Typography>
          </Box>

          {/* Renderizado de Tipo de Lista */}
          <Box>
            {section.type === 'verify_cards' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {section.list.map((item: any, i: number) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: theme.palette.background.default, border: `1px solid ${theme.palette.divider}`, borderRadius: '12px', p: '12px 16px' }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: theme.palette.softHighlight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       {item.icon === 'id_card' ? <BadgeOutlinedIcon sx={{ fontSize: '18px', color: theme.palette.primary.main }}/> : <PhoneIphoneOutlinedIcon sx={{ fontSize: '18px', color: theme.palette.primary.main }}/>}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '14px', color: theme.palette.text.primary }}>{item.title}</Typography>
                      <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, mt: 0.5 }}>{item.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {section.type === 'bullet_list' && (
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.list.map((item: string, i: number) => (
                  <Box component="li" key={i} sx={{ display: 'flex', gap: 1.25, fontSize: '14px', lineHeight: 1.75 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, flexShrink: 0, mt: '10px' }} />
                    <Box>
                      {parseBoldText(item, '#4B5563', '#1F2937')}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TrustSafetyContent;