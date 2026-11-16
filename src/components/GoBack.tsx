import React from 'react';
import { useNavigate } from 'react-router';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface GoBackProps {
  className?: string;
}

export const GoBack: React.FC<GoBackProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Volver a la página anterior" arrow>
      <IconButton
        onClick={() => navigate(-1)}
        className={className}
        aria-label="Volver atrás"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.secondary',
          transition: 'all 0.2s ease',
          padding: '8px',
          mb: 2,
          mt: 2,
        }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
