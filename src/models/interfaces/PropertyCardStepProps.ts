interface dataCardProperty {
  title: string;
  subtitle: string;  
  stepTitle: string;
  stepNumber: number;

  titleDescription: string;
  description: string;
}
interface PropertyCardStepProps {
  step: number;
  data: dataCardProperty[]
}

export default PropertyCardStepProps;