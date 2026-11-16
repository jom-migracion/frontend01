import peploSession from '@/assets/profile.png';
import Jom from '@/assets/LogoJOM-MORADO.svg';
import { languages } from '@/common/constants/language';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import NotificationCard from '@/components/NotificationCard';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import useMenuState from '@/hooks/useMenuState';
import useItemState from '@/hooks/userItemState';
import { useAuthContext } from '@/modules/_auth/context';
import { useAuthStore } from '@/store/auth.store';
import { useLang } from '@/store/language.store';
import { useQueryClient } from '@tanstack/react-query';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GrHomeRounded } from 'react-icons/gr';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2';
import { BsBell } from 'react-icons/bs';
import { IoMdHeartEmpty } from 'react-icons/io';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import {
  IoCalendarOutline,
  IoCreateOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPersonAddOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { LuMessageSquareText } from 'react-icons/lu';
import { PiUserLight } from 'react-icons/pi';
import LanguageSelectorDialogMinimal from './LanguageSelectorDialogMinimal';
import { useLocation, useNavigate } from 'react-router';
const SignInForm = React.lazy(() => import('./SignInForm'));
//import { MdPayment } from 'react-icons/md';
// const SignUpForm = React.lazy(() => import('./SignUpForm'));
const SignUpForm2 = React.lazy(() => import('./SignUpForm2'));
import { RestClient } from '@/services/RestClient';
import { useSnackbar } from '@/context/SnackbarContext';
import assertEnv from '@/config/env';
import {
  useListingRentContinueStore,
  usePropertyRegistration,
} from '@/store/listingRentPropertyRegistration.store';
import LoadingThreeDotsJumping from './LoadingThreeDotsJumping';
import { pushToDataLayer } from '@/utilities/analytics';

const Navbar: React.FC = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const { t, i18n } = useTranslation();
  const handleRouteLink = useHandleRouteLink();
  const text = useMediaQuery(theme.breakpoints.up('md'));
  const setLang = useLang((state: any) => state.setLang);
  const lang = useLang((state: any) => state.lang);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(lang);
  const [typeLogin, setTypeLogin] = useState<string>('registration');
  const { isGuestAuthenticated, isHostAuthenticated, logout, changeRole } = useAuthContext();
  const photo = useAuthStore((state) => state.photo);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language] = useState<'es' | 'en'>('es');
  const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any>(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showSnackbar = useSnackbar();
  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNotif(event.currentTarget);
  };
  const handleCloseNotif = () => {
    setAnchorNotif(null);
  };
  const openNotif = Boolean(anchorNotif);

  const clearListingRentIdContinue = useListingRentContinueStore(
    (state) => state.clearListingRentIdContinue
  );
  const resetState = usePropertyRegistration((state) => state.resetState);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleOpenMobileMenu = () => setMobileMenuOpen(true);
  const handleCloseMobileMenu = () => setMobileMenuOpen(false);
  const [isLoadingContinue, setIsLoadingContinue] = useState(false);
  const { identifier } = useAuthStore.getState();

  assertEnv.VITE_BASE_URL;

  const handleRoad = () => {
    if (isHostAuthenticated) {
      handleRouteLink('/host');
      return;
    } else {
      handleRouteLink(AssertRoutes.HOME);
      return;
    }
  };

  const location = useLocation();
  const { anchorEl, handleMenuOpen, handleMenuClose } = useMenuState();

  const handleMouseLeave = () => {
    setTimeout(() => {
      handleMenuClose();
    }, 150); // 150ms de gracia
  };

  const {
    open: openFormAuth,
    handleOpen: handleOpenFormAuth,
    handleClose: handleCloseFormAuth,
  } = useItemState();
  const {
    open: openFormAuthTest,
    handleOpen: handleOpenFormAuthTest,
    handleClose: handleCloseFormAuthTest,
  } = useItemState();

  const {
    anchorEl: translateAnchorEl,
    handleMenuOpen: handleOpenTranslate,
    handleMenuClose: handleCloseTranslate,
  } = useMenuState();

  const handleTranslateMouseLeave = () => {
    handleCloseTranslate();
  };

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    setSelectedLanguage(lng);
    handleCloseTranslate();
  };

  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
      setSelectedLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    if (isGuestAuthenticated || isHostAuthenticated) {
      pushToDataLayer('receive_message');
      getLisintRentInfo();
    }
  }, [isGuestAuthenticated, isHostAuthenticated]);

  const getLisintRentInfo = () => {
    const jsonData = {
      page: 1,
      pageSize: 10,
    };

    RestClient.post('Alert', jsonData).then((x: any) => {
      if (x?.data?.statusCode == '200') {
        setNotifications(x?.data);
      }
    });
  };

  const handleChangeHost = async () => {
    setIsLoadingContinue(true);
    try {
      const responseGetProfile = await RestClient.post('/GetProfile');
      if (responseGetProfile?.data?.statusCode == 200) {
        if (responseGetProfile?.data?.statusCode != '200' && responseGetProfile?.data?.hasError) {
          showSnackbar(
            'Error: ' + responseGetProfile?.data?.resultError?.message?.message || '',
            'error',
            8000
          );
        } else {
          if (responseGetProfile?.data?.data?.isDocumentVerified) {
            changeRole('host');
            pushToDataLayer('host_signup', { user_id: identifier });
            navigate(AssertRoutes.ADMINPANEL);
          } else {
            navigate(AssertRoutes.ACCOUNT_SETTINGS + '?openIdentityVerification=true');
          }
        }
      } else {
        showSnackbar('Error: No es posible cambiar de rol.', 'error', 8000);
      }
    } catch (error) {
      showSnackbar('Error: No es posible cambiar de rol.', 'error', 8000);
    } finally {
      setIsLoadingContinue(false);
    }
  };

  const handleChangeGuest = () => {
    changeRole('guest');
    handleRouteLink(AssertRoutes.HOME);
  };

  const handleMarkAsRead = (id: number) => {
    RestClient.put(`Alert/${id}/MarkAsRead`).then((x: any) => {
      if (x?.status == 200) {
        getLisintRentInfo();
      }
    });
  };

  const handleMarkAllAsRead = () => {
    RestClient.put('Alert/MarkAllAsRead').then(() => {
      getLisintRentInfo();
    });
  };

  const appBarContent = (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#fff',
        top: 0,
        padding: 0,
        paddingTop: 'env(safe-area-inset-top)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: 1100,
      }}
    >
      <Container
        maxWidth={isLargeScreen ? 'xl' : 'lg'}
        disableGutters
        sx={{ px: { xs: 1, sm: 4, md: isLargeScreen ? 4 : 2 } }}
      >
        <Toolbar
          sx={{
            bgcolor: '#fff',
            padding: '0px !important',
          }}
        >
          <Box display="flex" alignItems="flex-start" flexGrow={1}>
            <Box sx={{ cursor: 'pointer' }}>
              {isMobile ? (
                <img onClick={handleRoad} src={Jom} alt="Logo de la empresa" width={60} />
              ) : (
                <img onClick={handleRoad} src={Jom} alt="Logo de la empresa" width={110} />
              )}
            </Box>
          </Box>
          {/* Opciones del Navbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
            {isGuestAuthenticated && (
              <Typography
                onClick={handleChangeHost}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  height: '40px',
                  padding: { xs: '0 8px', sm: '0 14px', md: '0 20px' },
                  borderRadius: '12px',
                  backgroundColor: '#EFEEFF',
                  color: '#5B55C8',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                  fontWeight: 500,
                  transition: 'all 150ms ease-in-out',
                  '&:hover': {
                    backgroundColor: '#F8F9FC',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                {t('navbar.personMenu.becomeHost')}
              </Typography>
            )}
            {isHostAuthenticated &&
              location.pathname != '/host/home-hosting' &&
              location.pathname != '/host/register-start-using' &&
              location.pathname != '/host/register' && (
                <Typography
                  onClick={() => {
                    resetState();
                    clearListingRentIdContinue();
                    handleRouteLink(AssertRoutes.HOSTING);
                  }}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    height: '40px',
                    padding: { xs: '0 8px', sm: '0 14px', md: '0 20px' },
                    borderRadius: '12px',
                    backgroundColor: '#EFEEFF',
                    color: '#5B55C8',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: { xs: '11px', sm: '13px', md: '14px' },
                    fontWeight: 500,
                    transition: 'all 150ms ease-in-out',
                    '&:hover': {
                      backgroundColor: '#F8F9FC',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                  }}
                >
                  {t('navbar.personMenu.create')}
                </Typography>
              )}
            {/* Icono de traducción */}
            <IconButton
              aria-label="Cambiar idioma"
              onClick={handleOpenTranslate}
              sx={{ color: '#6B7280', display: 'flex', alignItems: 'center', m: 0, p: 0 }}
            >
              <LanguageOutlinedIcon sx={{ fontSize: '22px', m: 0, p: 0 }} />
            </IconButton>
            {text && (
              <Typography
                onClick={handleOpenTranslate}
                sx={{ fontSize: '14px', fontWeight: 500, m: 0, p: 0 }}
              >
                {selectedLanguage === 'es' ? '(ES)' : '(US)'}
              </Typography>
            )}
            {/* Menú de idiomas */}
            <Menu
              anchorEl={translateAnchorEl}
              open={Boolean(translateAnchorEl)}
              onClose={handleCloseTranslate}
              slotProps={{
                list: {
                  onMouseLeave: handleTranslateMouseLeave,
                },
              }}
              sx={{
                mr: 4,
                '& .MuiPaper-root': {
                  borderRadius: 4,
                  p: 1,
                  minWidth: 280,
                },
              }}
            >
              {languages.map(({ code, languageKey }) => (
                <MenuItem
                  key={code}
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#1F2937',
                    fontSize: '14px',
                    fontWeight: selectedLanguage === code ? 600 : 400,
                    borderRadius: 2,
                    py: 0.8,
                    my: 0.5,
                    gap: 2,
                    '&:hover': {
                      backgroundColor: '#F8F9FC',
                      borderColor: '#E5E7EB',
                    },
                  }}
                  onClick={() => handleChangeLanguage(code)}
                >
                  <LanguageOutlinedIcon sx={{ fontSize: '22px', color: '#6B7280' }} />
                  <Typography sx={{ fontSize: '14px' }}>{t(languageKey)}</Typography>
                </MenuItem>
              ))}
            </Menu>
            {(isHostAuthenticated || isGuestAuthenticated) && (
              <IconButton
                aria-label="Notificaciones"
                sx={{ color: '#6B7280' }}
                onClick={handleOpenNotif}
              >
                <Badge
                  badgeContent={notifications?.pagination?.totalItemCount || 0}
                  color="primary"
                >
                  <BsBell style={{ fontSize: '22px' }} />
                </Badge>
              </IconButton>
            )}
            {/* Icono de usuario */}
            {(isHostAuthenticated || isGuestAuthenticated) && text && (
              <IconButton
                aria-label="Perfil de usuario"
                onClick={() => {
                  if (isHostAuthenticated) handleRouteLink(AssertRoutes.ACCOUNT_PROFILE);
                  else if (isGuestAuthenticated) handleRouteLink(AssertRoutes.ACCOUNT_PROFILE);
                }}
                sx={{
                  color: theme.palette.customColors.primary[4],
                  border: 'none',
                  hover: { bgcolor: 'transparent' },
                  p: 0,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.customColors.primary[4],
                    border: `1px solid #e2e2e2`,
                    width: 34,
                    height: 34,
                  }}
                >
                  <img src={photo || peploSession} alt="Hi" style={{ width: 34, height: 34 }} />
                </Avatar>
              </IconButton>
            )}
            {!text && (
              <IconButton
                aria-label="Abrir menú móvil"
                onClick={handleOpenMobileMenu}
                sx={{ color: '#6B7280' }}
              >
                <MenuIcon sx={{ fontSize: '22px' }} />
              </IconButton>
            )}
            {text && (
              <IconButton
                aria-label="Abrir menú de opciones"
                onClick={handleMenuOpen}
                sx={{ color: '#6B7280' }}
              >
                <MenuIcon sx={{ fontSize: '22px' }} />
              </IconButton>
            )}
            {/* Menú de usuario */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              slotProps={{
                list: {
                  onMouseLeave: handleMouseLeave,
                },
              }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: 4,
                  p: 1,
                  minWidth: 280,
                },
                '& .MuiMenuItem-root': {
                  backgroundColor: '#ffffff',
                  color: '#1F2937',
                  borderRadius: 2,
                  py: 0.8,
                  my: 0.4,
                  alignItems: 'center',
                  '& > .MuiBox-root': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    flexShrink: 0,
                  },
                  '& svg': {
                    color: '#6B7280',
                  },
                  '&:hover': {
                    backgroundColor: '#F8F9FC',
                    borderColor: '#E5E7EB',
                  },
                },
              }}
            >
              {!(isGuestAuthenticated || isHostAuthenticated) && (
                <MenuItem
                  key={'assert_1_test'}
                  sx={{ gap: 2 }}
                  onClick={() => {
                    handleOpenFormAuthTest();
                  }}
                >
                  <Box>
                    <IoPersonAddOutline size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('navbar.personMenu.register')}
                  </Typography>
                </MenuItem>
              )}
              {!(isGuestAuthenticated || isHostAuthenticated) && (
                <MenuItem
                  key={'assert_2'}
                  sx={{ gap: 2 }}
                  onClick={() => {
                    setTypeLogin('login');
                    handleOpenFormAuth();
                  }}
                >
                  <Box>
                    <IoLogInOutline size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('navbar.personMenu.login')}
                  </Typography>
                </MenuItem>
              )}
              {isGuestAuthenticated && (
                <MenuItem sx={{ gap: 2 }} onClick={() => handleRouteLink(AssertRoutes.WISHLIST)}>
                  <Box>
                    <IoMdHeartEmpty size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular">
                    {t('navbar.personMenu.wishlists')}
                  </Typography>
                </MenuItem>
              )}
              {isGuestAuthenticated && (
                <MenuItem
                  sx={{ gap: 2 }}
                  onClick={() => handleRouteLink(AssertRoutes.GUEST_MESSAGE)}
                >
                  <Box>
                    <LuMessageSquareText size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('navbar.personMenu.message')}
                  </Typography>
                </MenuItem>
              )}
              {isGuestAuthenticated && (
                <MenuItem sx={{ gap: 2 }} onClick={() => handleRouteLink(AssertRoutes.TRAVELS)}>
                  <Box>
                    <IoCalendarOutline size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('navbar.personMenu.travels')}
                  </Typography>
                </MenuItem>
              )}
              {(isGuestAuthenticated || isHostAuthenticated) && (
                <MenuItem
                  sx={{ gap: 2 }}
                  onClick={() => handleRouteLink(AssertRoutes.ACCOUNT_PROFILE)}
                >
                  <Box>
                    <PiUserLight size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('navbar.personMenu.profile')}
                  </Typography>
                </MenuItem>
              )}
              {(isGuestAuthenticated || isHostAuthenticated) && [
                <Divider key="divider-settings" />,
                <MenuItem
                  key="menu-settings"
                  sx={{ gap: 2 }}
                  onClick={() => handleRouteLink(AssertRoutes.ACCOUNT_SETTINGS)}
                >
                  <Box>
                    <IoSettingsOutline size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('navbar.personMenu.configuration')}
                  </Typography>
                </MenuItem>,
              ]}

              {isGuestAuthenticated && (
                <MenuItem sx={{ gap: 2 }} onClick={handleChangeHost}>
                  <Box>
                    <GrHomeRounded size={20} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('commonNames.beHost')}
                  </Typography>
                </MenuItem>
              )}
              {isHostAuthenticated && (
                <MenuItem sx={{ gap: 2 }} onClick={handleChangeGuest}>
                  <Box>
                    <GrHomeRounded size={20} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('commonNames.beGuest')}
                  </Typography>
                </MenuItem>
              )}
              {isHostAuthenticated && (
                <MenuItem
                  sx={{ gap: 2 }}
                  onClick={() => {
                    resetState();
                    clearListingRentIdContinue();
                    handleRouteLink(AssertRoutes.HOSTING);
                  }}
                >
                  <Box>
                    <IoCreateOutline size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('navbar.personMenu.create')}
                  </Typography>
                </MenuItem>
              )}
              <MenuItem sx={{ gap: 2 }} onClick={() => handleRouteLink(AssertRoutes.SUPPORT)}>
                <Box>
                  <HiOutlineQuestionMarkCircle size={22} />
                </Box>
                <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                  {t('navbar.personMenu.helpCenter')}
                </Typography>
              </MenuItem>
              {(isGuestAuthenticated || isHostAuthenticated) && ''}
              {(isGuestAuthenticated || isHostAuthenticated) && [
                <Divider key="divider-logout" />,
                <MenuItem
                  key="menu-logout"
                  sx={{ gap: 2 }}
                  onClick={() => {
                    localStorage.removeItem('host-storage');
                    localStorage.removeItem('userPhoto');
                    logout();
                    queryClient.invalidateQueries({ queryKey: ['listingRent'] });
                    handleRouteLink(AssertRoutes.HOME);
                    handleMenuClose();
                  }}
                >
                  <Box>
                    <IoLogOutOutline size={22} />
                  </Box>
                  <Typography variant="paragraph1SRegular" sx={{ gap: 2 }}>
                    {t('navbar.personMenu.logout')}
                  </Typography>
                </MenuItem>,
              ]}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      {openFormAuth && (
        <React.Suspense fallback={null}>
          <SignInForm open={openFormAuth} onClose={handleCloseFormAuth} typeLogin={typeLogin} />
        </React.Suspense>
      )}
      {openFormAuthTest && (
        <React.Suspense fallback={null}>
          <SignUpForm2
            open={openFormAuthTest}
            onClose={handleCloseFormAuthTest}
            onOpenSignIn={() => {
              handleCloseFormAuthTest();
              setTypeLogin('login');
              handleOpenFormAuth();
            }}
          />
        </React.Suspense>
      )}
    </AppBar>
  );

  return (
    <div style={{ padding: 0 }}>
      {<LoadingThreeDotsJumping open={isLoadingContinue} modal={true} />}
      <LanguageSelectorDialogMinimal
        open={languageOpen}
        selectedLanguage={language}
        onSelect={(lng) => handleChangeLanguage(lng)}
        onClose={() => setLanguageOpen(false)}
      />
      <div id="back-to-top-anchor" />

      {appBarContent}

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: 360,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'white', //theme.palette.primary.main,
              color: 'black',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {(isHostAuthenticated || isGuestAuthenticated) && (
                <Avatar
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.customColors.primary[4],
                    border: `1px solid #e1e1e1`,
                    width: 35,
                    height: 35,
                  }}
                >
                  <img src={photo || peploSession} alt="Hi" style={{ width: 34, height: 34 }} />
                </Avatar>
              )}
              <Box>
                <Typography
                  sx={{
                    fontFamily: theme.typography.body1,
                    ml: isGuestAuthenticated ? '0px' : '10px',
                    fontSize: isGuestAuthenticated ? '12px' : '16px',
                  }}
                >
                  {isGuestAuthenticated || isHostAuthenticated
                    ? JSON.parse(localStorage.getItem('auth-store') || '{}')?.state?.user ||
                      'Usuario'
                    : t('navbar.personMenu.login')}
                </Typography>
              </Box>
            </Box>
            <IconButton aria-label="Cerrar menú" onClick={handleCloseMobileMenu}>
              <CloseIcon style={{ color: 'black' }} />
            </IconButton>
          </Box>

          {/* Contenido del Drawer */}
          <List sx={{ flex: 1, px: 1, py: 2, overflowY: 'auto' }}>
            {/* {isHostAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleRouteLink(`${AssertRoutes.BOOK}/664`);
                    handleCloseMobileMenu();
                  }}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box>
                      <MdPayment size={18} color="#6B7280" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary="Pagos" />
                </ListItemButton>
              </ListItem>
            )} */}

            {!(isGuestAuthenticated || isHostAuthenticated) && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleOpenFormAuthTest();
                      handleCloseMobileMenu();
                    }}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box>
                        <IoPersonAddOutline size={22} color="#6B7280" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={t('navbar.personMenu.register')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setTypeLogin('login');
                      handleOpenFormAuth();
                      handleCloseMobileMenu();
                    }}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box>
                        <IoLogInOutline size={22} color="#6B7280" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={t('navbar.personMenu.login')} />
                  </ListItemButton>
                </ListItem>
                <Divider sx={{ my: 1 }} />
              </>
            )}

            {isGuestAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleRouteLink(AssertRoutes.WISHLIST);
                    handleCloseMobileMenu();
                  }}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box>
                      <IoMdHeartEmpty size={22} color="#6B7280" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.personMenu.wishlists')} />
                </ListItemButton>
              </ListItem>
            )}

            {/* {(isHostAuthenticated || isGuestAuthenticated) && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleRouteLink(AssertRoutes.GUEST_MESSAGE);
                    handleCloseMobileMenu();
                  }}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box>
                      <LuMessageSquareText size={22} color="#6B7280" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.personMenu.message')} />
                </ListItemButton>
              </ListItem>
            )} */}

            {isGuestAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleRouteLink(AssertRoutes.TRAVELS);
                    handleCloseMobileMenu();
                  }}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box>
                      <IoCalendarOutline size={22} color="#6B7280" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={t('commonNames.travels')} />
                </ListItemButton>
              </ListItem>
            )}

            {(isGuestAuthenticated || isHostAuthenticated) && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleRouteLink(AssertRoutes.ACCOUNT_PROFILE);
                      handleCloseMobileMenu();
                    }}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box>
                        <PiUserLight size={22} color="#6B7280" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={t('navbar.personMenu.profile')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleRouteLink(AssertRoutes.ACCOUNT_SETTINGS);
                      handleCloseMobileMenu();
                    }}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box>
                        <IoSettingsOutline size={22} color="#6B7280" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={t('navbar.personMenu.configuration')} />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {isGuestAuthenticated && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleChangeHost();
                      handleCloseMobileMenu();
                    }}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box>
                        <GrHomeRounded size={18} color="#6B7280" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={t('commonNames.beHost')} />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {isHostAuthenticated && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleChangeGuest();
                      handleCloseMobileMenu();
                    }}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box>
                        <GrHomeRounded size={18} color="#6B7280" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={t('commonNames.beGuest')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      resetState();
                      clearListingRentIdContinue();
                      handleRouteLink(AssertRoutes.HOSTING);
                      handleCloseMobileMenu();
                    }}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box>
                        <IoCreateOutline size={22} color="#6B7280" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={t('navbar.personMenu.create')} />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {(isGuestAuthenticated || isHostAuthenticated) && <Divider sx={{ my: 1 }} />}

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleRouteLink(AssertRoutes.SUPPORT);
                  handleCloseMobileMenu();
                }}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box>
                    <HiOutlineQuestionMarkCircle size={22} color="#6B7280" />
                  </Box>
                </ListItemIcon>
                <ListItemText primary={t('navbar.personMenu.helpCenter')} />
              </ListItemButton>
            </ListItem>

            {/* {(isGuestAuthenticated || isHostAuthenticated) && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleRouteLink(AssertRoutes.ASSERT_ADMIN);
                    handleCloseMobileMenu();
                  }}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box>
                      <RiAdminLine size={22} color="#6B7280" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.personMenu.admin')} />
                </ListItemButton>
              </ListItem>
            )} */}
          </List>

          {/* Footer del Drawer */}
          {(isGuestAuthenticated || isHostAuthenticated) && (
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                mt: 'auto',
              }}
            >
              <ListItemButton
                onClick={() => {
                  logout();
                  localStorage.removeItem('userPhoto');
                  queryClient.invalidateQueries({ queryKey: ['listingRent'] });
                  handleRouteLink(AssertRoutes.HOME);
                  handleCloseMobileMenu();
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: 'white',
                  color: 'black',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    color: 'black',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                  <IoLogOutOutline size={22} color="gray" />
                </ListItemIcon>
                <ListItemText primary={t('navbar.personMenu.logout')} />
              </ListItemButton>
            </Box>
          )}
        </Box>
      </Drawer>

      <Popover
        open={openNotif}
        anchorEl={anchorNotif}
        onClose={handleCloseNotif}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 3,
              width: 350,
              maxHeight: 'calc(100vh - 32px)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box p={2} sx={{ maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' }}>
          <NotificationCard
            notifications={notifications?.data || []}
            handleMarkAsRead={handleMarkAsRead}
            handleMarkAllAsRead={handleMarkAllAsRead}
          />
        </Box>
      </Popover>
    </div>
  );
};

export default Navbar;
