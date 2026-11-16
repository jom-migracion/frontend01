import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Tooltip } from '@mui/material';

interface BackButtonProps {
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, size = 'medium' }) => {
  return (
    <Tooltip title="Go back">
      <IconButton onClick={onClick} aria-label="Go back" color="inherit">
        <ArrowBackIosNewIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
