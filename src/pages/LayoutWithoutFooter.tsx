import Navbar from '@/components/Navbar';
import { theme } from '@/themes/theme';
import { Box, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router';

const LayoutOnlyWithNavbar = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box component="main" flexGrow={1} mt={isMobile ? '56px' : '74px'}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutOnlyWithNavbar;
