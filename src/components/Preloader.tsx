import React from 'react';
import { Box, Typography } from '@mui/material';
import './css/Preloader.css';
import LogoJom from '../assets/LogoJOM-BLANCO.svg';

const Preloader: React.FC = () => {
  return (
    <Box className="preloader">
      <Box className="preloader__content">
        <Box className="preloader__logo-wrapper">
          <img src={LogoJom} alt="Logo JOM" className="preloader__logo" />
        </Box>
        <Typography className="preloader__text">Preparando tu estancia perfecta...</Typography>
        <Box className="preloader__progress">
          <Box className="preloader__progress-bar" />
        </Box>
      </Box>
    </Box>
  );
};

export default Preloader;
