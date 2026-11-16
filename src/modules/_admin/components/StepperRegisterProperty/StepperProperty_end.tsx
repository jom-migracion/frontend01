import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { DiscountType } from '@/models/interfaces/ListingRentResponseStep';
import { useSnackbar } from '@/context/SnackbarContext';

const services = [
  {
    key: 'pricing',
    title: 'Precios',
    dias: 'Lunes a Viernes',
    count: 200,
  },
  {
    key: 'weekendPrice',
    title: 'Precios',
    dias: 'Sabado a Domingo',
    count: 250,
  },
];

const services1 = [
  {
    key: 'price1',
    title: 'Descuento semanal',
    desc: 'Para estadías de 7 noches o más',
    count: 250,
  },
  {
    key: 'price2',
    title: 'Descuento semanal',
    desc: 'Sabado a DomingoPara estadías de 7 noches o más',
    count: 250,
  },
];

interface PricesDiscount {
  pricing: number;
  weekendPrice: number;
  price1: number;
  price2: number;
}

const selectedDiscountTypes: DiscountType[] = [];
const StepperProperty_end: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
  prefillData,
}) => {
  const showSnackbar = useSnackbar();
  const [discountTypes, setDiscountTypes] = useState<DiscountType[]>([]);
  const [pricesDiscount, setPricesDiscount] = useState<PricesDiscount>({
    pricing: 200,
    weekendPrice: 250,
    price1: 200,
    price2: 200,
  });

  const { handleSubmit } = useForm({ defaultValues: prefillData, mode: 'onChange' });

  const handlePriceInputChange = (
    key: keyof typeof pricesDiscount,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    setPricesDiscount((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleGuestChange = (key: keyof typeof pricesDiscount, delta: number) => {
    setPricesDiscount((prev) => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const handleSelectDiscount = (index: number, checked: boolean) => {
    const itemIndex = selectedDiscountTypes.findIndex(
      (selected) =>
        selected.discountTypeForTypePriceId === discountTypes[index].discountTypeForTypePriceId
    );

    if (checked && itemIndex == -1) {
      selectedDiscountTypes.push(discountTypes[index]);
    } else {
      itemIndex !== -1 && selectedDiscountTypes.splice(itemIndex, 1);
    }
  };

  const internalSubmit = () => {
    const discount = selectedDiscountTypes.map((item, index) => ({
      dicountTypeId: item.discountTypeForTypePriceId,
      price: index === 0 ? pricesDiscount.price1 : pricesDiscount.price2,
    }));

    if (selectedDiscountTypes.length == 0) {
      showSnackbar('Por favor seleccione precio y descuento', 'info');
    } else {
      onSubmit &&
        onSubmit({
          discount,
          pricing: pricesDiscount.pricing,
          weekendPrice: pricesDiscount.weekendPrice,
        });
    }
  };

  useEffect(() => {
    setDiscountTypes(prefillData?.parametrics?.discountTypes);
    selectedDiscountTypes.length = 0;
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form key={step} onSubmit={onSubmit ? handleSubmit(internalSubmit) : undefined}>
        <Grid container spacing={1} columns={16} sx={{ mt: 10 }}>
          <Grid size={{ md: 8, xs: 16 }}>
            <PropertyCardStep step={step} activeStep={activeStep} end={true} />
          </Grid>
          <Grid size={{ md: 8, xs: 16 }}>
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}
            >
              <Typography sx={{ mt: 1, ml: 1, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                Agrega datos básicos
              </Typography>
              <Typography
                sx={{ ml: 1, mr: 5, fontWeight: 300, fontSize: '15px', color: '#000000' }}
              >
                Después podrás agregar más información, como los tipos de cama.
              </Typography>
              <CardContent sx={{ width: '90%', ml: 0 }}>
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableBody>
                      {services.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell align="left" sx={{ pb: 1 }}>
                            <Typography
                              sx={{ fontWeight: 300, fontSize: '14px', color: '#B6B6B6' }}
                            >
                              Precios
                            </Typography>
                            <Typography sx={{ fontWeight: 300, fontSize: '16px' }}>
                              {service.dias}
                            </Typography>
                          </TableCell>
                          <TableCell align="right"></TableCell>
                          <TableCell align="right"></TableCell>
                          <TableCell align="right"></TableCell>
                          <TableCell align="right" sx={{ pl: '10%', pb: 1 }}>
                            <IconButton
                              onClick={() =>
                                handleGuestChange(service.key as keyof typeof pricesDiscount, -1)
                              }
                              disabled={
                                pricesDiscount[service.key as keyof typeof pricesDiscount] === 0
                              }
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
                            sx={{ fontSize: '16px', fontWeight: 300, pl: '7%', pt: 3 }}
                          >
                            <TextField
                              value={pricesDiscount[service.key as keyof typeof pricesDiscount]}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handlePriceInputChange(
                                  service.key as keyof typeof pricesDiscount,
                                  e
                                )
                              }
                              type="number"
                              size="small"
                              sx={{
                                width: '70px',
                                textAlign: 'center',
                                // Quitar las flechas en WebKit (Chrome, Safari)
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                  WebkitAppearance: 'none',
                                  margin: 0,
                                },
                                // Ocultar las flechas en Firefox
                                '& input[type="number"]': {
                                  MozAppearance: 'textfield',
                                },
                                // Ocultar flechas en otros navegadores
                                '& input': {
                                  appearance: 'textfield',
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ pl: '5%', pb: 1 }}>
                            <IconButton
                              onClick={() =>
                                handleGuestChange(service.key as keyof typeof pricesDiscount, 1)
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
                <Divider></Divider>
                <TableContainer sx={{ mt: 1 }}>
                  <Table aria-label="sticky table">
                    <TableBody>
                      {services1.map((service, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor: '#F6F6F6',
                            '& td': {
                              borderBottom: '8px solid white',
                            },
                          }}
                        >
                          <TableCell align="left" sx={{ pb: 1 }}>
                            <Checkbox
                              name="basic-checked"
                              size="large"
                              onClick={(event) =>
                                handleSelectDiscount(
                                  index,
                                  (event.target as HTMLInputElement).checked
                                )
                              }
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                              {service.title}
                            </Typography>
                            <Typography sx={{ fontWeight: 300, fontSize: '12px' }}>
                              {service.desc}
                            </Typography>
                          </TableCell>
                          <TableCell align="left"></TableCell>
                          <TableCell align="right" sx={{ pl: '2%', pb: 1 }}>
                            <IconButton
                              onClick={() =>
                                handleGuestChange(service.key as keyof typeof pricesDiscount, -1)
                              }
                              disabled={
                                pricesDiscount[service.key as keyof typeof pricesDiscount] === 0
                              }
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
                            sx={{ fontSize: '16px', fontWeight: 300, pl: '2%' }}
                          >
                            <TextField
                              value={pricesDiscount[service.key as keyof typeof pricesDiscount]}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handlePriceInputChange(
                                  service.key as keyof typeof pricesDiscount,
                                  e
                                )
                              }
                              type="number"
                              size="small"
                              sx={{
                                width: '70px',
                                textAlign: 'center',
                                // Quitar las flechas en WebKit (Chrome, Safari)
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                  WebkitAppearance: 'none',
                                  margin: 0,
                                },
                                // Ocultar las flechas en Firefox
                                '& input[type="number"]': {
                                  MozAppearance: 'textfield',
                                },
                                // Ocultar flechas en otros navegadores
                                '& input': {
                                  appearance: 'textfield',
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ pb: 1, pl: '2%' }}>
                            <IconButton
                              onClick={() =>
                                handleGuestChange(service.key as keyof typeof pricesDiscount, 1)
                              }
                              sx={{ border: '1px solid', borderColor: 'divider' }}
                              size="small"
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
            <Grid sx={{ ml: 2, width: '87%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default StepperProperty_end;
