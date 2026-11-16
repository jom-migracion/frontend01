// services/mockVerificationService.ts

type VerificationStatus = 'initial' | 'pending' | 'success' | 'error';

/**
 * Simula una llamada a un servicio backend que retorna el estado de verificación de identidad.
 * @param idUser - ID del usuario
 * @returns Estado de verificación
 */
export const fetchVerificationStatus = (idUser: number): VerificationStatus => {
  // Simulación simple basada en el ID
  const mod = idUser % 4;

  switch (mod) {
    case 0:
      return 'initial';
    case 1:
      return 'pending';
    case 2:
      return 'success';
    case 3:
      return 'error';
    default:
      return 'initial';
  }
};