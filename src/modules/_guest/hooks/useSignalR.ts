import { useEffect, useState, useCallback } from 'react';
import { signalRService, Notification } from '@/services/SignalRService';

export const useSignalR = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<string>('Desconectado');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Registrar callbacks
    signalRService.setOnNotificationReceived((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    signalRService.setOnUnreadCountUpdate((count) => {
      setUnreadCount(count);
    });

    signalRService.setOnConnectionStatusChange((status) => {
      setConnectionStatus(status);
      setIsConnected(status === 'Conectado');
    });

    // Conectar automáticamente
    signalRService.connect();

    return () => {
      signalRService.disconnect();
    };
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    await signalRService.markNotificationAsRead(notificationId);
    
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, isRead: true } : n
      )
    );
    
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount,
    connectionStatus,
    isConnected,
    markAsRead,
    clearNotifications,
  };
};