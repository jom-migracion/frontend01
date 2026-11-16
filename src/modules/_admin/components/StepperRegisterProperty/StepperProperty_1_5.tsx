import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSnackbar } from '@/context/SnackbarContext';

const services = [
  {
    key: 'guests',
    name: 'Huéspedes',
    count: 1,
  },
  {
    key: 'bathrooms',
    name: 'Habitaciones',
    count: 1,
  },
  {
    key: 'bedrooms',
    name: 'Camas',
    count: 1,
  },
  {
    key: 'beds',
    name: 'Baños',
    count: 1,
  },
];

interface Guests {
  guests: number;
  bathrooms: number;
  bedrooms: number;
  beds: number;
}

const StepperProperty_1_5: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
}) => {
  const showSnackbar = useSnackbar();
  const { handleSubmit } = useForm({ defaultValues: {}, mode: 'onChange' });
  const [maxGuests, setMaxGuests] = useState<Guests>({
    guests: 0,
    bathrooms: 0,
    bedrooms: 0,
    beds: 0,
  });

  const handleGuestChange = (key: keyof typeof maxGuests, delta: number) => {
    setMaxGuests((prev) => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const internalSubmit = () => {
    if (
      maxGuests.guests === 0
    ) {
      showSnackbar('Debe ingresar cantidad máxima de Huéspedes permitidos.', 'info', 3000);
    } else {
      onSubmit && onSubmit(maxGuests);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form key={step} onSubmit={onSubmit ? handleSubmit(internalSubmit) : undefined}>
        <Grid container spacing={1} columns={16} sx={{ mt: 10 }}>
          <Grid size={{ md: 8, xs: 16 }}>
            <PropertyCardStep step={step} activeStep={activeStep} />
          </Grid>
          <Grid size={{ md: 8, xs: 16 }}>
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}
            >
              <Typography sx={{ mt: 2, ml: 4, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                Agrega datos básicos
              </Typography>
              <Typography
                sx={{ ml: 4, mr: 5, fontWeight: 300, fontSize: '15px', color: '#000000' }}
              >
                Después podrás agregar más información, como los tipos de cama.
              </Typography>
              <CardContent sx={{ width: '75%', ml: 2 }}>
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableBody>
                      {services.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell align="left" sx={{ pb: 1 }}>
                            {service.name}
                          </TableCell>
                          <TableCell align="right"></TableCell>
                          <TableCell align="right"></TableCell>
                          <TableCell align="right"></TableCell>
                          <TableCell align="right" sx={{ pl: '8%', pb: 1 }}>
                            <IconButton
                              onClick={() =>
                                handleGuestChange(service.key as keyof typeof maxGuests, -1)
                              }
                              disabled={maxGuests[service.key as keyof typeof maxGuests] === 0}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                              size="small"
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontSize: '18px', fontWeight: 300, pt: 3, pl: 3 }}
                          >
                            {maxGuests[service.key as keyof typeof maxGuests]}
                          </TableCell>
                          <TableCell align="right" sx={{ pr: '5%', pb: 1 }}>
                            <IconButton
                              onClick={() =>
                                handleGuestChange(service.key as keyof typeof maxGuests, 1)
                              }
                              sx={{ border: '1px solid', borderColor: 'divider' }}
                              size="small"
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow></TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
            <Grid sx={{ ml: 2, width: '77%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default StepperProperty_1_5;
