# 软著信息采集系统

基于 Taro 4 + React 的**跨端应用**，支持微信小程序、H5 网页和头条小程序，用于采集软件著作权登记信息。

## 技术栈

- **框架**: Taro 4.1.9
- **语言**: TypeScript 5.4.5
- **渲染**: React 18.0.0
- **样式**: TailwindCSS 4.1.18
- **状态管理**: Zustand 5.0.9
- **图标库**: lucide-react-taro
- **工程化**: Vite 4.2.0
- **包管理**: pnpm

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

修改 `.env.local` 中的 API 地址：

```bash
PROJECT_DOMAIN=https://web-production-2c115.up.railway.app
```

### 本地开发

```bash
# 启动 H5 网页开发服务器（推荐）
pnpm dev:web

# 启动微信小程序开发
pnpm dev:weapp

# 启动头条小程序开发
pnpm dev:tt

# 同时启动 H5 和本地后端（NestJS，如需）
pnpm dev
```

- **H5 地址**: http://localhost:5000（浏览器直接打开）
- **微信小程序**: 使用微信开发者工具打开项目根目录
- **头条小程序**: 使用头条开发者工具打开

### 构建

```bash
pnpm build:web    # 构建 H5
pnpm build:weapp  # 构建微信小程序
```

## 项目结构

```
├── config/                   # Taro 构建配置
│   ├── index.ts              # 主配置文件
│   ├── dev.ts                # 开发环境配置
│   └── prod.ts               # 生产环境配置
├── src/                      # 前端源码
│   ├── pages/                # 页面组件
│   │   ├── index/            # 首页
│   │   └── form/             # 采集表页面
│   ├── components/           # UI 组件
│   ├── utils/                # 工具函数
│   ├── network.ts            # 网络请求工具
│   └── app.tsx               # 应用入口
├── types/                    # TypeScript 类型定义
└── .env.local                # 环境变量
```

## API 连接

本项目连接到部署在 Railway 的 FastAPI 后端：

- **后端地址**: `https://web-production-2c115.up.railway.app`
- **API 文档**: `https://web-production-2c115.up.railway.app/docs`

### 主要功能

1. **采集表填写** - 用户填写软件著作权登记信息
2. **提交数据** - 将采集信息提交到后端数据库
3. **查询码生成** - 生成查询码供材料生成系统使用

## 核心开发规范

### 新建页面流程

1. 在 `src/pages/` 下创建页面目录
2. 创建 `index.tsx`（页面组件）
3. 创建 `index.config.ts`（页面配置）
4. 在 `src/app.config.ts` 的 `pages` 数组中注册页面路径

### 发送请求

```typescript
import { Network } from '@/network'

// GET 请求
const data = await Network.request({
  url: '/api/hello'
})

// POST 请求
const result = await Network.request({
  url: '/api/software-copyright/form',
  method: 'POST',
  data: { /* 表单数据 */ }
})
```

### 图标使用

```tsx
import { House, Settings, User } from 'lucide-react-taro'

<House size={24} color="#1890ff" />
```

### Tailwind CSS

```tsx
<View className="flex flex-col items-center justify-center min-h-screen">
  <Text className="text-2xl font-bold text-blue-600">标题</Text>
</View>
```

## 小程序限制

| 限制项 | 说明 |
|--------|------|
| 主包体积 | ≤ 2MB |
| 域名配置 | 生产环境需配置合法域名 |
| 本地开发 | 需开启「不校验合法域名」 |

## 重要提示

1. **后端服务** - 本项目使用外部 FastAPI 后端（`softreg-backend`），需确保 Railway 服务运行
2. **代理配置** - 开发环境代理已配置为指向 Railway 后端
3. **环境变量** - 确保 `.env.local` 中的 `PROJECT_DOMAIN` 配置正确
