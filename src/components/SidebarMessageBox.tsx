import React from 'react';
import { Box, Typography } from '@mui/material';

interface SidebarMessageBoxProps {
  message?: string | null;
}

const SidebarMessageBox: React.FC<SidebarMessageBoxProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Box
      sx={{
        bgcolor: '#F8F9FC',
        border: '1px solid #e2e8f0',
        borderRadius: 4,
        mt: 4,
      }}
    >
      <Typography variant="body2" color="text.secondary" m={4}>
        {message}
      </Typography>
    </Box>
  );
};

export default SidebarMessageBox;
