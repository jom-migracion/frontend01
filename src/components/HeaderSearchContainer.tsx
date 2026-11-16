import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface HeaderSearchContainerProps {
  backgroundImage: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const HeaderSearchContainer: React.FC<HeaderSearchContainerProps> = ({
  backgroundImage,
  children,
  title = '',
  subtitle = '',
  // title = 'CONFORT',
  // subtitle = 'RESERVA',
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', width: '100%', pb: 5 }}>
      {/* Imagen */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '200px', md: '600px' },
          borderRadius: '9px',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.5) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            width: '100%',
          }}
        >
          <Typography
            variant="overline"
            sx={{
              mt: { xs: 6, sm: 4, md: 8 },
              fontFamily: "'AvantGarde', sans-serif",
              fontWeight: 700,
              fontSize: {
                xs: 'clamp(1.5rem, 8vw, 2.5rem)',
                sm: 'clamp(2rem, 6vw, 3.5rem)',
                md: '12.5rem',
              },
              letterSpacing: '0.01em',
              lineHeight: 1.2,
              textShadow: '2px 4px 4px rgba(0, 0, 0, 0.3)',
              color: 'whitesmoke',
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: {
                  xs: 'clamp(0.75rem, 4vw, 1rem)', // Smaller subtitle
                  sm: 'clamp(1rem, 3vw, 1.5rem)',
                  md: '3.5rem',
                },
                fontWeight: theme.typography.fontWeightMedium,
                display: 'block',
                mb: { xs: -1, sm: -2, md: -3 },
              }}
            >
              {subtitle}
            </Box>
            {title}
          </Typography>
        </motion.div>
      </Box>

      {/* Buscador */}
      <Box
        sx={{
          position: 'relative',
          mt: { xs: -10, md: -11 },
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 1, md: 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HeaderSearchContainer;
