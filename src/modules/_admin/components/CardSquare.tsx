import { LUCIDE_ICONS } from '@/assets/lucideReact';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';

const CardSquare: React.FC<{
  title: string;
  description?: string;
  srcImg?: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  typeIcon?: string;
  selected?: boolean;
  minHeight?: number | string;
  iconBgColor?: string;
  seeIcon?: boolean;
}> = ({ title, description, srcImg, seeIcon, onClick, typeIcon = '', selected = false, minHeight = 140, iconBgColor = '' }) => {
  // hooks
  const { palette} = useTheme();

  let IconComponent = typeIcon && LUCIDE_ICONS[typeIcon];
    IconComponent = IconComponent ?? LUCIDE_ICONS['HelpCircle'];

  return (
    <Tooltip title={title} enterDelay={500} placement="top">
      <Box
        onClick={onClick}
        sx={{
          width: '100%',
          height: '100%',
          border: selected ? `2px solid ${palette.primary.main}` : '1px solid',
          borderColor: selected ? palette.primary.main : palette.grey[300],
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          cursor: 'pointer',
          bgcolor: palette.background.paper,
          p: { xs: 2, md: 2},
          transition: 'all 0.2s ease',
          minHeight: description ? minHeight : 'auto',
          overflow: 'hidden',
          '&:hover': {
            borderColor: palette.primary.main,
            boxShadow: selected ? '0px 4px 12px rgba(91, 85, 200, 0.15)' : '0px 4px 12px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        {srcImg && (
          <Box 
            sx={{ 
              mb: { xs: 1.5, md: 1.5 }, 
              bgcolor: iconBgColor || palette.grey[100], 
              borderRadius: '10%',
              width: { xs: 40, md: 44 },
              height: { xs: 40, md: 44 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 1.25, md: 1.5 },
            }}
          >
            <img src={srcImg} width={24} height={24} style={{ objectFit: 'contain' }} />
          </Box>
        )}
        {!srcImg && IconComponent && seeIcon && (
          <Box
            sx={{
              width: { xs: 40, md: 44 },
              height: { xs: 40, md: 44 },
              bgcolor: palette.grey[100],
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 1.5, md: 1.5 },
            }}
          >
            <IconComponent size={24} color={selected ? palette.primary.main : palette.text.primary} />
          </Box>
        )}
        <Typography
          sx={{          
            textAlign: 'center',
            mb: description ? 0.75 : 0,
            fontWeight: 600,
            width: '100%',
            fontSize: { xs: '0.9rem', md: '0.875rem' },
            lineHeight: 1.3,
            color: palette.text.primary,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            sx={{          
              color: palette.text.secondary,
              textAlign: 'center',
              fontSize: { xs: '0.8rem', md: '0.75rem' },
              lineHeight: 1.4,
              width: '100%',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default CardSquare;
