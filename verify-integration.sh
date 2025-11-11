#!/bin/bash

echo "🔍 验证 deepmerge 项目集成状态"
echo "================================"
echo ""

# 检查原项目核心功能
echo "✓ 原项目核心文件检查:"
echo "  - API 路由数量: $(find src/app/api -name "route.ts" | wc -l) 个"
echo "  - AI 提供商: $(ls src/app/api/ai/ | wc -l) 个"
echo "  - 搜索提供商: $(ls src/app/api/search/ | wc -l) 个"
echo "  - MCP 支持: $([ -d src/app/api/mcp ] && echo "✓" || echo "✗")"
echo "  - SSE 支持: $([ -d src/app/api/sse ] && echo "✓" || echo "✗")"
echo ""

# 检查新增组件
echo "⭐ 新增基因研究组件:"
for component in ModeSwitch GeneResearch GeneralResearch ResearchCapabilities; do
  if [ -f "src/components/Research/${component}.tsx" ]; then
    size=$(wc -l < "src/components/Research/${component}.tsx")
    echo "  ✓ ${component}.tsx (${size} 行)"
  else
    echo "  ✗ ${component}.tsx 缺失"
  fi
done
echo ""

# 检查修改的文件
echo "📝 核心修改文件:"
echo "  - setting.ts: $(grep -q "ResearchMode" src/store/setting.ts && echo "✓ 包含 ResearchMode" || echo "✗")"
echo "  - Topic.tsx: $(grep -q "ModeSwitch" src/components/Research/Topic.tsx && echo "✓ 包含双模式" || echo "✗")"
echo "  - zh-CN.json: $(grep -q "research.mode" src/locales/zh-CN.json && echo "✓ 包含模式翻译" || echo "✗")"
echo "  - en-US.json: $(grep -q "research.mode" src/locales/en-US.json && echo "✓ 包含模式翻译" || echo "✗")"
echo ""

# 检查 Git 状态
echo "📦 Git 状态:"
current_branch=$(git branch --show-current)
echo "  - 当前分支: ${current_branch}"
echo "  - 最新提交: $(git log -1 --oneline)"
echo ""

# 检查依赖
echo "📚 依赖检查:"
echo "  - node_modules: $([ -d node_modules ] && echo "✓ 已安装" || echo "✗ 未安装")"
echo "  - checkbox 组件: $([ -f src/components/ui/checkbox.tsx ] && echo "✓" || echo "✗")"
echo ""

# 检查构建
echo "🏗️  构建状态:"
if [ -d .next ]; then
  echo "  ✓ 项目已构建"
else
  echo "  ℹ️  项目未构建（需要运行 npm run build）"
fi
echo ""

echo "================================"
echo "✅ 集成验证完成！"
echo ""
echo "📖 快速开始:"
echo "  1. npm install          # 安装依赖（如需要）"
echo "  2. npm run dev          # 启动开发服务器"
echo "  3. 访问 http://localhost:3000"
echo ""
echo "📚 查看完整文档:"
echo "  cat INTEGRATION_COMPLETE.md"
