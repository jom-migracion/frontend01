import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isAndroid: boolean;
  isIOS: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isEmulated: boolean; // <--- Nuevo campo
}

export function useDeviceType(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isAndroid: false,
    isIOS: false,
    isMobile: false,
    isDesktop: false,
    isEmulated: false,
  });

  useEffect(() => {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';

    // Detecciones básicas por UserAgent
    const rawIsAndroid = /android/i.test(userAgent);
    const rawIsIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const rawIsMobile = rawIsAndroid || rawIsIOS || /Mobi|Tablet/i.test(userAgent);

    // --- LÓGICA DE DETECCIÓN DE EMULADOR ---
    const platform = (navigator.platform || '').toLowerCase();
    
    // Si el UserAgent dice que es móvil, pero la plataforma reporta un SO de escritorio
    const isDesktopOS = platform.includes('win') || platform.includes('mac') || platform.includes('linux');
    const isMobileOS = platform.includes('iphone') || platform.includes('android') || platform.includes('ipad');

    // Comprobamos si tiene un ratón de alta precisión activo (común en PC)
    const hasFinePointer = window.matchMedia('(any-pointer: fine)').matches;

    // Se considera emulador si el UserAgent dice ser móvil pero delata ser un entorno de escritorio
    const isEmulated = rawIsMobile && (isDesktopOS && !isMobileOS || hasFinePointer);

    // Si es emulador, ajustamos las banderas reales
    const isRealMobile = rawIsMobile && !isEmulated;
    const isDesktop = !isRealMobile; // Tratamos al emulador de PC como Desktop

    setDeviceInfo({
      isAndroid: rawIsAndroid && !isEmulated,
      isIOS: rawIsIOS && !isEmulated,
      isMobile: isRealMobile,
      isDesktop: isDesktop,
      isEmulated: isEmulated,
    });
  }, []);

  return deviceInfo;
}