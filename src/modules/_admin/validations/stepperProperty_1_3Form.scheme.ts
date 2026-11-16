import { z } from 'zod';
export const stepperProperty_1_3formSchema = z.object({
  department: z.string().min(1, { message: 'El departamento es obligatorio' }),
  city: z.string().min(1, { message: 'La ciudad es obligatoria' }),
  address1: z.string().optional(),
  address2: z.string().optional(),
  position: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    // .refine((val) => (val ? val.lat !== 0 && val.lng !== 0 : false), {
    //   message: 'Debe marcar una ubicación válida en el mapa',
    // }),
});

export type TypeStepperProperty_1_3formSchema = z.infer<typeof stepperProperty_1_3formSchema>;
