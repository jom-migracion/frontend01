import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import PrecioBase from './PanelConfiguracion/PrecioBase';
import Descuentos from './PanelConfiguracion/Descuentos';
import TarifasAdicionales from './PanelConfiguracion/TarifasAdicionales';
import DuracionDelViaje from './PanelConfiguracion/DuracionDelViaje';
// import { usePost, usePut } from '@/hooks/api';
import PriceForm from './PanelConfiguracion/PriceForm';
import AvailabilitySettingsForm from './PanelConfiguracion/AvailabilitySettingsForm';
import MinDayForm from './PanelConfiguracion/MinDayForm';
import AvailabilityForm from './PanelConfiguracion/AvailabilityForm';
import ExtraGuestFeeForm from './PanelConfiguracion/ExtraGuestFeeForm';
import { SelectedDay } from '@/models/interfaces/SelectedDay';
import { ApiService } from '@/services/ApiService';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import { RestClient } from '@/services/RestClient';

interface Props {
  diasSeleccionados: SelectedDay[];
  propertyId?: string;
  propertyInfo?: any;
  onSeleccionarDias: (dias: SelectedDay[]) => void;
  handleRefetchCalendar: () => void;
}

interface AdditionFee {
  listingAdditionalFeeId: number;
  listingRentId: string;
  additionalFeeId: number;
  amountFee: number;
  feeValue: number | null;
}

const FEE_IDS = {
  CLEANING_FEE: 3,
  PET_FEE: 6,
  EXTRA_GUEST_FEE: 7,
};

const PanelConfiguracion1: React.FC<Props> = ({
  diasSeleccionados,
  propertyId,
  propertyInfo,
  onSeleccionarDias,
  handleRefetchCalendar,
}) => {
  const [modoEdicion, setModoEdicion] = useState<null | string>(null);
  const [selectedSection, setSelectedSection] = useState<'precios' | 'disponibilidad' | null>(
    diasSeleccionados.length > 0 ? 'precios' : null
  );
  const [, setTempValor] = useState<number>(0);
  const [, setAdditionalFees] = React.useState<AdditionFee[]>([]);
  const [cleaningFeeAmount, setCleaningFeeAmount] = useState(0);
  const [petFeeAmount, setPetFeeAmount] = useState(0);
  const [extraGuestFeeAmount, setExtraGuestFeeAmount] = useState(0);
  const [extraGuestCount, setExtraGuestCount] = useState(0);
  const [percentageWeek, setPercentageWeek] = useState(0);
  const [percentageMonth, setPercentageMonth] = useState(0);
  const [minStay, setMinStay] = useState(0);
  const [maxStay, setMaxStay] = useState(0);
  const [minimumNotice, setMinimumNotice] = useState(0);
  const [minimumNoticeHour, setMinimumNoticeHour] = useState('');
  // const [approvalPolicyTypeId, setApprovalPolicyTypeId] = useState(0);
  const [preparationDays, setPreparationDays] = useState(0);
  const [availabilityWindowMonth, setAvailabilityWindowMonth] = useState(0);
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();

  const handleEditar = (id: string, valor?: number) => {
    setModoEdicion(id);
    setTempValor(valor ?? 0);
  };

  // Función para validar los valores mínimos y máximos
  const validateStayLimits = (newValue: number, currentEditMode: string): boolean => {
    if (currentEditMode === 'minimoNoches') {
      // El mínimo no debe ser mayor al máximo
      if (newValue > maxStay) {
        showSnackbar(
          t('panelCalendarConfig.validation.minGreaterThanMax') ||
            'El mínimo de noches no puede ser mayor al máximo',
          'error'
        );
        return false;
      }
    } else if (currentEditMode === 'maximoNoches') {
      // El máximo no debe ser menor al mínimo
      if (newValue < minStay) {
        showSnackbar(
          t('panelCalendarConfig.validation.maxLessThanMin') ||
            'El máximo de noches no puede ser menor al mínimo',
          'error'
        );
        return false;
      }
    }
    return true;
  };

  const fetchReviews = async () => {
    try {
      const response = await ApiService.get<{ data: AdditionFee[] }>(
        `/Host/ListingRent/${propertyId}/GetAdditionalFee`
      );
      setAdditionalFees(response.data);
      const fee1 = response.data.find((f: any) => f.additionalFeeId == FEE_IDS.CLEANING_FEE);
      setCleaningFeeAmount(fee1 ? fee1.amountFee : 0);
      const fee2 = response.data.find((f: any) => f.additionalFeeId == FEE_IDS.PET_FEE);
      setPetFeeAmount(fee2 ? fee2.amountFee : 0);
      const fee3 = response.data.find((f: any) => f.additionalFeeId == FEE_IDS.EXTRA_GUEST_FEE);
      setExtraGuestFeeAmount(fee3 ? fee3.amountFee : 0);
      if(fee3?.feeValue){
        setExtraGuestCount(fee3?.feeValue || 0);
      } else {
        setExtraGuestCount(propertyInfo?.maxGuests || 0);
      }
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId]);

  useEffect(() => {
    let _percentageWeek = 0;
    let _percentageMonth = 0;

    if (propertyInfo?.price) {
      _percentageWeek = Array.isArray(propertyInfo?.price.tlListingDiscountForRates)
        ? propertyInfo?.price.tlListingDiscountForRates.find((p: any) => p.code == 'week')
            ?.porcentage || 0
        : 0;
      _percentageMonth = Array.isArray(propertyInfo?.price.tlListingDiscountForRates)
        ? propertyInfo?.price.tlListingDiscountForRates.find((p: any) => p.code == 'month')
            ?.porcentage || 0
        : 0;
    }
    setPercentageWeek(_percentageWeek);
    setPercentageMonth(_percentageMonth);
    setMinStay(propertyInfo?.minimunStay || 0);
    setMaxStay(propertyInfo?.maximumStay || 0);
    setMinimumNotice(propertyInfo?.minimumNotice || 0);
    setMinimumNoticeHour(propertyInfo?.minimumNoticeHour || '');
    // setApprovalPolicyTypeId(propertyInfo?.approvalPolicyTypeId || 0);
    setPreparationDays(propertyInfo?.preparationDays || 0);
    setAvailabilityWindowMonth(propertyInfo?.availabilityWindowMonth || 0);
  }, [propertyInfo]);

  useEffect(() => {
    if (diasSeleccionados.length > 0 && modoEdicion === null) {
      setTempValor(0);
    }
  }, [diasSeleccionados]);

  const handleGuardar = async (newPrice: number) => {
    if (modoEdicion === 'precioNoche' && propertyId) {
      let data = {
        nightlyPrice: newPrice,
        weekendNightlyPrice: 0,
        currencyId: 2,
        discountPrices: null,
      };
      await RestClient.put(`/Host/ListingRent/${propertyId}/UpdatePricingAndDiscounts`, data)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
          handleRefetchCalendar();
        } else {
          showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
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
    } else if (modoEdicion === 'precioFinSemana' && propertyId) {
      let data = {
        nightlyPrice: 0,
        weekendNightlyPrice: newPrice,
        currencyId: 2,
        discountPrices: null,
      };
      await RestClient.put(`/Host/ListingRent/${propertyId}/UpdatePricingAndDiscounts`, data)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
          handleRefetchCalendar();
        } else {
          showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
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
    } else if (modoEdicion === 'descuentoSemanal' && propertyId) {
      let data = {
        nightlyPrice: 0,
        weekendNightlyPrice: 0,
        currencyId: 2,
        discountPrices: [
          {
            discountCode: 'week',
            discountId: 1,
            price: 0,
            percentage: newPrice,
          },
        ],
      };
      await RestClient.put(`/Host/ListingRent/${propertyId}/UpdatePricingAndDiscounts`, data)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          setPercentageWeek(newPrice);
          showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
          handleRefetchCalendar();
        } else {
          showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
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
    } else if (modoEdicion === 'descuentoMensual' && propertyId) {
      let data = {
        nightlyPrice: 0,
        weekendNightlyPrice: 0,
        currencyId: 2,
        discountPrices: [
          {
            discountCode: 'month',
            discountId: 2,
            price: 0,
            percentage: newPrice,
          },
        ],
      };
      await RestClient.put(`/Host/ListingRent/${propertyId}/UpdatePricingAndDiscounts`, data)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          setPercentageMonth(newPrice);
          showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
          handleRefetchCalendar();
        } else {
          showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
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
    } else if (modoEdicion === 'precioRangoNoche' && propertyId) {
      let data = {
        dates: diasSeleccionados.map((d) => d.date),
        listingRentId: propertyId,
        nightPrice: newPrice,
      };
      await RestClient.post('/Calendar/SetNightPrice', data)
        .then((x: any) => {
          if (x?.data?.statusCode == '200') {
            showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
            handleRefetchCalendar();
          } else {
            showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
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
      onSeleccionarDias([]);
    } else if (modoEdicion === 'tarifaLimpieza' && propertyId) {
      let data = {
        listingRentId: propertyId,
        additionalFeeIds: [3],
        additionalFeeValues: [newPrice],
      };
      await RestClient.put('/Host/ListingRent/UpsertAdditionalFee', data)
        .then((x: any) => {
          if (x?.data?.statusCode == '200') {
            setCleaningFeeAmount(newPrice);
            showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
            handleRefetchCalendar();
          } else {
            showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
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
    } else if (modoEdicion === 'tarifaMascotas' && propertyId) {
      let data = {
        listingRentId: propertyId,
        additionalFeeIds: [6],
        additionalFeeValues: [newPrice],
      };
      await RestClient.put('/Host/ListingRent/UpsertAdditionalFee', data)
        .then((x: any) => {
          if (x?.data?.statusCode == '200') {
            setPetFeeAmount(newPrice);
            showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
            handleRefetchCalendar();
          } else {
            showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
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
    // } else if (modoEdicion === 'tarifaHuespedExtra' && propertyId) {
    //   let data = {
    //     listingRentId: propertyId,
    //     additionalFeeIds: [7],
    //     additionalFeeValues: [newPrice],
    //   };
    //   await RestClient.put('/Host/ListingRent/UpsertAdditionalFee', data)
    //     .then((x: any) => {
    //       if (x?.data?.statusCode == '200') {
    //         setExtraGuestFeeAmount(newPrice);
    //         showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
    //         handleRefetchCalendar();
    //       } else {
    //         showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
    //       }
    //     })
    //     .catch((error) => {
    //       showSnackbar(
    //         'Error: ' +
    //           (error?.response?.data?.resultError?.message
    //             ? error?.response?.data?.resultError?.message
    //             : error.message),
    //         'error',
    //         8000
    //       );
    //     });
    } else if (modoEdicion === 'minimoNoches' && propertyId) {
      // Validar antes de actualizar
      if (!validateStayLimits(newPrice, 'minimoNoches')) {
        setModoEdicion(null);
        return;
      }

      let data = {
        listingRentId: propertyId,
        setMinStay: true,
        minStay: newPrice,
        setMaxStay: false,
        maxStay: 0,
      };
      await RestClient.put('/Host/ListingRent/UpsertMaxMinStay', data)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          setMinStay(newPrice);
          handleRefetchCalendar();
          showSnackbar(
            t('panelCalendarConfig.successUpdate') || 'Actualizado correctamente',
            'success'
          );
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
    } else if (modoEdicion === 'maximoNoches' && propertyId) {
      // Validar antes de actualizar
      if (!validateStayLimits(newPrice, 'maximoNoches')) {
        setModoEdicion(null);
        return;
      }

      let data = {
        listingRentId: propertyId,
        setMinStay: false,
        minStay: 0,
        setMaxStay: true,
        maxStay: newPrice,
      };
      await RestClient.put('/Host/ListingRent/UpsertMaxMinStay', data)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          setMaxStay(newPrice);
          handleRefetchCalendar();
          showSnackbar(
            t('panelCalendarConfig.successUpdate') || 'Actualizado correctamente',
            'success'
          );
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

    setModoEdicion(null);
  };

  const handleGuardarExtraGuest = async (newPrice: number, countGuest: number) => {

    if (modoEdicion === 'tarifaHuespedExtra' && propertyId) {
      let data = {
        listingRentId: propertyId,
        additionalFeeIds: [7],
        additionalFeeValues: [newPrice],
        additionalFeeControlValues: [countGuest]
      };
      await RestClient.put('/Host/ListingRent/UpsertAdditionalFee', data)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          setExtraGuestFeeAmount(newPrice);
          showSnackbar(t('panelCalendarConfig.successUpdate'), 'success');
          handleRefetchCalendar();
        } else {
          showSnackbar(t('panelCalendarConfig.errorUpdate'), 'error');
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
      setModoEdicion(null);
    } else {
      showSnackbar(
        'Error: propiedad no válida o modo de edición incorrecto',
        'error',
        8000
      );
    }
  }

  const handleSaveAvailability = async (isAvailable: boolean) => {
    if (!propertyId || diasSeleccionados.length === 0) {
      showSnackbar(
        t('panelCalendarConfig.errorUpdate') || 'Error: No hay fechas seleccionadas',
        'error'
      );
      setModoEdicion(null);
      return;
    }

    const dataRequest = {
      listingRentId: propertyId,
      dates: diasSeleccionados.map((d) => d.date),
      blockType: isAvailable ? 2 : 1, // 1 para bloqueado, 2 para disponible
      blockReason: isAvailable ? 'Disponible manual' : 'Bloqueado manual',
    };

    if (isAvailable) {
      // Si está disponible, desbloqueamos y establecemos precio
      await RestClient.post('/Calendar/unblock', dataRequest)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          showSnackbar(
          t('panelCalendarConfig.successUpdate') || 'Fechas actualizadas correctamente',
            'success'
          );
          handleRefetchCalendar();
          onSeleccionarDias([]);
          setModoEdicion(null);
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
    } else {
      // Si está bloqueado
      await RestClient.post('/Calendar/block', dataRequest)
      .then((x: any) => {
        if (x?.data?.statusCode == '200') {
          showSnackbar(
            t('panelCalendarConfig.successUpdate') || 'Fechas bloqueadas correctamente',
            'success'
          );
          handleRefetchCalendar();
          onSeleccionarDias([]);
          setModoEdicion(null);
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
  };

  const handleRefresh = async () => {
    await handleRefetchCalendar();
  };

  // Función para determinar si los días seleccionados están bloqueados
  const areDatesBlocked = React.useMemo(() => {
    if (!propertyInfo?.calendarDays || diasSeleccionados.length === 0) {
      return false;
    }

    const firstDate = diasSeleccionados[0].date + 'T00:00:00';
    const blockedDay = propertyInfo.calendarDays.find((x: any) => {
      const calendarDate = String(x.date);
      return calendarDate === firstDate && x.blockType === 1;
    });

    return !!blockedDay;
  }, [propertyInfo, diasSeleccionados]);

  const handlePriceMax:()=>number = () => {
    const prices = diasSeleccionados?.map(item => item.price) || [];
      //const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return maxPrice || 0;
  }

  // Vista principal sin sección seleccionada
  if (!selectedSection && !modoEdicion) {
    return (
      <Box>
        <Typography variant="h6" fontWeight={600} m={3} textAlign={'center'}>
          {t('panelCalendarConfig.selectOption')}
        </Typography>

        {/* Bloque de Configuración de Precios */}
        <Paper
          elevation={0}
          onClick={() => setSelectedSection('precios')}
          sx={{
            p: 2.5,
            //mb: 2,
            cursor: 'pointer',
            // border: '1px solid #e0e0e0',
            // borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              //boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderColor: '#5E4DB2',
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography variant="body1" fontWeight={600} mb={1}>
                {t('panelCalendarConfig.pricesSettings')}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                ${propertyInfo?.price?.priceNightly || 0} {t('panelCalendarConfig.pricePerNight')}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                {t('panelCalendarConfig.priceWeekend', {
                  price: propertyInfo?.price?.weekendNightlyPrice || 0,
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('panelCalendarConfig.discountWeek')} {percentageWeek}%
              </Typography>
            </Box>
            <div style={{ position: 'relative', top: '40px' }}>
              <ChevronRight sx={{ color: 'text.secondary', fontSize: 38 }} />
            </div>
          </Box>
        </Paper>

        <Divider sx={{ my: 0 }} />

        {/* Bloque de Configuración de Disponibilidad */}
        <Paper
          elevation={0}
          onClick={() => setSelectedSection('disponibilidad')}
          sx={{
            p: 2.5,
            cursor: 'pointer',
            // border: '1px solid #e0e0e0',
            // borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              // boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderColor: '#5E4DB2',
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography variant="body1" fontWeight={600} mb={1}>
                {t('panelCalendarConfig.availabilitySettings')}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                {t('panelCalendarConfig.stayRange')} {minStay} - {maxStay}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('panelCalendarConfig.sameDayNotice')}
              </Typography>
            </Box>
            <div style={{ position: 'relative', top: '20px' }}>
              <ChevronRight sx={{ color: 'text.secondary', fontSize: 38 }} />
            </div>
          </Box>
        </Paper>
        <Divider sx={{ my: 0 }} />
      </Box>
    );
  }

  // Vista de Configuración de Precios
  if (selectedSection === 'precios' && !modoEdicion) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <ChevronRight
            onClick={() => setSelectedSection(null)}
            sx={{
              transform: 'rotate(180deg)',
              cursor: 'pointer',
              mr: 1,
              fontSize: 28,
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            {t('panelCalendarConfig.pricesSettings')}
          </Typography>
        </Box>
        {diasSeleccionados.length > 0 && (
          <AvailabilityForm
            diasSeleccionados={diasSeleccionados}
            onSave={handleSaveAvailability}
            areDatesBlocked={areDatesBlocked}
          />
        )}
        <PrecioBase
          isMobile={false}
          modoEdicion={modoEdicion}
          handleEditar={handleEditar}
          priceNightly={propertyInfo?.price?.priceNightly || 0}
          weekendNightlyPrice={propertyInfo?.price?.weekendNightlyPrice || 0}
          diasSeleccionados={diasSeleccionados}
        />
        {!(diasSeleccionados?.length > 0)  && <Descuentos
          isMobile={false}
          modoEdicion={modoEdicion}
          handleEditar={handleEditar}
          percentageWeek={percentageWeek}
          percentageMonth={percentageMonth}
        />}
        {!(diasSeleccionados?.length > 0)  && propertyId && (
          <TarifasAdicionales
            modoEdicion={modoEdicion}
            handleEditar={handleEditar}
            cleaningFeeAmount={cleaningFeeAmount}
            petFeeAmount={petFeeAmount}
            extraGuestFeeAmount={extraGuestFeeAmount}
          />
        )}
      </Box>
    );
  }

  // Vista de Configuración de Disponibilidad
  if (selectedSection === 'disponibilidad' && !modoEdicion) {
    return (
      <Box m={1}>
        <Box display="flex" alignItems="center" mb={3}>
          <ChevronRight
            onClick={() => setSelectedSection(null)}
            sx={{
              transform: 'rotate(180deg)',
              cursor: 'pointer',
              mr: 1,
              fontSize: 28,
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            {t('panelCalendarConfig.availabilitySettings')}
          </Typography>
        </Box>

        <DuracionDelViaje
          modoEdicion={modoEdicion}
          handleEditar={handleEditar}
          minStay={minStay || 1}
          maxStay={maxStay || 365}
        />
        {propertyId && (
          <AvailabilitySettingsForm
            propertyId={propertyId}
            minimumNotice={minimumNotice}
            minimumNoticeHour={minimumNoticeHour}
            preparationDays={preparationDays}
            availabilityWindowMonth={availabilityWindowMonth}
            onRefresh={handleRefresh}
          />
        )}
      </Box>
    );
  }

  // Vistas de edición (formularios)
  return (
    <Box>
      {modoEdicion === 'disponibilidadRango' && (
        <AvailabilityForm
          diasSeleccionados={diasSeleccionados}
          onSave={handleSaveAvailability}
          areDatesBlocked={areDatesBlocked}
        />
      )}
      {modoEdicion === 'precioRangoNoche' && (
        <PriceForm
          initialPrice={handlePriceMax()}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.customNightRange')}
        />
      )}
      {modoEdicion === 'precioNoche' && (
        <PriceForm
          initialPrice={propertyInfo?.price?.priceNightly || 0}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
        />
      )}
      {modoEdicion === 'precioFinSemana' && (
        <PriceForm
          initialPrice={propertyInfo?.price?.weekendNightlyPrice || 0}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.customWeekend')}
        />
      )}
      {modoEdicion === 'descuentoSemanal' && (
        <PriceForm
          initialPrice={percentageWeek}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.weekDiscount')}
          isPercentage={true}
        />
      )}
      {modoEdicion === 'descuentoMensual' && (
        <PriceForm
          initialPrice={percentageMonth}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.monthDiscount')}
          isPercentage={true}
        />
      )}
      {modoEdicion === 'tarifaLimpieza' && (
        <PriceForm
          initialPrice={cleaningFeeAmount}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.cleaningFee')}
          isTarifa={true}
        />
      )}
      {modoEdicion === 'tarifaMascotas' && (
        <PriceForm
          initialPrice={petFeeAmount}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.petFee')}
          isTarifa={true}
        />
      )}
      {modoEdicion === 'tarifaHuespedExtra' && (
        <ExtraGuestFeeForm
          initialPrice={extraGuestFeeAmount}
          onSave={handleGuardarExtraGuest}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.extraGuest')}
          initialGuestThreshold= { extraGuestCount }
          maxGuest = { propertyInfo?.maxGuests || 1 }
        />
      )}
      {modoEdicion === 'minimoNoches' && (
        <MinDayForm
          initialPrice={minStay == 0 ? 1 : minStay}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.minNights')}
          currentMinStay={minStay}
          currentMaxStay={maxStay}
          fieldType="minStay"
        />
      )}
      {modoEdicion === 'maximoNoches' && (
        <MinDayForm
          initialPrice={maxStay == 0 ? 365 : maxStay}
          onSave={handleGuardar}
          onCancel={() => setModoEdicion(null)}
          label={t('panelCalendarConfig.labels.maxNights')}
          currentMinStay={minStay}
          currentMaxStay={maxStay}
          fieldType="maxStay"
        />
      )}
    </Box>
  );
};

export default PanelConfiguracion1;
