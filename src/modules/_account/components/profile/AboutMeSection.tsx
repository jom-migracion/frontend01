import AssertModal from '@/components/AssertModal';
import { Box, Link, Typography } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import AboutMeForm from './AboutMeForm';

interface ProfileItemProps {
  value?: string;
  aditionalId: number;
}

const AboutMeSection: React.FC<ProfileItemProps> = ({ value, aditionalId }) => {
  const { t } = useTranslation();
  const [openAboutSpace, setOpenAboutSpace] = useState(false);
  const [dataItem, setDataItem] = useState(value);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleSave = async (aboutMe: string) => {
    setDataItem(aboutMe);
    setIsUpdated(true);
    setOpenAboutSpace(false);
  };

  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {`${t('myProfile.myProfilePage.aboutMe.title')}:`}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          {isUpdated ? (
            dataItem ? (
              <Typography variant="body1" color="text.secondary">
                {dataItem}
              </Typography>
            ) : (
              t('myProfile.myProfilePage.aboutMe.defaultMessage')
            )
          ) : value ? (
            <Typography variant="body1" color="text.secondary">
              {value}
            </Typography>
          ) : (
            t('myProfile.myProfilePage.aboutMe.defaultMessage')
          )}
          <Link
            href="#"
            variant="body1"
            sx={{ paddingLeft: '10px', fontWeight: 'bold', textDecoration: 'none' }}
            onClick={() => setOpenAboutSpace(true)}
          >
            {t('myProfile.myProfilePage.aboutMe.introduceYourself')}
          </Link>
        </Box>
      </Box>
      <AssertModal
        title={''}
        content={
          <AboutMeForm
            initialAboutMe={isUpdated ? dataItem || '' : value || ''}
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

export default AboutMeSection;
