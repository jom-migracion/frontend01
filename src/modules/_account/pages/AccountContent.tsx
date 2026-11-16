import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
// import LegalNameSection from '../components/LegalNameSection';
import PreferredNameSection1 from '../components/PreferredNameSection1';
import EmailSection1 from '../components/EmailSection1';
import PhoneSection1 from '../components/PhoneSection1';
import StreetSection1 from '../components/StreetSection1';
import { useGet } from '@/hooks/api';
import { PersonalInfo } from '@/models/interfaces/PersonalInfo';
import EmergencyContactSection1 from '../components/EmergencyContactSection1';
import LegalNameSection1 from '../components/LegalNameSection1';
import { useTranslation } from 'react-i18next';
import IdentityVerificationSection from '../components/IdentityVerificationSection';
import { useSearchParams } from 'react-router';

interface AccountContentProps {
  autoOpenIdentityVerification?: boolean;
}

const AccountContent: React.FC<AccountContentProps> = ({ autoOpenIdentityVerification = false }) => {
  const [userData, setUserData] = useState<PersonalInfo>();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const openIdentityFromQuery =
    searchParams.get('openIdentityVerification') === 'true' ||
    searchParams.get('openIdentityVerification') === '1';

  const shouldOpenIdentityVerification = autoOpenIdentityVerification || openIdentityFromQuery;

  const { data: PersonalInfoData, isLoading } = useGet<PersonalInfo>(
    'PersonalInfoRequest',
    '/GetPersonalInformation'
  );

  const handleLegalNameSave = async (firstName: string, lastName: string) => {
    setUserData(
      (prev: any) =>
        prev
          ? {
              ...prev, // Mantén todos los demás datos del usuario
              name: firstName, // Actualiza el nombre legal
              lastName: lastName, // Actualiza el apellido legal
            }
          : null // Si prev es null, mantén null (aunque el flujo normal evita esto)
    );
  };

  const handlePreferredNameSave = async (preferredName: string) => {
    setUserData((prev: any) =>
      prev
        ? {
            ...prev,
            favoriteName: preferredName,
          }
        : null
    );
  };

  const handleEmailSave = async (email: string) => {
    setUserData((prev: any) =>
      prev
        ? {
            ...prev,
            email: email,
          }
        : null
    );
  };

  const handlePhoneSave = async (phoneCode: string, phone: string) => {
    setUserData((prev: any) =>
      prev
        ? {
            ...prev,
            phoneCode: phoneCode,
            phone: phone,
          }
        : null
    );
  };

  const handleAddress = async (address: string) => {
    setUserData((prev: any) =>
      prev
        ? {
            ...prev,
            address: address,
          }
        : null
    );
  };


  const handleEmergencyContactSave = async (
    id: number,
    name: string,
    relationship: string,
    email: string,
    phone: string
  ) => {
    setUserData((prev: any) =>
      prev
        ? {
            ...prev, // Mantén todos los demás datos del usuario
            emergencyContact: {
              emergencyContactId: id,
              name: name,
              relationship: relationship,
              languageId: 1,
              email: email,
              phoneCode: '591',
              phoneNumber: phone,
            },
          }
        : null
    );
  };

  useEffect(() => {
    if (PersonalInfoData?.data) {
      setUserData(PersonalInfoData?.data);
    }
  }, [PersonalInfoData]);

  return (
    !isLoading && (
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          {t('accountSettings.personalInformation.title')}
        </Typography>
        <LegalNameSection1
          initialFirstName={userData?.name || ''}
          initialLastName={userData?.lastName || ''}
          onSave={handleLegalNameSave}
        />
        <PreferredNameSection1
          initialPreferredNameValue={PersonalInfoData?.data?.favoriteName || ''}
          onSave={handlePreferredNameSave}
        />
        <EmailSection1
          initialEmail={PersonalInfoData?.data?.email ?? null}
          onSave={handleEmailSave}
        />
        <PhoneSection1
          initialCodeCountry={PersonalInfoData?.data?.phoneCode || ''}
          initialPhone={PersonalInfoData?.data?.phoneNumber || ''}
          onSave={handlePhoneSave}
        />
        <IdentityVerificationSection autoOpen={shouldOpenIdentityVerification} />
        <StreetSection1 initialAddress={PersonalInfoData?.data?.address||''} onSave={handleAddress} />
        <EmergencyContactSection1
          initialId={PersonalInfoData?.data?.emergencyContact?.emergencyContactId || 0}
          initialName={PersonalInfoData?.data?.emergencyContact?.name || ''}
          initialRelationship={PersonalInfoData?.data?.emergencyContact?.relationship || ''}
          initialEmail={PersonalInfoData?.data?.emergencyContact?.email || ''}
          initialPhone={PersonalInfoData?.data?.emergencyContact?.phoneNumber || ''}
          onSave={handleEmergencyContactSave}
        />
      </Box>
    )
  );
};

export default AccountContent;
