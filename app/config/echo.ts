import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { isAuthenticated } from '@/utils/auth';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<any> | null = null;

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
  
  try {
    const appKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY || process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    if (!appKey) {
      throw new Error('缺少 WebSocket app key：请设置 NEXT_PUBLIC_REVERB_APP_KEY 或 NEXT_PUBLIC_PUSHER_APP_KEY');
    }
    const token = localStorage.getItem('token') || process.env.NEXT_PUBLIC_BROADCAST_TOKEN || '';
    const wsHost = process.env.NEXT_PUBLIC_WS_HOST || '127.0.0.1';
    const wsPort = process.env.NEXT_PUBLIC_WS_PORT ? Number(process.env.NEXT_PUBLIC_WS_PORT) : undefined;
    const wssPort = process.env.NEXT_PUBLIC_WS_WSS_PORT ? Number(process.env.NEXT_PUBLIC_WS_WSS_PORT) : (process.env.NEXT_PUBLIC_WS_PORT ? Number(process.env.NEXT_PUBLIC_WS_PORT) : undefined);
    const forceTLS = process.env.NEXT_PUBLIC_WS_SECURE === 'true';
    const wsPath = process.env.NEXT_PUBLIC_WS_PATH || '/app';
    const enabledTransports = forceTLS ? ['wss'] as Array<'ws' | 'wss'> : ['ws'];

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    echo = new Echo({
      broadcaster: 'reverb',
      key: appKey,
      wsHost,
      wsPort,
      wssPort,
      forceTLS,
      enabledTransports,
      wsPath,
      disableStats: true,
      authEndpoint: '/api/broadcasting/auth',
      auth: {
        withCredentials: true,
        headers,
      }
    });

        console.log('WebSocket 配置:', {
          appKey: appKey ? appKey.slice(0, 6) + '***' : '未设置',
          wsHost,
          wsPort: wsPort || '未设置',
          wssPort: wssPort || '未设置',
          wsSecure: forceTLS,
          wsPath,
          authEndpoint: '/api/broadcasting/auth',
          hasAuthHeader: Boolean(token),
        });

        // 类型断言为PusherConnector
        const connector = echo.connector as any;

        connector.pusher.connection.bind('error', (err: any) => {
          console.error('WebSocket 连接错误:', err);
          if (err.data?.code === 4001) {
            console.log('尝试重新连接...');
            connector.pusher.connect();
          }
        });

        connector.pusher.connection.bind('disconnected', () => {
          console.log('WebSocket 连接断开');
          setTimeout(() => {
            console.log('尝试重新连接...');
            connector.pusher.connect();
          }, 1000);
        });

        connector.pusher.connection.bind('connected', () => {
          console.log('WebSocket 连接成功');
        });

        let reconnectAttempts = 0;
        const maxReconnectAttempts = 3;

        connector.pusher.connection.bind('connecting', () => {
          console.log('正在连接 WebSocket...');
        });

        connector.pusher.connection.bind('failed', () => {
          console.log('WebSocket 连接失败');
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            console.log(`第 ${reconnectAttempts} 次重试...`);
            setTimeout(() => {
              connector.pusher.connect();
            }, 1000 * reconnectAttempts);
          } else {
            console.error('WebSocket 重连次数超过限制，请刷新页面重试');
          }
        });

        connector.pusher.connection.bind('connected', () => {
          console.log('WebSocket 连接成功，重置重连计数');
          reconnectAttempts = 0;
        });
  } catch (error) {
    console.error('WebSocket 初始化失败:', error);
  }
}

export default echo;