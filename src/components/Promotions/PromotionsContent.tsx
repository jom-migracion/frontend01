import { Box, Typography, Button, useTheme } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

const parseBoldText = (text: string, defaultColor: string, strongColor: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Typography key={index} component="strong" sx={{ fontWeight: 600, color: strongColor }}>{part.slice(2, -2)}</Typography>;
    }
    return <Typography key={index} component="span" sx={{ color: defaultColor }}>{part}</Typography>;
  });
};

const PromotionsContent = ({ sections }: { sections: any[] }) => {
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
            
            // Texto Normal
            if (item.type === 'text') {
              return (
                <Box key={i} sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.75 }}>
                    {parseBoldText(item.text, '#4B5563', theme.palette.text.primary)}
                  </Typography>
                </Box>
              );
            }

            // Tarjeta de Descarga de Documentos
            if (item.type === 'download-card') {
              return (
                <Box 
                  key={i} 
                  sx={{ 
                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2.5, 
                    p: 2.5, mb: 2, bgcolor: theme.palette.background.default, border: `1px solid ${theme.palette.divider}`, borderRadius: '12px',
                    transition: 'all 0.2s', '&:hover': { borderColor: theme.palette.primary.main, boxShadow: `0 4px 12px ${theme.palette.primary.main}1A` } 
                  }}
                >
                  <Box sx={{ width: 48, height: 48, borderRadius: '10px', bgcolor: theme.palette.softHighlight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PictureAsPdfOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: '24px' }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, lineHeight: 1.4 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                  {/* Atributo 'download' fuerza la descarga del archivo */}
                  <Button 
                    variant="primary" 
                    component="a" 
                    href={item.file} 
                    download 
                    sx={{ minWidth: '160px', height: '40px', fontSize: '13px', width: { xs: '100%', sm: 'auto' } }}
                  >
                    <DownloadOutlinedIcon sx={{ fontSize: '18px', mr: 1 }} />
                    {item.buttonText}
                  </Button>
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

export default PromotionsContent;