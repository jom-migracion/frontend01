import { z } from 'zod';

// Esquema de validación con Zod
export const authRegistrationScheme = z.object({
  names: z.string().min(2, {message: 'namesRequired'}),
  lastName: z.string().min(2, {message: 'lastNameRequired'}),
  email: z.string().email({message: 'emailRequired'}),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La confirmación de la contraseña debe tener al menos 6 caracteres'),
  phoneCode: z.string().default('+591'),
  phoneNumber: z.string().min(8, 'Ingresa un número de celular válido'),
  otp: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});
