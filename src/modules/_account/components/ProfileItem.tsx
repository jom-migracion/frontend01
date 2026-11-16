import { Box, Typography } from "@mui/material";

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value, onClick }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      py: 1,
      borderBottom: '1px solid #000',
      // '&:last-child': { borderBottom: 'none' },
    }}
    onClick={onClick}
  >
    <Box sx={{ minWidth: '32px', display: 'flex', alignItems: 'center' }}>
      {icon}
    </Box>
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
);

export default ProfileItem;