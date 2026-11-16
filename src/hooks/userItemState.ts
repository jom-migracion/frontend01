import { useState, useCallback } from 'react';

const useItemState = () => {
  const [open, setAnchorEl] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    setAnchorEl(true);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(false);
  }, []);

  return { open, handleOpen, handleClose };
};

export default useItemState;
