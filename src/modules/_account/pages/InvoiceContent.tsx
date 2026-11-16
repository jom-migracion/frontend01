import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
import { ApiService } from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { Box, Skeleton, Tab, Tabs, Typography } from '@mui/material';
import BillingDataForm from './BillingDataForm';
import type { BillingFormData, BillingFormErrors } from './BillingDataForm';
import InvoiceList from './InvoiceList';
import { useAuthContext } from '@/modules/_auth/context';
import { useTranslation } from 'react-i18next';
// import { useSnackbar } from '@/context/SnackbarContext';
import { useNotification } from '@/context/NotificationContext';

const UPSERT_USER_ENDORSEMENT_URL =
  '/UpsertUserEndorsement';

const DEFAULT_BILLING_DATA: BillingFormData = {
  fullName: '',
  email: '',
  nit: '',
  documentType: 'NIT',
  fiscalAddress: '',
  stateId: 0,
  stateName: '',
  cityId: 0,
  cityName: '',
};

const hasValidBillingData = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return false;
};

const BillingFormSkeleton = () => (
  <Box sx={{ maxWidth: 600, mx: 'auto', py: 4, px: 2 }}>
    <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width={280} height={42} sx={{ mb: 3 }} />
    <Skeleton variant="rounded" width="100%" height={64} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" width="100%" height={64} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" width="100%" height={64} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" width="100%" height={64} sx={{ mb: 3 }} />
    <Skeleton variant="rounded" width="100%" height={50} sx={{ mb: 1.5 }} />
    <Skeleton variant="rounded" width="100%" height={44} />
  </Box>
);

const InvoiceContent = () => {
  const { isGuestAuthenticated, isHostAuthenticated } = useAuthContext();
  const [activeTab, setActiveTab] = useState(0);
  const [billingData, setBillingData] = useState<BillingFormData>(DEFAULT_BILLING_DATA);
  const [billingErrors, setBillingErrors] = useState<BillingFormErrors>({});
  const [hasBillingData, setHasBillingData] = useState<boolean>(false);
  const [isLoadingBillingData, setIsLoadingBillingData] = useState<boolean>(true);
  const showNotification = useNotification();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBillingDataStatus = async () => {
      setIsLoadingBillingData(true);

      try {
        const userType = isGuestAuthenticated ? 'GUEST' : 'HOST';
        const response = await ApiService.get<ResponseAssert<unknown>>('/GetUserEndorsement', {
          invoiceTypeCode: userType,
        });

        const existsInApi = !response?.hasError && hasValidBillingData(response?.data);
        setHasBillingData(existsInApi);

        const responseData = response?.data;
        const endorsementSource =
          Array.isArray(responseData) && responseData.length > 0
            ? (responseData[0] as Record<string, unknown>)
            : (responseData as Record<string, unknown> | null);

        if (endorsementSource && typeof endorsementSource === 'object') {
          setBillingData({
            fullName: String(endorsementSource.fullName ?? ''),
            email: String(endorsementSource.email ?? ''),
            nit: String(endorsementSource.nit ?? ''),
            documentType: endorsementSource.documentType === 'CI' ? 'CI' : 'NIT',
            fiscalAddress: String(endorsementSource.fiscalAddress ?? ''),
            stateId: Number(endorsementSource.stateId ?? 0),
            stateName: String(endorsementSource.stateName ?? ''),
            cityId: Number(endorsementSource.cityId ?? 0),
            cityName: String(endorsementSource.cityName ?? ''),
          });
        } else {
          setBillingData(DEFAULT_BILLING_DATA);
        }
      } catch (error) {
        console.error('Error al consultar datos de facturación:', error);
        setBillingData(DEFAULT_BILLING_DATA);
      } finally {
        setIsLoadingBillingData(false);
      }
    };

    fetchBillingDataStatus();
  }, [isGuestAuthenticated, isHostAuthenticated]);

  const handleBillingFieldChange = (field: keyof BillingFormData, value: string | number) => {
    setBillingData((previousData) => ({ ...previousData, [field]: value }) as BillingFormData);

    if (field === 'fullName' || field === 'email' || field === 'nit' || field === 'fiscalAddress' || field === 'cityId') {
      if (billingErrors[field]) {
        setBillingErrors((previousErrors) => ({ ...previousErrors, [field]: undefined }));
      }
    }
  };

  const validateBillingForm = () => {
    const errors: BillingFormErrors = {};

    if (!billingData.fullName.trim()) {
      errors.fullName = 'Este campo es obligatorio';
    }

    if (!billingData.email.trim()) {
      errors.email = 'Este campo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.email.trim())) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    if (!billingData.nit.trim()) {
      errors.nit = 'Este campo es obligatorio';
    }

    if (!billingData.fiscalAddress.trim()) {
      errors.fiscalAddress = 'Este campo es obligatorio';
    }

    if (!billingData.cityId) {
      errors.cityId = 'Este campo es obligatorio';
    }

    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveBillingData = async () => {
    if (!validateBillingForm()) {
      return;
    }

    try {

      const response = await ApiService.post<ResponseAssert<unknown>>(UPSERT_USER_ENDORSEMENT_URL, {
        invoiceTypeCode: isGuestAuthenticated ? 'GUEST' : 'HOST',
        fullName: billingData.fullName,
        email: billingData.email,
        nit: billingData.nit,
        documentType: billingData.documentType,
        fiscalAddress: billingData.fiscalAddress,
        stateId: billingData.stateId,
        cityId: billingData.cityId,
        detail: '',
      });

      if (response?.hasError) {
        console.error('No fue posible guardar los datos de facturación en el servicio.');
        return;
      }
      showNotification(
              'success',
              'Registro exitoso',
              'Datos de facturación guardados correctamente'
            );
      setHasBillingData(true);
    } catch (error) {
      // console.error('Error al guardar datos de facturación:', error);
      showNotification('error', 'Error de guardado', 'No fue posible guardar los datos de facturación');
    }
  };

  const handleCancelBillingForm = () => {
    setBillingData({
      fullName: '',
      email: '',
      nit: '',
      documentType: 'NIT',
      fiscalAddress: '',
      stateId: 0,
      stateName: '',
      cityId: 0,
      cityName: '',
    });
    setBillingErrors({});
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ px: 2, mb: 2 }}>
        {t('accountSettings.billing.title2', { defaultValue: 'Facturas' })}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="invoice tabs">
          <Tab label={t('accountSettings.billing.billingData', { defaultValue: 'Datos para facturación' })} sx={{ textTransform: 'none' }} />
          <Tab label={t('accountSettings.billing.asGuest', { defaultValue: 'Como huésped' })} sx={{ textTransform: 'none' }} disabled={!hasBillingData} />
          <Tab label={t('accountSettings.billing.asHost', { defaultValue: 'Como anfitrión' })} sx={{ textTransform: 'none' }} disabled={!hasBillingData} />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        isLoadingBillingData ? (
          <BillingFormSkeleton />
        ) : (
          <BillingDataForm
            billingData={billingData}
            billingErrors={billingErrors}
            onFieldChange={handleBillingFieldChange}
            onSave={handleSaveBillingData}
            onCancel={handleCancelBillingForm}
          />
        )
      ) : null}

      {activeTab === 1 ? <InvoiceList type="guest" /> : null}
      {activeTab === 2 ? <InvoiceList type="host" /> : null}
    </Box>
  );
};

export default InvoiceContent;
