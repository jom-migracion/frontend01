import * as signalR from '@microsoft/signalr';

export interface NotificationAction {
  actionType: string;
  actionLabel: string;
  actionUrl: string;
}

export interface Notification {
  notificationId: number;
  type: string;
  title: string;
  messageBody: string;
  createdAt: string;
  listingRentId?: number;
  bookingId?: string;
  actions?: NotificationAction[];
  isRead?: boolean;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected: boolean = false;
  private userId: string | null = null;

  // Callbacks
  private onNotificationReceived: ((notification: Notification) => void) | null = null;
  private onUnreadCountUpdate: ((count: number) => void) | null = null;
  private onConnectionStatusChange: ((status: string) => void) | null = null;

  constructor() {
    this.setupBeforeUnload();
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.isConnected) {
        this.connect();
      }
    });
  }

  private getAuthToken(): string | null {
    try {
    const authStore = localStorage.getItem('auth-store');
      if (!authStore) {
        console.warn('⚠️ No se encontró auth-store en localStorage');
        return null;
      }

      const parsed = JSON.parse(authStore);
      const token = parsed?.state?.userToken || null;
      
      if (!token) {
        console.warn('⚠️ No se encontró token en auth-store');
      }
      return token;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  }

  private getUserIdFromToken(token: string): string {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return 'unknown';

      const payload = JSON.parse(this.base64UrlDecode(parts[1]));
      return payload.sub || payload.userId || 'unknown';
    } catch (error) {
      console.error('❌ Error decodificando token:', error);
      return 'unknown';
    }
  }

  private base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  }

  async connect(): Promise<boolean> {
    // Si ya está conectado, no reconectar
    if (this.isConnected && this.connection) {
      console.log('✅ Ya está conectado a SignalR');
      return true;
    }

    try {
      this.updateStatus('Conectando...');
      console.log('🔄 Iniciando conexión a SignalR...');

      const authToken = this.getAuthToken();
      if (!authToken) {
        console.error('❌ No se encontró token de autenticación');
        this.updateStatus('No autenticado');
        return false;
      }

      this.userId = this.getUserIdFromToken(authToken);
      console.log('👤 User');

      const hubUrl = `${import.meta.env.VITE_API_URL}`;
      console.log('🔗 Conectando a hub');

      // Configurar conexión
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => {
            console.log('🔑 Proporcionando token de acceso');
            return authToken;
          },
          skipNegotiation: true, // Cambiar a false para permitir negociación
          transport: signalR.HttpTransportType.WebSockets, // | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            const delay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
            console.log(`⏱️ Próximo intento de reconexión en ${delay}ms`);
            return delay;
          },
        })
        .configureLogging(signalR.LogLevel.Information) // Cambiar a Information para ver más logs
        .build();

      this.setupEventHandlers();

      await this.connection.start();
      this.isConnected = true;
      this.updateStatus('Conectado');

      console.log('✅ Conectado exitosamente al hub de notificaciones');
      console.log('🔌 Connection ID:', this.connection.connectionId);

      // Solicitar conteo inicial
      await this.requestUnreadCount();

      return true;
    } catch (error) {
      console.error('❌ Error conectando al hub:', error);
      this.updateStatus('Error de conexión');
      this.isConnected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        this.updateStatus('Desconectando...');
        await this.connection.stop();
        this.isConnected = false;
        this.connection = null;
        this.updateStatus('Desconectado');
        console.log('✅ Desconectado del hub');
      } catch (error) {
        console.error('❌ Error desconectando:', error);
      }
    }
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    console.log('📡 Configurando manejadores de eventos...');

    // Recibir notificaciones
    this.connection.on('ReceiveNotification', (notification: Notification) => {
      console.log('📬 Nueva notificación recibida:', notification);
      console.log('📬 Tipo de notificación:', notification.type);
      
      if (this.onNotificationReceived) {
        console.log('✅ Ejecutando callback de notificación');
        this.onNotificationReceived(notification);
      } else {
        console.warn('⚠️ No hay callback registrado para notificaciones');
      }
    });

    // Actualizar contador
    this.connection.on('UpdateUnreadCount', (count: number) => {
      console.log('🔢 Contador de no leídas actualizado:', count);
      if (this.onUnreadCountUpdate) {
        this.onUnreadCountUpdate(count);
      }
    });

    // Notificación marcada como leída
    this.connection.on('NotificationMarkedAsRead', (notificationId: number) => {
      console.log('✅ Notificación marcada como leída:', notificationId);
    });

    // Eventos de reconexión
    this.connection.onreconnecting((error) => {
      console.log('🔄 Reconectando...', error);
      this.updateStatus('Reconectando...');
      this.isConnected = false;
    });

    this.connection.onreconnected((connectionId) => {
      console.log('✅ Reconectado. ConnectionId:', connectionId);
      this.updateStatus('Conectado');
      this.isConnected = true;
      this.requestUnreadCount();
    });

    this.connection.onclose((error) => {
      console.log('🔌 Conexión cerrada', error);
      this.updateStatus('Desconectado');
      this.isConnected = false;
    });

    console.log('✅ Manejadores de eventos configurados');
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    if (this.isConnected && this.connection) {
      try {
        console.log('📤 Marcando notificación como leída:', notificationId);
        await this.connection.invoke('MarkNotificationAsRead', notificationId);
      } catch (error) {
        console.error('❌ Error marcando notificación como leída:', error);
      }
    } else {
      console.warn('⚠️ No se puede marcar como leída: no hay conexión');
    }
  }

  async requestUnreadCount(): Promise<void> {
    if (this.isConnected && this.connection) {
      try {
        console.log('📤 Solicitando conteo de no leídas');
        await this.connection.invoke('RequestUnreadCount');
      } catch (error) {
        console.error('❌ Error solicitando conteo:', error);
      }
    }
  }

  // Métodos para registrar callbacks
  setOnNotificationReceived(callback: (notification: Notification) => void) {
    console.log('📝 Registrando callback de notificaciones');
    this.onNotificationReceived = callback;
  }

  setOnUnreadCountUpdate(callback: (count: number) => void) {
    console.log('📝 Registrando callback de contador');
    this.onUnreadCountUpdate = callback;
  }

  setOnConnectionStatusChange(callback: (status: string) => void) {
    console.log('📝 Registrando callback de estado de conexión');
    this.onConnectionStatusChange = callback;
  }

  private updateStatus(status: string) {
    console.log('📊 Estado de conexión:', status);
    if (this.onConnectionStatusChange) {
      this.onConnectionStatusChange(status);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getUserId(): string | null {
    return this.userId;
  }

  // Método para verificar la conexión
  async testConnection(): Promise<boolean> {
    if (!this.connection) {
      console.log('❌ No hay conexión');
      return false;
    }

    try {
      console.log('🧪 Probando conexión...');
      console.log('🔌 Estado:', this.connection.state);
      console.log('🆔 Connection ID:', this.connection.connectionId);
      return this.isConnected;
    } catch (error) {
      console.error('❌ Error probando conexión:', error);
      return false;
    }
  }
}

export const signalRService = new SignalRService();