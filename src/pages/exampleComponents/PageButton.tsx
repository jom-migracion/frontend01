import { GiShoppingBag } from 'react-icons/gi';
import { HiMiniArrowSmallRight } from 'react-icons/hi2';
import CustomButton from '@/components/CustomButton';
import { useTheme } from '@mui/material';

const PageButton = () => {
 const theme = useTheme();
  return (
    <>
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Reserva'
        size='medium'
        variant='text'
        endIcon={
          <GiShoppingBag
            style={{
              fill: 'black', // Sin relleno
              stroke: 'whitesmoke', // Borde azul
              strokeWidth: '20px', // Grosor del borde
            }}
          />
        }
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Reserva'
        size='medium'
        variant='outlined'
        endIcon={
          <GiShoppingBag
            style={{
              fill: 'black', // Sin relleno
              stroke: 'whitesmoke', // Borde azul
              strokeWidth: '20px', // Grosor del borde
            }}
          />
        }
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Reserva'
        backgroundColor={theme.palette.primary.main}
        textColor={theme.palette.primary.contrastText}
        hoverColor={theme.palette.primary.light}
        size='medium'
        endIcon={
          <GiShoppingBag
            style={{
              fill: 'transparent', // Sin relleno
              stroke: 'whitesmoke', // Borde azul
              strokeWidth: '20px', // Grosor del borde
            }}
          />
        }
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Registrate'
        variant='text'
        size='medium'
        width={'400px'}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Registrate'
        size='medium'
        variant='outlined'
        width={'400px'}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Registrate'
        backgroundColor={theme.palette.primary.main}
        textColor={theme.palette.primary.contrastText}
        hoverColor={theme.palette.primary.light}
        size='medium'
        width={'400px'}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Comenzar'
        size='medium'
        variant='text'
        endIcon={
          <HiMiniArrowSmallRight
            style={{
              color: 'black',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          />
        }
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Comenzar'
        size='medium'
        variant='outlined'
        endIcon={
          <HiMiniArrowSmallRight
            style={{
              color: 'black',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          />
        }
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Comenzar'
        backgroundColor={theme.palette.primary.main}
        textColor={theme.palette.primary.contrastText}
        hoverColor={theme.palette.primary.light}
        size='medium'
        endIcon={
          <HiMiniArrowSmallRight style={{ color: 'white', fontSize: '1.5rem', fontWeight: 600 }} />
        }
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Siguiente'
        borderRadius={20}
        variant='text'
        width='150px'
        fullWidth={false}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Siguiente'
        borderRadius={20}
        variant='outlined'
        width='150px'
        fullWidth={false}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Siguiente'
        backgroundColor={theme.palette.primary.main}
        textColor={theme.palette.primary.contrastText}
        hoverColor={theme.palette.primary.light}
        borderRadius={20}
        variant='contained'
        width='150px'
        fullWidth={false}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Cancelar'
        color='secondary'
        borderRadius={20}
        variant='text'
        width='150px'
        fullWidth={false}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Cancelar'
        color='secondary'
        borderRadius={20}
        variant='outlined'
        width='150px'
        fullWidth={false}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Cancelar'
        color='secondary'
        borderRadius={20}
        variant='contained'
        width='150px'
        fullWidth={false}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Cancelar'
        backgroundColor={theme.palette.primary.light}
        textColor={theme.palette.primary.main}
        borderRadius={20}
        variant='contained'
        width='150px'
        fullWidth={false}
      />
      <div style={{ marginBottom: '20px' }}></div>
      <CustomButton
        label='Ver más'
        color='secondary'
        borderRadius={20}
        size='medium'
        variant='outlined'
        width='150px'
        border={`2px solid ${theme.palette.customSecondary.secondary3}`}
      />
    </>
  );
};

export default PageButton;
