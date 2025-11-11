# 🚀 快速开始指南

## 方法一：完整克隆（推荐）⭐

### 1️⃣ 克隆仓库

```bash
git clone https://github.com/awaragml00029-debug/deepmerge.git
cd deepmerge
git checkout claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL
```

### 2️⃣ 注意

⚠️ 当前仓库包含**融合后的核心组件**，但还需要一些依赖文件。

**最佳方案**：基于原始项目应用我们的更改

```bash
# 克隆基因研究项目（包含所有依赖）
git clone https://deepwiki.com/Scilence2022/DeepGeneResearch.git my-research-app
cd my-research-app

# 添加融合仓库
git remote add fusion https://github.com/awaragml00029-debug/deepmerge.git
git fetch fusion

# 应用融合分支的更改
git checkout -b unified fusion/claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL
```

### 3️⃣ 安装依赖

```bash
npm install
```

### 4️⃣ 配置 API Keys

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
nano .env
```

**必需的 API Keys**（至少配置一个）：

```env
# AI Provider (选一个)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Search Provider (选一个)
TAVILY_API_KEY=tvly-...
SERPER_API_KEY=...
```

### 5️⃣ 运行项目

```bash
npm run dev
```

### 6️⃣ 访问应用

打开浏览器访问：http://localhost:3000

## 方法二：手动下载 ZIP

### 1️⃣ 下载代码

访问 GitHub 仓库页面：
```
https://github.com/awaragml00029-debug/deepmerge
```

1. 切换到分支：`claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL`
2. 点击绿色 "Code" 按钮
3. 选择 "Download ZIP"
4. 解压到本地目录

### 2️⃣ 安装和运行

```bash
cd deepmerge-main
npm install
cp .env.example .env
# 编辑 .env 文件添加 API keys
npm run dev
```

## 方法三：混合方案（推荐新手）

这个方法结合了两个项目的优点：

### 步骤详解

```bash
# 1. 克隆基础项目（DeepGeneResearch，包含所有依赖）
git clone https://deepwiki.com/Scilence2022/DeepGeneResearch.git deep-research
cd deep-research

# 2. 下载融合文件
# 创建一个临时目录
mkdir ../temp-fusion
cd ../temp-fusion

# 克隆融合仓库
git clone https://github.com/awaragml00029-debug/deepmerge.git
cd deepmerge
git checkout claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

# 3. 复制融合文件到主项目
cp -r src/store ../deep-research/src/
cp -r src/components/Research/ModeSwitch.tsx ../deep-research/src/components/Research/
cp -r src/components/Research/GeneralResearch.tsx ../deep-research/src/components/Research/
cp -r src/components/Research/Topic.tsx ../deep-research/src/components/Research/
cp -r src/components/Research/ResearchCapabilities.tsx ../deep-research/src/components/Research/
cp -r src/locales ../deep-research/src/
cp README.md ../deep-research/
cp SETUP_GUIDE.md ../deep-research/

# 4. 返回主项目
cd ../../deep-research

# 5. 安装依赖
npm install

# 6. 配置环境变量
cp .env.example .env
nano .env  # 添加你的 API keys

# 7. 运行
npm run dev
```

## 🔑 获取 API Keys

### OpenAI (推荐)
1. 访问：https://platform.openai.com/api-keys
2. 登录/注册
3. 点击 "Create new secret key"
4. 复制 key 到 `.env` 文件

### Anthropic Claude
1. 访问：https://console.anthropic.com/
2. 进入 Settings → API Keys
3. 创建新 key
4. 复制到 `.env` 文件

### Tavily Search (搜索功能)
1. 访问：https://tavily.com
2. 注册账号
3. 获取 API key
4. 复制到 `.env` 文件

## ✅ 验证安装

### 启动成功标志：

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Ready in 2.3s
```

### 测试功能：

1. **访问首页**
   ```
   http://localhost:3000
   ```
   应该看到模式切换器和研究能力展示

2. **测试通用模式**
   - 选择"通用研究"
   - 输入主题："人工智能发展史"
   - 点击"开始研究"

3. **测试基因模式**
   - 切换到"基因研究"
   - 输入基因：TP53
   - 选择物种：Homo sapiens
   - 点击"开始研究"

4. **测试 URL 参数**
   ```
   http://localhost:3000/?gene=BRCA1&organism=Human
   ```
   应该自动切换到基因模式并填充表单

## ❗ 常见问题

### Q: 端口 3000 已被占用
```bash
npm run dev -- -p 3001
```

### Q: 找不到模块
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: API key 不工作
- 检查 `.env` 文件格式（无引号、无空格）
- 重启开发服务器
- 验证 key 是否有效

### Q: 页面空白
- 打开浏览器控制台 (F12)
- 查看 Console 中的错误
- 确保所有依赖已安装

## 📚 进一步学习

- **详细设置**：查看 `SETUP_GUIDE.md`
- **功能说明**：查看 `README.md`
- **实现细节**：查看 `IMPLEMENTATION_SUMMARY.md`
- **架构设计**：查看 `MERGE_PLAN.md`

## 🎯 下一步

1. ✅ 成功运行项目
2. 🔍 测试通用研究模式
3. 🧬 测试基因研究模式
4. 🎨 自定义配置和样式
5. 📝 开始你的研究！

## 💡 提示

- **保存工作**：研究结果会自动保存在浏览器本地存储
- **主题切换**：支持亮色/暗色主题
- **语言切换**：支持中文/英文界面
- **模式记忆**：系统会记住你上次选择的研究模式

## 🆘 获取帮助

遇到问题？
1. 查看详细文档（`SETUP_GUIDE.md`）
2. 检查 GitHub Issues
3. 提交新 Issue

---

**祝研究愉快！** 🚀🎉

如有任何问题，欢迎反馈！
