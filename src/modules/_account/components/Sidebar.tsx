import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentsIcon from '@mui/icons-material/Payments';
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import FolderIcon from "@mui/icons-material/Folder";
import ReceiptIcon from '@mui/icons-material/Receipt';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { CurrencyExchange } from '@mui/icons-material';

interface Props {
  selected: string | undefined;
  onSelect: (section: string) => void;
}

const Sidebar: FC<Props> = ({ selected, onSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menu = [
    {
      label: t('accountSettings.personalInformation.title', { defaultValue: "Información personal" }),
      icon: <PersonIcon />,
      value: 'personal',
    },
    { label: t('accountSettings.loginAndSecurity.title', { defaultValue: "Inicio de sesión y seguridad" }), icon: <LockIcon />, value: 'security' },
    { label: t('accountSettings.payments.title', { defaultValue: "Pagos y cobros" }), icon: <PaymentsIcon />, value: 'payments' },
    { label: t('accountSettings.billing.title', { defaultValue: "Facturación" }), icon: <ReceiptIcon />, value: "invoice" },
    { label: t('accountSettings.notificationHistory.title', { defaultValue: "Historial de notificaciones" }), icon: <NotificationsIcon />, value: 'notification' },
    {
      label: t('accountSettings.refundsAndPenalties.title', { defaultValue: "Reembolsos y penalidades" }),
      icon: <CurrencyExchange />,
      value: 'reembolso'
    },
    // { label: "Datos", icon: <FolderIcon />, value: "data" },
  ];

  return (
    <>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('accountSettings.title', { defaultValue: "Configuración de la cuenta" })}
      </Typography>
      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.value}
            selected={selected === item.value}
            onClick={() => {
              onSelect(item.value);
              navigate('/host/info-profile/' + item.value);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

export default Sidebar;
