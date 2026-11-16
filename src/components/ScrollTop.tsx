import React from 'react';
import ScrollTopProps from '@/models/interfaces/ScrollTopProps';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';

const ScrollTop = (scroll: ScrollTopProps) => {
  const { children, window } = scroll;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const anchor = (target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 16 },
          right: { xs: 16, sm: 16 },
          zIndex: 1200,
        }}
      >
        {children}
      </Box>
    </Zoom>
  );
};

export default ScrollTop;
