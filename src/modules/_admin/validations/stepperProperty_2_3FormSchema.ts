import { z } from 'zod';
import { validateOffensiveContent } from '@/utilities/contentModeration';

export const stepperProperty_2_3formSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'minimo 1 caracteres' })
    .max(50, { message: 'maximo 50 caracteres' })
    // .refine(
    //   (value) => {
    //     const validation = validateOffensiveContent(value);
    //     return validation.isValid;
    //   },
    //   { message: 'El título contiene contenido inapropiado' }
    // )
    ,
  description: z
    .string()
    .min(1, { message: 'minimo 1 caracteres' })
    .max(500, { message: 'maximo 500 caracteres' })
    // .refine(
    //   (value) => {
    //     const validation = validateOffensiveContent(value);
    //     return validation.isValid;
    //   },
    //   { message: 'La descripción contiene contenido inapropiado' }
    // ),
});

export type TypeStepperProperty_2_3formSchema = z.infer<typeof stepperProperty_2_3formSchema>;