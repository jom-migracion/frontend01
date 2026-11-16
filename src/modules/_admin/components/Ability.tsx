import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { CounterTableProps } from '../interface/IPropertyRegistrationProps';

const Ability = ({ items, values, onValueChange }: CounterTableProps) => {
  const { palette, typography } = useTheme();

  const handleChange = (key: string, delta: number) => {
    const currentValue = values[key] || 0;
    const item = items.find(item => item.key === key);
    const maxValue = item?.maxLimit;
    let newValue = currentValue + delta;
    
    // Aplicar límite mínimo (0)
    newValue = Math.max(0, newValue);
    
    // Aplicar límite máximo si está definido
    if (maxValue !== undefined) {
      newValue = Math.min(maxValue, newValue);
    }
    
    onValueChange(key, newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {items.map((item, index) => {
        if (!item.hidden) {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: palette.grey[300],
                borderRadius: '18px',
                padding: 3,
                width: '100%',
                bgcolor: '#fff',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: typography.paragraph1Regular,
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 0.5,
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: typography.small1Regular,
                    color: palette.text.secondary,
                    fontSize: '14px',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 'auto' }}>
                <IconButton
                  onClick={() => handleChange(item.key, -1)}
                  disabled={values[item.key] === 0}
                  sx={{
                    border: '1px solid',
                    borderColor: palette.grey[400],
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    '&:disabled': {
                      borderColor: palette.grey[300],
                      opacity: 0.5,
                    },
                  }}
                  size="small"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                
                <Typography
                  sx={{
                    fontFamily: typography.h3,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    minWidth: 30,
                    textAlign: 'center',
                  }}
                >
                  {values[item.key] || 0}
                </Typography>
                
                <IconButton
                  onClick={() => handleChange(item.key, 1)}
                  disabled={item.maxLimit !== undefined && values[item.key] >= item.maxLimit}
                  sx={{
                    border: '1px solid',
                    borderColor: palette.grey[400],
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    '&:disabled': {
                      borderColor: palette.grey[300],
                      opacity: 0.5,
                    },
                  }}
                  size="small"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        }
      })}
    </Box>
  );
};

export default Ability;
