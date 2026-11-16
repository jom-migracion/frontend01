import { Box, /*Card, CardContent,*/ Typography, useTheme, styled } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import { GoQuestion } from 'react-icons/go';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useEffect, useState } from 'react';
import AdvanceNotice from '../AdvanceNotice';
import { PropertyRegistrationProps_3_2 } from '../../interface/IPropertyRegistrationProps';
import { useStepValidation } from '@/context/FormStepContext';
import CardRectangle from '../CardRectangle';
import { ApprovalPolicyType } from '@/models/interfaces/ListingRentResponseStep';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next';

const PreparationCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(3),
}));

export const PropertyRegistrationStep_3_2: React.FC<PropertyRegistrationProps_3_2> = ({
  onChange
}) => {
  // store
  const { approvalPolicyType } = usePropertyRegistration((state) => state.data.parametrics);
  const { approvalPolicyTypeId, minimunNoticeDays, preparationDays: preparationDay } = usePropertyRegistration(
    (state) => state.data.listingData
  );
  
  // useState 
  const [reservationType, setReservationType] = useState<ApprovalPolicyType>();
  const [advanceNoticeDays, setAdvanceNoticeDays] = useState(minimunNoticeDays??0);
  const [preparationDays, setPreparationDays] = useState(preparationDay??0);

  // hooks
  const { setStepValid } = useStepValidation();
  const {palette: { customColors }/*, typography*/ } = useTheme();
  
  // Hook original
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step32' });
  // Nuevo hook para textos faltantes
  const { t: tStep32 } = useTranslation('translation', { keyPrefix: 'PropertyRegistrationStep_3_2' });

  useEffect(() => {

    const isValid = !!reservationType && advanceNoticeDays >= 0 && preparationDays >= 0;
    setStepValid(7, isValid); // Notifica al componente padre si es válido o no
    onChange({
      step3_2: {
        approvalPolicyTypeId: reservationType?.approvalPolicyTypeId ?? 1,
        advanceNotice: advanceNoticeDays,
        preparation: preparationDays,
      },
    });
  }, [reservationType, advanceNoticeDays, preparationDays, setStepValid, onChange]);

  useEffect(() => {
    if (approvalPolicyType && !reservationType) { 
      if (approvalPolicyTypeId) {
        const foundApproval = approvalPolicyType.find(
          (prope) => prope.approvalPolicyTypeId === approvalPolicyTypeId
        );
        if (foundApproval) {
          setReservationType(foundApproval);
        }
      } else {
        const manbookApproval = approvalPolicyType.find(
          (prope) => prope.code === 'manbook'
        );
        if (manbookApproval) {
          setReservationType(manbookApproval);
        }
      }
    }
  }, [approvalPolicyType, approvalPolicyTypeId, reservationType]); 

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 650 }}>
      {/* Título principal */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600, 
          mb: 1.5,
          fontSize: '1.5rem',
          color: 'text.primary',
          mt: '25px'
        }}
      >
        {/* {t('title')} */}
        {tStep32('headerTitle', { defaultValue: 'Define cómo recibirás reservas' })}
      </Typography>
      <Typography 
        sx={{ fontSize: '0.875rem', mb: 4, lineHeight: 1.6, color: 'text.secondary' }}
      >
        {tStep32('headerSubtitle', { defaultValue: 'Elige el método que mejor se adapte a tu ritmo.' })}
        {/* La mayoría de los anfitriones prefieren la reserva inmediata para agilizar el proceso. */}
      </Typography>

      {/* Método de reserva */}
      {approvalPolicyType?.map((appro) => {
        if (appro?.code == 'manbook') {
                return (
                <CardRectangle
                  key={appro.code}
                  onClick={() => setReservationType(appro)}
                  title={appro?.name}
                  selected={appro?.approvalPolicyTypeId == reservationType?.approvalPolicyTypeId}
                  description={appro?.description}
                  bgColor={
                    appro?.code == reservationType?.code ? customColors.lights[3] : ''
                  }
                />
              )
        }
      })}

      {/* Gestión de preparación */}
      <PreparationCard>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '16px', 
            mb: 3,
            color: 'text.primary',
          }}
        >
          {tStep32('preparationTitle', { defaultValue: 'Gestión de preparación' })}
        </Typography>
        
        <AdvanceNotice
          title={t('advanceNoticeDaysTitle')}
          description={t('advanceNoticeDaysDescription')}
          onChange={setAdvanceNoticeDays}
          initialDays={advanceNoticeDays}
        />
        <AdvanceNotice
          title={t('preparationDaysTitle')}
          description={t('preparationDaysDescription')}
          onChange={setPreparationDays}
          initialDays={preparationDays}
          maxDays={2}
        />
      </PreparationCard>
    </Box>
  );
};