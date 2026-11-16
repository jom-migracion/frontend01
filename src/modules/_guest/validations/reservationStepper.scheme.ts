import { z } from 'zod';

// Esquema para datos de tarjeta de crédito
export const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'El número de tarjeta es requerido')
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, 'Formato de tarjeta inválido'),
  
  expiryDate: z
    .string()
    .min(1, 'La fecha de vencimiento es requerida')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato MM/YY requerido'),
  
  cvv: z
    .string()
    .min(3, 'CVV debe tener al menos 3 dígitos')
    .max(4, 'CVV debe tener máximo 4 dígitos')
    .regex(/^\d+$/, 'CVV debe contener solo números'),
  
  // Dirección de facturación
  billingAddress: z.object({
    address: z.string().min(1, 'La dirección es requerida'),
    apartmentNumber: z.string().optional(),
    city: z.string().min(1, 'La ciudad es requerida'),
    state: z.string().min(1, 'El estado/provincia es requerido'),
    postalCode: z.string().min(1, 'El código postal es requerido'),
    country: z.string().min(1, 'El país es requerido'),
  }),
});

// Esquema para mensaje al anfitrión
export const hostMessageSchema = z.object({
  message: z
    .string()    
    .max(1000, 'El mensaje no puede exceder 1000 caracteres').optional(),
});

// Esquema para método de pago seleccionado
export const paymentMethodSchema = z.object({
  method: z.enum(['credit_card', 'qr', 'paypal'], {
    required_error: 'Debe seleccionar un método de pago',
  }),
});

// Esquema completo de la reserva
export const reservationSchema = z.object({
  paymentMethod: paymentMethodSchema,
  creditCardData: creditCardSchema.optional(),
  hostMessage: hostMessageSchema,
});

// Tipos TypeScript derivados de los esquemas (comentados para JavaScript)
// export type CreditCardData = z.infer<typeof creditCardSchema>;
// export type HostMessage = z.infer<typeof hostMessageSchema>;
// export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
// export type ReservationData = z.infer<typeof reservationSchema>;



