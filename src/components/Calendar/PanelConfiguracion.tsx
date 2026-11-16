import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Slide, useMediaQuery, useTheme } from '@mui/material';
// import PanelDisponibilidad from './PanelDisponibilidad';
import PrecioBase from './PanelConfiguracion/PrecioBase';
import Descuentos from './PanelConfiguracion/Descuentos';
import TarifasAdicionales from './PanelConfiguracion/TarifasAdicionales';
import DuracionDelViaje from './PanelConfiguracion/DuracionDelViaje';
import { usePost, usePut } from '@/hooks/api';
import PriceForm from './PanelConfiguracion/PriceForm';
import AvailabilitySettingsForm from './PanelConfiguracion/AvailabilitySettingsForm';
import MinDayForm from './PanelConfiguracion/MinDayForm';
import { ApiService } from '@/services/ApiService';

interface Props {
  diasSeleccionados: string[];
  propertyId?: string;
  propertyInfo?: any;
  onSeleccionarDias: (dias: string[]) => void;
}
interface AdditionFee {
  listingAdditionalFeeId: number;
  listingRentId: number;
  additionalFeeId: number;
  amountFee: number;
}

const FEE_IDS = {
  CLEANING_FEE: 3, // Ejemplo de ID para Tarifa de Limpieza
  PET_FEE: 6, // Ejemplo de ID para Tarifa por Mascotas
  EXTRA_GUEST_FEE: 7, // Ejemplo de ID para Tarifa por Huésped Adicional
};

const PanelConfiguracion: React.FC<Props> = ({
  diasSeleccionados,
  propertyId,
  propertyInfo,
  onSeleccionarDias,
}) => {
  const [tab, setTab] = useState('precios');
  const [modoEdicion, setModoEdicion] = useState<null | string>(null);
  const [tempValor, setTempValor] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [additonalFees, setAdditionalFees] = React.useState<AdditionFee[]>([]);
  const [cleaningFeeAmount, setCleaningFeeAmount] = useState(0);
  const [petFeeAmount, setPetFeeAmount] = useState(0);
  const [extraGuestFeeAmount, setExtraGuestFeeAmount] = useState(0);
  const [percentageWeek, setPercentageWeek] = useState(0);
  const [percentageMonth, setPercentageMonth] = useState(0);
  const [minStay, setMinStay] = useState(0);
  const [maxStay, setMaxStay] = useState(0);
  const [minimumNotice, setMinimumNotice] = useState(0);
  const [minimumNoticeHour, setMinimumNoticeHour] = useState('');

  const handleEditar = (id: string, valor?: number) => {
    setModoEdicion(id);
    setTempValor(valor ?? 0);
  };
  // api
  const { mutate: UpdatePricingAndDiscounts } = usePut<any>(
    `/Host/ListingRent/${propertyId}/UpdatePricingAndDiscounts`
  );
  const { mutate: UpsertAdditionalFee } = usePut<any>('/Host/ListingRent/UpsertAdditionalFee');
  const { mutate: addSetNightPrice } = usePost<any>('/Calendar/SetNightPrice');
  const { mutate: UpsertMaxMinStay } = usePut<any>('/Host/ListingRent/UpsertMaxMinStay');
  //const { mutate: UpsertPercentage } = usePut<any>('/Host/ListingRent/UpsertPercentage');

  const fetchReviews = async () => {
    try {
      const response = await ApiService.get<{ data: AdditionFee[] }>(
        `/Host/ListingRent/${propertyId}/GetAdditionalFee`
      );
      setAdditionalFees(response.data);
      const fee1 = response.data.find((f: any) => f.additionalFeeId == FEE_IDS.CLEANING_FEE);
      setCleaningFeeAmount(fee1 ? fee1.amountFee : 0); // Devuelve el monto o 0 si no se encuentra la tarifa
      const fee2 = response.data.find((f: any) => f.additionalFeeId == FEE_IDS.PET_FEE);
      setPetFeeAmount(fee2 ? fee2.amountFee : 0);
      const fee3 = response.data.find((f: any) => f.additionalFeeId == FEE_IDS.EXTRA_GUEST_FEE);
      setExtraGuestFeeAmount(fee3 ? fee3.amountFee : 0);
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
      _percentageWeek =
        propertyInfo?.price.tlListingDiscountForRates.find((p: any) => p.code == 'week')
          ?.porcentage || 0;
      _percentageMonth =
        propertyInfo?.price.tlListingDiscountForRates.find((p: any) => p.code == 'month')
          ?.porcentage || 0;
    }
    setPercentageWeek(_percentageWeek);
    setPercentageMonth(_percentageMonth);
    setMinStay(propertyInfo?.minimunStay || 0);
    setMaxStay(propertyInfo?.maximumStay || 0);
    setMinimumNotice(propertyInfo?.minimumNotice || 0);
    setMinimumNoticeHour(propertyInfo?.minimumNoticeHour || '');
  }, [propertyInfo]);

  // Activar edición de precio por noche automáticamente al seleccionar días
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

      UpdatePricingAndDiscounts(data, {
        onSuccess: (response) => {
          console.log(response);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
    } else if (modoEdicion === 'precioFinSemana' && propertyId) {
      let data = {
        nightlyPrice: 0,
        weekendNightlyPrice: newPrice,
        currencyId: 2,
        discountPrices: null,
      };

      UpdatePricingAndDiscounts(data, {
        onSuccess: (response) => {
          console.log(response);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
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

      UpdatePricingAndDiscounts(data, {
        onSuccess: (response) => {
          console.log(response);
          setPercentageWeek(newPrice);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
    } else if (modoEdicion === 'descuentoMensual' && propertyId) {
      let data = {
        nightlyPrice: 0,
        weekendNightlyPrice: 0,
        currencyId: 1,
        discountPrices: [
          {
            discountCode: 'month',
            discountId: 2,
            price: 0,
            percentage: newPrice,
          },
        ],
      };

      UpdatePricingAndDiscounts(data, {
        onSuccess: (response) => {
          console.log(response);
          setPercentageMonth(newPrice);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
    } else if (modoEdicion === 'precioRangoNoche' && propertyId) {
      let data = {
        dates: diasSeleccionados,
        listingRentId: propertyId,
        nightPrice: newPrice,
      };

      addSetNightPrice(data, {
        onSuccess: (response) => {
          console.log(response);
          if (response.statusCode == '200') {
            showSnackbar('Registro exitoso', 'success');
          } else {
            showSnackbar('Registro exitoso', 'error');
          }
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
      onSeleccionarDias([]);
    } else if (modoEdicion === 'tarifaLimpieza' && propertyId) {
      let data = {
        listingRentId: propertyId,
        additionalFeeIds: [3],
        additionalFeeValues: [newPrice],
      };
      UpsertAdditionalFee(data, {
        onSuccess: (response) => {
          console.log(response);
          setCleaningFeeAmount(newPrice);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
    } else if (modoEdicion === 'tarifaMascotas' && propertyId) {
      let data = {
        listingRentId: propertyId,
        additionalFeeIds: [6],
        additionalFeeValues: [newPrice],
      };
      UpsertAdditionalFee(data, {
        onSuccess: (response) => {
          console.log(response);
          setPetFeeAmount(newPrice);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
    } else if (modoEdicion === 'tarifaHuespedExtra' && propertyId) {
      let data = {
        listingRentId: propertyId,
        additionalFeeIds: [7],
        additionalFeeValues: [newPrice],
      };
      UpsertAdditionalFee(data, {
        onSuccess: (response) => {
          console.log(response);
          setExtraGuestFeeAmount(newPrice);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
      console.log('Tarifa de limpieza: ', tempValor);
    } else if (modoEdicion === 'minimoNoches' && propertyId) {
      let data = {
        listingRentId: propertyId,
        setMinStay: true,
        minStay: newPrice,
        setMaxStay: false,
        maxStay: 0,
      };
      UpsertMaxMinStay(data, {
        onSuccess: (response) => {
          console.log(response);
          setMinStay(newPrice);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
    } else if (modoEdicion === 'maximoNoches' && propertyId) {
      let data = {
        listingRentId: propertyId,
        setMinStay: false,
        minStay: 0,
        setMaxStay: true,
        maxStay: newPrice,
      };
      UpsertMaxMinStay(data, {
        onSuccess: (response) => {
          console.log(response);
          setMaxStay(newPrice);
        },
        onError: (error: any) => {
          console.log('Existe error', error);
        },
      });
    }

    setModoEdicion(null);
  };

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, val) => {
          setTab(val);
          setModoEdicion(null);
        }}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Precios" value="precios" sx={{ fontWeight: tab === 'precios' ? 600 : 400 }} />
        <Tab
          label="Disponibilidad"
          value="disponibilidad"
          sx={{ fontWeight: tab === 'disponibilidad' ? 600 : 400 }}
        />
      </Tabs>

      {tab === 'precios' && (
        <Box mt={2}>
          <Slide direction="left" in={!modoEdicion} mountOnEnter unmountOnExit>
            <Box>
              <PrecioBase
                isMobile={isMobile}
                modoEdicion={modoEdicion}
                handleEditar={handleEditar}
                priceNightly={propertyInfo?.price?.priceNightly || 0}
                weekendNightlyPrice={propertyInfo?.price?.weekendNightlyPrice || 0}
                diasSeleccionados={diasSeleccionados}
              />
              <Descuentos
                isMobile={isMobile}
                modoEdicion={modoEdicion}
                handleEditar={handleEditar}
                percentageWeek={percentageWeek}
                percentageMonth={percentageMonth}
              />
              {propertyId && (
                <TarifasAdicionales
                  modoEdicion={modoEdicion}
                  handleEditar={handleEditar}
                  cleaningFeeAmount={cleaningFeeAmount}
                  petFeeAmount={petFeeAmount}
                  extraGuestFeeAmount={extraGuestFeeAmount}
                />
              )}
            </Box>
          </Slide>
          {modoEdicion === 'precioRangoNoche' && (
            <PriceForm
              initialPrice={propertyInfo?.price?.priceNightly || 0}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Precio personalizado por rango de noches"
              maxLimit={90000}
            />
          )}
          {modoEdicion === 'precioNoche' && (
            <PriceForm
              initialPrice={propertyInfo?.price?.priceNightly || 0}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              maxLimit={10000}
            />
          )}
          {modoEdicion === 'precioFinSemana' && (
            <PriceForm
              initialPrice={propertyInfo?.price?.weekendNightlyPrice || 0}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Precio personalizado por fin de semana"
              maxLimit={10000}
            />
          )}
          {modoEdicion === 'descuentoSemanal' && (
            <PriceForm
              initialPrice={percentageWeek}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Descuento semanal (%)"
              isPercentage={true}
            />
          )}
          {modoEdicion === 'descuentoMensual' && (
            <PriceForm
              initialPrice={percentageMonth}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Descuento mensual (%)"
              isPercentage={true}
            />
          )}
          {modoEdicion === 'tarifaLimpieza' && (
            <PriceForm
              initialPrice={cleaningFeeAmount}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Tarifa de limpieza por estadía"
            />
          )}
          {modoEdicion === 'tarifaMascotas' && (
            <PriceForm
              initialPrice={petFeeAmount}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Tarifa de mascotas"
            />
          )}
          {modoEdicion === 'tarifaHuespedExtra' && (
            <PriceForm
              initialPrice={extraGuestFeeAmount}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Tarifa de huesped adicional por noche"
            />
          )}
        </Box>
      )}

      {tab === 'disponibilidad' && (
        <Box mt={2} ml={0} mr={0}>
          <Slide direction="left" in={!modoEdicion} mountOnEnter unmountOnExit>
            <Box>
              <DuracionDelViaje
                modoEdicion={modoEdicion}
                handleEditar={handleEditar}
                minStay={minStay}
                maxStay={maxStay}
              />
              {propertyId && (
                <AvailabilitySettingsForm
                  propertyId={propertyId}
                  minimumNotice={minimumNotice}
                  minimumNoticeHour={minimumNoticeHour}
                />
              )}
            </Box>
          </Slide>

          {modoEdicion === 'minimoNoches' && (
            <MinDayForm
              initialPrice={minStay}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Numero minimo de noches"
            />
          )}
          {modoEdicion === 'maximoNoches' && (
            <MinDayForm
              initialPrice={maxStay}
              onSave={handleGuardar}
              onCancel={() => setModoEdicion(null)}
              label="Numero maximo de noches"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default PanelConfiguracion;
function showSnackbar(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}
