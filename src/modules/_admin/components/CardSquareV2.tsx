import { amenityIconMap } from '@/assets/amenitiesIcons';
import { /*Avatar,*/ Box, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';

const CardSquareV2: React.FC<{
  title: string;
  description?: string;
  srcImg?: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  typeIcon?: string;
  selected?: boolean;
}> = ({ title, description, srcImg, onClick, typeIcon = '', selected = false }) => {
  // hooks
  const { palette} = useTheme();

  const IconComponent = typeIcon ? amenityIconMap[typeIcon] : undefined;

  return (
    <Tooltip title={title} enterDelay={500} placement="top">
      <Box
        sx={{
          borderRadius: '20px',
          transition: 'all 0.3s ease',
        }}
      >
        <Box
          onClick={onClick}
          sx={{
            width: '100%',
            minHeight: 22,
            border: '1px solid',
            borderColor: selected ? palette.primary.main : palette.grey[200],
            display: 'flex',
            alignItems: 'center',
            borderRadius: '50px',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            cursor: 'pointer',
            padding: { xs: '8px 12px', sm: '10px 20px' },
            transition: 'all 0.3s ease',
            boxShadow: 'none',
            backgroundColor: palette.background.paper,
            gap: { xs: 1.5, sm: 3 },
            '&:hover': {
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
              borderColor: palette.grey[300],
            }
          }}
        >
        {srcImg && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src={srcImg} width={32} height={32} style={{ objectFit: 'contain' }} />
          </Box>
        )}
        {!srcImg && IconComponent && (
          <Box sx={{ 
            width: 20, 
            height: 20, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <IconComponent 
              size={20} 
              color={selected ? palette.primary.main : palette.text.primary} 
              strokeWidth={1.5} 
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{          
              textAlign: 'left',
              mb: description ? 0.25 : 0,
              fontWeight: selected ? 600 : 500,
              fontSize: '14px',
              color: selected ? palette.text.primary: palette.text.secondary,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              sx={{          
                color: palette.text.secondary,
                textAlign: 'left',
                fontSize: '0.8125rem',
                lineHeight: 1.4,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      </Box>
    </Tooltip>
  );
};

export default CardSquareV2;
