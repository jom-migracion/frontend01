// utils/zodUtils.ts
import { z } from 'zod';
/**
* Esquema de números Zod personalizado que transforma cadenas vacías en indefinidas
* antes de la validación, lo que hace que los campos de números obligatorios vacíos no superen la validación.
*/
export const zodNumber = (schema?: z.ZodNumber) =>
  z.preprocess((value) => {
    // Si el valor es una cadena vacía, conviértalo en indefinido
    if (value === '') {
      return undefined;
    }
    // De lo contrario, intente convertir a un número
    return Number(value);
  }, schema || z.number()); 