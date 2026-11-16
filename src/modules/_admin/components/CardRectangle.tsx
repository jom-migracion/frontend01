import { LUCIDE_ICONS } from '@/assets/lucideReact';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

const CardRectangle: React.FC<{
  title?: string;
  description: string;
  srcImg?: string;
  bgColor?: string;
  textColorTitle?: string;
  textColorDescription?: string;
  onClick?: () => void;
  selected?: boolean;
  typeIcon?: string;
  seeIcon?: boolean;
}> = ({ title, description, srcImg, typeIcon, onClick,seeIcon, selected = false }) => {
  // hooks
  const { typography, palette } = useTheme();
  
  let IconComponent = typeIcon && LUCIDE_ICONS[typeIcon];
  IconComponent = IconComponent ?? LUCIDE_ICONS['HelpCircle'];

  return (
    <Box
      sx={{
        border: selected ? `2px solid ${palette.primary.main}` : '2px solid transparent',
        borderRadius: '18px',
        padding: '0px',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,        
        bgcolor: palette.background.paper,
      }}
    >
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          border: '1px solid',
          borderColor: palette.grey[300],
          borderRadius: '16px',
          width: '100%',
          flex: 1,
          cursor: 'pointer',
          padding: 1.5,
          // backgroundColor: bgColor || palette.background.paper,
          transition: 'all 0.3s ease',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          boxSizing: 'border-box',
        }}
      >
      {srcImg && (
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: palette.grey[300],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
          }}
        >
          <img src={srcImg} width={32} height={32} />
        </Box>
      )}
        {!srcImg && IconComponent && seeIcon &&(
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Typography
          sx={{
            fontFamily: typography.paragraph1Medium,
            // color: textColorTitle || palette.text.primary,
            fontWeight: 600,
            fontSize: '16px',
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            textWrap: 'wrap',
            fontFamily: typography.small1Regular as string,
            // color: textColorDescription || palette.text.secondary,
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
    </Box>
  );
};

export default CardRectangle;
