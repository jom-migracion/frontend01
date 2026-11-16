import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  useTheme,
  Drawer,
  useMediaQuery, // Importado para el sidebar responsivo
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckIcon from '@mui/icons-material/Check';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  PropertyRegistrationStep_1_1,
  PropertyRegistrationStep_1_2,
  PropertyRegistrationStep_1_3,
  PropertyRegistrationStep_2_1,
  PropertyRegistrationStep_2_2,
  PropertyRegistrationStep_2_3,
  PropertyRegistrationStep_3_1,
  PropertyRegistrationStep_3_2,
  PropertyRegistrationStep_3_3,
  PropertyRegistrationStep_3_4,
  PropertyRegistrationStep_end,
} from '@/modules/_admin/components/PropertyRegistrationList';

import { StepValidationContext } from '@/context/FormStepContext';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useGet, usePost } from '@/hooks/api';
import { ListingRentResponseStep } from '@/models/interfaces/ListingRentResponseStep';
import {
  getDefaultStepperLinearRegistre,
  StepperLinearRegistreProperty,
} from '@/models/interfaces/stepperLinearRegistreProperty';
import { useSnackbar } from '@/context/SnackbarContext';
// import { useNavigate } from 'react-router';
// import { AssertRoutes } from '@/common/enum/AssertRoutes';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useListingRentContinueStore, usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { ViewCodeNextStep } from '@/common/enum/ListingRent';
import { useTranslation } from 'react-i18next';
import { convertirString_Minutos } from '@/common/util/dateFunctions';
import SuccessfulPublicationModal from '@/components/SuccessfulPublicationModal';
import { useAuthContext } from '@/modules/_auth/context/AuthContext';
import { useNavigate } from 'react-router';
import { RestClient } from '@/services/RestClient';
import { pushToDataLayer } from '@/utilities/analytics';

const PropertyRegistration = () => {
  // useState
  const [activeStep, setActiveStep] = useState(0);
  const [isStepReady, setIsStepReady] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [stepData, setStepData] = useState<StepperLinearRegistreProperty>(
    getDefaultStepperLinearRegistre()
  );
  // Nuevo estado para la visibilidad del sidebar en móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // console.log('activeStep', activeStep);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  // Fin de cambios en estados

  const [dataListingRentResponse, setDataListingRentResponse] = useState<ListingRentResponseStep>();
  const [formData, setFormData] = useState<any>({});
  const [stepStates, setStepStates] = useState<
    Record<number, 'default' | 'selected' | 'completed'>
  >({});
  const [unlockedGroups, setUnlockedGroups] = useState<Set<number>>(new Set([0])); // Solo el primer grupo desbloqueado
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0); // El paso más avanzado que se ha desbloqueado
  const [openSuccessfulPublicationModal, setOpenSuccessfulPublicationModal] = useState(false);
  const [isLoadingContinue, setIsLoadingContinue] = useState(false);

  // store
  const continueStepPublishing = usePropertyRegistration((state) => state.continueStepPublishing);
  const setContinueStepPublishing = usePropertyRegistration(
    (state) => state.setContinueStepPublishing
  );
  const { listingRentId } = usePropertyRegistration((state) => state.data.listingData);
  const { listingData: storeListingData, parametrics: storeParametrics } = usePropertyRegistration(
    (state) => state.data
  );
  const updateListingData = usePropertyRegistration((state) => state.updateListingData);
  const updateParametrics = usePropertyRegistration((state) => state.updateParametrics);
  const resetState = usePropertyRegistration((state) => state.resetState);
  const setListingRentIdContinue = useListingRentContinueStore((state) => state.setListingRentIdContinue);
  const clearListingRentIdContinue = useListingRentContinueStore((state) => state.clearListingRentIdContinue);
  const listingRentIdContinue = useListingRentContinueStore((state) => state.listingRentIdContinue);
  const setDataListingRent = usePropertyRegistration((state) => state.setData);

  // hooks
  const { isHostAuthenticated } = useAuthContext();
  
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { t } = useTranslation('tralation', { keyPrefix: 'admin.registerProperty' });
  const { t:t33 } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step33' });
  const {
    palette: { customColors, primary, background },
    typography,
  } = useTheme();

  const handleFormStepChange = useCallback((data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  }, []);

  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // api
  const { mutate: PostListingRent, isPending } = usePost<ListingRentResponseStep>(
    `/Host/ListingRent/${listingRentId}/ProcessData`
  );

  const { mutate: PostListingRentInitial, isPending: isPendingInitial } = usePost<ListingRentResponseStep>(
    `/Host/ListingRent/ProcessData`
  );

  const { refetch: EnableHostRole  } = useGet(
    'AssertEnableHostRole',
    '/EnableHostRole',
    [],
    false
  );

  useEffect(() => {
    if (!isHostAuthenticated) {
      navigate(`/`);
    }
  }, [isHostAuthenticated, navigate]);  

  // const
  const stepGroups = [
    {
      label: t('stepGroupsList.label1'),
      description: t('stepGroupsList.description1'),
      subSteps: [
        {
          label: t('stepGroupsList.subSteps1.label11'),
          content: <PropertyRegistrationStep_1_1 onChange={handleFormStepChange} />, //LV001
        },
        {
          label: t('stepGroupsList.subSteps1.label12'),
          content: <PropertyRegistrationStep_1_2 onChange={handleFormStepChange} />, //LV002
        },
        {
          label: t('stepGroupsList.subSteps1.label13'),
          content: <PropertyRegistrationStep_1_3 onChange={handleFormStepChange} />, //LV003
        },
      ],
    },
    {
      label: t('stepGroupsList.label2'),
      description: t('stepGroupsList.description2'),
      subSteps: [
        {
          label: t('stepGroupsList.subSteps2.label21'),
          content: <PropertyRegistrationStep_2_1 onChange={handleFormStepChange} />, //LV004
        },
        {
          label: t('stepGroupsList.subSteps2.label22'),
          content: <PropertyRegistrationStep_2_2 listingRentId={listingRentId} />, //LV005
        },
        {
          label: t('stepGroupsList.subSteps2.label23'),
          content: <PropertyRegistrationStep_2_3 onChange={handleFormStepChange} />, //LV006
        },
      ],
    },
    {
      label: t('stepGroupsList.label3'),
      description: t('stepGroupsList.description3'),
      subSteps: [
        {
          label: t('stepGroupsList.subSteps3.label31'),
          content: <PropertyRegistrationStep_3_1 onChange={handleFormStepChange} />, //LV007
        },
        {
          label: t('stepGroupsList.subSteps3.label32'),
          content: <PropertyRegistrationStep_3_2 onChange={handleFormStepChange} />, //LV008
        },
        {
          label: t('stepGroupsList.subSteps3.label33'),
          content: <PropertyRegistrationStep_3_3 onChange={handleFormStepChange} />, //LV009
        },
        {
          label: t('stepGroupsList.subSteps3.label34'),
          content: <PropertyRegistrationStep_3_4 onChange={handleFormStepChange} />, //LV010
        },
        {
          label: '',
          content: <PropertyRegistrationStep_end listingRentId={`${listingRentId}`} />, //LV011
        },
      ],
    },
  ];

  const { LV001, LV002, LV003, LV004, LV005, LV006, LV007, LV008, LV009, LV010, LV011 } =
    ViewCodeNextStep;

  const flatSteps = stepGroups.flatMap((group, groupIndex) =>
    group.subSteps.map((step, subIndex) => ({
      groupIndex,
      subIndex,
      label: group.label,
      subLabel: step.label,
      content: step.content,
      description: group.description,
    }))
  );

  const currentStep = flatSteps[activeStep];

  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});

  const setStepValid = useCallback((stepIndex: number, isValid: boolean) => {
    setStepValidation((prev) => {
      if (prev[stepIndex] === isValid) {
        return prev;
      }
      return { ...prev, [stepIndex]: isValid };
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      isValidMap: stepValidation,
      setStepValid,
    }),
    [stepValidation, setStepValid]
  );

  // functions
  const saveStoreData = (data: ListingRentResponseStep, viewCode: string) => {
    const { listingData, parametrics } = data;
    setDataListingRentResponse(data);
    switch (viewCode) {
      case LV001:
        updateListingData({
          accomodationTypeId: listingData?.accomodationTypeId,
          propertySubTypeId: listingData?.propertySubTypeId,
          listingRentId: listingData.listingRentId,
        });
        setListingRentIdContinue(listingData.listingRentId);
        break;
      case LV002:
        updateListingData({
          maxGuests: listingData?.maxGuests,
          bathrooms: listingData?.bathrooms,
          bedrooms: listingData?.bedrooms,
          beds: listingData?.beds,
          sofaBeds: listingData?.sofaBeds,
          privateBathroom: listingData?.privateBathroom,
          privateBathroomLodging: listingData?.privateBathroomLodging,
          sharedBathroom: listingData?.sharedBathroom,
        });
        break;
      case LV003:
        updateListingData({
          address: {
            address1: listingData?.address.address1 ?? '',
            address2: listingData?.address.address2 ?? '',
            cityId: listingData?.address.cityId ?? 0,
            countyId: listingData?.address.countyId,
            stateId: listingData?.address.stateId,
            city: {
              city: listingData?.address.city?.city ?? '',
              country: listingData?.address.city?.country ?? '',
              countryCode: '',
              state: listingData?.address.city?.state ?? '',
              stateCode: '',
              county: listingData?.address.city?.county ?? '',
            },
          },
          latitude: listingData?.latitude,
          longitude: listingData?.longitude,
        });
        updateParametrics({
          amenitiesTypes: parametrics?.amenitiesTypes,
          featuredAspects: parametrics?.featuredAspects,
          securityItems: parametrics?.securityItems,
        });
        break;
      case LV004:
        updateListingData({
          featuredAspects: listingData?.featuredAspects,
          amenities: listingData?.amenities,
          securityItems: listingData?.securityItems,
          listingPhotos: listingData.listingPhotos.sort((a, b) => {
            if (a.isPrincipal && !b.isPrincipal) {
              return -1;
            }
            if (!a.isPrincipal && b.isPrincipal) {
              return 1;
            }
            return 0;
          }),
        });
        break;
      case LV005:
        updateListingData({
          listingPhotos: listingData.listingPhotos.sort((a, b) => {
            if (a.isPrincipal && !b.isPrincipal) {
              return -1;
            }
            if (!a.isPrincipal && b.isPrincipal) {
              return 1;
            }
            return 0;
          }),
        });
        break;
      case LV006:
        updateListingData({
          title: listingData.title,
          description: listingData.description,
          discounts: listingData.discounts,
        });
        updateParametrics({
          discountTypes: parametrics.discountTypes,
        });
        break;
      case LV007:
        updateListingData({
          priceNightly: listingData.priceNightly,
          weekendNightlyPrice: listingData.weekendNightlyPrice,
          discounts: listingData.discounts,
        });
        updateParametrics({
          approvalPolicyType: parametrics.approvalPolicyType,
        });
        break;
      case LV008:
        updateListingData({
          approvalPolicyTypeId: listingData.approvalPolicyTypeId,
          minimunNoticeDays: listingData.minimunNoticeDays,
          preparationDays: listingData.preparationDays,
        });
        updateParametrics({
          ruleTypes: parametrics.ruleTypes,
        });
        break;
      case LV009:
        updateListingData({
          rules: listingData.rules,
          tlCheckInOutPolicy: listingData.tlCheckInOutPolicy,
        });
        updateParametrics({
          cancelationPolicyTypes: parametrics.cancelationPolicyTypes,
        });
        break;
      case LV010:
        updateListingData({
          cancelationPolicyTypeId: listingData.cancelationPolicyTypeId,
          listingPhotos: listingData.listingPhotos, // adicional carga de fotos
        });
        break;
      default:
        break;
    }
  };

  const handleSubmitListingRent = (initial: boolean = false) => {  

    if (initial && listingRentId == 0) {
      PostListingRentInitial(stepData, {
        onSuccess: (response) => {
          const { data, statusCode, resultError } = response;

          if (statusCode === '200') {
            setDataListingRentResponse(data);
            saveStoreData(data, stepData.viewCode);
            const nextStep = activeStep + 1;
            const nextGroupIndex = flatSteps[nextStep].groupIndex;

            if (!unlockedGroups.has(nextGroupIndex)) {
              setUnlockedGroups((prev) => new Set([...prev, nextGroupIndex]));
            }
            setMaxUnlockedStep(nextStep);
            setActiveStep(nextStep);            
          } else {
            showSnackbar(resultError?.message, 'error');
          }
        },
        onError: (error) => {
          showSnackbar(error?.message, 'error');
        }        
      })
    }else{
      PostListingRent(stepData, {
        onSuccess: (response) => {
          const { data, statusCode, resultError } = response;

          if (statusCode === '200') {
            setDataListingRentResponse(data);
            saveStoreData(data, stepData.viewCode);
            // Desbloquear el siguiente grupo si es necesario
            if (stepData.viewCode != LV011) {
              const nextStep = activeStep + 1;
              const nextGroupIndex = flatSteps[nextStep].groupIndex;

              if (!unlockedGroups.has(nextGroupIndex)) {
                setUnlockedGroups((prev) => new Set([...prev, nextGroupIndex]));
              }
              setMaxUnlockedStep(nextStep);
              setActiveStep(nextStep);
            } else {                                   
              pushToDataLayer('activate_property', {
                property_id: listingRentId
              });
              resetState();
              EnableHostRole()
              clearListingRentIdContinue();            
              // Reproducir sonido de éxito
              const audio = new Audio('/src/assets/sounds/jom_create_property.mpeg');
              audio.play().catch(err => console.error('Error al reproducir sonido:', err));
              
              setOpenSuccessfulPublicationModal(true);
              // showSnackbar('Publicación Exitosa', 'success');
              // navigate(AssertRoutes.ADMINPANEL);
            }
          } else {
            showSnackbar(resultError?.message, 'error');
          }
        },
        onError: (error) => {
          showSnackbar(error?.message, 'error');
        },
      });
    }
  };

  const handleNext = async () => {
    if (activeStep < flatSteps.length - 1) {
      const { step1_1, step1_2, step1_3, step2_1, step2_3, step3_1, step3_2, step3_3, step3_4 } =
        formData;

      setStepStates((prev) => ({ ...prev, [activeStep]: 'completed' }));
      switch (activeStep) {
        case 0:
          setStepData((prev) => {
            prev.listingRentId = listingRentId == 0 ? null : listingRentId;
            prev.subtypeId = step1_1?.propertyType?.propertySubtypeId;
            prev.accomodationId = step1_1?.accomodationType?.accommodationTypeId;
            prev.viewCode = LV001;
            return prev;
          });
          if (
            step1_1?.propertyType?.subTypeCode == 'FAMILY' &&
            step1_1?.accomodationType?.accomodationCode == 'ENTIRE'
          ) {
            updateListingData({ combinationOption: 1 });
          } else if (
            step1_1?.propertyType?.subTypeCode == 'FAMILY' &&
            step1_1?.accomodationType?.accomodationCode == 'PRIVATE'
          ) {
            updateListingData({ combinationOption: 2 });
          } else if (
            step1_1?.propertyType?.subTypeCode == 'FAMILY' &&
            step1_1?.accomodationType?.accomodationCode == 'SHARED'
          ) {
            updateListingData({ combinationOption: 3 });
          } else {
            updateListingData({ combinationOption: 0 });
          }

          handleSubmitListingRent(true);
          break;
        case 1:
          setStepData((prev) => {
            ((prev.maxGuests = step1_2?.guests ?? storeListingData?.maxGuests),
              (prev.bathrooms = step1_2?.bathrooms ?? storeListingData?.bathrooms),
              (prev.bedrooms = step1_2?.bedrooms ?? storeListingData?.bedrooms),
              (prev.beds = step1_2?.beds ?? storeListingData?.beds),
              (prev.sofaBeds = step1_2?.sofaBeds ?? storeListingData?.sofaBeds?? 0),
              (prev.privateBathroom =
                step1_2?.privateBathroom ?? storeListingData?.privateBathroom),
              (prev.privateBathroomLodging =
                step1_2?.privateBathroomLodging ?? storeListingData?.privateBathroomLodging),
              (prev.sharedBathroom = step1_2?.sharedBathroom ?? storeListingData?.sharedBathroom),
              (prev.viewCode = LV002),
            prev.listingRentId = listingRentId);
            return prev;
          });
          handleSubmitListingRent();
          break;
        case 2:
          setStepData((prev) => {
            ((prev.address.address2 = step1_3?.address2 ?? storeListingData?.address?.address2),
              (prev.address.address1 = step1_3?.address1 ?? storeListingData?.address?.address1),
              (prev.address.city.city = step1_3?.search?.city ?? storeListingData?.address?.city?.city),
              (prev.address.city.country = step1_3?.search?.country ?? storeListingData?.address?.city?.country),
              (prev.address.city.county = step1_3?.search?.county ?? storeListingData?.address?.city?.county),
              (prev.address.city.state = step1_3?.search?.state ?? storeListingData?.address?.city?.state),
              (prev.address.zipCode = step1_3?.search?.postalCode ?? storeListingData?.address?.zipCode),
              prev.listingRentId = listingRentId
            );
            prev.address.latitude = step1_3?.position?.lat ?? storeListingData?.latitude;
            prev.address.longitude = step1_3?.position?.lng ?? storeListingData?.longitude;
            prev.viewCode = LV003;
            return prev;
          });
          handleSubmitListingRent();
          break;
        case 3:
          setStepData((prev) => {
            ((prev.featuredAmenities = step2_1?.featuredAmenities ?? storeListingData?.amenities),
              (prev.featuredAspects =
                step2_1?.featuredAspects ?? storeListingData?.featuredAspects),
              (prev.securityItems = step2_1?.securityItems ?? storeListingData?.securityItems),
              (prev.viewCode = LV004),
            prev.listingRentId = listingRentId);
            return prev;
          });
          handleSubmitListingRent();
          break;
        case 4:
          setStepData((prev) => {
            prev.viewCode = LV005;
            prev.listingRentId = listingRentId;
            return prev;
          });
          handleSubmitListingRent();
          break;
        case 5:
          setStepData((prev) => {
            ((prev.title = step2_3?.title ?? storeListingData?.title),
              (prev.description = step2_3?.description ?? storeListingData?.description),
              (prev.viewCode = LV006),
            prev.listingRentId = listingRentId);
            prev.discounts = [];
            return prev;
          });
          handleSubmitListingRent();
          break;
        case 6:
          let paramDiscount = dataListingRentResponse?.parametrics.discountTypes;
          
          if (!paramDiscount || paramDiscount.length == 0) {
            paramDiscount = storeParametrics.discountTypes;
          }

          const newk = paramDiscount.find((item) => item.code === 'new');
          const week = paramDiscount.find((item) => item.code === 'week');
          const month = paramDiscount.find((item) => item.code === 'month');
          const requestDiscount: any = [];
          if (step3_1?.newPercentage)
            requestDiscount.push({
              dicountTypeId: newk?.discountTypeForTypePriceId ?? 0,
              percentage: step3_1?.newPercentage,
              price: 0,
            });
          if (step3_1?.weeklyPercentage)
            requestDiscount.push({
              dicountTypeId: week?.discountTypeForTypePriceId ?? 0,
              percentage: step3_1?.weeklyPercentage,
              price: 0,
            });
          if (step3_1?.monthlyPercentage)
            requestDiscount.push({
              dicountTypeId: month?.discountTypeForTypePriceId ?? 0,
              percentage: step3_1?.monthlyPercentage,
              price: 0,
            });
          setStepData((prev) => {
            ((prev.pricing = step3_1?.pricePerNight ?? storeListingData?.priceNightly),
              (prev.weekendPrice =
                step3_1?.customizedPrice ?? storeListingData?.weekendNightlyPrice),
              (prev.discounts = requestDiscount),
              (prev.viewCode = LV007),
            prev.listingRentId = listingRentId);
            return prev;
          });
          handleSubmitListingRent();
          break;
        case 7:
          setStepData((prev) => {
            ((prev.approvalPolicyTypeId =
              step3_2?.approvalPolicyTypeId ?? storeListingData?.approvalPolicyTypeId),
              (prev.minimunNoticeDays =
                step3_2?.advanceNotice ?? storeListingData?.minimunNoticeDays),
              (prev.preparationDays = step3_2?.preparation ?? storeListingData?.preparationDays),
              (prev.viewCode = LV008),
            prev.listingRentId = listingRentId);
            return prev;
          });
          handleSubmitListingRent();
          break;
        case 8:
          const timeCheckIn = convertirString_Minutos(step3_3?.arrivalStart??storeListingData?.tlCheckInOutPolicy?.checkInTime);
          const timeEnd = convertirString_Minutos(step3_3?.arrivalEnd??storeListingData?.tlCheckInOutPolicy?.maxCheckInTime);  

          if (timeEnd < timeCheckIn) {
              showSnackbar(t33('alertCheckInTimeCheckEnd'), 'info');
          } else {  
            setStepData((prev) => {
              ((prev.checkInPolicies.checkInTime =
                step3_3?.arrivalStart ?? storeListingData?.tlCheckInOutPolicy?.checkInTime),
                (prev.checkInPolicies.checkOutTime =
                  step3_3?.departureTime ?? storeListingData?.tlCheckInOutPolicy?.checkOutTime),
                (prev.checkInPolicies.maxCheckInTime =
                  step3_3?.arrivalEnd ?? storeListingData?.tlCheckInOutPolicy?.maxCheckInTime),
                (prev.rules =
                  step3_3?.ruleStates ?? storeListingData?.rules.find((items) => items)?.ruleTypeId),
                (prev.viewCode = LV009),
                (prev.rulesModels = step3_3?.ruleStatesModels),
                prev.listingRentId = listingRentId
              );
              return prev;
            });
            handleSubmitListingRent();
          }
          break;
        case 9:
          setStepData((prev) => {
            ((prev.cancelPolicyTypeId = step3_4?.cancelPolicyTypeId??storeListingData?.cancelationPolicyTypeId), (prev.viewCode = LV010), prev.listingRentId = listingRentId);
            return prev;
          });
          handleSubmitListingRent();
          break;
        default:
          break;
      }
    }
    if (activeStep === flatSteps.length - 1) {
      setStepData((prev) => {
        prev.viewCode = LV011;
        prev.listingConfirmation = true;
        return prev;
      });
      handleSubmitListingRent();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleStepClick = (stepIndex: number) => {
    const stepGroupIndex = flatSteps[stepIndex].groupIndex;

    // Solo permitir clic si el grupo está desbloqueado
    if (!unlockedGroups.has(stepGroupIndex)) {
      return;
    }

    // Solo permitir clic si el paso ya fue desbloqueado
    if (stepIndex > maxUnlockedStep) {
      return;
    }

    // Cerrar el Drawer si se hace clic en un paso en móviles
    if (isSidebarOpen) {
        setIsSidebarOpen(false);
    }
    
    const currentState = stepStates[stepIndex] || 'default';

    if (currentState === 'default' || currentState === 'selected') {
      // Simplemente navegar al paso y marcarlo como seleccionado
      setStepStates((prev) => ({ ...prev, [stepIndex]: 'selected' }));
      setActiveStep(stepIndex);
    } else if (currentState === 'completed') {
      // Si ya está completado, permitir el reingreso.
      setActiveStep(stepIndex);
    }
  };
  
  const handleContinue = async () => {
    setIsLoadingContinue(true);
    try {
      const responseContinue = await RestClient.get(
        `/Host/ListingRent/${listingRentIdContinue}/ProcessData/Continue`
      );
      const responseProcessData = await responseContinue.data;
      if (responseProcessData.statusCode == '200' && responseProcessData.data) {
        setDataListingRent(responseProcessData.data);
        setContinueStepPublishing(responseProcessData.data.listingData.nextViewCode);        
      } else {
        showSnackbar(responseProcessData?.resultError?.message, 'error');
      }
    } catch (error: any) {
      showSnackbar(error?.message || 'Error', 'error');
    } finally {
      setIsLoadingContinue(false);
    }
  };


  const renderStepIcon = (stepIndex: number, isLast: boolean) => {
    const state = stepStates[stepIndex] || 'default';
    const isSelected = activeStep === stepIndex;

    const iconContent = (() => {
      if (isSelected) {
        return (
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#fff',
              zIndex: 2,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: primary.main }} />
          </Box>
        );
      }

      switch (state) {
        case 'completed':
          return (
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <CheckIcon sx={{ fontSize: 13, color: '#fff' }} />
            </Box>
          );
        default:
          return (
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '1px solid #E0E0E0',
                bgcolor: '#fff',
                zIndex: 2,
              }}
            />
          );
      }
    })();

    return (
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {iconContent}
        {!isLast && (
          <Box
            sx={{
              position: 'absolute',
              top: '18px',
              height: '32px', // Approx height to connect to next item
              width: '1px',
              backgroundColor: '#E0E0E0',
              zIndex: 1,
            }}
          />
        )}
      </Box>
    );
  };
  

  useEffect(() => {
    if (continueStepPublishing) {
      setIsStepReady(false);
      switch (continueStepPublishing) {
        case LV001:
          setActiveStep(0); setMaxUnlockedStep(0);
          setUnlockedGroups(new Set([0]));
          break;
        case LV002:
          setActiveStep(1); setMaxUnlockedStep(1);
          setUnlockedGroups(new Set([0]));
          setStepStates({ 0: 'completed' });
          break;
        case LV003:
          setActiveStep(2); setMaxUnlockedStep(2);
          setUnlockedGroups(new Set([0]));
          setStepStates({ 0: 'completed', 1: 'completed' });
          break;
        case LV004:
          setActiveStep(3); setMaxUnlockedStep(3);
          setUnlockedGroups(new Set([0, 1]));
          setStepStates({ 0: 'completed', 1: 'completed', 2: 'completed' });
          break;
        case LV005:
          setActiveStep(4); setMaxUnlockedStep(4);
          setUnlockedGroups(new Set([0, 1]));
          setStepStates({ 0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed' });
          break;
        case LV006:
          setActiveStep(5); setMaxUnlockedStep(5);
          setUnlockedGroups(new Set([0, 1]));
          setStepStates({ 0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed' });
          break;
        case LV007:
          setActiveStep(6); setMaxUnlockedStep(6);
          setUnlockedGroups(new Set([0, 1, 2]));
          setStepStates({ 0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed', 5: 'completed' });
          break;
        case LV008:
          setActiveStep(7); setMaxUnlockedStep(7);
          setUnlockedGroups(new Set([0, 1, 2]));
          setStepStates({ 0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed', 5: 'completed', 6: 'completed' });
          break;
        case LV009:
          setActiveStep(8); setMaxUnlockedStep(8);
          setUnlockedGroups(new Set([0, 1, 2]));
          setStepStates({ 0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed', 5: 'completed', 6: 'completed', 7: 'completed' });
          break;
        case LV010:
          setActiveStep(9); setMaxUnlockedStep(9);
          setUnlockedGroups(new Set([0, 1, 2]));
          setStepStates({ 0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed', 5: 'completed', 6: 'completed', 7: 'completed', 8: 'completed' });
          break;
        case LV011:
          setActiveStep(10); setMaxUnlockedStep(10);
          setUnlockedGroups(new Set([0, 1, 2]));
          setStepStates({ 0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed', 5: 'completed', 6: 'completed', 7: 'completed', 8: 'completed', 9: 'completed' });
          break;
        default:
          setActiveStep(0); setMaxUnlockedStep(0);
          setUnlockedGroups(new Set([0]));
          break;
      }      
      setContinueStepPublishing('');
      setTimeout(() => setIsStepReady(true), 0);
    }
  }, [continueStepPublishing, setContinueStepPublishing]);
  
  useEffect(() => {
    // const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    // const isReload = navigationEntries.length > 0 && navigationEntries[0].type === 'reload';

    if (listingRentIdContinue) {
      handleContinue();                    
    }
  }, [listingRentIdContinue]);
  // bbbb
  
  // Componente Auxiliar para el contenido del Sidebar (evita la duplicación de código)
  const SidebarContent = () => (
    <>
      {/* <Typography sx={{ mb: 3, fontFamily: typography.h6Medium }}>
        {t('uploadProperty')}
      </Typography> */}

      {stepGroups.map((group, groupIndex) => {
        const isGroupUnlocked = unlockedGroups.has(groupIndex);
        const isExpanded = isGroupUnlocked && expandedGroup === groupIndex;

        return (
          <Accordion
            key={group.label}
            expanded={isExpanded}
            onChange={() =>
              isGroupUnlocked &&
              setExpandedGroup(expandedGroup === groupIndex ? null : groupIndex)
            }
            disableGutters
            elevation={0}
            sx={{
              mb: 2,
              border: isExpanded ? 'none' : `1px solid ${customColors.secondary[3]}`,
              borderRadius: '12px !important',
              background: isExpanded ? '#F8FAFC' : background.default,
              boxShadow: 'none',
              opacity: isGroupUnlocked ? 1 : 0.6,
              overflow: 'hidden',
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={isGroupUnlocked ? <KeyboardArrowDownOutlinedIcon sx={{ color: primary.main }} /> : null}
              sx={{
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 'bold',
                },
                cursor: isGroupUnlocked ? 'pointer' : 'default',
                pointerEvents: isGroupUnlocked ? 'auto' : 'none',
              }}
            >
              {isGroupUnlocked ? (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: primary.main,
                    }}
                  >
                    {groupIndex === 0 ? (
                      <InfoOutlinedIcon sx={{ fontSize: 22 }} />
                    ) : groupIndex === 1 ? (
                      <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />
                    ) : (
                      <SettingsOutlinedIcon sx={{ fontSize: 22 }} />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      color: primary.main,
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    {group.label}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      color: '#999',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    {groupIndex + 1}. {group.label}
                  </Typography>
                  {/* <Box sx={{ ml: 'auto', mr: 0.5 }}>
                    <LockOutlinedIcon sx={{ width: 18, color: '#999', mt: 0.5 }} />
                  </Box> */}
                </>
              )}
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, pb: 1 }}>
              <List disablePadding>
                {group.subSteps.map((subStep, subIndex) => {
                  const stepIndex = flatSteps.findIndex(
                    (s) => s.groupIndex === groupIndex && s.subIndex === subIndex
                  );
                  const isSelected = activeStep === stepIndex;
                  const validSubSteps = group.subSteps.filter(s => s.label !== '');
                  const isLastValid = subStep.label === validSubSteps[validSubSteps.length - 1]?.label;

                  return subStep.label !== '' ? (
                    <ListItemButton
                      key={subStep.label}
                      selected={isSelected}
                      disabled={!isGroupUnlocked || stepIndex > maxUnlockedStep}
                      onClick={() => handleStepClick(stepIndex)} // Usa handleStepClick
                      sx={{
                        pl: 4,
                        py: 1,
                        '&.Mui-selected': {
                          backgroundColor: 'transparent',
                        },
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-disabled': {
                          opacity: 0.6,
                          cursor: 'not-allowed',
                        },
                      }}
                    >
                      <Box sx={{ mr: 2 }}>
                        {renderStepIcon(stepIndex, isLastValid)}
                      </Box>
                      <ListItemText
                        primary={subStep.label}
                        slotProps={{
                          primary: {
                            fontSize: 15,
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? '#1A1A1A' : '#555',
                          },
                        }}
                      />
                    </ListItemButton>
                  ) : null;
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );

  return (
    <StepValidationContext.Provider value={contextValue}>
      <Box sx={{ display: 'flex' }}>
        {/* --- 1. Botón de Menú (Visible solo en móviles) --- */}
        {/* <Box 
          sx={{
            display: { xs: 'block', md: 'none' }, // Muestra solo en pantallas pequeñas
            position: 'fixed', 
            top: 70, 
            left: 16,
            zIndex: 1100, // Asegura que esté por encima del Drawer
          }}
        >
          <Button
            variant="contained"
            onClick={toggleSidebar}
            startIcon={isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          >
            {t('menu')}
          </Button>
        </Box> */}
        
        {/* --- 2. Sidebar de ESCRITORIO (Box) --- */}
        <Box
          sx={{
            // AÑADIDO: Oculta en xs (móviles) y muestra en md (escritorio)
            display: { xs: 'none', md: 'block' }, 
            width: 240,
            borderRight: '1px solid #e0e0e0',
            borderTop: '1px solid #e0e0e0',
            py:15,
            px: 2,
            background: '#ffff',
            height: '100vh',
            position: 'fixed',
            top: 0,
            overflowY: 'auto',
            flexShrink: 0,
            boxSizing: 'border-box'
          }}
        >
          {/* Contenido del Sidebar de Escritorio */}
          <SidebarContent /> 
        </Box>

        {/* --- 3. Sidebar de MÓVILES (Drawer) --- */}
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={toggleSidebar}
          sx={{
            display: { xs: 'block', md: 'none' }, // Solo funciona en móviles
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 270, 
              // Estilos de la caja interna del Drawer para que parezca el sidebar original
              background: '#F9F9F9',
              borderRight: '1px solid #e0e0e0',
              borderTop: '1px solid #e0e0e0',
            },
          }}
        >
          <Box sx={{ p: 2, minHeight: '100vh', width: 270 }}>
            {/* Contenido del Sidebar en el Drawer */}
            <SidebarContent /> 
          </Box>
        </Drawer>

        {/* Main content */}
        <Box sx={{ 
            flexGrow: 1, 
            // mt: 2,
            ml: { xs: 0, md: '240px' }, // Compensar el ancho del sidebar fijo
            pl: { xs: 3, md: 10 }, 
            pr: { xs: 3, md: 10 },
            pt: { xs: 8, md: 3 },
            bgcolor: '#f8f9fc',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
          {/* loading */}
          {<LoadingThreeDotsJumping open={isPendingInitial || isPending || isLoadingContinue} modal={true} />}

          <Box sx={{ flexGrow: 1, maxWidth: activeStep == 2 || activeStep == 4 || activeStep == 3 ? '1000px' : activeStep == 10 ? '1200px': '800px', width: '100%', mx: 'auto', mb: 10 }}>
            {/* header (Breadcrumbs) */}
            {activeStep < 10 && (
              <Box sx={{ mb: 2, mt: isMobile ? -5 : 2 }}>
                <Typography 
                  sx={{ 
                    fontFamily: typography.small1Regular, 
                    color: '#666666',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    gap: 0.5,
                  }}
                >
                  {flatSteps[activeStep].label} {'  >  '} <span style={{ color: '#999', marginLeft: '0.5rem' }}>{flatSteps[activeStep].subLabel}</span>
                </Typography>
              </Box>
            )}

            {/* contenidos */}
            <Box sx={{ mb: 5}}>{isStepReady && currentStep.content}</Box>
          </Box>

          <Box sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: { xs: 0, md: 240 }, // Respetar el sidebar en desktop
            right: 0,
            bgcolor: '#ffffff',
            zIndex: 1000,
            px: { xs: 3, md: 10 },
          }}>
            <Divider sx={{ mb: 0, mx: { xs: -3, md: -10 }, borderColor: customColors.lights[1]}} />

            {/* botones footer */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: { xs: 0, md: 0 }, position: 'relative'}}>
              <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="text"
              size='large'
              sx={{ 
                fontFamily: typography.paragraph1Regular, 
                textTransform: 'none', 
                color: '#666666',
                textDecoration: 'underline',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#222222'
                }
              }}
            >
              {t('buttonBack')}
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              size='large'
              sx={{ 
                fontFamily: typography.paragraph1Regular, 
                textTransform: 'none',
                borderRadius: '18px',
                px: 5,
                py: 1.5,
                fontWeight: 500,
                minWidth: '120px'
              }}
              disabled={activeStep === flatSteps.length - 1 ? false : !stepValidation[activeStep]}
            >
              {activeStep === flatSteps.length - 1 ? t('buttonPublish') : t('buttonNext')}
            </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <SuccessfulPublicationModal
        listingRentId={dataListingRentResponse?.listingData.listingRentId ?? 0}
        open={openSuccessfulPublicationModal}
        handleClose={() => setOpenSuccessfulPublicationModal(false)}
      />
    </StepValidationContext.Provider>
  );
};

export default PropertyRegistration;