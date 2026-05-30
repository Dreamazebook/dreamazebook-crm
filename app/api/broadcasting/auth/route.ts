// app/api/broadcasting/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getApiOrigin } from '@/utils/apiBaseUrl'
import { logApiError } from '@/utils/errorLogger'

export async function POST(req: NextRequest) {
  try {
    // 1) 获取原始表单 body (socket_id=...&channel_name=...)
    const body = await req.text()
    console.log('Broadcasting auth request body:', body)

    // 2) 提取前端带来的请求头（仅使用 Authorization）
    const cookie = req.headers.get('cookie') || ''
    const authHeader = req.headers.get('authorization') || ''

    console.log('Broadcasting auth headers:', {
      authHeader: authHeader ? 'Present' : 'Missing',
      cookie: cookie ? 'Present' : 'Missing',
      csrfToken: 'Removed (api-token only)'
    })

    // 3) 构造 Laravel 后端广播授权 URL（稳健处理异常/非法主机名）
    const apiUrlEnv = process.env.NEXT_PUBLIC_API_URL
    let laravelUrl = getApiOrigin()
    if (apiUrlEnv) {
      // 先尝试按原值解析
      try {
        laravelUrl = new URL(apiUrlEnv).origin
      } catch {
        // 若因类似 https://.dreamazebook.com/api 导致解析失败，尝试去除「://.」中的点
        try {
          const sanitized = apiUrlEnv.replace('://.', '://')
          laravelUrl = new URL(sanitized).origin
        } catch {
          // 仍失败则回退到当前环境默认域名
          laravelUrl = getApiOrigin()
        }
      }
    }
    console.log('Resolved broadcasting auth target:', laravelUrl)

    // 4) 转发请求给 Laravel，包括 Cookie 和 CSRF token
    // 4) api-token ：必须带 Bearer
    if (!/^Bearer\s+\S+/.test(authHeader)) {
      console.warn('Missing Bearer token for broadcasting auth (api-token only mode)')
      return NextResponse.json({ error: 'Unauthorized: missing Bearer token' }, { status: 401 })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie,
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': authHeader,
    }
    const authPath = '/api/broadcasting/auth'
    console.log('Broadcasting auth mode:', 'api-token (forced)', 'path:', authPath)

    const laravelRes = await fetch(`${laravelUrl}${authPath}`, {
      method: 'POST',
      headers,
      body,
      credentials: 'include',
    })

    // 5) 读取并解析响应
    const text = await laravelRes.text()
    console.log('Laravel response status:', laravelRes.status)
    console.log('Laravel response text:', text)
    
    let data: any
    try {
      data = JSON.parse(text)
    } catch (e) {
      logApiError({ error: e, context: 'Laravel auth response not JSON' })
      return NextResponse.json({ error: 'Invalid auth response' }, { status: 502 })
    }

    // 不再提供其他模式/路径的回退

    if (!laravelRes.ok) {
      logApiError({ error: { status: laravelRes.status, data, headers: Object.fromEntries(laravelRes.headers.entries()) }, context: 'Laravel broadcast auth failed' })
      return NextResponse.json({ error: 'Auth failed', details: data }, { status: laravelRes.status })
    }

    // 6) 返回成功结果给前端 Echo
    return NextResponse.json(data, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, X-XSRF-TOKEN, Authorization',
      }
    })
  } catch (err) {
    logApiError({ error: err, context: 'Proxy error in broadcasting auth route' })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 处理 OPTIONS 请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, X-XSRF-TOKEN, Authorization',
    },
  })
}
