import contentPropertyCardStep from '@/common/constants/contentPropertyCardStep';
import CustomButton from '@/components/CustomButton';
import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

const PropertyCardStep: React.FC<{ step?: number; activeStep: number; end?: boolean }> = ({
  step,
  activeStep,
  end = false,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));;

  if (step == undefined) return <></>;
  return (
    <Card
      sx={{
        boxSizing: 'border-box',
        boxShadow: '4px -4px 8px rgba(0, 0, 0, 0.2)',
        ml: isSmallScreen ? 3 : 10,
        borderRadius: '0 15px 15px 0',
        width: '80%',
      }}
    >
      <CardContent
        sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}
      >
        <Typography sx={{ mt: 7, fontSize: '45px', fontWeight: 600, lineHeight: '100%' }}>
          {contentPropertyCardStep[step]?.data[activeStep - 1]?.title}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: '35px',
            fontWeight: 600,
            lineHeight: '100%',
            mt: 3,
            ml: 1,
          }}
        >
          {contentPropertyCardStep[step]?.data[activeStep - 1]?.subtitle}
        </Typography>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: '100%',
            mt: 3,
          }}
        >
          {contentPropertyCardStep[step]?.data[activeStep - 1]?.stepTitle}
        </Typography>
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '100%',
            mt: 3,
          }}
        >
          {contentPropertyCardStep[step]?.data[activeStep - 1]?.titleDescription}
        </Typography>
        <Typography
          fontSize={'14px'}
          sx={{
            color: 'text.secondary',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '100%',
            textAlign: 'justify',
            mt: 3,
            mr: 5,
          }}
        >
          {contentPropertyCardStep[step]?.data[activeStep - 1]?.description}
        </Typography>
        <CustomButton
          label={!end ? 'Siguiente' : 'Finalizar'}
          type="submit"
          color="primary"
          borderRadius={15}
          fullWidth
          sx={{
            width: '120px',
            borderRadius: '15px',
            fontSize: '13px',
            fontWeight: 600,
            mt: 2,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyCardStep;
