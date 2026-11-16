import React, { useState } from 'react';
import { Box, Typography, Button, useTheme, Drawer, Fab, IconButton } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';

import { usePost } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { useAuthContext } from '@/modules/_auth/context';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import SignInForm from '../SignInForm';
import { useConvertReservationStore } from '@/store/message.store';

interface SidebarProps {
  faqData: any;
  activeSectionId: string;
  sidebarCta: any;
}

const HelpCenterSidebar: React.FC<SidebarProps> = ({ faqData, activeSectionId, sidebarCta }) => {
  const theme = useTheme();
  
  // Estado para el menú
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { isGuestAuthenticated } = useAuthContext();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { mutate: startConversationSupport, isPending } = usePost(
    `/Messaging/Conversations/Support`
  );
  const setStateConversationId = useConvertReservationStore(
    (state: any) => state.setStateConversationId
  );  
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsDrawerOpen(false);
    }
  };

  const handleStartChat = () => {
    if (!isGuestAuthenticated) {
      setIsLoginModalOpen(true);
      setIsDrawerOpen(false);
      return;
    }

    startConversationSupport(
      {
        bookId: 0,
        messageTypeId: 0,
        body: 'Hola, necesito ayuda con... ',
      },
      {
        onSuccess: (onde:any) => {
          const conversationId = onde?.data?.conversationId;
          showSnackbar('Conversación iniciada con soporte JoM', 'success');
            if (conversationId){
              setStateConversationId(conversationId);
            }          
          setIsDrawerOpen(false);
          navigate('/host/messages');
        },
        onError: (error: any) => {
          showSnackbar(
            error?.response?.data?.message || 'Hubo un error al iniciar la conversación con soporte.', 
            'error'
          );
        },
      }
    );
  };

  // --- CONTENIDO DEL MENÚ ---
  const MenuContent = () => (
    <>
      <LoadingThreeDotsJumping open={isPending} modal={true} />

      {Object.keys(faqData).map(key => {
        const data = faqData[key];
        return (
          <Box key={key} sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 1.25, opacity: 0.8 }}>
              {data.label}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {data.groups.map((group: any) => {
                const isActive = activeSectionId === group.id;
                return (
                  <Box
                    key={group.id} component="a" onClick={() => handleScroll(group.id)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.25, p: '7px 10px', borderRadius: '8px',
                      fontSize: '13px', fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                      color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                      bgcolor: isActive ? theme.palette.softHighlight : 'transparent',
                      transition: 'background 0.12s, color 0.12s',
                      '&:hover': { bgcolor: isActive ? theme.palette.softHighlight : '#F3F4F6', color: theme.palette.text.primary }
                    }}
                  >
                    {group.shortTitle || group.title}
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}

      <Box sx={{ bgcolor: theme.palette.softHighlight, border: `1px solid ${theme.palette.primary.main}33`, borderRadius: '16px', p: 2.25, mt: 1, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupportAgentIcon sx={{ fontSize: '18px', color: theme.palette.primary.main }} />
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: theme.palette.text.primary }}>
            {sidebarCta.title}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, lineHeight: 1.5 }}>
          {sidebarCta.subtitle}
        </Typography>

        <Button 
          variant="primary" 
          onClick={handleStartChat}
          disabled={isPending}
          sx={{ height: '36px', fontSize: '12px', mt: 0.5, px: 2, display: 'flex', gap: 1 }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: '14px' }} />
          {sidebarCta.button}
        </Button>
      </Box>
    </>
  );

  return (
    <>
      {/* SIDEBAR */}
      <Box 
        component="aside" 
        sx={{ 
          display: { xs: 'none', lg: 'block' },
          width: '220px', 
          flexShrink: 0, 
          position: 'sticky', 
          top: '88px', 
          maxHeight: 'calc(100vh - 112px)', 
          overflowY: 'auto', 
          pr: 2 
        }}
      >
        <MenuContent />
      </Box>

      {/* BOTÓN FLOTANTE PARA MÓVIL */}
      <Fab 
        color="primary" 
        aria-label="menu" 
        onClick={() => setIsDrawerOpen(true)}
        sx={{ 
          display: { xs: 'flex', lg: 'none' }, 
          position: 'fixed', 
          bottom: 24, 
          left: 24, 
          zIndex: 1000 
        }}
      >
        <MenuOpenIcon />
      </Fab>

      {/* Menú lateral deslizable */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, p: 3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={() => setIsDrawerOpen(false)} sx={{ color: theme.palette.text.secondary }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: 'auto' }}>
          <MenuContent />
        </Box>
      </Drawer>

      {/* MODAL DE LOGIN */}
      <SignInForm
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        typeLogin="login"
      />
    </>
  );
};

export default HelpCenterSidebar;