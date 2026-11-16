// src/components/AvailabilitySettingsForm.tsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  // Paper,
  // Box,
  // Divider,
  // TextField,
  // Componentes clave para el desplegable (Accordion)
  // Accordion,
  // AccordionSummary,
  // AccordionDetails,
  // Radio,
  // RadioGroup,
  // FormControlLabel,
  // Button,
} from '@mui/material';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SelectorAnticipacionCompleto from './SelectorAnticipacionCompleto';
import SameDayNoticeHours from './SameDayNoticeHours';
// import { useCustomMutationByUrl, usePut } from '@/hooks/api';
import PreparationTimeSection from './PreparationTimeSection';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import AvailabilityWindowMonth from './AvailabilityWindowMonth';
import { RestClient } from '@/services/RestClient';
// import { json } from 'stream/consumers';

// interface AvailabilitySettings {
//   minNights: number;
//   maxNights: number;
//   noticePeriod: string; // Ej: "El mismo día", "1 día", etc.
//   sameDayCutoffTime: string;
//   preparationTime: string;
//   availabilityWindow: string;
// }

// const initialSettings: AvailabilitySettings = {
//   minNights: 1,
//   maxNights: 365,
//   noticePeriod: 'El mismo día',
//   sameDayCutoffTime: '9:00 a.m.',
//   preparationTime: '1 noche antes y después',
//   availabilityWindow: '12 meses de anticipación',
// };

// const noticePeriodOptions = ['El mismo día', '1 día', '2 días', '3 días', '7 días', '14 días'];

// const CustomSelectRow: React.FC<{
//   label: string;
//   value: string;
//   onClick: () => void;
// }> = ({ label, value, onClick }) => (
//   <Paper
//     elevation={0}
//     sx={{
//       p: 1,
//       mb: 1,
//       border: '1px solid #e0e0e0',
//       cursor: 'pointer',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//     }}
//     onClick={onClick}
//   >
//     <Box>
//       <Typography variant="body2" color="text.secondary">
//         {label}
//       </Typography>
//       <Typography variant="body1" fontWeight="medium">
//         {value}
//       </Typography>
//     </Box>
//     <ArrowDropDownIcon color="action" />
//   </Paper>
// );

interface FormProps {
  propertyId: string;
  minimumNotice: number;
  minimumNoticeHour: string;
  preparationDays: number;
  availabilityWindowMonth: number;
  /** Función que se llama cuando el usuario guarda un nuevo precio. Recibe el nuevo precio. */
  onRefresh: () => void;
}

const AvailabilitySettingsForm: React.FC<FormProps> = ({
  propertyId,
  minimumNotice,
  minimumNoticeHour,
  preparationDays,
  availabilityWindowMonth,
  onRefresh,
}) => {
  //states
    const { t } = useTranslation();
  const [minNotice, setMinNotice] = useState(0);
  const [minNoticeHour, setMinNoticeHour] = useState('06:00:00');

  //api hooks
  // const { mutate: UpsertReservationNotice } = usePut<any>(
  //   '/Host/ListingRent/UpsertReservationNotice'
  // );
  // const { mutate: UpdatePricingAndDiscounts } = useCustomMutationByUrl('put');
  // const { mutate: UpdateAvailabilityWindowMonth } = useCustomMutationByUrl('put');

  //hooks
  const showSnackbar = useSnackbar();

  useEffect(() => {
    setMinNotice(minimumNotice);
    setMinNoticeHour(minimumNoticeHour || '06:00:00');
  }, [minimumNotice, minimumNoticeHour]);

  const handleSaveMinNotice = async (newValue: number) => {
    let data = {
      listingRentId: propertyId,
      minimumNoticeDay: newValue,
      minimumNoticeHours: '06:00:00',
    };

    // UpsertReservationNotice(data, {
    //   onSuccess: (response) => {
    //     console.log(response);
    //     setMinNotice(newValue);
    //     setMinNoticeHour('06:00:00');
    //   },
    //   onError: (error: any) => {
    //     console.log('Existe error', error);
    //   },
    // });
    await RestClient.put('/Host/ListingRent/UpsertReservationNotice', data)
    .then((x: any) => {
      if (x?.data?.statusCode == '200') {
        // showSnackbar(
        // t('panelCalendarConfig.successUpdate') || 'Fechas actualizadas correctamente',
        //   'success'
        // );
        //console.log(response);
        setMinNotice(newValue);
        setMinNoticeHour('06:00:00');
        onRefresh();
      } else {
        showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
        console.log('Existe error: ', x);
      }
    })
    .catch((error) => {
      showSnackbar(
        'Error: ' +
          (error?.response?.data?.resultError?.message
            ? error?.response?.data?.resultError?.message
            : error.message),
        'error',
        8000
      );
    });
  };
  const handleSaveMinNoticeHour = async (newValue: string) => {
    let data = {
      listingRentId: propertyId,
      minimumNoticeDay: 0,
      minimumNoticeHours: newValue,
    };

    // UpsertReservationNotice(data, {
    //   onSuccess: (response) => {
    //     console.log(response);
    //     setMinNoticeHour(newValue);
    //     onRefresh();
    //   },
    //   onError: (error: any) => {
    //     console.log('Existe error', error);
    //   },
    // });
    await RestClient.put('/Host/ListingRent/UpsertReservationNotice', data)
    .then((x: any) => {
      if (x?.data?.statusCode == '200') {
        // showSnackbar(
        // t('panelCalendarConfig.successUpdate') || 'Fechas actualizadas correctamente',
        //   'success'
        // );
        //console.log(response);
        setMinNoticeHour(newValue);
        onRefresh();
      } else {
        showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
        console.log('Existe error: ', x);
      }
    })
    .catch((error) => {
      showSnackbar(
        'Error: ' +
          (error?.response?.data?.resultError?.message
            ? error?.response?.data?.resultError?.message
            : error.message),
        'error',
        8000
      );
    });
  };

  const handleSavePrepationTime = async (newValue: number) => {
    const url = 'Host/ListingRent/UpsertPreparationDay';
    
    const jsonData = {
      listingRentId: propertyId,
      preparationDayValue: newValue,
    };
    // UpdatePricingAndDiscounts(
    //   { url, data: jsonData },
    //   {
    //     onSuccess: (response) => {
    //       const { statusCode, resultError } = response;

    //       if (statusCode === '200') {
    //         showSnackbar('update', 'success');
    //         onRefresh();
    //       } else {
    //         showSnackbar(resultError?.message || 'Error no controlado.', 'error');
    //       }
    //     },
    //     onError: (error) => {
    //       showSnackbar(error?.response?.data?.resultError?.message ?? error.message, 'error');
    //     },
    //   }
    // );
    await RestClient.put(url, jsonData)
    .then((x: any) => {
      if (x?.data?.statusCode == '200') {
        // showSnackbar(
        // t('panelCalendarConfig.successUpdate') || 'Fechas actualizadas correctamente',
        //   'success'
        // );
        //console.log(response);
        showSnackbar('update', 'success');
        onRefresh();
      } else {
        showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
        console.log('Existe error: ', x);
      }
    })
    .catch((error) => {
      showSnackbar(
        'Error: ' +
          (error?.response?.data?.resultError?.message
            ? error?.response?.data?.resultError?.message
            : error.message),
        'error',
        8000
      );
    });
  };

  const handleSaveAvailabilityWindowMonth = async (newValue: number) => {
    const url = 'Host/ListingRent/UpsertAvailabilityWindowMonth';

    const jsonData = {
      listingRentId: propertyId,
      availabilityWindowMonth: newValue,
    };
    // UpdateAvailabilityWindowMonth(
    //   { url, data: jsonData },
    //   {
    //     onSuccess: (response) => {
    //       const { statusCode, resultError } = response;

    //       if (statusCode === '200') {
    //         showSnackbar('update', 'success');
    //         onRefresh();
    //       } else {
    //         showSnackbar(resultError?.message || 'Error no controlado.', 'error');
    //       }
    //     },
    //     onError: (error) => {
    //       showSnackbar(error?.response?.data?.resultError?.message ?? error.message, 'error');
    //     },
    //   }
    // );
    await RestClient.put(url, jsonData)
    .then((x: any) => {
      if (x?.data?.statusCode == '200') {
        // showSnackbar(
        // t('panelCalendarConfig.successUpdate') || 'Fechas actualizadas correctamente',
        //   'success'
        // );
        //console.log(response);
        showSnackbar('update', 'success');
        onRefresh();
      } else {
        showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
        console.log('Existe error: ', x);
      }
    })
    .catch((error) => {
      showSnackbar(
        'Error: ' +
          (error?.response?.data?.resultError?.message
            ? error?.response?.data?.resultError?.message
            : error.message),
        'error',
        8000
      );
    });
  }

  return (
    <Container disableGutters sx={{ py: 2, pr: 0, pl: 0 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('availabilitySettings.title')}
      </Typography>
      <SelectorAnticipacionCompleto
        minimumNotice={minNotice}
        handleSave={handleSaveMinNotice}
      />
      <br />
      {minNotice == 0 && (
        <SameDayNoticeHours
          minimumNoticeHour={minNoticeHour}
          handleSave={handleSaveMinNoticeHour}
        />
      )}
      <PreparationTimeSection
        minimumNotice={preparationDays}
        handleSave={handleSavePrepationTime}
      />
      <AvailabilityWindowMonth 
        availabilityWindowMonth={availabilityWindowMonth}
        handleSave={handleSaveAvailabilityWindowMonth}
      />
      {/* <CustomSelectRow
        label="Tiempo de preparación"
        value={settings.preparationTime}
        onClick={() => console.log('Abrir modal/select de Tiempo de preparación')}
      />

      <CustomSelectRow
        label={t('availabilitySettings.window.label')}
        value={settings.availabilityWindow}
        onClick={() => console.log('Abrir modal/select de Ventana de disponibilidad')}
      /> */}

      {/* <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          border: '1px solid #e0e0e0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafa',
        }}
        onClick={() => console.log('Navegar a opciones avanzadas')}
      >
        <Box>
          <Typography variant="body1" fontWeight="medium">
            Más opciones de configuración de disponibilidad
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Días de check-in y de check-out restringidos
          </Typography>
        </Box>
        <ArrowForwardIosIcon color="action" sx={{ fontSize: 'medium' }} />
      </Paper> */}
    </Container>
  );
};

export default AvailabilitySettingsForm;
