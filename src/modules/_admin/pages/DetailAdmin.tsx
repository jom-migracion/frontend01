import { useEffect, useState } from 'react';
import { Alert, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LeftPanel from '../components/detailProperty/LeftPanel';
import RightPanel from '../components/detailProperty/RightPanel';
import EditableDescripcion from '../components/detailProperty/EditProperty/EditableDescripcion';
import SelectorPropiedadYTipo from '../components/detailProperty/EditProperty/SelectorPropiedadYTipo';
import FormularioUbicacion from '../components/detailProperty/EditProperty/FormularioUbicacion';
import FormularioPreciosYDescuentos from '../components/detailProperty/EditProperty/FormularioPreciosYDescuentos';
import FormularioCapacidad from '../components/detailProperty/EditProperty/FormularioCapacidad';
import SelectorServicios from '../components/detailProperty/EditProperty/SelectorServicios';
import SelectorReglasCasa from '../components/detailProperty/EditProperty/SelectorReglasCasa';
import SelectorPoliticaCancelacion from '../components/detailProperty/EditProperty/SelectorPoliticaCancelacion';
import SelectorHorariosCheckinCheckout from '../components/detailProperty/EditProperty/SelectorHorariosCheckinCheckout';
import PasoRecorridoFotografico from '../components/detailProperty/EditProperty/PasoRecorridoFotografico';
import SelectorTipoReservacion from '../components/detailProperty/EditProperty/SelectorTipoReservacion';
import { useGet2 } from '@/hooks/api';
import { Listing } from '@/models/interfaces/Listing';
import EstadoDelAnuncio from '../components/detailProperty/EditProperty/EstadoDelAnuncio';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { ArrowBackIos } from '@mui/icons-material';
import { RestClient } from '@/services/RestClient';

interface DetailPropertyProps {
  cardId?: string | number | null;
  handleChangeSelectedCardId: (_: any, newValue: number) => void;
  statusCode?: string;
}

const DetailProperty = ({
  cardId,
  handleChangeSelectedCardId,
  statusCode = '',
}: DetailPropertyProps) => {
  const [seleccionado, setSeleccionado] = useState(0);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [dataUnpublish, setDataUnpublish] = useState<any>(null);
  const [loadingUnpublish, setLoadingUnpublish] = useState(false);
  const [errorUnpublish, setErrorUnpublish] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Bloquear el scroll del body mientras este componente está montado
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const { data, isLoading, isError, error } = useGet2<Listing | any>(
    ['detailPropertyToUpdate', cardId],
    `/ListingRent/${cardId}`,
    {
      enabled: statusCode !== 'UNPUBLISH' && !!cardId,
    }
  );

  useEffect(() => {
    const fetchUnpublishedData = async () => {
      if (statusCode == 'UNPUBLISH') {
        setLoadingUnpublish(true);
        setErrorUnpublish(null);
        try {
          const consult = await RestClient.get(`/Host/ListingRent/${cardId}`);
          if (consult?.data?.statusCode === '200') {
            setDataUnpublish(consult.data);
          } else {
            setErrorUnpublish(
              consult?.data?.resultError || { message: 'Error al cargar la propiedad' }
            );
          }
        } catch (err) {
          setErrorUnpublish({ message: 'Error al cargar la propiedad' });
        } finally {
          setLoadingUnpublish(false);
        }
      }
    };

    fetchUnpublishedData();
  }, [statusCode]);

  // Determinar qué data usar según el statusCode
  const activeData = statusCode === 'UNPUBLISH' ? dataUnpublish : data;

  // Sincronizar fotos con activeData; las eliminaciones actualizan photos directamente
  useEffect(() => {
    if (activeData?.data?.photos) {
      setPhotos(activeData.data.photos);
    }
  }, [activeData?.data?.photos]);
  const activeIsLoading = statusCode === 'UNPUBLISH' ? loadingUnpublish : isLoading;
  const activeIsError = statusCode === 'UNPUBLISH' ? !!errorUnpublish : isError;
  const activeError = statusCode === 'UNPUBLISH' ? errorUnpublish : error;

  // Retornar UI de error si hay problema y ya terminó de cargar
  if (!activeIsLoading && activeIsError) {
    const errorMessage = activeError?.message || 'Error al cargar la propiedad';
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <IconButton
          edge="end"
          sx={{ mr: 2, color: 'black' }}
          onClick={() => handleChangeSelectedCardId(null, 1)}
        >
          <ArrowBackIos />
        </IconButton>
        <Alert severity="error">{errorMessage}</Alert>
      </Box>
    );
  }

  if (!activeIsLoading && activeData && activeData.statusCode !== '200') {
    const errorMessage = activeData?.resultError?.message || 'Error al cargar la propiedad';
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <IconButton
          edge="end"
          sx={{ mr: 2, color: 'black' }}
          onClick={() => handleChangeSelectedCardId(null, 1)}
        >
          <ArrowBackIos />
        </IconButton>
        <Alert severity="error">{errorMessage}</Alert>
      </Box>
    );
  }

  // No renderizar el contenido hasta que tengamos data válida
  if (!activeData?.data || activeIsLoading) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <LoadingThreeDotsJumping open={true} modal={true} />
      </Box>
    );
  }

  const contenidoDerecha = [
    <PasoRecorridoFotografico
      listingRentId={activeData?.data?.listingRentId}
      listingPhotos={photos}
      onDeletePhoto={(id) =>
        setPhotos((prev) => prev.filter((p: any) => p.listingPhotoId !== id))
      }
    />,
    <EditableDescripcion
      listingRentId={activeData?.data?.listingRentId}
      title={activeData?.data?.name}
      description={activeData?.data?.description}
    />,
    <SelectorPropiedadYTipo
      listingRentId={activeData?.data?.listingRentId}
      propertySubType={activeData?.data?.property?.type}
      accomodationType={activeData?.data?.accomodationType}
    />,
    <FormularioPreciosYDescuentos
      listingRentId={activeData?.data?.listingRentId}
      listingRentName={activeData?.data?.name}
      pricePerNight={activeData?.data?.price?.priceNightly}
      customizedPrice={activeData?.data?.price?.weekendNightlyPrice}
      discountNewPercentage={activeData?.data?.price?.tlListingDiscountForRates.find(
        (item: any) => item.code === 'new'
      )}
      discountWeeklyPercentage={activeData?.data?.price?.tlListingDiscountForRates.find(
        (item: any) => item.code === 'week'
      )}
      discountMonthlyPercentage={activeData?.data?.price?.tlListingDiscountForRates.find(
        (item: any) => item.code === 'month'
      )}
    />,
    <SelectorServicios
      amenitiesSelected={activeData?.data?.amenities}
      securityItemsSelected={activeData?.data?.securityItems}
      featuredAspectsSelected={activeData?.data?.featuredAspects}
      listingRentId={activeData?.data?.listingRentId}
    />,
    <FormularioCapacidad
      listingRentId={activeData?.data?.listingRentId}
      subTypeCode={activeData?.data?.property?.type?.subTypeCode}
      accomodationCode={activeData?.data?.accomodationType?.accomodationCode}
      capacity={{
        guests: activeData?.data?.maxGuests,
        bathrooms: activeData?.data?.bathrooms,
        bedrooms: activeData?.data?.bedrooms,
        beds: activeData?.data?.beds,
        sofaBeds: activeData?.data?.sofaBeds,
        privateBathroom: activeData?.data?.privateBathroom,
        privateBathroomLodging: activeData?.data?.privateBathroomLodging,
        sharedBathroom: activeData?.data?.sharedBathroom,
      }}
    />,
    <FormularioUbicacion
      listingRentId={activeData?.data?.listingRentId}
      addressEdit={activeData?.data?.property?.address}
      latitude={activeData?.data?.property?.latitude}
      longitude={activeData?.data?.property?.longitude}
    />,
    <SelectorReglasCasa
      rentRules={activeData?.data?.rentRules}
      listingRentId={activeData?.data?.listingRentId}
    />,
    <SelectorTipoReservacion
      listingRentId={activeData?.data?.listingRentId}
      approvalPolicy={activeData?.data?.approvalPolicy}
      minimunNoticeDays={activeData?.data?.minimumNotice ?? 0}
      preparationDay={activeData?.data?.preparationDays ?? 0}
      listingRentName={activeData?.data?.name}
    />,
    <SelectorPoliticaCancelacion
      listingRentId={activeData?.data?.listingRentId}
      selectedPolicyId={activeData?.data?.cancelationPolicyTypeId}
    />,
    <SelectorHorariosCheckinCheckout
      listingRentId={activeData?.data?.listingRentId}
      tlCheckInOutPolicy={activeData?.data?.checkInOutPolicies[0]}
    />,
    <EstadoDelAnuncio
      photos={photos}
      listingRentId={activeData?.data?.listingRentId}
      handleChangeSelectedCardId={handleChangeSelectedCardId}
      price={activeData?.data?.price?.priceNightly}
      currencyCode={activeData?.data?.price?.currencyCode}
      status={activeData?.data?.statusCode}
      listingRentName={activeData?.data?.name}
      location={`${activeData?.data?.property?.cityName ?? activeData?.data?.property?.address?.city?.cityName}, ${activeData?.data?.property?.countryName ?? activeData?.data?.property?.address?.city?.country}`}
    />,
  ];

  return (
    <Box
      sx={{
        width: '100%',
        pt: 5,
        pl: isMobile ? 1 : 12,
        pr: isMobile ? 1 : 12,
        pb: 8,
        height: 'calc(100vh - 98px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Botón para mostrar el panel izquierdo en móviles */}
      {isMobile && !showLeftPanel && (
        <IconButton onClick={() => setShowLeftPanel(true)} sx={{ mb: 0, mt: -3, flexShrink: 0 }}>
          <MenuIcon />
        </IconButton>
      )}

      {/* Contenedor de los paneles */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          bgcolor: 'white',
          borderRadius: '24px',
          py: 2,
          px: '0px',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {/* Panel izquierdo condicional */}
        {(!isMobile || showLeftPanel) && (
          <Box
            sx={{
              width: isMobile ? '100%' : '30%',
              flexShrink: 0,
              height: '100%',
            }}
          >
            <LeftPanel
              seleccionado={seleccionado}
              onSelect={(index) => {
                setSeleccionado(index);
                if (isMobile) setShowLeftPanel(false);
              }}
              detailProperty={activeData?.data}
              handleChangeSelectedCardId={handleChangeSelectedCardId}
            />
          </Box>
        )}

        {/* Panel derecho */}
        <Box
          sx={{
            flexGrow: 1,
            width: isMobile ? '100%' : 'auto',
            height: '110%',
            overflow: 'hidden',
            ml: -2,
          }}
        >
          <RightPanel contenido={contenidoDerecha[seleccionado]} />
        </Box>
      </Box>
    </Box>
  );
};

export default DetailProperty;
