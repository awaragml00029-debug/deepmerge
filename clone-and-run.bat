@echo off
REM Deep Research Platform - Windows 克隆和运行脚本
REM 融合了通用研究和基因研究的统一平台

echo ==================================================
echo   Deep Research Platform - 克隆和安装脚本
echo   双模式研究系统：通用研究 + 基因研究
echo ==================================================
echo.

REM 1. 克隆仓库
echo [1/5] 克隆仓库...
if exist "deepmerge" (
    echo 目录 'deepmerge' 已存在，跳过克隆
    cd deepmerge
) else (
    git clone https://github.com/awaragml00029-debug/deepmerge.git
    cd deepmerge
    echo √ 仓库克隆成功
)
echo.

REM 2. 切换到功能分支
echo [2/5] 切换到功能分支...
git fetch origin
git checkout claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL
echo √ 已切换到分支: claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL
echo.

REM 3. 安装依赖
echo [3/5] 安装 Node.js 依赖...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo × 未检测到 npm，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
npm install
echo √ 依赖安装成功
echo.

REM 4. 创建环境变量示例文件
echo [4/5] 创建环境变量配置文件...
if not exist ".env.local" (
    (
        echo # Deep Research Platform - 环境变量配置
        echo # 可选：如果您想在服务器端配置 API 密钥（不推荐，建议在 UI 中配置）
        echo.
        echo # OpenAI API Key
        echo # NEXT_PUBLIC_OPENAI_API_KEY=sk-...
        echo.
        echo # Anthropic API Key
        echo # NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
        echo.
        echo # Google API Key
        echo # NEXT_PUBLIC_GOOGLE_API_KEY=...
        echo.
        echo # SiliconFlow API Key
        echo # NEXT_PUBLIC_SILICONFLOW_API_KEY=...
        echo.
        echo # Tavily Search API Key
        echo # NEXT_PUBLIC_TAVILY_API_KEY=...
        echo.
        echo # Serper Search API Key
        echo # NEXT_PUBLIC_SERPER_API_KEY=...
        echo.
        echo # Exa Search API Key
        echo # NEXT_PUBLIC_EXA_API_KEY=...
    ) > .env.local
    echo √ 已创建 .env.local 示例文件
    echo 注意: API 密钥建议在 Web UI 的设置页面中配置（更安全）
) else (
    echo .env.local 已存在，跳过创建
)
echo.

REM 5. 显示完成信息
echo [5/5] 安装完成！
echo.
echo ==================================================
echo √ 安装成功！
echo ==================================================
echo.
echo 📦 下一步操作：
echo.
echo 1. 启动开发服务器:
echo    npm run dev
echo.
echo 2. 在浏览器中访问:
echo    http://localhost:3000
echo.
echo 3. 配置 API 密钥:
echo    • 点击右上角 ⚙️ 设置按钮
echo    • 选择 AI 提供商（OpenAI、Anthropic、Google 或 SiliconFlow）
echo    • 输入对应的 API Key
echo    • 选择搜索提供商（Tavily、Serper 或 Exa）
echo    • 输入搜索 API Key
echo    • 保存设置
echo.
echo 🎯 主要功能：
echo.
echo   ✨ 双模式研究系统
echo      • 通用研究模式 - 适用于各种主题
echo      • 基因研究模式 - 专业基因功能研究
echo.
echo   🤖 AI 提供商支持
echo      • OpenAI (GPT-4, GPT-3.5)
echo      • Anthropic (Claude 3)
echo      • Google (Gemini)
echo      • SiliconFlow (Qwen)
echo.
echo   🔍 搜索集成
echo      • Tavily - AI 优化搜索
echo      • Serper - Google 搜索
echo      • Exa - 语义搜索
echo.
echo   🧬 基因研究功能
echo      • 12 种预定义生物体
echo      • 7 种研究焦点
echo      • 8 种特定研究方面
echo      • 自定义提示词支持
echo.
echo ==================================================
echo 准备就绪！现在可以运行 npm run dev 启动项目
echo ==================================================
echo.
pause
