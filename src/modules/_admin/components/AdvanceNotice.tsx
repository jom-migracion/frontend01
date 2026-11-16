import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
// import { useTranslation } from 'react-i18next';

interface AdvanceNoticeProps {
  title: string;
  description: string;
  onChange: (value: number) => void;
  initialDays?: number;
  maxDays?: number;
}

const AdvanceNotice: React.FC<AdvanceNoticeProps> = ({
  title,
  description,
  onChange,
  initialDays = 1,
  maxDays = 50,
}) => {
  const [days, setDays] = useState(initialDays);

  // hooks
  // const { t } = useTranslation();

  // functions
  const handleRemoveDay = () => {
    setDays((prevDays) => Math.max(0, prevDays - 1));
  };

  const handleAddDay = () => {
    setDays((prevDays) => Math.min(maxDays, prevDays + 1));
  };

  // Notificar al componente padre cada vez que cambie 'days
  useEffect(() => {
    onChange(days);
  }, [days, onChange]);

  return (
    <Box sx={{ mb: 3, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1.5} flexShrink={0}>
          <IconButton
            aria-label="restar día"
            onClick={handleRemoveDay}
            disabled={days === 0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '32px',
              width: 36,
              height: 36,
              '&:hover': { backgroundColor: 'action.hover' },
              '&:disabled': { opacity: 0.5 },
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              width: '32px',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {days}
          </Typography>
          <IconButton
            aria-label="sumar día"
            onClick={handleAddDay}
            disabled={days >= maxDays}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '32px',
              width: 36,
              height: 36,
              '&:hover': { backgroundColor: 'action.hover' },
              '&:disabled': { opacity: 0.5 },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Typography
        color="text.secondary"
        sx={{
          mt: 0.5,
          fontSize: '14px',
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default AdvanceNotice;
