import { Box, Dialog, DialogContent, Icon } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useItemState from '@/hooks/userItemState';
import CustomCloseButton from '@/components/CustomCloseButton';
import HostForm from '@/modules/_auth/components/HostForm';
import StepperProperty_0 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_0';
import StepperProperty_1_1 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_1_1';
import StepperProperty_1_2 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_1_2';
import StepperProperty_1_3 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_1_3';
import StepperProperty_1_4 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_1_4';
import StepperProperty_1_5 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_1_5';
import StepperProperty_2_1 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_2_1';
// import StepperProperty_2_2 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_2_2';
import StepperProperty_2_3 from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_2_3';
import StepperProperty_end from '@/modules/_admin/components/StepperRegisterProperty/StepperProperty_end';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import {
  getDefaultStepperLinearRegistre,
  StepperLinearRegistreProperty,
} from '@/models/interfaces/stepperLinearRegistreProperty';
import { useAuthContext } from '@/modules/_auth/context';
import { usePost } from '@/hooks/api';
import { ListingRentResponseStep } from '@/models/interfaces/ListingRentResponseStep';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useSnackbar } from '@/context/SnackbarContext';

const steps = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const StepperLinearRegisterProperty: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [listingRentId, setListingRentId] = useState<string>('0');
  const showSnackbar = useSnackbar();
  const [stepData, setStepData] = useState<StepperLinearRegistreProperty>(
    getDefaultStepperLinearRegistre()
  );
  const [dataListingRentResponse, setDataListingRentResponse] = useState<ListingRentResponseStep>();
  const { isHostAuthenticated } = useAuthContext();

  const handleRouteLink = useHandleRouteLink();

  const { handleSubmit: handle0Submit } = useForm({
    // resolver: zodResolver(authRegistrationScheme),
  });

  const {
    open: openHostForm,
    handleOpen: handleOpenHostForm,
    handleClose: handleCloseHostForm,
  } = useItemState();
  const { mutate: ListingRent, isPending } = usePost<ListingRentResponseStep>(
    `/Host/ListingRent/${listingRentId}/ProcessData`
  );
  const seeFormAuth = () => {
    if (!isHostAuthenticated) {
      handleOpenHostForm();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleSubmitListingRent = async () => {
    ListingRent(stepData, {
      onSuccess: (response) => {
        const { data, statusCode, resultError } = response;
        if (activeStep == 8) {
          showSnackbar('Publicacion exitosa', 'success');
          handleRouteLink(AssertRoutes.ADMINPANEL);
        } else {
          if (statusCode === '200') {
            setDataListingRentResponse(data);
            setListingRentId(data?.listingData?.listingRentId.toString() ?? '');
            setActiveStep(activeStep + 1);
          } else {
            showSnackbar(resultError?.message, 'error');
          }
        }
      },
      onError: (error) => {
        showSnackbar(error?.message, 'error');
      },
    });
  };
  const onSubmit = (finalData: any) => {
    console.log('onSubmit', activeStep, finalData);

    switch (activeStep) {
      case 1:
        setStepData((prev) => {
          prev.listingRentId = finalData?.listingRentId ?? 0;
          prev.subtypeId = finalData?.propertySubtypeId;
          prev.viewCode = 'LV001';
          return prev;
        });
        handleSubmitListingRent();
        break;
      case 2:
        setStepData((prev) => {
          prev.listingRentId = listingRentId;
          prev.accomodationId = finalData?.accommodationTypeId;
          prev.subtypeId = 0;
          prev.viewCode = dataListingRentResponse?.listingData.nextViewCode ?? 'LV002';
          return prev;
        });
        handleSubmitListingRent();
        break;
      case 3:
        setStepData((prev) => {
          (prev.address.address2 = finalData?.address2),
            (prev.address.address1 = finalData?.address1),
            (prev.address.cityId = finalData?.city?.value),
            (prev.address.countyId = finalData?.county?.countyId),
            (prev.address.stateId = finalData?.city?.stateId);

          prev.viewCode = dataListingRentResponse?.listingData.nextViewCode ?? 'LV003';
          return prev;
        });
        handleSubmitListingRent();
        break;
      case 4:
        setStepData((prev) => {
          (prev.address.latitude = finalData?.lat),
            (prev.address.longitude = finalData?.lng),
            (prev.viewCode = dataListingRentResponse?.listingData.nextViewCode ?? 'LV004');
          return prev;
        });
        handleSubmitListingRent();
        break;
      case 5:
        setStepData((prev) => {
          (prev.maxGuests = finalData?.guests),
            (prev.bathrooms = finalData?.bathrooms),
            (prev.bedrooms = finalData?.bedrooms),
            (prev.beds = finalData?.beds),
            (prev.viewCode = dataListingRentResponse?.listingData.nextViewCode ?? 'LV005');
          return prev;
        });
        handleSubmitListingRent();
        break;
      case 6:
        setStepData((prev) => {
          (prev.amenities = finalData),
            (prev.viewCode = dataListingRentResponse?.listingData.nextViewCode ?? 'LV006');
          return prev;
        });
        handleSubmitListingRent();
        break;
      case 7:
        setStepData((prev) => {
          (prev.featuredAspects = finalData?.selected),
            (prev.title = finalData?.title),
            (prev.description = finalData?.description),
            (prev.viewCode = dataListingRentResponse?.listingData.nextViewCode ?? 'LV007');
          return prev;
        });
        handleSubmitListingRent();
        break;
      case 8:
        setStepData((prev) => {
          (prev.discounts = finalData?.discount),
            (prev.pricing = finalData?.pricing ?? 0),
            (prev.weekendPrice = finalData?.weekendPrice ?? 0),
            (prev.currencyId = 2),
            (prev.viewCode = dataListingRentResponse?.listingData.nextViewCode ?? 'LV008');
          return prev;
        });
        handleSubmitListingRent();
        break;
      // case 9:
      //   setActiveStep(activeStep + 1);
      //   setStepData(stepData);
      //   // setStepData({ ...stepData, property: setStepData });
      //   break;
      default:
        break;
    }

    // if (activeStep === steps.length - 1) {
    //   handleRouteLink(Route.ADMINPANEL);
    // }
  };

  const getStepContent = (step: number) => {
    console.log('step', step);
    switch (step) {
      case 0:
        return (
          <>
            <form key={step} onSubmit={handle0Submit(seeFormAuth)}>
              <StepperProperty_0 />
            </form>
            <Dialog
              open={openHostForm}
              aria-labelledby="responsive-dialog-title"
              maxWidth="sm"
              scroll="body"
              sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
              <CustomCloseButton onClick={handleCloseHostForm}>
                <Icon component="span" sx={{ fontSize: '1.25rem' }}>
                  X
                </Icon>
              </CustomCloseButton>
              <DialogContent
                sx={{
                  pb: (theme) => `${theme.spacing(2)} !important`,
                  px: (theme) => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(8)} !important`,
                  ],
                  pt: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(1)} !important`,
                  ],
                }}
              >
                <HostForm onClose={handleCloseHostForm} onSubmit={onSubmit} />
              </DialogContent>
            </Dialog>
          </>
        );
      case 1:
        return (
          <>
            {<LoadingThreeDotsJumping open={isPending} modal={true} />}
            <StepperProperty_1_1
              stepsCount={7}
              activeStep={step}
              step={1}
              onSubmit={onSubmit}
              prefillData={stepData}
            />
          </>
        );
      case 2:
        return (
          <>
            {<LoadingThreeDotsJumping open={isPending} modal={true} />}
            <StepperProperty_1_2
              stepsCount={7}
              activeStep={step}
              step={1}
              onSubmit={onSubmit}
              prefillData={dataListingRentResponse}
            />
            {/* <Button color="secondary" onClick={handleBack}>
              Atrás
            </Button> */}
          </>
        );
      case 3:
        return (
          <>
            {<LoadingThreeDotsJumping open={isPending} modal={true} />}
            <StepperProperty_1_3
              stepsCount={7}
              activeStep={step}
              step={1}
              onSubmit={onSubmit}
              prefillData={dataListingRentResponse}
            />
            {/* <Button color="secondary" onClick={handleBack}>
              Atrás
            </Button> */}
          </>
        );
      case 4:
        return (
          <>
            {<LoadingThreeDotsJumping open={isPending} modal={true} />}
            <StepperProperty_1_4
              stepsCount={7}
              activeStep={step}
              step={1}
              onSubmit={onSubmit}
              prefillData={dataListingRentResponse}
            />
            {/* <Button color="secondary" onClick={handleBack}>
              Atrás
            </Button> */}
          </>
        );
      case 5:
        return (
          <>
            {<LoadingThreeDotsJumping open={isPending} modal={true} />}
            <StepperProperty_1_5 stepsCount={7} activeStep={step} step={1} onSubmit={onSubmit} />
            {/* <Button color="secondary" onClick={handleBack}>
              Atrás
            </Button> */}
          </>
        );
      case 6:
        return (
          <>
            {<LoadingThreeDotsJumping open={isPending} modal={true} />}
            <StepperProperty_2_1
              stepsCount={5}
              activeStep={1}
              step={2}
              onSubmit={onSubmit}
              prefillData={dataListingRentResponse}
            />{' '}
            {/* <Button color="secondary" onClick={handleBack}>
              Atrás
            </Button> */}
          </>
        );
      case 7:
        return (
          <>
            {<LoadingThreeDotsJumping open={isPending} modal={true} />}
            <StepperProperty_2_3
              stepsCount={5}
              activeStep={2}
              step={2}
              onSubmit={onSubmit}
              prefillData={dataListingRentResponse}
            />
            {/* <Button color="secondary" onClick={handleBack}>
              Atrás
            </Button> */}
          </>
        );
      case 8:
        return (
          <>
            {<LoadingThreeDotsJumping open={isPending} modal={true} />}
            <StepperProperty_end
              stepsCount={5}
              activeStep={3}
              step={2}
              onSubmit={onSubmit}
              prefillData={dataListingRentResponse}
            />
            {/* <Button color="secondary" onClick={handleBack}>
              Atrás
            </Button> */}
          </>
        );
      // case 9:
      //   return (
      //     <>
      //       <StepperProperty_end
      //         stepsCount={5}
      //         activeStep={4}
      //         step={2}
      //         onSubmit={onSubmit}
      //         prefillData={dataListingRentResponse}
      //       />{' '}
      //       <Button color="secondary" onClick={handleBack}>
      //         Atrás
      //       </Button>
      //     </>
      //   );
      default:
        return null;
    }
  };
  const renderContent = () => {
    if (activeStep !== steps.length) {
      return getStepContent(activeStep);
    }
  };

  return <Box sx={{ mt: 5 }}>{renderContent()}</Box>;
};
export default StepperLinearRegisterProperty;
