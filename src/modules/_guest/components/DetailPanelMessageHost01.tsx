import { useSnackbar } from '@/context/SnackbarContext';
import { useGet, usePut } from '@/hooks/api';
import {
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  List,
  Paper,
  ListItem,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import DetailPanelMessageHost02 from './DetailPanelMessageHost02';
import { useMessageStoreReservation } from '@/store/message.store';

// import Grid from '@mui/material/Grid2';

const QuestionCancel: React.FC<{
  listItems: any;
  conversation: any;
  setOpenCancelReservation: (bol: boolean) => void;
}> = ({ listItems, conversation, setOpenCancelReservation }) => {
  const storeReservation = useMessageStoreReservation((state: any) => state.setStateReservation);

  // hooks
  const showSnackbar = useSnackbar();
  const { typography } = useTheme();

  // api
  const { mutate: RefuseConsulting } = usePut(
    `/Host/Booking/Consulting/${conversation?.priceCalculation?.priceCalculation?.priceCalculationId}/Refuse`
  );

  const handleCancelConsult = (item: any) => {
    if (conversation?.priceCalculation?.priceCalculation?.priceCalculationId) {
      RefuseConsulting(item?.reasonRefusedId, {
        onSuccess: (response) => {
          const { resultError, statusCode } = response;
          if (statusCode == '200') {
            storeReservation('REFUSED');
            showSnackbar('La consulta ha sido rechazada.', 'success');
            setOpenCancelReservation(false);
          } else showSnackbar(resultError?.message, 'error');
        },
        onError: (error: any) => showSnackbar(error?.message, 'error'),
      });
    } else {
      showSnackbar('No se pudo rechazar la consulta, intente nuevamente.', 'error');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff',
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '500px',
          margin: 'auto',
          padding: 3,
          textAlign: 'center',
          borderRadius: '12px',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
        }}
      >
        <Box>
          <Typography
            variant="h3Medium"
            component="h1"
            sx={{ fontWeight: 'bold', textAlign: 'left', mb: 4 }}
          >
            XXX Cuéntanos por qué no puedes recibirlo
          </Typography>
          <List>
            {listItems.map((item: any) => (
              <ListItem
                key={item?.reasonRefusedId}
                sx={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  '& .MuiListItemText-primary': {
                    fontFamily: typography.paragraph1Medium,
                    lineHeight: '1.5',
                    cursor: 'pointer',
                    ':hover': {
                      backgroundColor: 'black',
                      color: 'white',
                      p: 1,
                      borderRadius: '12px',
                      transition: '0.3s',
                    },
                  },
                  paddingBottom: 2,
                  paddingTop: 2,
                }}
              >
                <ListItemText
                  primary={item?.reasonRefusedText}
                  onClick={() => handleCancelConsult(item)}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: typography.paragraph1Medium,
              padding: '12px 24px',
              borderColor: 'grey.400',
              mt: 5,
            }}
            onClick={() => setOpenCancelReservation(false)}
          >
            Cancelar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const DetailPanelMessageHost01: React.FC<{
  bookingData: any;
  conversation: any;
  reCalled: () => void;
}> = ({ bookingData, conversation, reCalled }) => {
  // state
  const [openCancelReservation, setOpenCancelReservation] = useState(false);
  const storeReservation = useMessageStoreReservation((state: any) => state.setStateReservation);

  //  api
  const { data: ParametricsReasonRefused } = useGet<any>(
    'ParametricsReasonRefused',
    '/Parametrics/ReasonRefused'
  );
  const { mutate: ApproveConsulting } = usePut(
    `/Host/Booking/Consulting/${conversation?.priceCalculation?.priceCalculation?.priceCalculationId}/Approve`
  );

  // hooks
  const { typography } = useTheme();
  const showSnackbar = useSnackbar();

  // functions
  const handlAceptConsult = () => {
    if (conversation?.priceCalculation?.priceCalculation?.priceCalculationId) {
      ApproveConsulting(
        {},
        {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') {
              storeReservation('PENDING');
              showSnackbar('La consulta ha sido aceptada.', 'success');
            } else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error'),
        }
      );
    } else {
      showSnackbar('No se pudo aprobar la consulta, intente nuevamente.', 'error');
    }
  };

  return (
    <Box
      sx={{
        borderLeft: '1px solid #e0e0e0',
        height: { xs: 'auto', md: 'calc(100vh - 65px)' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      {openCancelReservation ? (
        <QuestionCancel
          listItems={ParametricsReasonRefused?.data || []}
          setOpenCancelReservation={setOpenCancelReservation}
          conversation={conversation}
        />
      ) : (
        <>
          <Box
            sx={{
              p: { xs: 1.5, sm: 1.88 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h3Medium" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Reservación
            </Typography>
          </Box>
          {conversation == null ? (
            <></>
          ) : !conversation?.booking ? (
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              {/* Sección de consulta */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="small1Medium"
                  component="div"
                  sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                >
                  Consulta
                </Typography>
                <Typography
                  variant="small1Medium"
                  component="div"
                  sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' }, mt: 0.5 }}
                >
                  {conversation?.userIdOneNavigation?.name ?? ''}{' '}
                  {conversation?.userIdOneNavigation?.lastName ?? ''}
                </Typography>
                <Typography
                  variant="small1Regular"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    lineHeight: { xs: 1.4, sm: 1.5 },
                    mt: 0.5,
                  }}
                >
                  {conversation?.listingRent?.name ?? ''}
                  {/* Lujoso depto Stratto Equipetrol */}
                  <br />
                  {conversation?.priceCalculation?.priceCalculation?.calculationDetails ?? ''}
                  <br />
                  {conversation?.priceCalculation?.priceCalculation?.amount}{' '}
                  {conversation?.priceCalculation?.priceCalculation?.currencyCode}
                </Typography>
              </Box>

              {/* Botones de acción */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 1.5, sm: 2 },
                  mb: { xs: 2, sm: 3 },
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#1a1a1a',
                    fontFamily: typography.paragraph1Medium,
                    textTransform: 'none',
                    p: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                  onClick={handlAceptConsult}
                >
                  Aceptar Consulta
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#1a1a1a',
                    fontFamily: typography.paragraph1Medium,
                    textTransform: 'none',
                    p: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                  onClick={() => setOpenCancelReservation(true)}
                >
                  Rechazar Consulta
                </Button>
              </Box>

              <Divider sx={{ my: 2, bgcolor: '#e0e0e0' }} />

              {/* Sección "Acerca de" */}
              <Box sx={{ my: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="paragraph1Medium"
                  component="div"
                  sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                >
                  Acerca de {conversation?.userIdOneNavigation?.name ?? ''}{' '}
                  {conversation?.userIdOneNavigation?.lastName ?? ''}
                </Typography>
                <Typography
                  variant="small1Regular"
                  component="div"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mt: 0.5 }}
                >
                  Valoración de reseñas
                </Typography>

                <Typography
                  variant="small1Regular"
                  component="div"
                  sx={{
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    mt: 0.5,
                  }}
                >
                  Identidad verificada
                </Typography>

                <Typography
                  variant="small1Regular"
                  component="div"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mt: 0.5 }}
                >
                  Se unió a Assert en
                </Typography>
                <Typography
                  variant="small1Regular"
                  component="div"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mt: 0.5 }}
                >
                  Vive en
                </Typography>
                <Typography
                  variant="small1Regular"
                  component="div"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mt: 0.5 }}
                >
                  Habla
                </Typography>
                <Typography
                  variant="small1Regular"
                  sx={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: '#007bff',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    mt: 0.5,
                  }}
                >
                  Muestra el perfil
                </Typography>
              </Box>

              <Divider sx={{ my: 2, bgcolor: '#e0e0e0' }} />

              {/* Sección de detalles de la reservación */}
              <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="paragraph1Medium"
                  component="div"
                  sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '0.95rem', sm: '1rem' } }}
                >
                  Detalles de la reservación
                </Typography>
                <Typography
                  variant="small1Medium"
                  component="div"
                  sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' }, fontWeight: 'bold' }}
                >
                  Huéspedes
                </Typography>
                <Typography
                  variant="small1Medium"
                  component="div"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mt: 0.5 }}
                >
                  1 adulto
                </Typography>
              </Box>
            </Box>
          ) : (
            <DetailPanelMessageHost02
              bookingData={bookingData}
              conversation={conversation}
              reCalled={reCalled}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default DetailPanelMessageHost01;
