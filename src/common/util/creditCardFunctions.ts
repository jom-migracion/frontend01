export const formatExpiryDateCard = (value: string) => {
  const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 y 00 > 0
    // Permitir sólo dígitos y `/`
    .replace(/[^\d\/]|^[\/]*$/g, '')
    .replace(/\/\//g, '/'); // Impedir introducir más de 1 `/`

  return finalValue;
};

export const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};
