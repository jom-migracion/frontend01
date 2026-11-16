// import { createContext, useContext, useState, ReactNode, SyntheticEvent } from 'react';
// import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
// import { Alert } from '@mui/material';
// import Slide, { SlideProps } from '@mui/material/Slide';
// import { useTranslation } from 'react-i18next';

// type SnackbarContextType = (
//   message: string | undefined,
//   severity?: 'error' | 'info' | 'success' | 'warning',
//   duration?: number
// ) => void;

// const SnackbarContext = createContext<SnackbarContextType | null>(null);

// function SlideTransition(props: SlideProps) {
//   return <Slide {...props} direction="left" />;
// }

// export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: 'error' | 'info' | 'success' | 'warning';
//     duration: number;
//   }>({
//     open: false,
//     message: '',
//     severity: 'success',
//     duration: 2000,
//   });

//   const { t } = useTranslation();

//   const showSnackbar = (
//     message = '',
//     severity: 'error' | 'info' | 'success' | 'warning' = 'success',
//     duration = 2000
//   ) => {
//     if (!message) return;

//     let finalMessage = message;
//     // Lógica de traducción
//     switch (message) {
//       case 'save':
//         finalMessage = t('commonNames.saveRecord');
//         break;
//       case 'update':
//         finalMessage = t('commonNames.updateRecord');
//         break;
//       case 'delete':
//         finalMessage = t('commonNames.deleteRecord');
//         break;
//       default:
//         break;
//     }

//     setSnackbar({
//       open: true,
//       message: finalMessage,
//       severity,
//       duration,
//     });
//   };

//   const handleClose = (_: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
//     if (reason === 'clickaway') return;
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   return (
//     <SnackbarContext.Provider value={showSnackbar}>
//       {children}
//       <Snackbar
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         open={snackbar.open}
//         onClose={handleClose}
//         autoHideDuration={snackbar.duration}
//         TransitionComponent={SlideTransition}
//       >
//         <Alert
//           onClose={handleClose}
//           severity={snackbar.severity}
//           variant="filled"
//           elevation={6}
//           sx={{
//             color: 'white',
//             width: '100%',
//             minWidth: '300px',
//             backdropFilter: 'blur(10px)',
//             //  opacity: 0.9,
//             boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
//             borderRadius: '12px',
//             position: 'relative',
//             '& .MuiAlert-icon': { fontSize: '1.5rem' },
//             '& .MuiAlert-message': { padding: '8px 0', fontSize: '0.9rem' },
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </SnackbarContext.Provider>
//   );
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useSnackbar = () => {
//   const context = useContext(SnackbarContext);
//   if (!context) {
//     throw new Error('useSnackbar debe usarse dentro de un SnackbarProvider');
//   }
//   return context;
// };

// SnackbarProvider.tsx
import { createContext, useContext, useState, ReactNode, SyntheticEvent } from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Alert, AlertProps, keyframes, styled } from '@mui/material';
import Slide, { SlideProps } from '@mui/material/Slide';
import { useTranslation } from 'react-i18next';

/* ---------- 1. Animación “sube-baja” solo para error ---------- */
const shake = keyframes`
  0%   { transform: translateY(0); }
  25%  { transform: translateY(-4px); }
  50%  { transform: translateY(4px); }
  75%  { transform: translateY(-2px); }
  100% { transform: translateY(0); }
`;

const ShakeWrapper = styled('div')<{ isError: boolean }>(({ isError }) => ({
  width: '100%',
  animation: isError ? `${shake} 0.25s ease-in-out` : 'none',
}));

const ShakeAlert = (props: AlertProps) => (
  <ShakeWrapper isError={props.severity === 'error'}>
    <Alert {...props} />
  </ShakeWrapper>
);

/* ---------- 2. Contexto ---------- */
type SnackbarContextType = (
  message?: string,
  severity?: 'error' | 'info' | 'success' | 'warning',
  duration?: number
) => void;

const SnackbarContext = createContext<SnackbarContextType | null>(null);

/* ---------- 3. Transición slide (sin cambios) ---------- */
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

/* ---------- 4. Provider ---------- */
export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'info' | 'success' | 'warning';
    duration: number;
  }>({
    open: false,
    message: '',
    severity: 'success',
    duration: 2000,
  });

  const { t } = useTranslation();

  const showSnackbar: SnackbarContextType = (
    message = '',
    severity = 'success',
    duration = 2000
  ) => {
    if (!message) return;

    let finalMessage = message;
    switch (message) {
      case 'save':
        finalMessage = t('commonNames.saveRecord');
        break;
      case 'update':
        finalMessage = t('commonNames.updateRecord');
        break;
      case 'delete':
        finalMessage = t('commonNames.deleteRecord');
        break;
      default:
        break;
    }

    setSnackbar({ open: true, message: finalMessage, severity, duration });
  };

  const handleClose = (_: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbar.open}
        onClose={handleClose}
        autoHideDuration={snackbar.duration}
        TransitionComponent={SlideTransition}
      >
        <ShakeAlert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{
            color: 'white',
            width: '100%',
            minWidth: '300px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            position: 'relative',
            '& .MuiAlert-icon': { fontSize: '1.5rem' },
            '& .MuiAlert-message': { padding: '8px 0', fontSize: '0.9rem' },
          }}
        >
          {snackbar.message}
        </ShakeAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

/* ---------- 5. Hook ---------- */
export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar debe usarse dentro de SnackbarProvider');
  return ctx;
};
