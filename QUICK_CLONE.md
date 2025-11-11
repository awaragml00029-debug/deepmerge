# 🚀 快速克隆和运行指南

## 一键安装脚本

### Linux / macOS

```bash
# 下载并运行安装脚本
curl -O https://raw.githubusercontent.com/awaragml00029-debug/deepmerge/claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL/clone-and-run.sh
chmod +x clone-and-run.sh
./clone-and-run.sh
```

或者手动执行：

```bash
# 1. 克隆仓库
git clone https://github.com/awaragml00029-debug/deepmerge.git
cd deepmerge

# 2. 切换到功能分支
git checkout claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

### Windows

下载并运行 `clone-and-run.bat`：

```cmd
REM 下载脚本到当前目录
curl -O https://raw.githubusercontent.com/awaragml00029-debug/deepmerge/claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL/clone-and-run.bat

REM 运行脚本
clone-and-run.bat
```

或者使用 PowerShell：

```powershell
# 克隆仓库
git clone https://github.com/awaragml00029-debug/deepmerge.git
cd deepmerge

# 切换分支
git checkout claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

---

## 📝 访问应用

安装完成后：

1. 打开浏览器访问：**http://localhost:3000**
2. 点击右上角 **⚙️ 设置**按钮配置 API 密钥
3. 开始使用双模式研究系统！

---

## 🔑 配置 API 密钥

### 方法 1: 在 Web UI 中配置（推荐）

1. 访问 http://localhost:3000
2. 点击右上角 ⚙️ 设置图标
3. 选择 **AI 提供商**：
   - OpenAI → 输入 `sk-...`
   - Anthropic → 输入 `sk-ant-...`
   - Google → 输入您的 API Key
   - SiliconFlow → 输入您的 API Key

4. 选择**搜索提供商**：
   - Tavily → 输入 API Key
   - Serper → 输入 API Key
   - Exa → 输入 API Key

5. 点击**保存**

### 方法 2: 使用环境变量（可选）

编辑 `.env.local` 文件：

```env
# AI 提供商
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_GOOGLE_API_KEY=...
NEXT_PUBLIC_SILICONFLOW_API_KEY=...

# 搜索提供商
NEXT_PUBLIC_TAVILY_API_KEY=...
NEXT_PUBLIC_SERPER_API_KEY=...
NEXT_PUBLIC_EXA_API_KEY=...
```

---

## 🎯 功能概览

### 双模式研究系统

#### 🔬 通用研究模式
- 适用于任何主题的深度研究
- 支持文件上传（PDF、Word、TXT等）
- 网页爬虫集成
- 知识库管理
- AI 智能问答

#### 🧬 基因研究模式
- 12 种预定义生物体（大肠杆菌、人类、小鼠等）
- 7 种研究焦点（分子功能、蛋白结构、疾病关联等）
- 8 种特定研究方面
- 疾病背景分析
- 实验方法规划
- 自定义研究提示词

### AI 提供商支持
- ✅ **OpenAI** - GPT-4, GPT-3.5-turbo
- ✅ **Anthropic** - Claude 3 Sonnet/Opus
- ✅ **Google** - Gemini Pro
- ✅ **SiliconFlow** - Qwen 模型

### 搜索引擎集成
- 🔍 **Tavily** - AI 优化的搜索引擎
- 🔍 **Serper** - Google 搜索 API
- 🔍 **Exa** - 语义搜索引擎

### 完整研究工作流
1. **生成搜索查询** - AI 分析问题，生成 3-5 个精准查询
2. **执行网络搜索** - 多查询并行搜索，去重整合
3. **AI 深度分析** - 提取关键见解，识别模式
4. **生成完整报告** - 结构化 Markdown 报告

### 结果导出
- 📋 复制到剪贴板
- 📄 导出为 Markdown 文件
- 🖨️ 打印/导出为 PDF
- 🔗 完整的源引用列表

---

## 📚 详细文档

项目包含完整文档：

- **README.md** - 项目概述
- **USER_GUIDE.md** - 详细使用指南
- **IMPLEMENTATION_COMPLETE.md** - 技术实现报告
- **TROUBLESHOOTING.md** - 常见问题解决

---

## 🛠️ NPM 命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

---

## 🌐 项目信息

- **仓库**: https://github.com/awaragml00029-debug/deepmerge
- **分支**: claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL
- **最新提交**: a89e9d9
- **版本**: 1.0.0

---

## 🎉 开始使用

访问 **http://localhost:3000** 并开始您的第一个研究！

### 通用研究示例
```
主题: "量子计算的最新进展"
```

### 基因研究示例
```
基因: TP53
生物体: Human
焦点: Disease Association
疾病背景: Cancer, Li-Fraumeni syndrome
```

---

**祝研究愉快！** 🚀
