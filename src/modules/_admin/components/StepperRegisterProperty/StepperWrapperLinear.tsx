import StepperWrapper from '@/components/styles/StepperWrapper';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import { Step, Stepper, StepConnector, styled, stepConnectorClasses } from '@mui/material';
import React from 'react';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main, // Color para el paso activo
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300], // Color por defecto
    borderRadius: 1,
  },
}));

const StepperWrapperLinear: React.FC<StepperWrapperProps> = ({ stepsCount, activeStep }) => {
  const stepsArray  = Array.from({ length: stepsCount }, (_, index) => index);
  return (
    <StepperWrapper>
      <Stepper activeStep={activeStep} sx={{ width: '98%' }} connector={<ColorlibConnector />}>
        {stepsArray .map((_, index) => {
          return <Step key={index}></Step>;
        })}
      </Stepper>
    </StepperWrapper>
  );
};

export default StepperWrapperLinear;
