import * as crypto from 'crypto';

/**
 * Genera un código OTP (One-Time Password) numérico.
 * @param length La longitud del código OTP a generar (por ejemplo, 6).
 * @returns El código OTP como una cadena de texto.
 */
export const generateOTP1 = (length: number): string => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    // Generar un número aleatorio criptográficamente seguro entre min y max.
    const randomNumber = crypto.randomInt(min, max + 1);
    
    // Convertir el número a cadena de texto y asegurar que tenga la longitud correcta
    // con ceros a la izquierda si es necesario.
    return randomNumber.toString().padStart(length, '0');
}

/**
 * Genera un código OTP (One-Time Password) numérico.
 * @param length La longitud del código OTP a generar (por ejemplo, 6).
 * @returns El código OTP como una cadena de texto.
 */
export const generateOTP = (length: number): string => {
    let otp = '';
    const characters = '0123456789';

    for (let i = 0; i < length; i++) {
        // Selecciona un carácter aleatorio de la cadena 'characters'
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }
    
    return otp;
}
