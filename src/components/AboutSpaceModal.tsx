import theme from '@/themes/theme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDialog from './CustomDialog';

type AboutSpaceModalProps = {
  description: string | undefined;
  open: boolean;
  title?: string;
  onClose: () => void;
};

const AboutSpaceModal = ({ description, open, title, onClose }: AboutSpaceModalProps) => {
  return (
    <CustomDialog
      maxWidth="sm"
      isOpen={open}
      onClose={onClose}
      title={title || 'Acerca de este espacio'}
    >
      <Box>
        <Typography sx={{ fontFamily: theme.typography.paragraph1Regular }} textAlign="justify">
          {description}
        </Typography>
      </Box>
    </CustomDialog>
  );
};

export default AboutSpaceModal;
