import AssertModal from '@/components/AssertModal';
import { Box, Typography } from '@mui/material';
import FormStept1 from './FormStept1';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  // onClick?: () => void;
}

const ProfileItemStep1: React.FC<ProfileItemProps> = ({ icon, label, value }) => {
  const [openAboutSpace, setOpenAboutSpace] = useState(false);

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
            {label}
          </Typography>
          {value && (
            <Typography variant="body2" color="text.secondary">
              {value}
            </Typography>
          )}
        </Box>
      </Box>
      <AssertModal
        title={''}
        content={<FormStept1 maxCharacters={30} initialOccupation="Test Tester" />}
        open={openAboutSpace}
        showCloseLeft={false}
        onClose={() => setOpenAboutSpace(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
    </>
  );
};

export default ProfileItemStep1;
