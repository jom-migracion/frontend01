import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDateDayMonthLiteral = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
    }).replace('.', ''); // Elimina el punto en algunos locales (ej: "mar." -> "mar")
}; // Salida: "8 mar" (depende del locale)


export const formatDateToTime = (date: Date | string): string => {
    const fechaObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(fechaObj?.getTime())) return 'Fecha inválida';

    return fechaObj.toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).replace(/\./g, '');
}; // Salida "2:30 p.m."



export const formatDateWithDateFnsCapitalized = (date: Date): string => {
    const formattedString = format(date, 'MMMM d, yyyy', { locale: es });

    // Dividimos el string en partes para capitalizar el mes
    const parts = formattedString.split(' ');
    if (parts.length > 0) {
        // Capitaliza la primera letra del primer elemento (que debería ser el mes)
        parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }

    return parts.join(' ');
};// Salida: "Maro 8, 2023" (dependiendo de la fecha)

export const formatDateDayMonthShort = (date: Date): string => {
    // Formato 'd' para el día sin ceros, 'MMM' para el mes abreviado (ej. "ene")
    const formattedString = format(date, 'd MMM', { locale: es });

    // Dividimos el string para poder insertar "de" y capitalizar el mes
    const parts = formattedString.split(' ');

    // El mes abreviado estará en la segunda posición (índice 1)
    if (parts.length > 1) {
        // Capitaliza la primera letra del mes abreviado (ej: "ene" -> "Ene")
        parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }

    // Unimos las partes con "de"
    return `${parts[0]} de ${parts[1]}`;
}; // Salida esperada: "15 de Ene"

export const formatDateTimeToDate = (date: string | null): string => {
    if (date == null) {
        return "";
    }
    const dateReplace = date.toUpperCase().replace("T00:00:00", "");
    const parts = dateReplace.split("-");
    if (parts.length > 1) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    return "";
}

// hora = '10:00' o '02:00'
export const convertirString_Minutos = (hora: string) => {
    const [horas, minutos] = hora.split(':').map(Number);
    return (horas * 60) + minutos; // ejemplo retorno 1260
};

export const calculateDaysDifference = (startDate: Date, endDate: Date): number => {
    // Set the time of both dates to midnight UTC to avoid timezone issues
    const startUTC: Date = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    const endUTC: Date = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));

    // Get the difference in milliseconds
    const differenceInMs: number = endUTC.getTime() - startUTC.getTime();

    // Convert milliseconds to days
    const msInADay: number = 1000 * 60 * 60 * 24;

    // Round the result to get a whole number of days
    return Math.round(differenceInMs / msInADay);
}

/**
 * @param date La fecha a formatear. Puede ser un objeto Date o una cadena de texto.
 * @returns La fecha formateada en el formato "lun., 13 ene.".
 */
export const formatShortDate = (date: Date | string): string => {
    // Convierte la entrada a un objeto Date si no lo es ya.
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    // Si la fecha no es válida, devolvemos una cadena vacía o un mensaje de error.
    if (isNaN(dateObject.getTime())) {
        return 'Fecha inválida';
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short', // "lun."
        day: 'numeric',   // "13"
        month: 'short',   // "ene."
    };

    return new Intl.DateTimeFormat('es-ES', options).format(dateObject);
};

export const getDayOfTheWeek = (
    date: Date | string,
    format: 'complet' | 'short' = 'complet'
): string => {
    const fechaObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(fechaObj.getTime())) {
        throw new Error('Fecha inválida');
    }

    const fullDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const shortDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return format === 'complet'
        ? fullDays[fechaObj.getDay()]
        : shortDays[fechaObj.getDay()]; // Lunes or Lun
}

export const formatDateCheckIn = (fechaString: string, formatLarge: boolean = false, onlyDateMonth: boolean = false): string => {
    let resultado: string = '';
    if (fechaString == null || fechaString.trim() === '') {
        return resultado;
    } else {

        const fecha = new Date(fechaString);

        if (formatLarge) {
            // Caso 1: Retornar "09 de oct. de 2025"
            const opcionesLargo: Intl.DateTimeFormatOptions = {
                day: '2-digit',    // '09'
                month: 'short',    // 'oct.'
                year: 'numeric',   // '2025'
            };
            const formato = new Intl.DateTimeFormat('es-ES', opcionesLargo).format(fecha);

            let resultado = formato
                .replace('.', '') // Quita el punto de 'oct.'
                .replace(/(\d{2})\s+(\w{3})\s+(\d{4})/, '$1 de $2. de $3'); // Añade los 'de' y el punto

            return resultado;

        } else {
            // Definir las opciones de formato
            let opciones: Intl.DateTimeFormatOptions = {
                weekday: 'short', // 'sáb'
                day: '2-digit',   // '31'
                month: 'short',   // 'ago'
                hour: 'numeric',  // '3'
                minute: '2-digit',// '00'
                hour12: true,     // Usar formato am/pm
                //timeZone: 'UTC'
            };
            if (onlyDateMonth) {
                opciones = {
                    weekday: 'short', // 'sáb'
                    day: '2-digit',   // '31'
                    month: 'short',   // 'ago'
                };
            }

            let resultado = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);

            // Limpieza para el formato "sáb, 31 ago 3:00 pm"
            resultado = resultado
                .replace(/\./g, '')  // Quita los puntos (p. ej., "sáb." y "oct.")
                .replace(/, /g, ',') // Quita el espacio después de la coma (si lo hay)
                .replace(/,/g, ', ') // Asegura un solo espacio después de la coma
                .replace(/ a m/g, 'am')
                .replace(/ p m/g, 'pm')
                .replace(/,(\s*)(\d{2})/g, ', $2') // Asegura un solo espacio antes de la hora después de la coma
                .trim();

            return resultado;
        }
    }
}

export const formatearFechaYHora = (isoString: string): { fecha: string; hora: string } => {
    if (!isoString) {
        return {
            fecha: "",
            hora: ""
        };
    }
    // 1. Crear un objeto Date a partir de la cadena ISO.
    const fechaObjeto = new Date(isoString);

    // Guardrail: Verificar si la fecha es válida.
    if (isNaN(fechaObjeto.getTime())) {
        return {
            fecha: "Fecha inválida",
            hora: "Hora inválida"
        };
    }

    // --- Formato de la Fecha: "14 de mar. de 2025" ---

    // Opciones para el formato de fecha
    const opcionesFecha: Intl.DateTimeFormatOptions = {
        day: 'numeric',      // Día como número (ej: 14)
        month: 'short',    // Mes abreviado (ej: mar)
        year: 'numeric'    // Año como número (ej: 2025)
    };

    // Crear el formateador con idioma español ('es-ES')
    const formateadorFecha = new Intl.DateTimeFormat('es-ES', opcionesFecha);

    // Aplicar el formato y reemplazar " de " por un espacio simple para coincidir con "1 de mar. de 2025"
    // Nota: El formato nativo sería "14 mar. 2025", así que ajustamos para obtener "14 de mar. de 2025".
    // El formato solicitado "1 de mar. de 2025" realmente coincide con el día *1* y el mes *marzo*,
    // si el día en el ISO fuese "2025-03-01...". Usaremos el formato completo.

    let fechaFormateada = formateadorFecha.format(fechaObjeto);

    // El formato 'es-ES' suele dar '14 mar. 2025'.
    // Para obtener el formato exacto '14 de mar. de 2025', podemos hacer una pequeña manipulación:
    // 1. Obtener los componentes.
    const dia = fechaObjeto.getDate();

    // 2. Formatear el mes y el año.
    const opcionesMesAnio: Intl.DateTimeFormatOptions = {
        month: 'short',
        year: 'numeric'
    };
    const mesYAnio = new Intl.DateTimeFormat('es-ES', opcionesMesAnio)
        .format(fechaObjeto)
        .replace(/\./g, '') // Quitar puntos para un formato más limpio antes de agregar ' de '
        .trim();

    // 3. Ensamblar la cadena final: "14 de mar. de 2025"
    fechaFormateada = `${dia} de ${mesYAnio}`;


    // --- Formato de la Hora: "14:00 p.m." ---

    // Opciones para el formato de hora (formato 24 horas y forzar el uso de 'p.m.' o 'a.m.')
    const opcionesHora: Intl.DateTimeFormatOptions = {
        hour: '2-digit',      // Hora con dos dígitos (ej: 14)
        minute: '2-digit',    // Minuto con dos dígitos (ej: 00)
        hour12: true,         // Usar formato de 12 horas para tener a.m./p.m.
        timeZone: 'UTC'       // Es crucial forzar UTC para que la hora sea la misma que la del ISO string.
        // Si no se usa 'UTC', new Date() la interpreta en la zona horaria local.
    };

    const formateadorHora = new Intl.DateTimeFormat('es-ES', opcionesHora);
    let horaFormateada = formateadorHora.format(fechaObjeto);

    // El formato resultante será algo como "2:00 p. m.".
    // Queremos "14:00 p.m.". Para esto, necesitamos *el valor de la hora de la cadena ISO* y luego el sufijo p.m./a.m.

    // 1. Obtener la hora y los minutos directamente de la cadena, sin la conversión de zona horaria de Intl.
    const partesTiempo = isoString.split('T')[1].split(':');
    const hora24 = partesTiempo[0]; // "14"
    const minutos = partesTiempo[1]; // "00"

    // 2. Determinar si es a.m. o p.m.
    const horaNumerica = parseInt(hora24, 10);
    const sufijo = horaNumerica >= 12 ? 'p.m.' : 'a.m.';

    // 3. Ensamblar la hora: "14:00 p.m."
    horaFormateada = `${hora24}:${minutos} ${sufijo}`;


    return {
        fecha: fechaFormateada,
        hora: horaFormateada
    };
}

export const formatDateRange = (checkin: string, checkout: string): string => {

    if (!checkin || !checkout) {
        return '';
    }

    // 1. Crear objetos Date a partir de las cadenas de entrada
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    // 2. Opciones de formato para el nombre corto del mes
    // 'es-ES' para español, 'short' para la versión corta del mes (e.g., 'oct.')
    const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short' });

    // 3. Extraer día y mes para ambas fechas
    const checkinDay = checkinDate.getDate();
    const checkoutDay = checkoutDate.getDate();

    // Obtener los nombres cortos de los meses
    const checkinMonth = monthFormatter.format(checkinDate).replace('.', ''); // Ej: 'oct'
    const checkoutMonth = monthFormatter.format(checkoutDate).replace('.', ''); // Ej: 'oct'

    // 4. Lógica de Formato

    // CASO 1: Ambas fechas están en el **mismo** mes
    if (checkinDate.getMonth() === checkoutDate.getMonth()) {
        // Formato: "14 – 16 de oct."
        return `${checkinDay} - ${checkoutDay} de ${checkoutMonth}.`;
    }

    // CASO 2: Las fechas están en **diferentes** meses
    else {
        // Formato: "14 de jul - 16 de ago."
        // Se formatea la primera fecha: "14 de jul"
        const formattedCheckin = `${checkinDay} de ${checkinMonth}`;

        // Se formatea la segunda fecha: "16 de ago."
        // La regla para el segundo mes indica usar el mes completo, pero para mantener la consistencia con el ejemplo y la brevedad, usaremos el mismo formato corto, añadiendo el punto.
        const formattedCheckout = `${checkoutDay} de ${checkoutMonth}.`;

        return `${formattedCheckin} - ${formattedCheckout}`;
    }
}

export const tiempoTranscurrido = (fechaString: string): string => {
    // 1. Convertir la fecha string a un objeto Date (esto usa el huso horario del sistema).
    const fechaPasada = new Date(fechaString);
    const fechaActual = new Date();

    // 2. Calcular la diferencia en milisegundos
    const diferenciaMs = fechaActual.getTime() - fechaPasada.getTime();

    // Si la fecha futura es posterior a la actual (diferenciaMs es negativo o cero)
    if (diferenciaMs < 0) {
        return "0 segundos"; // O manejar como 'Fecha futura'
    }

    // 3. Definir las unidades de tiempo en milisegundos
    const MS_POR_SEGUNDO = 1000;
    const MS_POR_MINUTO = 60 * MS_POR_SEGUNDO;
    const MS_POR_HORA = 60 * MS_POR_MINUTO;

    // 4. Calcular y retornar el resultado en la unidad más grande
    
    if (diferenciaMs < MS_POR_MINUTO) {
        // Menos de 1 minuto
        const segundos = Math.floor(diferenciaMs / MS_POR_SEGUNDO);
        return `${segundos} segundo${segundos !== 1 ? 's' : ''}`;
    } 
    
    else if (diferenciaMs < MS_POR_HORA) {
        // Entre 1 minuto y 59 minutos
        const minutos = Math.floor(diferenciaMs / MS_POR_MINUTO);
        return `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    } 
    
    else {
        // 1 hora o más
        const horas = Math.floor(diferenciaMs / MS_POR_HORA);
        return `${horas} hora${horas !== 1 ? 's' : ''}`;
    }
}


export const esMenorALaFechaActual = (fechaString: string) => {
  // 1. Convertir el string de fecha a un objeto Date
  const fechaDada = new Date(fechaString);

  // 2. Obtener el objeto Date para el instante actual
  const fechaActual = new Date();

  // 3. Validar si el string pudo ser parseado correctamente.
  //    getTime() retorna NaN si la fecha no es válida.
  if (isNaN(fechaDada.getTime())) {
    // Asumimos que una fecha no válida no puede ser considerada "menor"
    return false;
  }
  
  // 4. Comparar las dos fechas.
  //    Cuando se comparan dos objetos Date, JavaScript los compara por su
  //    valor numérico (milisegundos desde 1970).
  return fechaDada < fechaActual;
}

export const tiempoRestante = (fechaCheckIn: string,  horas: boolean = false, fechaActualString: string = new Date().toISOString()): string => {
    const fechaFutura = new Date(fechaCheckIn);
    const fechaActual = new Date(fechaActualString);

    const diferenciaMs = fechaFutura.getTime() - fechaActual.getTime();

    if (diferenciaMs <= 0) {
        return horas ? "00:00" : "0 segundos";
    }

    const MS_POR_SEGUNDO = 1000;
    const MS_POR_MINUTO = 60 * MS_POR_SEGUNDO;
    const MS_POR_HORA = 60 * MS_POR_MINUTO;
    const MS_POR_DIA = 24 * MS_POR_HORA;

    if (horas) {
        const totalHoras = Math.floor(diferenciaMs / MS_POR_HORA);
        const minutos = Math.floor((diferenciaMs % MS_POR_HORA) / MS_POR_MINUTO);
        return `${totalHoras.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} Horas`;
    }

    if (diferenciaMs < MS_POR_MINUTO) {
        const segundos = Math.floor(diferenciaMs / MS_POR_SEGUNDO);
        return `${segundos} segundo${segundos !== 1 ? 's' : ''}`;
    } else if (diferenciaMs < MS_POR_HORA) {
        const minutos = Math.floor(diferenciaMs / MS_POR_MINUTO);
        return `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    } else if (diferenciaMs < MS_POR_DIA) {
        const horasVal = Math.floor(diferenciaMs / MS_POR_HORA);
        return `${horasVal} hora${horasVal !== 1 ? 's' : ''}`;
    } else {
        const dias = Math.floor(diferenciaMs / MS_POR_DIA);
        const horasVal = Math.floor((diferenciaMs % MS_POR_DIA) / MS_POR_HORA);
        return horasVal > 0 
            ? `${dias} día${dias !== 1 ? 's' : ''} y ${horasVal} hora${horasVal !== 1 ? 's' : ''}`
            : `${dias} día${dias !== 1 ? 's' : ''}`;
    }
}

export const formatearFecha = (fechaInput: string | Date) => {
  // Convertimos el input a un objeto Date (si ya lo es, se mantiene igual)
  const fecha = new Date(fechaInput);

  // Validamos si la fecha es válida
  if (isNaN(fecha.getTime())) {
    return "Fecha inválida";
  }

  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long'
  });
};

/**
 * Formatea una fecha en el formato dd/MM/yyyy
 * @param date Objeto Date o string con la fecha
 * @returns string en formato dd/MM/yyyy (ej: "25/12/2025")
 */
export const formatDateDdMmYyyy = (date: Date | string): string => {
  // Convierte la entrada a un objeto Date si no lo es ya
  const dateObject = typeof date === 'string' ? new Date(date) : date;

  // Validar si la fecha es válida
  if (isNaN(dateObject.getTime())) {
    return 'Fecha inválida';
  }

  // Usar date-fns para formato dd/MM/yyyy
  return format(dateObject, 'dd/MM/yyyy');
};