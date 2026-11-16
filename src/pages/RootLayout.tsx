import FooterJom from '@/components/FooterJom';
import Navbar from '@/components/Navbar';
import { theme } from '@/themes/theme';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Outlet } from 'react-router';

const RootLayout = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box component="main" flexGrow={1} p={0} mt={isMobile ? '60px' : '74px'}>
        <Outlet />
      </Box>
      <Box pt={4}>
        <FooterJom />
      </Box>
    </Box>
  );
};

export default RootLayout;
