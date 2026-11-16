import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { OverlayView } from '@react-google-maps/api';

const CustomHouseMarker = ({
  position,
  text,
}: {
  position: google.maps.LatLngLiteral;
  text: string;
}) => (
  <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
    <Box
      sx={{
        position: 'absolute',
        transform: text ? 'translate(-50%, -80%)' : 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {text && (
        <Paper
          elevation={3}
          sx={{
            bgcolor: '#3b82f6',
            color: 'white',
            px: 1.5,
            py: 1,
            borderRadius: 2,
            mb: 1,
            position: 'relative',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>
            {text}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #3b82f6',
            }}
          />
        </Paper>
      )}
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          bgcolor: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        <HomeIcon sx={{ color: 'white', fontSize: 22 }} />
      </Box>
    </Box>
  </OverlayView>
);

export default CustomHouseMarker;
