import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CustomMapMarker: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: '#333333',
        color: 'white',
        borderRadius: '5px',
        padding: '5px 8px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        fontSize: '0.1rem',
        fontWeight: 'bold',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%) rotate(0deg)',
          width: '15px',
          height: '15px',
          backgroundColor: '#2C2C2B',
          clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
        },
      }}
    >
      <Typography fontSize="0.6rem" component="span" sx={{ color: 'white' }}>
        {text}
      </Typography>
    </Box>
  );
};

export default CustomMapMarker;
