import { useState, useCallback } from 'react';

const useMenuState = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTimeout(() => setAnchorEl(null), 1800);
  }, []);

  return { anchorEl, handleMenuOpen, handleMenuClose, handleMouseLeave };
};

export default useMenuState;
