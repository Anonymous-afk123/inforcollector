# 软著采集表小程序设计指南

## 品牌定位

**应用定位**：软件著作权登记信息采集工具
**设计风格**：简洁大方、科技感、专业可信
**目标用户**：软件企业、开发者、知识产权从业者

## 配色方案

### 主色板

**主色调（科技蓝）**：
- 主色：`#3B82F6` (Tailwind: `blue-500`)
- 深色：`#2563EB` (Tailwind: `blue-600`)
- 浅色：`#60A5FA` (Tailwind: `blue-400`)
- 背景：`#EFF6FF` (Tailwind: `blue-50`)

**中性色**：
- 标题：`#0F172A` (Tailwind: `slate-900`)
- 正文：`#334155` (Tailwind: `slate-700`)
- 说明文字：`#64748B` (Tailwind: `slate-500`)
- 边框：`#E2E8F0` (Tailwind: `slate-200`)
- 背景：`#F8FAFC` (Tailwind: `slate-50`)

**语义色**：
- 成功：`#10B981` (Tailwind: `emerald-500`)
- 警告：`#F59E0B` (Tailwind: `amber-500`)
- 错误：`#EF4444` (Tailwind: `red-500`)

### 渐变色（科技感增强）

**主渐变**：
```css
/* 从蓝色到青色的渐变 */
background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
/* Tailwind 类名组合 */
bg-gradient-to-r from-blue-500 to-cyan-500
```

**卡片背景**：
```css
/* 半透明白色背景 + 微妙阴影 */
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(10px);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

## 字体规范

### 字号层级

- **H1（页面标题）**：`text-3xl font-bold` (30px, 加粗)
- **H2（卡片标题）**：`text-xl font-semibold` (20px, 半粗)
- **H3（小节标题）**：`text-lg font-medium` (18px, 中等)
- **Body（正文）**：`text-base` (16px, 常规)
- **Caption（说明文字）**：`text-sm text-slate-500` (14px, 灰色)

### 字重

- **Regular**：`font-normal` (400)
- **Medium**：`font-medium` (500)
- **Semibold**：`font-semibold` (600)
- **Bold**：`font-bold` (700)

## 间距系统

### 页面边距

- **页面左右边距**：`px-4` (16px)
- **页面上下边距**：`py-6` (24px)

### 卡片间距

- **卡片内边距**：`p-6` (24px)
- **卡片间距**：`gap-4` (16px)
- **卡片圆角**：`rounded-2xl` (16px)

### 表单间距

- **表单项间距**：`gap-4` (16px)
- **标签与输入框间距**：`gap-2` (8px)

## 组件使用原则

### 组件选型约束

**优先使用 `@/components/ui/*` 组件库**：

- **按钮**：使用 `Button` 组件，主按钮使用蓝色渐变
- **输入框**：使用 `Input` 和 `Textarea` 组件，统一圆角和边框
- **卡片**：使用 `Card` 组件作为容器
- **标签**：使用 `Label` 组件
- **徽章**：使用 `Badge` 组件显示状态
- **分隔线**：使用 `Separator` 组件分隔内容区域

**禁止手搓通用组件**：
- 不要用 `View/Text` 手搓按钮、输入框、卡片等
- 如果组件库缺失，优先补齐到 `src/components/ui`

### 页面布局原则

**首页布局**：
- 顶部：用户信息卡片（科技感渐变背景）
- 中部：快捷操作区（填写采集表、历史记录）
- 底部：功能说明或帮助信息

**表单页布局**：
- 顶部：进度指示器
- 中部：分组卡片（基本信息、开发环境、功能说明、企业信息）
- 底部：提交按钮（固定底部）

## 容器样式

### 卡片容器

```tsx
<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-slate-900">
      标题
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* 内容 */}
  </CardContent>
</Card>
```

### 按钮样式

```tsx
// 主按钮（渐变背景）
<Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-8 py-6 text-base font-medium shadow-lg">
  开始填写
</Button>

// 次按钮（描边样式）
<Button variant="outline" className="border-slate-200 text-slate-700 rounded-full px-8 py-6">
  查看历史
</Button>
```

## 导航结构

### TabBar 配置

暂不使用 TabBar，使用页面内导航。

### 页面跳转

- **首页 → 表单页**：`Taro.navigateTo({ url: '/pages/form/index' })`
- **表单页 → 首页**：`Taro.navigateBack()`

## 状态展示

### 加载态

使用 `Skeleton` 组件：
```tsx
<Skeleton className="h-12 w-full rounded-xl" />
```

### 空状态

```tsx
<View className="flex flex-col items-center justify-center py-12">
  <FileText className="w-16 h-16 text-slate-300 mb-4" />
  <Text className="text-slate-500">暂无记录</Text>
</View>
```

## 小程序约束

### 性能优化

- 图片使用 CDN 加载
- 列表使用虚拟滚动
- 避免过度动画

### 包体积

- 静态资源上传到 TOS
- 代码按需加载
- 压缩图片资源

## 设计清单

- [x] 主色/辅色 Tailwind 类名（科技蓝 `blue-500` + 中性灰 `slate-*`）
- [x] 组件选型原则（通用 UI 组件优先使用 `@/components/ui/*`）
- [x] 页面需要优先复用的 UI 组件（Button / Input / Card / Badge / Label）
- [x] 容器样式原则（圆角 `rounded-2xl`、阴影 `shadow-lg`、内边距 `p-6`）
- [x] 间距系统（页面边距 `px-4`、卡片间距 `gap-4`）
- [x] 导航结构（单页应用，无 TabBar）
- [x] 状态展示原则（加载态用 Skeleton、空状态用图标 + 文字）
