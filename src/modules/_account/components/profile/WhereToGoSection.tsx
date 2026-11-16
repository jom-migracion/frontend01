import AssertModal from '@/components/AssertModal';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FormWhereToGo from './FormWhereToGo';
import { useTranslation } from 'react-i18next';

interface ProfileItemProps {
  icon: React.ReactNode;
  value?: string;
  aditionalId: number;
}

const WhereToGoSection: React.FC<ProfileItemProps> = ({ icon, value, aditionalId }) => {
  const { t } = useTranslation();
  const [openAboutSpace, setOpenAboutSpace] = useState(false);
  const [dataItem, setDataItem] = useState(value);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleSave = async (whereToGo: string) => {
    setDataItem(whereToGo);
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
            {`${t('myProfile.myProfilePage.whereIAlwaysWantedToGo.title')}:`}
          </Typography>
          {isUpdated
            ? dataItem && (
                <Typography variant="body2" color="text.secondary">
                  {dataItem}
                </Typography>
              )
            : value && (
                <Typography variant="body2" color="text.secondary">
                  {value}
                </Typography>
              )}
        </Box>
      </Box>
      <AssertModal
        title={''}
        content={
          <FormWhereToGo
            initialWhereToGo={isUpdated ? dataItem || '' : value || ''}
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

export default WhereToGoSection;
