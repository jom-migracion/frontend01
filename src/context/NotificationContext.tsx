import { createContext, useContext, useState, ReactNode } from 'react';
import { Box } from '@mui/material';
import { Notification, NotificationStatus } from '@/components/Notification';

type NotificationContextType = (
  status: NotificationStatus,
  title: string,
  description: string,
  duration?: number
) => void;

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{
    open: boolean;
    status: NotificationStatus;
    title: string;
    description: string;
  } | null>(null);

  const showNotification = (
    status: NotificationStatus,
    title: string,
    description: string,
    duration = 3000
  ) => {
    setNotification({
      open: true,
      status,
      title,
      description,
    });

    // Auto-cerrar después de la duración especificada
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification && notification.open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9999,
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              from: {
                transform: 'translateX(100%)',
                opacity: 0,
              },
              to: {
                transform: 'translateX(0)',
                opacity: 1,
              },
            },
          }}
        >
          <Notification
            status={notification.status}
            title={notification.title}
            description={notification.description}
          />
        </Box>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
