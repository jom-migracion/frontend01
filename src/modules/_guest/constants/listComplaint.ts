export type ListOption = {
  id: string;
  primaryText: string;
  secondaryText?: string;
  nextViewId?: string;
};

export type ModalView = {
  id: string;
  title: string;
  options: ListOption[];
};

export const VIEWS: Record<string, ModalView> = {
  main: {
    id: 'main',
    title: '¿Qué está pasando?',
    options: [
      { id: 'fraude', primaryText: 'Creo que se trata de fraude o de una estafa', nextViewId: 'fraude_sub' },
      { id: 'insultante', primaryText: 'Su comportamiento es insultante', nextViewId: 'final' },
      { id: 'otra_cosa', primaryText: 'Otra cosa', nextViewId: 'final' },
    ],
  },
  fraude_sub: {
    id: 'fraude_sub',
    title: '¿Qué está pasando?',
    options: [
      { id: 'pago_fuera', primaryText: 'Me pidieron que realice el pago fuera de la plataforma', secondaryText: 'Por ejemplo: depósitos bancarios, pago en efectivo', nextViewId: 'final' },
      { id: 'comunicacion_fuera', primaryText: 'Me pidió que nos comunicáramos fuera de la plataforma de Assert', secondaryText: 'Por ejemplo: correo electrónico, teléfono o aplicación de mensajería', nextViewId: 'final' },
      { id: 'otra_cosa_fraude', primaryText: 'Otra cosa', nextViewId: 'final' },
    ],
  },
  final: {
    id: 'final',
    title: 'Gracias por su reporte.',
    options: [
      { id: 'close', primaryText: 'Cerrar' },
    ],
  }
};