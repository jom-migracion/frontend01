import { Box, Typography, Container, useTheme } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';

const CancellationHero = ({ data }: { data: any }) => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, borderBottom: `1px solid ${theme.palette.divider}`, pt: 5.5, pb: 5 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', gap: 2.5 }}>
          <Box sx={{ maxWidth: '670px' }}>
            <Typography variant="h1" sx={{ fontSize: '26px', fontWeight: 700, color: theme.palette.text.primary, mb: 1.5 }}>
              {data.title}
            </Typography>
            <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary, lineHeight: 1.6 }}>
              {data.subtitle}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', px: 2, py: 1.25 }}>
              <CalendarTodayIcon sx={{ fontSize: '15px', color: theme.palette.text.secondary }} />
              <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>{data.lastUpdateLabel}</Typography>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: theme.palette.text.primary }}>{data.lastUpdateDate}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', px: 2, py: 1.25 }}>
              <ImportContactsOutlinedIcon sx={{ fontSize: '15px', color: theme.palette.text.secondary }} />
              <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>{data.sectionsLabel}</Typography>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: theme.palette.text.primary }}>{data.sectionsCount}</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CancellationHero;