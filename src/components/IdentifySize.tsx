import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const useCurrentBreakpoint = (): Breakpoint => {
  const theme = useTheme<Theme>();

  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));

  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  return 'xs';
};

const IdentifySize = () => {
  const currentBreakpoint = useCurrentBreakpoint();

  return (
    <Box p={4}>
      <Typography variant="body1">
        <strong>{currentBreakpoint}</strong>
      </Typography>
    </Box>
  );
};

export default IdentifySize;
