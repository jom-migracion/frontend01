import React from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import theme from '@/themes/theme';

const Loading: React.FC<{ textVisible?: boolean; bgColor?: string, height?: string  }> = ({
  textVisible = true,
  bgColor = '#1d2628'
}) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', backgroundColor: bgColor }}
    >
      <Typography
        variant="overline"
        sx={{
          mt: { xs: 2, md: 12 },
          fontSize: { xs: '2rem', md: '10.5rem' },
          fontWeight: theme.palette.lights.main,
          letterSpacing: '0.02em',
          lineHeight: 1,
          textShadow: '2px 6px 4px rgba(0, 0, 0, 0.2)',
          color: 'whitesmoke',
        }}
      >
        {textVisible && (
          <>
    
            <span style={{ color: '#808080', fontFamily: "'AvantGarde', sans-serif",fontWeight: 600 }}>A</span>
            <span style={{ color: '#ffffff', fontFamily: "'AvantGarde', sans-serif",fontWeight: 600 }}>S</span>
            <span style={{ color: '#808080', fontFamily: "'AvantGarde', sans-serif",fontWeight: 600 }}>S</span>
            <span style={{ color: '#ffffff', fontFamily: "'AvantGarde', sans-serif",fontWeight: 600 }}>E</span>
            <span style={{ color: '#808080', fontFamily: "'AvantGarde', sans-serif",fontWeight: 600 }}>R</span>
            <span style={{ color: '#ffffff', fontFamily: "'AvantGarde', sans-serif",fontWeight: 600 }}>T</span>
          </>
        )}
      </Typography>
    </Grid>
  );
};

export default Loading;
