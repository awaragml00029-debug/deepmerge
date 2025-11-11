# 本地运行指南 / Local Setup Guide

## 📥 方法一：从 GitHub 克隆（推荐）

### 1. 克隆仓库

```bash
# 克隆融合后的仓库
git clone https://github.com/awaragml00029-debug/deepmerge.git
cd deepmerge

# 切换到融合分支
git checkout claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL
```

### 2. 注意事项

⚠️ **重要**: 当前仓库包含融合方案和核心组件，但还需要完整的项目依赖文件。

有两个选择：

#### 选项 A：基于现有基因研究项目

```bash
# 1. 克隆完整的基因研究项目
git clone https://deepwiki.com/Scilence2022/DeepGeneResearch.git temp-gene-research
cd temp-gene-research

# 2. 添加我们的融合仓库作为远程
git remote add merged https://github.com/awaragml00029-debug/deepmerge.git
git fetch merged

# 3. 切换到融合分支
git checkout -b merged-version merged/claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

# 4. 安装依赖
npm install

# 5. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 API keys

# 6. 运行项目
npm run dev
```

#### 选项 B：从头搭建（使用我们创建的文件）

由于项目需要很多其他依赖文件，我建议：

1. **下载完整的基因研究项目作为基础**
2. **然后替换关键文件**

## 📦 方法二：手动设置（完整步骤）

### 前置要求

- Node.js 18+
- npm 或 yarn
- Git

### 步骤 1: 获取基础项目

```bash
# 克隆基因研究项目作为基础
git clone https://deepwiki.com/Scilence2022/DeepGeneResearch.git deep-research-unified
cd deep-research-unified
```

### 步骤 2: 下载融合文件

从我们的仓库下载以下文件并替换：

```bash
# 下载融合分支的文件
git remote add merged https://github.com/awaragml00029-debug/deepmerge.git
git fetch merged claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

# 检出特定文件
git checkout merged/claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL -- \
  src/store/setting.ts \
  src/components/Research/ModeSwitch.tsx \
  src/components/Research/GeneralResearch.tsx \
  src/components/Research/Topic.tsx \
  src/components/Research/ResearchCapabilities.tsx \
  src/locales/zh-CN.json \
  src/locales/en-US.json \
  README.md
```

### 步骤 3: 安装依赖

```bash
npm install
```

### 步骤 4: 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，添加你的 API keys
nano .env  # 或使用你喜欢的编辑器
```

需要配置的 API Keys：

```env
# 至少配置一个 AI Provider
OPENAI_API_KEY=sk-...           # OpenAI
ANTHROPIC_API_KEY=sk-ant-...    # Anthropic Claude
GOOGLE_API_KEY=...              # Google Gemini
SILICONFLOW_API_KEY=...         # SiliconFlow

# 至少配置一个搜索 Provider
TAVILY_API_KEY=tvly-...         # Tavily Search
SERPER_API_KEY=...              # Serper
```

### 步骤 5: 运行项目

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build
npm start
```

### 步骤 6: 访问应用

打开浏览器访问：
- 本地地址: http://localhost:3000
- 通用研究: http://localhost:3000
- 基因研究（带参数）: http://localhost:3000/?gene=TP53&organism=Human

## 🔑 获取 API Keys

### OpenAI
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API key
3. 复制并添加到 `.env`

### Anthropic
1. 访问 https://console.anthropic.com/settings/keys
2. 创建新的 API key
3. 复制并添加到 `.env`

### Tavily (搜索)
1. 访问 https://tavily.com
2. 注册并获取 API key
3. 复制并添加到 `.env`

### SiliconFlow (可选，用于基因研究)
1. 访问 https://siliconflow.cn
2. 注册并获取 API key
3. 复制并添加到 `.env`

## 📂 项目结构

```
deep-research-unified/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 主页面
│   │   └── globals.css          # 全局样式
│   ├── components/
│   │   ├── Research/
│   │   │   ├── Topic.tsx        # 主组件（双模式集成）
│   │   │   ├── ModeSwitch.tsx   # 模式切换器
│   │   │   ├── GeneralResearch.tsx  # 通用研究界面
│   │   │   ├── GeneResearch.tsx     # 基因研究界面
│   │   │   └── ResearchCapabilities.tsx  # 能力展示
│   │   ├── Internal/            # 内部组件
│   │   ├── Knowledge/           # 知识库组件
│   │   └── ui/                  # UI 组件
│   ├── store/
│   │   └── setting.ts           # 状态管理（含researchMode）
│   ├── hooks/                   # 自定义 Hooks
│   ├── utils/                   # 工具函数
│   └── locales/                 # 国际化
│       ├── zh-CN.json
│       └── en-US.json
├── public/                      # 静态资源
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── .env                         # 环境变量（需创建）
```

## 🚀 使用方法

### 通用研究模式

1. 访问 http://localhost:3000
2. 确保"通用研究"模式已选中
3. 输入研究主题：
   ```
   人工智能的发展历史和未来趋势
   ```
4. （可选）添加资源：
   - 上传 PDF、Word 等文件
   - 使用网页爬虫添加在线资源
   - 从知识库选择已有资源
5. 点击"开始研究"

### 基因研究模式

#### 方法 1: 手动输入
1. 访问 http://localhost:3000
2. 切换到"基因研究"模式
3. 输入：
   - 基因符号: `TP53`
   - 生物体: 选择 `Homo sapiens`
4. 选择研究焦点：
   - ✓ 疾病关联
   - ✓ 蛋白质结构
5. 点击"开始研究"

#### 方法 2: URL 参数
直接访问：
```
http://localhost:3000/?gene=TP53&organism=Homo%20sapiens
```
系统会自动：
- 切换到基因研究模式
- 填充基因和生物体信息

## 🐛 常见问题

### 1. 端口被占用

```bash
# 使用不同端口
npm run dev -- -p 3001
```

### 2. 依赖安装失败

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### 3. API Key 无效

- 检查 `.env` 文件格式
- 确保没有多余的空格或引号
- 验证 API key 是否有效

### 4. 模块找不到

```bash
# 重新安装类型定义
npm install --save-dev @types/node @types/react @types/react-dom
```

### 5. 样式不生效

```bash
# 重新构建 Tailwind
npm run dev
# 清除浏览器缓存并刷新
```

## 📝 开发提示

### 热重载
修改代码后自动刷新，无需重启服务器。

### 查看日志
```bash
# 在终端查看详细日志
npm run dev
```

### 调试
在浏览器中打开开发者工具 (F12)，查看：
- Console: 查看错误信息
- Network: 查看 API 请求
- React DevTools: 查看组件状态

## 🎯 下一步

1. ✅ 配置至少一个 AI Provider
2. ✅ 配置至少一个搜索 Provider
3. ✅ 测试通用研究模式
4. ✅ 测试基因研究模式
5. ✅ 尝试 URL 参数功能
6. 🎨 自定义主题和样式
7. 🌐 添加更多语言支持

## 📞 获取帮助

如遇问题：
1. 查看 `MERGE_PLAN.md` 了解架构设计
2. 查看 `README.md` 了解功能特性
3. 查看 `IMPLEMENTATION_SUMMARY.md` 了解实现细节
4. 在 GitHub 上创建 Issue

## 🎉 开始使用

```bash
# 一键启动
npm run dev

# 访问
open http://localhost:3000
```

祝研究愉快！🚀
