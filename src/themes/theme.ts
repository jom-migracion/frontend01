import { createTheme, type PaletteColor, type PaletteColorOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    lights: Palette['primary'];
    brandLilac: PaletteColor;
    softHighlight: string;
    neutralBorder: string;
    gradients: {
      primary: string;
    };
    customColors: {
      primary: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
      };
      secondary: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
      };
      lights: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
      };
      success: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
      };
      warning: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
      };
      error: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
      };
    };
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    brandLilac?: PaletteColorOptions;
    softHighlight?: string;
    neutralBorder?: string;
    gradients?: {
      primary?: string;
    };
    customColors?: {
      primary?: {
        1?: string;
        2?: string;
        3?: string;
        4?: string;
        5?: string;
        6?: string;
        7?: string;
      };
      secondary?: {
        1?: string;
        2?: string;
        3?: string;
        4?: string;
        5?: string;
        6?: string;
        7?: string;
      };
      lights?: {
        1?: string;
        2?: string;
        3?: string;
        4?: string;
        5?: string;
        6?: string;
        7?: string;
      };
      success?: {
        1?: string;
        2?: string;
        3?: string;
        4?: string;
        5?: string;
        6?: string;
        7?: string;
      };
      warning?: {
        1?: string;
        2?: string;
        3?: string;
        4?: string;
        5?: string;
        6?: string;
        7?: string;
      };
      error?: {
        1?: string;
        2?: string;
        3?: string;
        4?: string;
        5?: string;
        6?: string;
        7?: string;
      };
    };
  }

  interface TypographyVariants {
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;

    h1Bold: React.CSSProperties;
    h1Medium: React.CSSProperties;
    h1Regular: React.CSSProperties;

    h1SBold: React.CSSProperties;
    h1SMedium: React.CSSProperties;
    h1SRegular: React.CSSProperties;

    h2Bold: React.CSSProperties;
    h2Medium: React.CSSProperties;
    h2Regular: React.CSSProperties;

    h2SBold: React.CSSProperties;
    h2SMedium: React.CSSProperties;
    h2SRegular: React.CSSProperties;

    h3Bold: React.CSSProperties;
    h3Medium: React.CSSProperties;
    h3Regular: React.CSSProperties;

    h3SBold: React.CSSProperties;
    h3SMedium: React.CSSProperties;
    h3SRegular: React.CSSProperties;

    h4Bold: React.CSSProperties;
    h4Medium: React.CSSProperties;
    h4Regular: React.CSSProperties;

    h4SBold: React.CSSProperties;
    h4SMedium: React.CSSProperties;
    h4SRegular: React.CSSProperties;

    h5Bold: React.CSSProperties;
    h5Medium: React.CSSProperties;
    h5Regular: React.CSSProperties;

    h5SBold: React.CSSProperties;
    h5SMedium: React.CSSProperties;
    h5SRegular: React.CSSProperties;

    h6Bold: React.CSSProperties;
    h6Medium: React.CSSProperties;
    h6Regular: React.CSSProperties;

    h6SBold: React.CSSProperties;
    h6SMedium: React.CSSProperties;
    h6SRegular: React.CSSProperties;

    paragraph1Bold: React.CSSProperties;
    paragraph1Medium: React.CSSProperties;
    paragraph1Regular: React.CSSProperties;

    paragraph1SBold: React.CSSProperties;
    paragraph1SMedium: React.CSSProperties;
    paragraph1SRegular: React.CSSProperties;

    small1Bold: React.CSSProperties;
    small1Medium: React.CSSProperties;
    small1Regular: React.CSSProperties;

    small1SBold: React.CSSProperties;
    small1SMedium: React.CSSProperties;
    small1SRegular: React.CSSProperties;

    small2Bold: React.CSSProperties;
    small2Medium: React.CSSProperties;
    small2Regular: React.CSSProperties;

    small2SBold: React.CSSProperties;
    small2SMedium: React.CSSProperties;
    small2SRegular: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    h1Bold?: React.CSSProperties;
    h1Medium?: React.CSSProperties;
    h1Regular?: React.CSSProperties;

    h1SBold?: React.CSSProperties;
    h1SMedium?: React.CSSProperties;
    h1SRegular?: React.CSSProperties;

    h2Bold?: React.CSSProperties;
    h2Medium?: React.CSSProperties;
    h2Regular?: React.CSSProperties;

    h2SBold?: React.CSSProperties;
    h2SMedium?: React.CSSProperties;
    h2SRegular?: React.CSSProperties;

    h3Bold?: React.CSSProperties;
    h3Medium?: React.CSSProperties;
    h3Regular?: React.CSSProperties;

    h3SBold?: React.CSSProperties;
    h3SMedium?: React.CSSProperties;
    h3SRegular?: React.CSSProperties;

    h4Bold?: React.CSSProperties;
    h4Medium?: React.CSSProperties;
    h4Regular?: React.CSSProperties;

    h4SBold?: React.CSSProperties;
    h4SMedium?: React.CSSProperties;
    h4SRegular?: React.CSSProperties;

    h5Bold?: React.CSSProperties;
    h5Medium?: React.CSSProperties;
    h5Regular?: React.CSSProperties;

    h5SBold?: React.CSSProperties;
    h5SMedium?: React.CSSProperties;
    h5SRegular?: React.CSSProperties;

    h6Bold?: React.CSSProperties;
    h6Medium?: React.CSSProperties;
    h6Regular?: React.CSSProperties;

    h6SBold?: React.CSSProperties;
    h6SMedium?: React.CSSProperties;
    h6SRegular?: React.CSSProperties;

    paragraph1Bold?: React.CSSProperties;
    paragraph1Medium?: React.CSSProperties;
    paragraph1Regular?: React.CSSProperties;

    paragraph1SBold?: React.CSSProperties;
    paragraph1SMedium?: React.CSSProperties;
    paragraph1SRegular?: React.CSSProperties;

    small1Bold?: React.CSSProperties;
    small1Medium?: React.CSSProperties;
    small1Regular?: React.CSSProperties;

    small1SBold?: React.CSSProperties;
    small1SMedium?: React.CSSProperties;
    small1SRegular?: React.CSSProperties;

    small2Bold?: React.CSSProperties;
    small2Medium?: React.CSSProperties;
    small2Regular?: React.CSSProperties;

    small2SBold?: React.CSSProperties;
    small2SMedium?: React.CSSProperties;
    small2SRegular?: React.CSSProperties;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    lights: true;
    brandLilac: true;
  }
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    error: true;
    premium: true;
    gradient: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1Bold: true;
    h1Medium: true;
    h1Regular: true;

    h1SBold: true;
    h1SMedium: true;
    h1SRegular: true;

    h2Bold: true;
    h2Medium: true;
    h2Regular: true;

    h2SBold: true;
    h2SMedium: true;
    h2SRegular: true;

    h3Bold: true;
    h3Medium: true;
    h3Regular: true;

    h3SBold: true;
    h3SMedium: true;
    h3SRegular: true;

    h4Bold: true;
    h4Medium: true;
    h4Regular: true;

    h4SBold: true;
    h4SMedium: true;
    h4SRegular: true;

    h5Bold: true;
    h5Medium: true;
    h5Regular: true;

    h5SBold: true;
    h5SMedium: true;
    h5SRegular: true;

    h6Bold: true;
    h6Medium: true;
    h6Regular: true;

    h6SBold: true;
    h6SMedium: true;
    h6SRegular: true;

    paragraph1Bold: true;
    paragraph1Medium: true;
    paragraph1Regular: true;

    paragraph1SBold: true;
    paragraph1SMedium: true;
    paragraph1SRegular: true;

    small1Bold: true;
    small1Medium: true;
    small1Regular: true;

    small1SBold: true;
    small1SMedium: true;
    small1SRegular: true;

    small2Bold: true;
    small2Medium: true;
    small2Regular: true;

    small2SBold: true;
    small2SMedium: true;
    small2SRegular: true;
  }
}

// const liftedShadow = '0 8px 16px 0 rgba(0,0,0,0.12)';
// const niceEase = 'cubic-bezier(0.35, 1.55, 0.65, 1)';
// const softShadow = '0 2px 4px 0 rgba(0,0,0,0.08)';
// const smoothTransition =
//   'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease';
// const transformTransition = `transform .35s ${niceEase}`;

export const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            height: 44,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
             '&:hover fieldset': {        // ← Agrega esto
              borderColor: '#e0e0e0',    // ← Mismo color que el estado normal
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
            '&.MuiInputBase-multiline': {
              height: 'auto',
              padding: '12px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#616161',
            '&.Mui-focused': {
              color: '#1976d2',
            },
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'primary' },
          style: ({ theme }) => ({
            backgroundColor: '#5B55C8',
            color: '#FFFFFF',
            margin: 0,
            padding: '0px 16px',
            height: 48,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            textTransform: 'none',
            // boxShadow: softShadow,
            // transition: `${smoothTransition}, ${transformTransition}`,
            // transform: "translateY(0) scale(1)",
            '&:hover': {
              backgroundColor: '#4A45B0',
              // boxShadow: softShadow,
              // transform: "translateY(-4px) scale(1.02)",
            },
            '&:active': {
              backgroundColor: '#4A45B0',
              // boxShadow: softShadow,
            },
            '&:disabled': {
              backgroundColor: '#E5E7EB',
              color: '#9CA3AF',
              boxShadow: 'none',
            },
            [theme.breakpoints.down('sm')]: {
                height: 38,
                fontSize: 12,
              borderRadius: 8,
              //px: 2,
              '& .MuiButton-startIcon': {
                mr: 0,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              '& .MuiButton-endIcon': {
                ml: 0,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              transform: 'translateY(-2px) scale(1.01)',
            },
          }),
        },
        {
          props: { variant: 'secondary' },
          style: ({ theme }) => ({
            backgroundColor: '#ffffff',
            color: '#1F2937',
            margin: 0,
            padding: '0px 16px',
            height: 48,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            textTransform: 'none',
            border: '1px solid #E5E7EB',
            // boxShadow: softShadow,
            // transition: `${smoothTransition}, ${transformTransition}`,
            // transform: 'translateY(0) scale(1)',
            '&:hover': {
              backgroundColor: '#F8F9FC',
              borderColor: '#E5E7EB',
             // boxShadow: softShadow,
             // transform: 'translateY(-4px) scale(1.02)',
            },
            '&:active': {
              backgroundColor: '#F8F9FC',
              borderColor: '#E5E7EB',
             // boxShadow: softShadow,
            },
            '&:disabled': {
              backgroundColor: '#E5E7EB',
              color: '#9CA3AF',
              boxShadow: 'none',
            },
            [theme.breakpoints.down('sm')]: {
              height: 38,
              fontSize: 12,
              borderRadius: 8,
              px: 2,
              '& .MuiButton-startIcon': {
                mr: 0,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              '& .MuiButton-endIcon': {
                ml: 2,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              transform: 'translateY(-2px) scale(1.01)',
            },
          }),
        },
        {
          props: { variant: 'error' },
          style: ({ theme }) => ({
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            margin: 0,
            padding: '0px 16px',
            height: 48,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            textTransform: 'none',
            //boxShadow: softShadow,
            //transition: `${smoothTransition}, ${transformTransition}`,
            //transform: 'translateY(0) scale(1)',
            '&:hover': {
              backgroundColor: '#B91C1C',
              //boxShadow: softShadow,
              //transform: 'translateY(-4px) scale(1.02)',
            },
            '&:active': {
              backgroundColor: '#DC2626',
             // boxShadow: softShadow,
            },
            '&:disabled': {
              backgroundColor: '#E5E7EB',
              color: '#9CA3AF',
              boxShadow: 'none',
            },
            [theme.breakpoints.down('sm')]: {
              height: 38,
              fontSize: 12,
              borderRadius: 8,
              px: 2,
              '& .MuiButton-startIcon': {
                mr: 0,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              '& .MuiButton-endIcon': {
                ml: 2,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              transform: 'translateY(-2px) scale(1.01)',
            },
          }),
        },
        {
          props: { variant: 'gradient' },
          style: ({ theme }) => ({
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#FFFFFF',
            margin: 0,
            padding: '0px 16px',
            height: 48,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            textTransform: 'none',
          //  boxShadow: softShadow,
          //  transform: 'translateY(0) scale(1)',
          //  transition: `${smoothTransition}, ${transformTransition}`,
            '&:hover': {
              /* puedes oscurecer un poco el gradiente o dejarlo igual */
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)',
          //    boxShadow: liftedShadow,
          //    transform: 'translateY(-4px) scale(1.02)',
            },
            '&:active': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)',
          //    boxShadow: softShadow,
          //    transform: 'translateY(0) scale(1)',
            },
            '&:disabled': {
              backgroundColor: '#E5E7EB',
              color: '#9CA3AF',
              boxShadow: 'none',
            },
            [theme.breakpoints.down('sm')]: {
              height: 38,
              fontSize: 12,
              borderRadius: 8,
              with: 'auto',
              px: 2,
              '& .MuiButton-startIcon': {
                mr: 0,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              '& .MuiButton-endIcon': {
                ml: 2,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              transform: 'translateY(-2px) scale(1.01)',
            },
          }),
        },

        /* ---------- PREMIUM ---------- */
        {
          props: { variant: 'premium' },
          style: ({ theme }) => ({
            backgroundColor: '#FFD700',
            color: '#ffffff',
            margin: 0,
            padding: '0px 16px',
            height: 48,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            textTransform: 'none',
          //  boxShadow: softShadow,
          //  transition: `${smoothTransition}, ${transformTransition}`,
          //  transform: 'translateY(0) scale(1)',
            '&:hover': {
              backgroundColor: '#FACC15',
            //  boxShadow: softShadow,
            //  transform: 'translateY(-4px) scale(1.02)',
            },
            '&:active': {
              backgroundColor: '#FACC15',
            //  boxShadow: softShadow,
            },
            '&:disabled': {
              backgroundColor: '#E5E7EB',
              color: '#9CA3AF',
              boxShadow: 'none',
            },
            [theme.breakpoints.down('sm')]: {
              height: 38,
              fontSize: 12,
              borderRadius: 8,
              px: 2,
              '& .MuiButton-startIcon': {
                mr: 0,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              '& .MuiButton-endIcon': {
                ml: 2,
                '& .MuiSvgIcon-root': { fontSize: 14 },
              },
              transform: 'translateY(-2px) scale(1.01)',
            },
          }),
        },
      ],
    },
  },

  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#5B55C8',
      dark: '#4A45B0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C3BDE0',
    },
    lights: {
      main: '#DADADA',
    },
    success: {
      main: '#66BB6A',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFA500',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
    background: {
      default: '#F8F9FC',
      paper: '#FFFFFF',
    },
    divider: '#E5E7EB',
    brandLilac: {
      main: '#5A4B9E',
      contrastText: '#FFFFFF',
    },
    softHighlight: '#EFEEFF',
    neutralBorder: '#E5E7EB',
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },

    // paleta customColors
    customColors: {
      primary: {
        1: '#5B4CA0',
        2: '#50438C',
        3: '#443978',
        4: '#393064',
        5: '#6C5CB2',
        6: '#b3a3bd',
        7: '#efeeff',
      },
      secondary: {
        1: '#C3BDE0',
        2: '#D2CDE7',
        3: '#E1DEEF',
        4: '#F0EEF7',
        5: '#B4ACD8',
        6: '#A59CD0',
        7: '#968BC8',
      },
      lights: {
        1: '#DADADA',
        2: '#E3E3E3',
        3: '#EDEDED',
        4: '#FFFFFF',
        5: '#B6B6B6',
        6: '#919191',
        7: '#2C2C2B',
      },
      success: {
        1: '#74c791',
        2: '#9fd8b0',
        3: '#c3e6cd',
        4: '#c3e6cd',
        5: '#4caf75',
        6: '#3f9a66',
        7: '#327b52',
      },
      warning: {
        1: '#ffb74d',
        2: '#ffd180',
        3: '#ffe8b2',
        4: '#fff8e1',
        5: '#ffa000',
        6: '#fb8c00',
        7: '#ef6c00',
      },
      error: {
        1: '#f1736a',
        2: '#f6a8a3',
        3: '#facdca',
        4: '#fdecea',
        5: '#c62828',
        6: '#c62828',
        7: '#c62828',
      },
    },
  } as any,

  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,

    h1: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '10px',
      fontWeight: 700,
      lineHeight: 1,
    },
    allVariants: {
      color: '#1F2937',
    },

    // Tipografías personalizadas del theme.ts original
    // h1
    h1Bold: {
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '56px',
    },
    h1Medium: {
      fontWeight: 500,
      fontSize: '48px',
      lineHeight: '56px',
    },
    h1Regular: {
      fontWeight: 400,
      fontSize: '48px',
      lineHeight: '56px',
    },

    h1SBold: {
      fontWeight: 700,
      fontSize: '36px',
      lineHeight: '44px',
    },
    h1SMedium: {
      fontWeight: 500,
      fontSize: '36px',
      lineHeight: '44px',
    },
    h1SRegular: {
      fontWeight: 400,
      fontSize: '36px',
      lineHeight: '44px',
    },

    // h2
    h2Bold: {
      fontWeight: 700,
      fontSize: '36px',
      lineHeight: '44px',
    },
    h2Medium: {
      fontWeight: 500,
      fontSize: '36px',
      lineHeight: '44px',
    },
    h2Regular: {
      fontWeight: 400,
      fontSize: '36px',
      lineHeight: '44px',
    },

    h2SBold: {
      fontWeight: 700,
      fontSize: '28px',
      lineHeight: '36px',
    },
    h2SMedium: {
      fontWeight: 500,
      fontSize: '28px',
      lineHeight: '36px',
    },
    h2SRegular: {
      fontWeight: 400,
      fontSize: '28px',
      lineHeight: '36px',
    },

    // h3
    h3Bold: {
      fontWeight: 700,
      fontSize: '28px',
      lineHeight: '36px',
    },
    h3Medium: {
      fontWeight: 500,
      fontSize: '28px',
      lineHeight: '36px',
    },
    h3Regular: {
      fontWeight: 400,
      fontSize: '28px',
      lineHeight: '36px',
    },

    h3SBold: {
      fontWeight: 700,
      fontSize: '22px',
      lineHeight: '30px',
    },
    h3SMedium: {
      fontWeight: 500,
      fontSize: '22px',
      lineHeight: '30px',
    },
    h3SRegular: {
      fontWeight: 400,
      fontSize: '22px',
      lineHeight: '30px',
    },

    // h4
    h4Bold: {
      fontWeight: 700,
      fontSize: '22px',
      lineHeight: '30px',
    },
    h4Medium: {
      fontWeight: 500,
      fontSize: '22px',
      lineHeight: '30px',
    },
    h4Regular: {
      fontWeight: 400,
      fontSize: '22px',
      lineHeight: '30px',
    },

    h4SBold: {
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: '26px',
    },
    h4SMedium: {
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '26px',
    },
    h4SRegular: {
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: '26px',
    },

    // h5
    h5Bold: {
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: '26px',
    },
    h5Medium: {
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '26px',
    },
    h5Regular: {
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: '26px',
    },

    h5SBold: {
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '24px',
    },
    h5SMedium: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
    },
    h5SRegular: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px',
    },

    // h6
    h6Bold: {
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '24px',
    },
    h6Medium: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
    },
    h6Regular: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px',
    },

    h6SBold: {
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '22px',
    },
    h6SMedium: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '22px',
    },
    h6SRegular: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '22px',
    },

    // paragraph1
    paragraph1Bold: {
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '24px',
    },
    paragraph1Medium: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
    },
    paragraph1Regular: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px',
    },

    paragraph1SBold: {
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '22px',
    },
    paragraph1SMedium: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '22px',
    },
    paragraph1SRegular: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '22px',
    },

    // small
    small1Bold: {
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: '18px',
    },
    small1Medium: {
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '18px',
    },
    small1Regular: {
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '18px',
    },

    small1SBold: {
      fontWeight: 700,
      fontSize: '10px',
      lineHeight: '16px',
    },
    small1SMedium: {
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '16px',
    },
    small1SRegular: {
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: '16px',
    },

    // small2
    small2Bold: {
      fontWeight: 700,
      fontSize: '10px',
      lineHeight: '16px',
    },
    small2Medium: {
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '16px',
    },
    small2Regular: {
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: '16px',
    },

    small2SBold: {
      fontWeight: 700,
      fontSize: '10px',
      lineHeight: 'auto',
    },
    small2SMedium: {
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: 'auto',
    },
    small2SRegular: {
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: 'auto',
    },
  } as any,
});

export default theme;
