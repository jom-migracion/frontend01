import { Dialog, DialogContent, DialogTitle, Typography, Box, Stack, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface LanguageSelectorDialogMinimalProps {
  open: boolean;
  selectedLanguage: 'es' | 'en';
  onClose: () => void;
  onSelect: (lang: 'es' | 'en') => void;
}

const LanguageSelectorDialogMinimal: React.FC<LanguageSelectorDialogMinimalProps> = ({
  open,
  selectedLanguage,
  onClose,
  onSelect,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            px: 2,
            py: 3,
          },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography fontSize={18} fontWeight={600}>
          Language
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select your preferred language
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} mt={2}>
          {/* Español */}
          <Box
            onClick={() => onSelect('es')}
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 3,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background-color 0.2s ease',
              bgcolor: selectedLanguage === 'es' ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Typography fontSize={20}>🇪🇸</Typography>
              <Box>
                <Typography fontWeight={500}>Español</Typography>
                <Typography variant="body2" color="text.secondary">
                  Spanish
                </Typography>
              </Box>
            </Box>

            {selectedLanguage === 'es' && <CheckIcon fontSize="small" color="primary" />}
          </Box>

          {/* English */}
          <Box
            onClick={() => onSelect('en')}
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 3,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background-color 0.2s ease',
              bgcolor: selectedLanguage === 'en' ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Typography fontSize={20}>🇺🇸</Typography>
              <Box>
                <Typography fontWeight={500}>English</Typography>
                <Typography variant="body2" color="text.secondary">
                  Inglés
                </Typography>
              </Box>
            </Box>

            {selectedLanguage === 'en' && <CheckIcon fontSize="small" color="primary" />}
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 500,
            }}
            onClick={onClose}
          >
            Aceptar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export { LanguageSelectorDialogMinimal };
export default LanguageSelectorDialogMinimal;
