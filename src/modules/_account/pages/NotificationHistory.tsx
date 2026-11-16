
import { MessageItemProps } from '@/components/MessageItem';
import { MessageList } from '@/components/MessageList';
import { PaginationControls } from '@/components/PaginationControls';
import AssertModal from '@/components/AssertModal';
import { usePost } from '@/hooks/api';
import { Box, CircularProgress, Typography, Divider } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { formatDateDdMmYyyy } from '@/common/util/dateFunctions';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;

interface AlertAction {
  actionId: number;
  actionUrl: string;
  actionLabel: string;
  isPrimary: boolean;
}

interface AlertItem {
  notificationId: number;
  title: string;
  messageBody: string;
  createdAt: string;
  tnNotificationActions: AlertAction[];
}

interface AlertPagination {
  totalPageCount: number;
  currentPage: number;
}

interface AlertResponse {
  pagination: AlertPagination;
  data: AlertItem[];
}

const NotificationHistory = () => {
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<MessageItemProps[]>([]);
  const [rawAlerts, setRawAlerts] = useState<AlertItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<AlertItem | null>(null);

  const { mutate: getAlerts } = usePost<AlertResponse>('Alert');

  const { t } = useTranslation();

  const alertsMap = useMemo(() => {
    return rawAlerts.reduce<Record<string, AlertItem>>((acc, item) => {
      acc[item.notificationId.toString()] = item;
      return acc;
    }, {});
  }, [rawAlerts]);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage('');

    getAlerts(
      {
        page,
        pageSize: PAGE_SIZE,
      },
      {
        onSuccess: (response) => {
          const apiData = response?.data ?? [];
          const apiPagination = response?.pagination;
          setRawAlerts(apiData);
          let listMessages: MessageItemProps[] = apiData.map((item:any) => ({
              id: item.notificationId.toString(),
              name: item.title,
              message: item.messageBody,
              date: item.createdAt,
            }));
          setMessages(listMessages);

          setTotalPages(apiPagination?.totalPageCount || 1);
          setPage(apiPagination?.currentPage || page);
          setIsLoading(false);
        },
        onError: (error: any) => {
          setErrorMessage(error?.message || 'No se pudo cargar las notificaciones.');
          setMessages([]);
          setRawAlerts([]);
          setTotalPages(1);
          setIsLoading(false);
        },
      }
    );
  }, [getAlerts, page]);

  const handleView = (id: string) => {
    const selectedAlert = alertsMap[id];
    if (selectedAlert) {
      setSelectedNotification(selectedAlert);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Box py={2}>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      ) : (
        <MessageList messages={messages} onView={handleView} />
      )}

      <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />

      <AssertModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedNotification?.title}
        maxWidthA="sm"
        content={
          selectedNotification && (
            <Box sx={{ py: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedNotification.title}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {t('NotificationHistory.description', { defaultValue: 'Descripción' })}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedNotification.messageBody}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {t('NotificationHistory.date', { defaultValue: 'Fecha' })}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDateDdMmYyyy(selectedNotification.createdAt)}
                  </Typography>
                </Box>

                {selectedNotification.tnNotificationActions && selectedNotification.tnNotificationActions.length > 0 && (
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="textSecondary">
                      {t('NotificationHistory.action', { defaultValue: 'Acción' })}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedNotification.tnNotificationActions[0].actionLabel}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )
        }
      />
    </>
  );
};

export default NotificationHistory;