import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { SvgIconComponent } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  icon?: SvgIconComponent | React.ElementType;
  title: string;
  description: string;
  buttonRoute?: string;
  buttonLabel?: string;
  align?: 'center' | 'left';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = SearchIcon,
  title,
  description,
  buttonRoute,
  buttonLabel = 'Explorar hospedajes',
  align = 'center',
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleButtonClick = () => {
    if (buttonRoute) {
      navigate(buttonRoute);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 560 },
        mx: align === 'left' ? 0 : 'auto',
        px: 2,
        py: { xs: 8, sm: 10 },
        borderRadius: 3,
        backgroundColor: 'transparent',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: align === 'left' ? 'flex-start' : 'center',
          textAlign: align,
          gap: 2.5,
        }}
      >
        <Avatar sx={{ bgcolor: '#f3f3f3', width: 66, height: 66 }}>
          <Icon sx={{ fontSize: 36, color: '#a3a3a3' }} />
        </Avatar>

        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              color: '#0F233F',
              fontSize: '18px',
              lineHeight: 1.35,
              mb: 1,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              maxWidth: 384,
              mx: align === 'left' ? 0 : 'auto',
              fontSize: '14px',
              color: '#8E96A7',
              lineHeight: 1.65,
            }}
          >
            {description}
          </Typography>
        </Box>

        {buttonRoute && (
          <Button
            variant="primary"
            sx={{
              pl: 2,
              pr: 2,
              height: 38,
              fontWeight: 500,
              fontSize: '14px',
            }}
            onClick={handleButtonClick}
          >
            {t('pastTrips.emptyStates.buttonExploration')}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default EmptyState;
