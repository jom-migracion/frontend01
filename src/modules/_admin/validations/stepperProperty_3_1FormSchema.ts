import { z } from 'zod';

export const stepperProperty_3_1formSchema = z.object({
  pricePerNight: z.coerce
    .number({
      invalid_type_error: 'Debe detallar el precio por noche. No puede ser valor negativo o cero',
    })
    .int({ message: 'El precio por noche debe ser un número entero' })
    .min(90, { message: 'El precio por noche debe ser mayor o igual a BOB 90' })
    .max(50000, { message: 'El precio por noche no puede superar BOB 50,000' }),

  customizedPrice: z.coerce
    .number({
      invalid_type_error:
        'El precio personalizado es obligatorio y debe ser un número mayor a cero',
    })
    .int({ message: 'El precio personalizado debe ser un número entero' })
    .min(90, { message: 'El precio personalizado debe ser mayor o igual a BOB 90' })
    .max(60000, { message: 'El precio personalizado no puede superar BOB 60,000' }),

  newPercentage: z.coerce
    .number({
      invalid_type_error: 'El porcentaje es obligatorio y debe ser un número mayor a cero',
    })
    .min(0, {
      message: 'El porcentaje debe ser mayor a cero',
    })
    .max(99, {
      message: 'El porcentaje no puede superar 99%',
    })
    .optional(),

  weeklyPercentage: z.coerce
    .number()
    .min(0, {
      message: 'El porcentaje semanal debe ser mayor a cero',
    })
    .max(99, {
      message: 'El porcentaje semanal no puede superar 99%',
    })
    .optional(),

  monthlyPercentage: z.coerce
    .number()
    .min(0, {
      message: 'El porcentaje mensual debe ser mayor a cero',
    })
    .max(99, {
      message: 'El porcentaje mensual no puede superar 99%',
    })
    .optional(),
});

export type TypeStepperProperty_3_1formSchema = z.infer<typeof stepperProperty_3_1formSchema>;
