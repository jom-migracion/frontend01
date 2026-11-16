import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

interface HeroProps {
  data: any;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: 'all' | 'guest' | 'host';
  setActiveTab: (val: 'all' | 'guest' | 'host') => void;
}

const HelpCenterHero: React.FC<HeroProps> = ({ data, searchQuery, setSearchQuery, activeTab, setActiveTab }) => {
  const theme = useTheme();

  const TabButton = ({ id, icon: Icon, label }: any) => {
    const isActive = activeTab === id && !searchQuery; // Si hay búsqueda, visualmente desactivamos los tabs específicos
    return (
      <Box
        component="button"
        onClick={() => { setActiveTab(id); setSearchQuery(''); }}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1.25,
          borderRadius: '12px', border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
          bgcolor: isActive ? theme.palette.softHighlight : '#fff',
          fontSize: '13px', fontWeight: isActive ? 600 : 500,
          color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
          cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
          '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main, bgcolor: theme.palette.softHighlight }
        }}
      >
        <Icon sx={{ fontSize: '17px' }} />
        {label}
      </Box>
    );
  };

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#FFF', border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', px: 2, py: 1.25 }}>
              <CalendarTodayIcon sx={{ fontSize: '15px', color: theme.palette.text.secondary }} />
              <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>{data.lastUpdateLabel}</Typography>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: theme.palette.text.primary }}>{data.lastUpdateDate}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#FFF', border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', px: 2, py: 1.25 }}>
              <QuizOutlinedIcon sx={{ fontSize: '15px', color: theme.palette.text.secondary }} />
              <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>{data.questionsLabel}</Typography>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: theme.palette.text.primary }}>{data.questionsCount}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Buscador */}
        <Box sx={{ position: 'relative', maxWidth: '540px', mt: 4 }}>
          <SearchOutlinedIcon sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: theme.palette.text.secondary, fontSize: '20px', pointerEvents: 'none' }} />
          <Box
            component="input"
            type="text"
            placeholder={data.searchPlaceholder}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            sx={{
              width: '100%', height: '48px', pl: '48px', pr: 2,
              border: `1px solid ${theme.palette.divider}`, borderRadius: '12px',
              fontSize: '14px', fontFamily: 'inherit', color: theme.palette.text.primary,
              outline: 'none', transition: 'border-color 0.15s',
              '&:focus': { borderColor: theme.palette.primary.main }
            }}
          />
        </Box>

        {/* Categorías */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2.5 }}>
          <TabButton id="all" icon={AppsIcon} label={data.tabs.all} />
          <TabButton id="guest" icon={LuggageOutlinedIcon} label={data.tabs.guest} />
          <TabButton id="host" icon={HomeOutlinedIcon} label={data.tabs.host} />
        </Box>
      </Container>
    </Box>
  );
};

export default HelpCenterHero;