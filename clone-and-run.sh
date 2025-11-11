#!/bin/bash

# Deep Research Platform - 完整克隆和运行脚本
# 融合了通用研究和基因研究的统一平台

set -e  # 遇到错误立即退出

echo "=================================================="
echo "  Deep Research Platform - 克隆和安装脚本"
echo "  双模式研究系统：通用研究 + 基因研究"
echo "=================================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 克隆仓库
echo -e "${BLUE}[1/5] 克隆仓库...${NC}"
if [ -d "deepmerge" ]; then
    echo -e "${YELLOW}目录 'deepmerge' 已存在，跳过克隆${NC}"
    cd deepmerge
else
    git clone https://github.com/awaragml00029-debug/deepmerge.git
    cd deepmerge
    echo -e "${GREEN}✓ 仓库克隆成功${NC}"
fi
echo ""

# 2. 切换到功能分支
echo -e "${BLUE}[2/5] 切换到功能分支...${NC}"
git fetch origin
git checkout claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL
echo -e "${GREEN}✓ 已切换到分支: claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL${NC}"
echo ""

# 3. 安装依赖
echo -e "${BLUE}[3/5] 安装 Node.js 依赖...${NC}"
if command -v npm &> /dev/null; then
    npm install
    echo -e "${GREEN}✓ 依赖安装成功${NC}"
else
    echo -e "${YELLOW}⚠ 未检测到 npm，请先安装 Node.js${NC}"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi
echo ""

# 4. 创建环境变量示例文件
echo -e "${BLUE}[4/5] 创建环境变量配置文件...${NC}"
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# Deep Research Platform - 环境变量配置
# 可选：如果您想在服务器端配置 API 密钥（不推荐，建议在 UI 中配置）

# OpenAI API Key
# NEXT_PUBLIC_OPENAI_API_KEY=sk-...

# Anthropic API Key
# NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...

# Google API Key
# NEXT_PUBLIC_GOOGLE_API_KEY=...

# SiliconFlow API Key
# NEXT_PUBLIC_SILICONFLOW_API_KEY=...

# Tavily Search API Key
# NEXT_PUBLIC_TAVILY_API_KEY=...

# Serper Search API Key
# NEXT_PUBLIC_SERPER_API_KEY=...

# Exa Search API Key
# NEXT_PUBLIC_EXA_API_KEY=...
EOF
    echo -e "${GREEN}✓ 已创建 .env.local 示例文件${NC}"
    echo -e "${YELLOW}注意: API 密钥建议在 Web UI 的设置页面中配置（更安全）${NC}"
else
    echo -e "${YELLOW}.env.local 已存在，跳过创建${NC}"
fi
echo ""

# 5. 显示完成信息和下一步
echo -e "${BLUE}[5/5] 安装完成！${NC}"
echo ""
echo "=================================================="
echo -e "${GREEN}✓ 安装成功！${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📦 下一步操作：${NC}"
echo ""
echo "1. 启动开发服务器:"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo "2. 在浏览器中访问:"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "3. 配置 API 密钥:"
echo "   • 点击右上角 ⚙️ 设置按钮"
echo "   • 选择 AI 提供商（OpenAI、Anthropic、Google 或 SiliconFlow）"
echo "   • 输入对应的 API Key"
echo "   • 选择搜索提供商（Tavily、Serper 或 Exa）"
echo "   • 输入搜索 API Key"
echo "   • 保存设置"
echo ""
echo -e "${BLUE}🎯 主要功能：${NC}"
echo ""
echo "  ✨ 双模式研究系统"
echo "     • 通用研究模式 - 适用于各种主题"
echo "     • 基因研究模式 - 专业基因功能研究"
echo ""
echo "  🤖 AI 提供商支持"
echo "     • OpenAI (GPT-4, GPT-3.5)"
echo "     • Anthropic (Claude 3)"
echo "     • Google (Gemini)"
echo "     • SiliconFlow (Qwen)"
echo ""
echo "  🔍 搜索集成"
echo "     • Tavily - AI 优化搜索"
echo "     • Serper - Google 搜索"
echo "     • Exa - 语义搜索"
echo ""
echo "  🧬 基因研究功能"
echo "     • 12 种预定义生物体"
echo "     • 7 种研究焦点"
echo "     • 8 种特定研究方面"
echo "     • 自定义提示词支持"
echo ""
echo "  📊 研究工作流"
echo "     • 生成搜索查询"
echo "     • 执行网络搜索"
echo "     • AI 分析结果"
echo "     • 生成完整报告"
echo ""
echo "  💾 导出功能"
echo "     • 复制到剪贴板"
echo "     • 导出 Markdown"
echo "     • 打印/导出 PDF"
echo ""
echo -e "${BLUE}📚 文档：${NC}"
echo "  • README.md - 项目概述"
echo "  • QUICKSTART.md - 快速开始指南"
echo "  • USER_GUIDE.md - 用户使用手册"
echo "  • IMPLEMENTATION_COMPLETE.md - 完整实现报告"
echo ""
echo -e "${BLUE}🛠️ 其他命令：${NC}"
echo ""
echo "  构建生产版本:"
echo -e "    ${GREEN}npm run build${NC}"
echo ""
echo "  启动生产服务器:"
echo -e "    ${GREEN}npm run start${NC}"
echo ""
echo "  代码检查:"
echo -e "    ${GREEN}npm run lint${NC}"
echo ""
echo "=================================================="
echo -e "${GREEN}准备就绪！现在可以运行 npm run dev 启动项目${NC}"
echo "=================================================="
