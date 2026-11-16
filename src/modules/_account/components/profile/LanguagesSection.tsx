import AssertModal from '@/components/AssertModal';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import LanguageForm from './LanguageForm';
import { Language } from '@/models/interfaces/profile/Language';

interface ProfileItemProps {
  icon: React.ReactNode;
  value?: Language[];
  aditionalId: number;
}

const LanguagesSection: React.FC<ProfileItemProps> = ({ icon, value, aditionalId }) => {
  const { t } = useTranslation();
  const [openAboutSpace, setOpenAboutSpace] = useState(false);
  const [dataItem, setDataItem] = useState<Language[]>(value || []);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleSave = async (languages?: Language[]) => {
    console.log(languages);
    setDataItem(languages || []);
    setIsUpdated(true);
    setOpenAboutSpace(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1,
          borderBottom: '1px solid #000',
        }}
        onClick={() => setOpenAboutSpace(true)}
      >
        <Box sx={{ minWidth: '32px', display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {`${t('myProfile.myProfilePage.languagesSpoken.title')}:`}
          </Typography>
          {isUpdated
            ? dataItem && (
                <Typography variant="body2" color="text.secondary">
                  {dataItem?.map((lang) => lang.detail).join(', ')}
                </Typography>
              )
            : value && (
                <Typography variant="body2" color="text.secondary">
                  {value?.map((lang) => lang.detail).join(', ')}
                </Typography>
              )}
        </Box>
      </Box>
      <AssertModal
        title={''}
        content={
          <LanguageForm
            initialSelectedLanguages={isUpdated ? dataItem || [] : value || []}
            initialId={aditionalId}
            onSave={handleSave}
          />
        }
        open={openAboutSpace}
        showCloseLeft={false}
        onClose={() => setOpenAboutSpace(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
    </>
  );
};

export default LanguagesSection;
