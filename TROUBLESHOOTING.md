# 故障排除指南 / Troubleshooting Guide

## ✅ 问题已解决！

你刚遇到的构建错误已经修复！所有缺失的组件都已添加。

## 📦 已添加的文件

### UI 组件 (7个)
- ✅ `src/components/Internal/Button.tsx`
- ✅ `src/components/ui/form.tsx`
- ✅ `src/components/ui/input.tsx`
- ✅ `src/components/ui/textarea.tsx`
- ✅ `src/components/ui/card.tsx`
- ✅ `src/components/ui/badge.tsx`
- ✅ `src/components/ui/select.tsx`
- ✅ `src/components/ui/dropdown-menu.tsx`

### Knowledge 组件 (3个)
- ✅ `src/components/Knowledge/ResourceList.tsx`
- ✅ `src/components/Knowledge/Crawler.tsx`
- ✅ `src/components/Knowledge/index.tsx`

### Hooks (4个)
- ✅ `src/hooks/useDeepResearch.ts`
- ✅ `src/hooks/useAiProvider.ts`
- ✅ `src/hooks/useKnowledge.ts`
- ✅ `src/hooks/useAccurateTimer.ts`

### Stores (3个)
- ✅ `src/store/global.ts`
- ✅ `src/store/task.ts`
- ✅ `src/store/history.ts`

### 工具 (1个)
- ✅ `src/lib/utils.ts`

## 🔄 如何更新

### 方法1：拉取最新代码

```bash
# 拉取最新更改
git pull origin claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

# 重新安装依赖（如果package.json有更新）
npm install

# 重新构建
npm run dev
```

### 方法2：重新克隆

如果遇到问题，可以重新克隆：

```bash
cd ..
rm -rf deepmerge  # 删除旧目录
git clone https://github.com/awaragml00029-debug/deepmerge.git
cd deepmerge
git checkout claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL
npm install
npm run dev
```

## 🐛 常见构建错误及解决方案

### 错误1: Module not found: Can't resolve '@/components/...'

**原因**: 缺少组件文件

**解决**:
```bash
# 确保已拉取最新代码
git pull origin claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

# 检查文件是否存在
ls src/components/Internal/
ls src/components/ui/
ls src/components/Knowledge/
```

### 错误2: Cannot find module '@/hooks/...'

**原因**: 缺少 hooks 文件

**解决**:
```bash
# 检查hooks目录
ls src/hooks/

# 如果缺失，拉取最新代码
git pull
```

### 错误3: Cannot find module '@/store/...'

**原因**: 缺少 store 文件

**解决**:
```bash
# 检查store目录
ls src/store/

# 应该包含：
# - setting.ts
# - global.ts
# - task.ts
# - history.ts
```

### 错误4: Module not found: Can't resolve '@/lib/utils'

**原因**: 缺少 utils 文件

**解决**:
```bash
# 检查lib目录
ls src/lib/

# 如果不存在，拉取最新代码
git pull
```

### 错误5: 依赖安装失败

**解决**:
```bash
# 清除缓存并重新安装
rm -rf node_modules package-lock.json
npm install

# 或使用 yarn
rm -rf node_modules yarn.lock
yarn install
```

### 错误6: Type errors in components

**解决**:
```bash
# 确保TypeScript配置正确
cat tsconfig.json

# 重新安装类型定义
npm install --save-dev @types/node @types/react @types/react-dom
```

### 错误7: Tailwind CSS not working

**解决**:
```bash
# 检查 Tailwind 配置
cat tailwind.config.ts
cat postcss.config.js

# 重新构建
npm run dev
```

## ✨ 验证安装

运行以下命令验证所有文件都正确安装：

```bash
# 检查关键文件
echo "检查 UI 组件..."
ls src/components/Internal/Button.tsx
ls src/components/ui/*.tsx

echo "检查 Knowledge 组件..."
ls src/components/Knowledge/*.tsx

echo "检查 Hooks..."
ls src/hooks/*.ts

echo "检查 Stores..."
ls src/store/*.ts

echo "检查工具..."
ls src/lib/utils.ts

# 如果所有文件都存在，显示成功消息
echo "✅ 所有文件检查完成！"
```

## 🚀 启动应用

```bash
# 开发模式
npm run dev

# 应该看到：
# ▲ Next.js 14.x.x
# - Local: http://localhost:3000
# ✓ Ready in 2.3s

# 访问
open http://localhost:3000
```

## 📝 当前功能状态

### ✅ 已实现
- 双模式切换（通用/基因研究）
- 模式切换UI
- 状态管理（Zustand）
- 基本UI组件
- 表单验证（Zod）
- 国际化支持（i18n）

### 🚧 待完善（需要原项目的完整实现）
- 深度研究逻辑（askQuestions）
- AI API 集成
- 搜索功能集成
- 文件处理逻辑
- 网页爬虫功能

## 💡 提示

如果你想要**完整的功能实现**，建议使用**方法一**（推荐方式）：

```bash
# 1. 克隆完整的基因研究项目
git clone https://deepwiki.com/Scilence2022/DeepGeneResearch.git my-app
cd my-app

# 2. 应用融合更改
git remote add fusion https://github.com/awaragml00029-debug/deepmerge.git
git fetch fusion
git checkout -b unified fusion/claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

# 3. 安装运行
npm install
cp .env.example .env
# 编辑 .env 添加 API keys
npm run dev
```

这样你会得到：
- ✅ 完整的 AI 集成
- ✅ 完整的搜索功能
- ✅ 完整的文件处理
- ✅ 双模式系统

## 🆘 仍有问题？

1. **查看日志**: 仔细阅读错误信息
2. **检查文件**: 确保所有文件都已下载
3. **重新安装**: `rm -rf node_modules && npm install`
4. **重新克隆**: 删除目录并重新克隆
5. **提交Issue**: 在GitHub上创建Issue并附上完整错误信息

## 📞 联系方式

- GitHub: https://github.com/awaragml00029-debug/deepmerge
- 分支: claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL

---

**最后更新**: 2025-11-11
**状态**: ✅ 所有构建错误已修复
