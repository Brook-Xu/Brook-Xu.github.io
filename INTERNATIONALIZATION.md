# 国际化功能说明

## 概述

本项目已成功集成Vue i18n国际化功能，支持中英文双语切换。

## 功能特性

- ✅ 支持中英文双语切换
- ✅ 自动检测浏览器语言
- ✅ 语言设置持久化存储
- ✅ 全局组件国际化
- ✅ 动态语言切换
- ✅ 响应式语言切换

## 技术实现

### 1. 依赖库
- `vue-i18n@8` - Vue.js国际化库

### 2. 文件结构
```
src/
├── locales/
│   ├── en.js          # 英文语言包
│   └── zh.js          # 中文语言包
├── i18n/
│   └── index.js       # i18n配置文件
└── components/        # 已国际化的组件
```

### 3. 语言包结构
语言包按功能模块组织：
- `common` - 通用词汇
- `navigation` - 导航栏
- `home` - 首页
- `charts` - 图表页面
- `marketData` - 市场数据
- `errors` - 错误消息
- `tooltips` - 工具提示

## 使用方法

### 1. 在组件中使用翻译
```vue
<template>
  <div>
    <h1>{{ $t('home.title') }}</h1>
    <p>{{ $t('home.subtitle') }}</p>
  </div>
</template>
```

### 2. 带参数的翻译
```vue
<template>
  <p>{{ $t('charts.invalidDateFormat', { row: 2, date: '2023-01-01' }) }}</p>
</template>
```

### 3. 编程式语言切换
```javascript
import { setLanguage, getCurrentLanguage } from '../i18n';

// 切换语言
setLanguage('zh'); // 切换到中文
setLanguage('en'); // 切换到英文

// 获取当前语言
const currentLang = getCurrentLanguage();
```

## 已国际化的组件

1. **Navigation.vue** - 导航栏组件
   - 菜单项翻译
   - 按钮文本翻译
   - 语言切换功能

2. **Home.vue** - 首页组件
   - 标题和副标题
   - 错误消息
   - 图表标签

3. **Charts.vue** - 图表页面组件
   - 上传区域文本
   - 文件要求说明
   - 错误消息
   - 图表配置

4. **其他组件** - Chart.vue, FileUploader.vue, StockFetcher.vue
   - 基础文本翻译

## 语言切换

用户可以通过以下方式切换语言：

1. **导航栏语言按钮** - 点击右上角的语言按钮
2. **自动检测** - 首次访问时自动检测浏览器语言
3. **持久化存储** - 语言选择会保存到localStorage

## 添加新翻译

### 1. 在语言包中添加新键值
```javascript
// src/locales/en.js
export default {
  newModule: {
    newKey: 'New Text'
  }
}

// src/locales/zh.js
export default {
  newModule: {
    newKey: '新文本'
  }
}
```

### 2. 在组件中使用
```vue
<template>
  <p>{{ $t('newModule.newKey') }}</p>
</template>
```

## 注意事项

1. **键名规范** - 使用点号分隔的层级结构
2. **参数传递** - 使用对象形式传递参数
3. **响应式更新** - 语言切换后需要刷新页面以完全应用
4. **回退语言** - 英文作为默认回退语言

## 测试

1. 启动开发服务器：`npm run dev`
2. 访问应用并测试语言切换功能
3. 验证所有文本是否正确翻译
4. 检查语言设置是否持久化

## 构建部署

```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 部署到GitHub Pages
npm run deploy
```

国际化功能已完全集成并可以正常使用！
