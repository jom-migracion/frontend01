import { Box, Typography, useTheme } from '@mui/material';

const parseBoldText = (text: string, defaultColor: string, strongColor: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Typography key={index} component="strong" sx={{ fontWeight: 600, color: strongColor }}>{part.slice(2, -2)}</Typography>;
    }
    return <Typography key={index} component="span" sx={{ color: defaultColor }}>{part}</Typography>;
  });
};

const HostContractContent = ({ sections }: { sections: any[] }) => {
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
          <Typography variant="h2" sx={{ fontSize: '20px', fontWeight: 700, color: theme.palette.text.primary, mb: 2.5, lineHeight: 1.3 }}>
            {section.title}
          </Typography>

          {section.items && section.items.map((item: any, i: number) => {
            
            // TEXT NORMAL
            if (item.type === 'text') {
              return (
                <Box key={i} sx={{ mb: 2.25, '&:last-child': { mb: 0 } }}>
                  <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary, lineHeight: 1.75 }}>
                    {parseBoldText(item.text, theme.palette.text.secondary, theme.palette.text.primary)}
                  </Typography>
                </Box>
              );
            }

            // SUB-LABEL (Cláusulas)
            if (item.type === 'sub-label') {
              return (
                <Typography key={i} sx={{ fontSize: '13px', fontWeight: 700, color: theme.palette.primary.main, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 3.5, mb: 1.5 }}>
                  {item.text}
                </Typography>
              );
            }

            // CHECK-LIST (Puntos azules)
            if (item.type === 'check-list') {
              return (
                <Box key={i} component="ul" sx={{ listStyle: 'none', p: 0, m: '10px 0 20px', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {item.list.map((listItem: string, lIndex: number) => (
                    <Box component="li" key={lIndex} sx={{ display: 'flex', gap: 1.25, fontSize: '13px', color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, flexShrink: 0, mt: '7px' }} />
                      <Box>{parseBoldText(listItem, theme.palette.text.secondary, theme.palette.text.primary)}</Box>
                    </Box>
                  ))}
                </Box>
              );
            }

            // NO-LIST (Puntos Rojos - Consecuencias)
            if (item.type === 'no-list') {
              return (
                <Box key={i} component="ul" sx={{ listStyle: 'none', p: 0, m: '10px 0 20px', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {item.list.map((listItem: string, lIndex: number) => (
                    <Box component="li" key={lIndex} sx={{ display: 'flex', gap: 1.25, fontSize: '13px', color: theme.palette.text.secondary, lineHeight: 1.6, p: '6px 8px', borderRadius: '6px', transition: 'background 0.15s', '&:hover': { bgcolor: theme.palette.action.hover } }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.error.main, flexShrink: 0, mt: '7px' }} />
                      <Box>{parseBoldText(listItem, theme.palette.text.secondary, theme.palette.text.primary)}</Box>
                    </Box>
                  ))}
                </Box>
              );
            }

            return null;
          })}

        </Box>
      ))}
    </Box>
  );
};

export default HostContractContent;