import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import StepperLinearWithValidation from '@/modules/_admin/pages/StepperLinearRegisterProperty';
import { Helmet } from 'react-helmet';

const CreateHome: React.FC = () => {
  return (
    <Container maxWidth={'xl'}>
      <Helmet>
        <title>Publicar espacio </title>
      </Helmet>
      <Stack direction={'column'} sx={{ ml: 2 }}>
        <StepperLinearWithValidation />
      </Stack>
    </Container>
  );
};

export default CreateHome;
