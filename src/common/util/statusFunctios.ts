import i18next from 'i18next';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

export interface EstadoReserva {
  estado: string;
  color: string;
  bg: string;
  code?: string;
  title: string;
  icon?: React.ElementType;
  iconColor?:
    | 'error'
    | 'inherit'
    | 'disabled'
    | 'info'
    | 'success'
    | 'warning'
    | 'action'
    | 'primary'
    | 'secondary';
  titleHost?: string;
  msgHost?: string;
  titleGuest?: string;
  msgGuest?: string;
}

export const estadoColorReserva = (
  status: string,
  checkin: string,
  checkout: string,
  get?: 'bg' | 'color' | 'estado'
): EstadoReserva | string => {
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const fechaActual = new Date();

  let objetoResultado: EstadoReserva = {
    estado: i18next.t('reservationStatus.unknown'),
    color: '#1D1D1B',
    bg: '#F3F4F6',
    code: 'desconocido',
    title: i18next.t('reservationStatus.reservation'),
  };

  if (status == 'rented' && fechaActual <= checkinDate) {
    objetoResultado = {
      estado: i18next.t('reservationStatus.upcoming'),
      color: '#354357',
      bg: '#efeff0',
      code: 'proximo',
      title: i18next.t('reservationStatus.reservation'),
      icon: CalendarTodayOutlinedIcon,
      iconColor: 'secondary',
      titleHost: 'Pago confirmado',
      msgHost: 'La reserva está confirmada. Coordina los detalles previos al check-in.',
      titleGuest: 'Reserva confirmada',
      msgGuest: 'Tu reserva está confirmada. Coordina detalles con el anfitrión.',
    };
  } else if (status == 'rented' && checkinDate <= fechaActual && checkoutDate >= fechaActual) {
    objetoResultado = {
      estado: i18next.t('reservationStatus.inProgress'),
      color: '#0369A1',
      bg: '#E0F2FE',
      code: 'en_curso',
      title: i18next.t('reservationStatus.reservation'),
      icon: TaskAltOutlinedIcon,
      iconColor: 'info',
      titleHost: 'El huésped está hospedado',
      msgHost:
        'La estadía está activa. Mantente disponible ante cualquier coordinación o incidencia.',
      titleGuest: 'Tu estadía está en curso',
      msgGuest: 'Puedes comunicarte con el anfitrión si necesitas algo durante tu estadía.',
    };
  } else if (status == 'completed') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.completed'),
      color: '#5B55C8',
      bg: '#EFEEFF',
      code: 'finalizada',
      title: i18next.t('reservationStatus.reservation'),
      icon: TaskAltOutlinedIcon,
      iconColor: 'primary',
    };
  } else if (status === 'non_approved') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.rejected'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'no_aprobada',
      title: i18next.t('reservationStatus.request'),
      icon: CancelOutlinedIcon,
      iconColor: 'error',
      titleHost: 'Solicitud rechazada',
      msgHost: 'Esta solicitud ya no está activa.',
      titleGuest: 'Solicitud rechazada',
      msgGuest: 'Esta solicitud ya no está activa.',
    };
  } else if (status == 'closed') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.canceledOrCompleted'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'cerrada',
      title: i18next.t('reservationStatus.request'),
      icon: CancelOutlinedIcon,
      iconColor: 'error',
    };
  } else if (status == 'canceled' || status == 're_canceled') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.canceled'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'cancelada',
      title: i18next.t('reservationStatus.request'),
      icon: CancelOutlinedIcon,
      iconColor: 'error',
      titleHost: 'Solicitud cancelada',
      msgHost: 'Esta solicitud ya no requiere respuesta.',
      titleGuest: 'Cancelaste la solicitud',
      msgGuest: 'La solicitud fue retirada correctamente.',
    };
  } else if (status === 'unavailable') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.unavailable'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'no_disponible',
      title: i18next.t('reservationStatus.request'),
      icon: CancelOutlinedIcon,
      iconColor: 'error',
      titleHost: 'Solicitud no disponible',
      msgHost: 'La solicitud ya no puede continuar por cambios en disponibilidad o condiciones.',
      titleGuest: 'Solicitud no disponible',
      msgGuest: 'El alojamiento ya no está disponible para esta solicitud.',
    };
  } else if (status === 'canceled_assert') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.canceled'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'cancelada',
      title: i18next.t('reservationStatus.request'),
      icon: CancelOutlinedIcon,
      iconColor: 'error',
    };
  } else if (status === 'canceled_payed') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.canceled'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'cancelada',
      title: i18next.t('reservationStatus.reservation'),
      icon: CancelOutlinedIcon,
      iconColor: 'error',
    };
  } else if (status == 'approved') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.processingPayment'),
      color: '#166534',
      bg: '#DCFCE7',
      code: 'procesando_pago',
      title: i18next.t('reservationStatus.request'),
      icon: AccessTimeOutlinedIcon,
      iconColor: 'inherit',
      titleHost: 'Solicitud aprobada',
      msgHost: 'El huésped debe completar el pago para confirmar la reserva.',
      titleGuest: 'Completa el pago',
      msgGuest: 'Paga dentro del plazo para confirmar tu reserva.',
    };
  } else if (status == 're_expired') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.expired'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'expirada',
      title: i18next.t('reservationStatus.request'),
      icon: CancelOutlinedIcon,
      iconColor: 'error',
      titleHost: 'Solicitud expirada',
      msgHost: 'La solicitud expiró porque no fue respondida dentro del plazo.',
      titleGuest: 'La solicitud expiró',
      msgGuest: 'La solicitud expiró porque no fue respondida dentro del plazo.',
    };
  } else if (status == 'book_expired') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.bookExpired'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'pago_expirada',
      title: i18next.t('reservationStatus.reservation'),
      icon: CancelOutlinedIcon,
      iconColor: 'error',
      titleHost: 'Pago expirado',
      msgHost: 'La solicitud aprobada expiró porque el pago no fue completado.',
      titleGuest: 'El pago expiró',
      msgGuest: 'No se completó el pago dentro del plazo establecido.',
    };
  } else if (status == 'prebook') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.pending'),
      color: '#92400E',
      bg: '#FEF3C7',
      code: 'pendiente',
      title: i18next.t('reservationStatus.request'),
      icon: AccessTimeOutlinedIcon,
      iconColor: 'inherit',
      titleHost: 'Tienes una nueva solicitud',
      msgHost: 'Responde la solicitud dentro del plazo establecido.',
      titleGuest: 'Solicitud enviada',
      msgGuest: 'El anfitrión debe responder tu solicitud dentro del plazo establecido.',
    };
  } else if (status == 'review') {
    objetoResultado = {
      estado: i18next.t('reservationStatus.inReview'),
      color: '#991B1B',
      bg: '#FEE2E2',
      code: 'revision',
      title: i18next.t('reservationStatus.reservation'),
      icon: VisibilityOutlinedIcon,
      iconColor: 'error',
    };
  }

  if (get == 'bg') {
    return objetoResultado.bg;
  } else if (get == 'color') {
    return objetoResultado.color;
  } else if (get == 'estado') {
    return objetoResultado.estado;
  } else {
    return objetoResultado;
  }
};
