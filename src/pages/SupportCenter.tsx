import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const SupportCenter = () => {
  return (
    <Container maxWidth={'xl'}>
      <Stack direction={'row'} sx={{ ml: 2 }}>
        <Typography variant="h3Bold"> SupportCenter </Typography>
      </Stack>
    </Container>
  );
};

export default SupportCenter;
