# DreamazeBook - 多语言电子书平台

## 项目概述
DreamazeBook 是一个基于 Next.js 的多语言电子书平台，提供书籍浏览、购买、个性化阅读体验等功能。支持国际化、实时通信和支付集成。

## 技术栈
- **框架**: Next.js 15.3 + React 19
- **UI组件库**: 
  - Material-UI (MUI)
  - Ant Design
  - Heroicons
- **状态管理**: Zustand
- **国际化**: next-intl
- **支付**: Stripe
- **实时通信**: 
  - Pusher
  - Socket.io
- **动画**: Framer Motion
- **日期处理**: 
  - date-fns
  - MUI Date Pickers
- **样式**: 
  - TailwindCSS
  - Emotion
- **工具库**: 
  - Axios
  - React Hot Toast

## 项目结构
```
dreamazebook-frontend/
├── app/                  # Next.js 应用路由
│   ├── [locale]/         # 国际化路由
│   │   ├── (marketing)/  # 营销页面
│   │   ├── (website)/    # 主站功能
│   │   │   ├── books/    # 书籍相关
│   │   │   ├── checkout/ # 结账流程
│   │   │   ├── shopping-cart/ # 购物车
│   │   │   └── ...       # 其他功能模块
│   ├── api/              # API路由
│   └── config/          # 应用配置
├── components/           # 公共组件(当前为空)
├── stores/               # 状态管理
│   └── userStore.ts      # 用户状态管理
├── utils/                # 工具函数
│   ├── api.js            # API请求
│   ├── auth.js           # 认证工具
│   └── ...               # 其他工具
├── public/               # 静态资源
└── ...                   # 其他配置文件
```

## 核心功能
1. **多语言支持** - 通过[locale]路由和next-intl实现
2. **用户认证** - 登录/注册/密码重置功能
3. **电商功能**:
   - 书籍浏览与选择
   - 购物车管理
   - 结账流程
   - 订单摘要
4. **个性化阅读**:
   - 书籍内容选择
   - 阅读偏好设置
5. **实时通信** - 通过Pusher和Socket.io实现
6. **分析与追踪** - 用户行为追踪

## 如何运行
1. 安装依赖:
```bash
npm install
```

2. 配置环境变量:
复制`.env.example`为`.env`并填写必要配置

3. 开发模式:
```bash
npm run dev
```

4. 生产构建:
```bash
npm run build
npm start
```

## API 端点

### 用户认证 (Authentication)
| 端点 | 方法 | 描述 |
|------|------|------|
| `/register` | POST | 用户注册 |
| `/login` | POST | 用户登录 |
| `/login/send-code` | POST | 发送登录验证码 |
| `/login/verify-code` | POST | 验证登录验证码 |
| `/logout` | POST | 用户登出 |
| `/forgot-password` | POST | 发送密码重置邮件 |
| `/reset-password` | POST | 重置密码 |
| `/user/profile` | GET/PUT | 获取/更新用户资料 |
| `/user/change-password` | POST | 修改密码 |

### OAuth 认证
| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/auth/{provider}/redirect` | GET | OAuth 重定向 (google, facebook) |
| `/api/auth/{provider}/callback` | GET | OAuth 回调 |

### 购物车 (Cart)
| 端点 | 方法 | 描述 |
|------|------|------|
| `/cart` | GET | 获取购物车列表 |
| `/cart/create` | POST | 创建购物车 |
| `/cart/remove` | POST | 移除购物车商品 |
| `/cart/{id}` | PUT | 更新购物车商品 |
| `/checkout/calculate-cost` | POST | 计算订单费用 |

### 订单 (Orders)
| 端点 | 方法 | 描述 |
|------|------|------|
| `/orders` | GET | 获取订单列表 |
| `/orders/{id}` | GET | 获取订单详情 |
| `/orders/{id}/progress` | GET | 获取订单进度 |
| `/orders/{id}/address` | PUT | 更新订单地址 |
| `/orders/{id}/shipping-method` | PUT | 更新配送方式 |
| `/orders/status` | GET | 获取订单状态 |
| `/order/update-message` | POST | 更新订单留言 |
| `/order/remove` | POST | 移除订单 |
| `/order/shipping-methods` | GET | 获取配送方式列表 |

### 结账 (Checkout)
| 端点 | 方法 | 描述 |
|------|------|------|
| `/checkout/create-order` | POST | 创建订单 |
| `/stripe/create-payment-intent` | POST | 创建 Stripe 支付意图 |
| `/stripe/confirm-payment` | POST | 确认 Stripe 支付 |
| `/shipping/countries` | GET | 获取国家列表 |
| `/shipping/prices` | POST | 估算运费 |

### 用户地址 (Addresses)
| 端点 | 方法 | 描述 |
|------|------|------|
| `/user/addresses` | GET/POST | 获取/创建地址列表 |
| `/user/addresses/{id}` | GET/PUT/DELETE | 地址详情操作 |

### 产品 (Products)
| 端点 | 方法 | 描述 |
|------|------|------|
| `/products` | GET | 获取产品列表 |
| `/picbooks` | GET | 获取绘本列表 |
| `/picbooks/{id}` | GET | 获取绘本详情 |

### Kickstarter
| 端点 | 方法 | 描述 |
|------|------|------|
| `/kickstarter-packages` | GET | 获取 Kickstarter 套餐 |
| `/kickstarter-packages/{id}/status` | GET | 获取套餐状态 |
| `/kickstarter-packages/items/{itemId}/picbook` | GET | 获取套餐内商品 |
| `/kickstarter-packages/items/{itemId}/options` | GET | 获取套餐选项 |

### 管理后台 (Admin)
| 端点 | 方法 | 描述 |
|------|------|------|
| `/admin/login` | POST | 管理员登录 |
| `/admin/users` | GET | 用户列表 |
| `/admin/roles` | GET | 角色列表 |
| `/admin/permissions` | GET | 权限列表 |
| `/admin/user-roles/{userId}/roles` | PUT | 分配用户角色 |
| `/admin/orders` | GET | 订单列表 |
| `/admin/orders/{id}` | GET | 订单详情 |
| `/admin/orders/{id}/retry-face-swap` | POST | 重试换脸 |
| `/admin/orders/{id}/generate-pdf` | POST | 生成 PDF |
| `/admin/orders/{id}/pdf-urls` | GET | 获取 PDF 链接 |
| `/admin/orders/{id}/send-preview-pdf` | POST | 发送预览 PDF |
| `/admin/orders/{id}/items/{itemId}/upload-final-images` | POST | 上传最终图片 |
| `/admin/orders/{id}/items/{itemId}/confirm` | POST | 手动确认订单 |
| `/admin/orders/download-images` | GET | 下载订单图片 |
| `/admin/logistics` | GET | 物流列表 |
| `/admin/logistics/{id}` | GET | 物流详情 |
| `/admin/logistics/{id}/print-label` | POST | 打印标签 |
| `/admin/logistics/confirm` | POST | 确认发货 |
| `/admin/logistics/print-pickup-order` | POST | 打印取货单 |
| `/admin/logistics/{id}/reschedule-pickup` | POST | 重新安排取货 |
| `/admin/picbooks` | GET | 绘本管理 |
| `/admin/picbooks/{id}` | GET | 绘本详情 |

### Webhooks
| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/stripe-webhook` | POST | Stripe 支付回调 |
| `/api/meta-webhook` | POST | Meta (Facebook) 回调 |
| `/api/hubspot` | POST | HubSpot 集成 |

### 其他 API
| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/ping` | GET | 服务健康检查 |
| `/api/send-mail` | POST | 发送邮件 |
| `/api/subscriptions` | GET/POST | 订阅管理 |
| `/api/cover-base-image` | GET | 封面底图 |
| `/api/cover-page-properties` | GET | 封面页面属性 |
| `/api/image-proxy/{encoded}` | GET | 图片代理 |
| `/api/local-gallery/{...segments}` | GET | 本地图片库 |

## 贡献指南
欢迎提交Pull Request。请确保代码风格一致并通过所有测试。