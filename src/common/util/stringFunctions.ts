export const convertUrlParamToObject = (paramString: string, separator: string) => {
  const parts = paramString.split(separator); // Divide el string por el pipe '|'

  const resultObject = parts.reduce((obj: Record<string, any>, part) => {
    const [key, value] = part.split('='); // Divide cada parte por el signo '=' en clave y valor

    let processedValue: any = value;

    // Intenta convertir a número si es posible
    // Esto es útil para que '123' sea el número 123, no el string "123"
    if (!isNaN(Number(processedValue)) && processedValue !== '') {
      processedValue = Number(processedValue);
    }

    // Puedes añadir lógica adicional aquí si necesitas convertir a otros tipos
    // Por ejemplo, para fechas si fueran necesarias:
    // if (key === 'checkin' || key === 'checkout') {
    //   processedValue = new Date(processedValue);
    // }

    obj[key] = processedValue; // Asigna el valor procesado a la clave original
    return obj;
  }, {} as Record<string, any>);

  return resultObject;
};

export const  ofuscarCorreo = (email: string) => {
  const [nombreUsuario, dominio] = email.split('@');
  if (!nombreUsuario || nombreUsuario.length < 2) {
    return email; // Retorna el correo original si no hay suficientes caracteres para ofuscar
  }

  const primerCaracter = nombreUsuario[0];
  const ultimoCaracter = nombreUsuario[nombreUsuario.length - 1];
  const asteriscos = '*'.repeat(nombreUsuario.length - 2);

  return `${primerCaracter}${asteriscos}${ultimoCaracter}@${dominio}`;
}
export const maskFirstFourDigits = (inputNumber: number | string): string => {
  const numStr = String(inputNumber);

  if (numStr.length < 4) {
    return '*'.repeat(numStr.length);
  }

  const lastFourDigits = numStr.slice(-4);
  const maskedPart = '****';

  return maskedPart + lastFourDigits;
}