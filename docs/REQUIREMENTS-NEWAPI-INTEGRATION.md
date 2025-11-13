# NewAPI 集成需求文档

**项目**: Deep Research
**功能**: NewAPI 集成与主题定制系统
**日期**: 2025-11-13
**状态**: ✅ 已完成

---

## 📋 需求概述

为 Deep Research 项目集成 NewAPI 统一网关，实现 API 密钥验证、余额管理和主题定制功能，提升用户体验并防止密钥滥用。

---

## 🎯 核心需求

### 需求 1: 主题颜色选择器

**优先级**: P0
**状态**: ✅ 已完成

#### 功能描述
在页面右上角添加主题选择按钮，用户点击后可从 5 种预设颜色主题中选择，点击后立即生效。

#### 详细要求
- **触发方式**: 点击调色板图标按钮
- **展示形式**: 弹出浮层，显示 5 个圆形颜色按钮
- **配色方案**:
  1. Ocean Blue（海洋蓝）- `#3b82f6`
  2. Forest Green（森林绿）- `#10b981`
  3. Royal Purple（皇家紫）- `#8b5cf6`
  4. Sunset Orange（日落橙）- `#f97316`
  5. Cherry Pink（樱桃粉）- `#ec4899`
- **交互效果**:
  - 点击颜色圆圈立即生效
  - 当前选中的颜色显示高亮边框
  - 点击浮层外区域关闭选择器
- **持久化**: 使用 localStorage 保存用户选择，下次访问自动恢复
- **生效范围**:
  - 所有按钮悬停/激活状态
  - 链接颜色
  - 强调文字颜色
  - 边框和聚焦环颜色

#### 技术实现
- **状态管理**: Zustand + persist middleware
- **样式应用**: 动态注入 CSS 样式到 `<head>`，使用 `data-theme` 属性选择器
- **CSS 变量**: `--theme-primary`, `--theme-secondary`, `--theme-accent`

#### 验收标准
- [ ] 调色板按钮在 Header 右上角显示
- [ ] 点击后显示 5 个颜色圆圈
- [ ] 点击颜色后整个 UI 立即变色
- [ ] 当前主题有视觉高亮
- [ ] 刷新页面后主题保持

---

### 需求 2: API Key 验证与功能锁定

**优先级**: P0
**状态**: ✅ 已完成

#### 功能描述
添加 NewAPI Token 验证机制，未验证前锁定相关功能，验证成功后自动切换随机主题作为视觉反馈。

#### 详细要求

**验证前状态**:
- 余额按钮显示灰色占位符（硬币图标 + `--`）
- 按钮不可点击
- 提示文字："Please set NewAPI token in Settings to see balance"

**验证流程**:
1. 用户在 Settings → General 标签输入 NewAPI Token
2. 点击 Save 按钮
3. 系统调用 NewAPI 验证接口：`https://off.092420.xyz/api/token?key={token}`
4. 验证响应：
   - **成功**:
     - 显示成功 Toast 提示："NewAPI token validated successfully!"
     - **立即随机切换一个主题颜色**（视觉反馈）
     - 保存 token 到本地存储
     - 获取并显示余额信息
     - 更新状态为 `validated`
   - **失败**:
     - 显示错误 Toast 提示："Token validation failed: {error message}"
     - 不保存 token
     - 保持功能锁定状态
     - 更新状态为 `failed`

**验证后状态**:
- 余额按钮显示真实余额
- 刷新按钮可用
- 自动每 5 分钟刷新余额

#### 状态机
```
unset (初始)
  ↓ [用户输入 token]
validating (验证中)
  ↓ [API 返回]
validated (成功) / failed (失败)
```

#### NewAPI 接口规范

**验证接口**: `GET /api/token?key={token}`

**响应格式**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "My Token",
    "status": 1,
    "remain_quota": 50000,
    "used_quota": 10000
  }
}
```

**字段说明**:
- `status`: 1=启用, 2=禁用
- `remain_quota`: 剩余额度（单位：1/1000美元）
- `used_quota`: 已用额度（单位：1/1000美元）

#### 技术实现
- **状态管理**: 独立的 auth store (Zustand)
- **字段类型**: `KeyStatus = 'unset' | 'validating' | 'validated' | 'failed'`
- **验证工具**: `src/utils/newapi.ts` - `validateNewAPIToken()`
- **随机主题**: `useThemeStore.getState().setRandomTheme()`

#### 验收标准
- [ ] Settings 中有 NewAPI Token 输入框（密码字段）
- [ ] 输入 token 并 Save 触发验证
- [ ] 验证过程中显示 loading 状态
- [ ] 验证成功显示 Toast 并随机切换主题
- [ ] 验证失败显示错误信息且不保存
- [ ] 清空 token 后状态重置为 unset

---

### 需求 3: 余额显示与充值引导

**优先级**: P0
**状态**: ✅ 已完成

#### 功能描述
在 Header 添加余额显示按钮，根据余额多少显示不同的图标和交互行为，余额不足时引导用户充值。

#### 详细要求

**显示位置**: Header 右上角第一个按钮（GitHub 链接之前）

**显示逻辑**:

| 状态 | 条件 | 图标 | 文字 | 颜色 | 可点击 | 点击行为 |
|------|------|------|------|------|--------|----------|
| 未验证 | `keyStatus !== 'validated'` | 硬币图标 🪙 | `--` | 灰色 | ❌ | 无 |
| 余额充足 | `balance > $10` | 金币 Emoji 💰 | `$XX.XX` | 金色 | ❌ | 无（仅展示） |
| 余额不足 | `balance ≤ $10` | 硬币图标 🪙 + ⚠️ | `$XX.XX` | 灰色 | ✅ | 跳转充值页面 |

**交互细节**:

1. **未验证状态**:
   - 显示灰色占位符
   - 鼠标悬停提示："Please set NewAPI token in Settings to see balance"
   - 按钮禁用

2. **余额充足（> $10）**:
   - 金色硬币 Emoji 💰
   - 金色文字显示余额
   - **不可点击**（`cursor: default`）
   - 鼠标悬停提示："Balance: $XX.XX"
   - 仅作展示用途

3. **余额不足（≤ $10）**:
   - 灰色硬币图标
   - 灰色文字显示余额
   - 右侧显示警告图标 ⚠️
   - **可点击**，点击跳转到：`https://off.092420.xyz/topup`
   - 鼠标悬停提示："Click to recharge"

**刷新机制**:
- **自动刷新**: 每 5 分钟自动调用接口刷新余额
- **手动刷新**:
  - 余额按钮右侧显示刷新按钮（循环箭头图标）
  - 点击触发立即刷新
  - 刷新时图标旋转动画
  - 禁用状态防止重复点击

#### 余额计算
- **API 返回**: `remain_quota` 单位为 1/1000 美元
- **前端显示**: 转换为美元，保留 2 位小数
- **示例**:
  - API: `remain_quota: 25500` → 前端: `$25.50`
  - API: `remain_quota: 8300` → 前端: `$8.30`

#### 充值链接
- **URL**: `https://off.092420.xyz/topup`
- **打开方式**: `window.open(url, '_blank')` 新标签页打开

#### 技术实现
- **组件**: `src/components/Internal/BalanceButton.tsx`
- **状态来源**: `useAuthStore()` - balance, token, isBalanceLow, isFeatureEnabled
- **API 调用**: `getTokenBalance(token)` 每 5 分钟 + 手动触发
- **样式**: TailwindCSS + lucide-react 图标

#### 验收标准
- [ ] Header 显示余额按钮
- [ ] 未验证时显示灰色占位符
- [ ] 余额 > $10 显示金币，不可点击
- [ ] 余额 ≤ $10 显示灰色币+警告，可点击跳转
- [ ] 自动每 5 分钟刷新余额
- [ ] 手动刷新按钮工作正常
- [ ] 刷新时有 loading 动画

---

### 需求 4: 防止 API Key 共享机制

**优先级**: P1
**状态**: ⏸️ 暂缓（NewAPI 自带速率限制）

#### 背景
用户希望防止一个 API Key 被多人共享使用，造成资源滥用。

#### 分析结论
经过技术调研，发现 **NewAPI 本身已内置强大的速率限制和配额管理功能**，可以在 NewAPI 管理后台配置：

- **速率限制** (Rate Limiting): 限制每个 token 的请求频率
- **配额管理** (Quota Management): 限制每个 token 的总用量
- **使用监控** (Usage Tracking): 实时追踪每个 token 的使用情况
- **Token 状态控制**: 管理员可随时禁用/启用 token

#### 推荐方案
1. **依赖 NewAPI 自带功能**（推荐）:
   - 在 NewAPI 后台为每个 token 设置合理的速率限制
   - 设置每日/每月配额上限
   - 监控异常使用模式
   - 优点：无需开发，功能完善，维护简单

2. **前端设备指纹绑定**（备选）:
   - 使用 FingerprintJS 生成浏览器指纹
   - 首次验证时绑定设备
   - 后续验证检查设备匹配
   - 复杂度：中等，约 3-4 小时开发
   - 缺点：用户换设备/浏览器需要重新绑定

3. **Session Token 机制**（备选）:
   - 验证后生成短期 session token
   - 前端使用 session token 而非原始 key
   - Session token 定期过期
   - 复杂度：高，约 6-8 小时开发
   - 需要后端支持

#### 当前决策
**暂不实现**，原因：
1. NewAPI 自带功能已足够强大
2. 避免重复造轮子
3. 降低系统复杂度
4. 减少维护成本

如后续有特殊需求，可再评估实施备选方案。

---

## 🏗️ 技术架构

### 技术栈
- **框架**: Next.js 15.5.6 (App Router)
- **语言**: TypeScript
- **状态管理**: Zustand + persist middleware
- **样式**: TailwindCSS
- **图标**: lucide-react
- **Toast 提示**: sonner

### 目录结构
```
src/
├── components/
│   ├── Internal/
│   │   ├── BalanceButton.tsx       # 余额显示按钮
│   │   ├── ThemeSelector.tsx       # 主题选择器
│   │   └── Header.tsx              # 页面头部（集成上述组件）
│   ├── Provider/
│   │   └── ThemeColorProvider.tsx  # 主题颜色初始化
│   └── Setting.tsx                 # 设置对话框（集成 token 验证）
├── store/
│   ├── theme.ts                    # 主题状态管理
│   ├── auth.ts                     # 认证和余额状态管理
│   └── setting.ts                  # 设置状态管理（新增 newApiToken）
├── utils/
│   └── newapi.ts                   # NewAPI 工具函数
└── app/
    └── layout.tsx                  # 根布局（集成 ThemeColorProvider）
```

### 核心模块

#### 1. Theme Store (`src/store/theme.ts`)
```typescript
interface ThemeStore {
  currentTheme: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  setRandomTheme: () => void;
  applyTheme: (themeId: ThemeId) => void;
}
```

**关键功能**:
- 5 种主题配置：THEMES 常量
- `applyTheme()`: 动态注入 CSS 样式
- `setRandomTheme()`: 随机选择主题
- 持久化到 localStorage: `theme-storage`

#### 2. Auth Store (`src/store/auth.ts`)
```typescript
interface AuthStore {
  token: string;
  keyStatus: KeyStatus;
  balance: number;
  usedBalance: number;
  tokenInfo: TokenInfo | null;

  setToken: (token: string) => void;
  setKeyStatus: (status: KeyStatus) => void;
  setBalance: (remain: number, used: number) => void;
  isFeatureEnabled: () => boolean;
  isBalanceLow: () => boolean;
}

type KeyStatus = 'unset' | 'validating' | 'validated' | 'failed';
```

**关键功能**:
- Token 验证状态管理
- 余额追踪（remain + used）
- 特征开关：`isFeatureEnabled()`
- 低余额判断：`isBalanceLow()` (≤ $10)

#### 3. NewAPI Utils (`src/utils/newapi.ts`)
```typescript
// 验证 Token
async function validateNewAPIToken(token: string): Promise<ValidationResult>

// 获取余额
async function getTokenBalance(token: string): Promise<number | null>

// 充值链接
function getRechargeURL(): string
```

**API 基础地址**: `https://off.092420.xyz`

---

## 🔄 业务流程

### 流程 1: 首次使用
```
用户打开应用
  ↓
看到灰色余额占位符 "--"
  ↓
点击 Settings 按钮
  ↓
进入 General 标签
  ↓
输入 NewAPI Token
  ↓
点击 Save
  ↓
[验证中] 按钮显示 "Saving..."
  ↓
[成功]
  - Toast: "NewAPI token validated successfully!"
  - 主题随机切换（视觉反馈）
  - 余额按钮显示真实金额
  - 对话框关闭
```

### 流程 2: 正常使用
```
用户打开应用
  ↓
自动加载已验证的 token
  ↓
余额按钮显示当前余额
  ↓
[余额 > $10]
  → 显示金币 💰（不可点击）

[余额 ≤ $10]
  → 显示灰色币 + ⚠️（可点击）
  → 用户点击 → 跳转充值页面
```

### 流程 3: 主题切换
```
用户点击调色板图标
  ↓
弹出 5 个颜色圆圈
  ↓
用户点击某个颜色
  ↓
立即生效：
  - CSS 样式注入到 <head>
  - 所有蓝色元素变为选中颜色
  - 当前颜色显示高亮边框
  - 保存到 localStorage
```

---

## 🧪 测试用例

### 测试场景 1: 主题选择器
| 用例 ID | 测试步骤 | 预期结果 |
|---------|----------|----------|
| T1.1 | 点击调色板图标 | 显示 5 个颜色圆圈弹层 |
| T1.2 | 点击蓝色圆圈 | 整体 UI 变为蓝色系 |
| T1.3 | 点击绿色圆圈 | 整体 UI 变为绿色系 |
| T1.4 | 当前主题是紫色 | 紫色圆圈显示高亮边框 |
| T1.5 | 点击弹层外区域 | 弹层关闭 |
| T1.6 | 刷新页面 | 主题保持上次选择 |

### 测试场景 2: Token 验证
| 用例 ID | 测试步骤 | 预期结果 |
|---------|----------|----------|
| T2.1 | 输入有效 token 并保存 | Toast 成功提示，主题随机切换 |
| T2.2 | 输入无效 token 并保存 | Toast 错误提示，不保存 token |
| T2.3 | 输入禁用的 token | Toast 提示 "Token is disabled" |
| T2.4 | 网络错误 | Toast 提示 "Network error" |
| T2.5 | 清空 token 字段并保存 | 状态重置为 unset |
| T2.6 | 验证成功后刷新页面 | 自动恢复验证状态和余额 |

### 测试场景 3: 余额显示
| 用例 ID | 测试步骤 | 预期结果 |
|---------|----------|----------|
| T3.1 | 未设置 token | 显示灰色 "--" 占位符 |
| T3.2 | Token 验证成功，余额 $25.50 | 显示金币 💰 + "$25.50"，金色 |
| T3.3 | 余额为 $8.30 | 显示灰币 + "$8.30" + ⚠️，灰色 |
| T3.4 | 余额 > $10 时点击按钮 | 无响应（不可点击） |
| T3.5 | 余额 ≤ $10 时点击按钮 | 新标签页打开充值页面 |
| T3.6 | 点击刷新按钮 | 图标旋转，余额更新 |
| T3.7 | 等待 5 分钟 | 余额自动刷新 |

### 测试场景 4: 边界情况
| 用例 ID | 测试步骤 | 预期结果 |
|---------|----------|----------|
| T4.1 | 余额恰好为 $10.00 | 视为低余额，可点击充值 |
| T4.2 | 余额为 $0.00 | 显示 "$0.00"，可点击充值 |
| T4.3 | API 返回 null/undefined | 不更新余额，显示上次值 |
| T4.4 | 快速连续点击刷新按钮 | 防抖，只执行一次 |
| T4.5 | 在多个标签页同时打开 | 每个标签页独立状态，localStorage 同步 |

---

## 📊 性能要求

| 指标 | 目标值 | 说明 |
|------|--------|------|
| Token 验证响应时间 | < 2s | NewAPI 接口响应时间 |
| 主题切换响应时间 | < 100ms | 立即生效，无感知延迟 |
| 余额刷新响应时间 | < 1s | 手动刷新时 |
| 页面首次加载 | < 3s | 包含主题应用 |
| 自动刷新间隔 | 5 分钟 | 不频繁请求，节省资源 |

---

## 🔒 安全要求

1. **Token 存储**:
   - 使用 Zustand persist 加密存储在 localStorage
   - 不在 URL 中暴露 token
   - 不在控制台日志中打印 token

2. **API 调用**:
   - HTTPS 加密传输
   - Token 通过 query parameter 传递（NewAPI 规范）
   - 不缓存包含 token 的响应

3. **输入验证**:
   - Token 格式检查（必须以 `sk-` 开头）
   - 防止 XSS 注入
   - 防止 SQL 注入（虽然是纯前端）

4. **错误处理**:
   - 不在错误信息中暴露敏感信息
   - 网络错误友好提示
   - API 错误码规范处理

---

## 📱 兼容性要求

### 浏览器支持
- Chrome/Edge ≥ 90
- Firefox ≥ 88
- Safari ≥ 14
- 不支持 IE

### 设备支持
- Desktop: 1920×1080 及以上
- Tablet: 768×1024 及以上
- Mobile: 375×667 及以上（响应式）

### 暗黑模式
- 完全支持暗黑模式
- 根据系统主题自动切换
- 主题颜色在暗黑模式下同样生效

---

## 🚀 部署要求

### 环境变量
无新增环境变量，使用默认 Next.js 配置。

### 构建命令
```bash
npm run build
```

### 验证构建
```bash
npm run build  # 应无 TypeScript/ESLint 错误
npm run start  # 启动生产环境验证
```

### 部署检查清单
- [ ] TypeScript 编译通过
- [ ] ESLint 无错误
- [ ] 所有功能测试通过
- [ ] 暗黑模式测试通过
- [ ] 移动端响应式测试通过
- [ ] NewAPI 接口可访问（https://off.092420.xyz）

---

## 📝 开发日志

### 2025-11-13

**v1.0.0 - 初始实现**
- ✅ 创建主题选择器组件
- ✅ 创建余额显示按钮
- ✅ 集成 NewAPI 验证
- ✅ 添加随机主题切换
- ⚠️ 问题：主题颜色未生效

**v1.0.1 - 修复主题应用**
- ✅ 创建 ThemeColorProvider
- ✅ 增强 applyTheme 函数
- ✅ 动态注入 CSS 样式
- ✅ 主题切换正常工作

**v1.0.2 - 优化余额按钮**
- ✅ 修改显示逻辑
- ✅ 未验证时也显示占位符
- ✅ 提升功能可发现性

---

## 📚 相关文档

### 内部文档
- [README.md](../README.md) - 项目说明
- [CHANGELOG.md](../CHANGELOG.md) - 版本历史

### 外部文档
- [NewAPI 官方文档](https://github.com/Calcium-Ion/new-api)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Zustand 文档](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TailwindCSS 文档](https://tailwindcss.com/docs)

---

## 🎯 未来优化

### 短期计划（可选）
1. **主题预览**：鼠标悬停颜色圆圈时预览效果
2. **余额趋势**：显示最近 7 天的使用趋势图
3. **通知提醒**：余额低于 $5 时浏览器通知

### 长期计划（待评估）
1. **自定义主题**：允许用户自定义颜色
2. **多账户管理**：支持多个 NewAPI token 切换
3. **使用统计**：详细的 API 调用统计和分析
4. **设备指纹绑定**：如需防共享，实现方案 2

---

## ✅ 验收清单

### 功能验收
- [ ] 主题选择器显示并工作正常
- [ ] 5 种颜色主题都能正确应用
- [ ] Token 验证流程完整
- [ ] 验证成功后随机切换主题
- [ ] 余额按钮 3 种状态显示正确
- [ ] 余额自动刷新工作正常
- [ ] 手动刷新按钮正常
- [ ] 充值跳转链接正确

### 代码质量
- [ ] TypeScript 无错误
- [ ] ESLint 无警告
- [ ] 代码有充分注释
- [ ] 组件结构清晰
- [ ] 状态管理合理

### 用户体验
- [ ] 操作流程顺畅
- [ ] 错误提示友好
- [ ] 加载状态明确
- [ ] 响应速度快
- [ ] 视觉反馈及时

### 文档完整性
- [ ] 需求文档完整
- [ ] 代码注释充分
- [ ] 提交信息清晰
- [ ] 变更记录详细

---

## 📞 联系方式

**项目维护者**: Claude AI Assistant
**Git Branch**: `claude/merge-deep-research-projects-011CV1LgxQytq6kS5F8XhXrL`
**最后更新**: 2025-11-13

---

**文档版本**: 1.0.0
**文档状态**: ✅ 最终版
