import { Box, Typography } from '@mui/material';

interface RightPanelProps {
  contenido: React.ReactNode;
}

export const RightPanel = ({ contenido }: RightPanelProps) => {
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderLeft: '1px solid #ccc', 
      // p: 3,
      pt: 3,
      pl: '20px',
      pr: 0,
      pb: 3
    }}>
      {typeof contenido === 'string' ? (
        <Typography>{contenido}</Typography>
      ) : (
        contenido
      )}
    </Box>
  );
};
export default RightPanel;
