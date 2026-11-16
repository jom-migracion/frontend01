interface StepperWrapperProps {
  stepsCount: number;
  activeStep: number;
  step?: number;
  onSubmit?: (data: any) => void;
  prefillData?: any;
}

export default StepperWrapperProps;
