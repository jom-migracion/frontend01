import { Box, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
//import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
//import PropertyCardStep from './PropertyCardStep';
import EditableTableSection from './EditableTableSection';
import DiscountTableSection from './DiscountTableSection';//
import { lessIcon, plusIcon } from '@/assets';
import { useState } from 'react';
//import PropertyCardStep from './PropertyCardStep';

const SectionPriceDiscount: React.FC<StepperWrapperProps> = ({  }) => {
  const [prices, setPrices] = useState([
    { title: 'Precios', dias: 'Lunes a Viernes', count: 200 },
    { title: 'Precios', dias: 'Sábado a Domingo', count: 250 },
  ]);

  const [discounts, setDiscounts] = useState([
    {
      title: 'Descuento semanal',
      desc: 'Para estadías de 7 noches o más',
      count: 250,
      checked: false,
    },
    {
      title: 'Descuento mensual',
      desc: 'Para estadías de 30 noches o más',
      count: 500,
      checked: true,
    },
  ]);

  const handlePriceChange = (index: number, newValue: number) => {
    const updated = [...prices];
    updated[index].count = Math.max(newValue, 0);
    setPrices(updated);
  };

  const handleDiscountChange = (index: number, newValue: number) => {
    const updated = [...discounts];
    updated[index].count = Math.max(newValue, 0);
    setDiscounts(updated);
  };

  const handleDiscountToggle = (index: number) => {
    const updated = [...discounts];
    updated[index].checked = !updated[index].checked;
    setDiscounts(updated);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} columns={16} sx={{ mt: 10 }}>
        
        <Grid sx={{ md: 8, xs: 16 }}>
          <Card sx={{ height: '100%', width: '100%', boxShadow: 'none' }}>
            
            <CardContent sx={{ width: '90%', ml: 2 }}>
              <EditableTableSection
                items={prices}
                onChange={handlePriceChange}
                plusIcon={plusIcon}
                lessIcon={lessIcon}
              />
              <DiscountTableSection
                items={discounts}
                onChange={handleDiscountChange}
                onToggle={handleDiscountToggle}
                plusIcon={plusIcon}
                lessIcon={lessIcon}
              />
            </CardContent>
          </Card>
          <Grid sx={{ ml: 2, width: '87%' }}>
            {/* <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} /> */}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionPriceDiscount;
