import { NextRequest, NextResponse } from 'next/server';
import { logApiError } from '@/utils/errorLogger';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': [
        'Content-Type',
        'Authorization',
        'X-Socket-Id',
        'Accept',
        'X-Requested-With',
        'X-XSRF-TOKEN'
      ].join(','),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. 原始 body（Pusher 会传 socket_id 和 channel_name）
    const body = await req.text();
    console.log('Received body:', body);

    // 2. 获取所有必要的请求头
    const authHeader = req.headers.get('authorization') || '';
    const socketId = req.headers.get('x-socket-id') || '';
    const accept = req.headers.get('accept') || 'application/json';
    const cookie = req.headers.get('cookie') || '';
    const csrfToken = req.headers.get('x-xsrf-token') || '';

    console.log('Request headers:', {
      authorization: authHeader,
      'x-socket-id': socketId,
      accept,
      cookie,
      'x-xsrf-token': csrfToken
    });

    // 3. 转发给你的 Laravel Pusher 授权端点
    const laravelRes = await fetch('http://localhost:8000/broadcasting/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
        'X-Socket-Id': socketId,
        'Accept': accept,
        'Cookie': cookie,
        'X-XSRF-TOKEN': csrfToken,
      },
      body,
      credentials: 'include',
    });

    const data = await laravelRes.json();
    console.log('Laravel response:', {
      status: laravelRes.status,
      data
    });

    if (!laravelRes.ok) {
      console.error('Pusher auth failed:', data);
      return NextResponse.json(
        { error: 'Pusher auth failed', details: data }, 
        { 
          status: laravelRes.status,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true',
          }
        }
      );
    }

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  } catch (err) {
    logApiError({ error: err, context: 'Pusher auth proxy error' });
    return NextResponse.json(
      { error: 'Server error', details: String(err) }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    );
  }
} 