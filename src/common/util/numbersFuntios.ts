
export const formatSemicolon = (baseAmount: any, type: string = 'es-ES') => {
  // Convertimos a número y validamos si es un número real
  const amount = Number(baseAmount);
  
  // Si es null, undefined, NaN o un string no numérico, usamos 0
  const validAmount = isNaN(amount) ? 0 : amount;

  return new Intl.NumberFormat(type, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(validAmount);
}; // Ejemplo: 1234.56 -> "1.234,56"