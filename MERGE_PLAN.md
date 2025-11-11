# Deep Research 项目融合方案

## 项目概述

本方案旨在融合两个深度研究项目：
1. **u14app/deep-research** - 通用深度研究工具
2. **Scilence2022/DeepGeneResearch** - 基因研究专业工具

## 融合目标

创建一个统一的用户界面，支持两种研究模式：
- **通用模式（General Mode）**：适用于各种主题的深度研究
- **专业模式（Gene Mode）**：专门用于基因研究的高级功能

## 核心差异分析

### 1. 文件变更统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 修改文件 (M) | 32 | 主要是配置、组件和工具函数 |
| 新增文件 (A) | 24 | 基因研究相关组件和工具库 |
| 删除文件 (D) | 1 | logo.svg |
| **总计** | **57** | |

### 2. 关键差异点

#### 通用研究模式的特性（已被替换）
```typescript
// 原始 Topic.tsx 功能
- 主题输入框（Textarea）
- 知识资源管理：
  * 本地文件上传
  * 网页爬虫
  * 知识库集成
- 资源列表展示和管理
- 通用的研究提示词
```

#### 基因研究模式的特性（当前实现）
```typescript
// 新的 GeneResearch.tsx 功能
- 基因符号和生物体选择
- 研究焦点选择（7种类型）
- 具体研究方面（8个维度）
- 疾病背景和实验方法
- 自定义提示词（支持变量替换）
- URL参数支持
- 专业的基因研究提示词系统
```

#### 新增的专业工具库
```
src/utils/gene-research/
├── api-integrations.ts        # 生物数据库API集成
├── data-extractor.ts          # 数据提取工具
├── quality-control.ts         # 质量控制
├── enhanced-quality-control.ts # 增强质量控制
├── literature-validator.ts    # 文献验证
├── query-generator.ts         # 查询生成器
├── report-templates.ts        # 报告模板
├── search-providers.ts        # 搜索提供商
└── visualization-generators.ts # 可视化生成器
```

## 融合方案设计

### 架构设计

```
┌─────────────────────────────────────────────┐
│           统一用户界面                        │
│         (src/app/page.tsx)                   │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │   模式切换器           │
        │ (ModeSwitch.tsx)      │
        └───────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   ┌────▼────┐           ┌─────▼─────┐
   │通用模式  │           │ 专业模式   │
   │General  │           │   Gene    │
   └────┬────┘           └─────┬─────┘
        │                      │
   ┌────▼────────┐      ┌─────▼──────────┐
   │ Topic.tsx   │      │GeneResearch.tsx│
   │(通用研究表单)│      │(基因研究表单)   │
   └────┬────────┘      └─────┬──────────┘
        │                      │
   ┌────▼────────┐      ┌─────▼──────────┐
   │通用提示词    │      │基因研究提示词   │
   │prompts.ts   │      │gene-research-  │
   │             │      │prompts.ts      │
   └─────────────┘      └────────────────┘
```

### 1. 状态管理扩展

在 `src/store/setting.ts` 中添加研究模式配置：

```typescript
export interface SettingStore {
  // ... 现有字段

  // 新增：研究模式
  researchMode: 'general' | 'gene';  // 默认 'general'
  setResearchMode: (mode: 'general' | 'gene') => void;
}
```

### 2. 模式切换组件

创建 `src/components/Research/ModeSwitch.tsx`：

```typescript
interface Props {
  mode: 'general' | 'gene';
  onChange: (mode: 'general' | 'gene') => void;
}

export default function ModeSwitch({ mode, onChange }: Props) {
  return (
    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <button
        className={mode === 'general' ? 'active' : ''}
        onClick={() => onChange('general')}
      >
        通用研究 (General)
      </button>
      <button
        className={mode === 'gene' ? 'active' : ''}
        onClick={() => onChange('gene')}
      >
        基因研究 (Gene)
      </button>
    </div>
  );
}
```

### 3. 恢复通用研究功能

创建 `src/components/Research/GeneralResearch.tsx`，恢复原始的通用研究表单：

```typescript
// 包含以下功能：
- 主题输入（Textarea）
- 知识资源管理
  * 文件上传
  * 网页爬虫
  * 知识库
- 资源列表
- 使用通用提示词系统
```

### 4. 重构 Topic.tsx

```typescript
function Topic({ urlGeneSymbol, urlOrganism }: TopicProps) {
  const { researchMode } = useSettingStore();

  return (
    <section className="p-4 border rounded-md mt-4">
      {/* 模式切换器 */}
      <ModeSwitch
        mode={researchMode}
        onChange={(mode) => setResearchMode(mode)}
      />

      {/* 根据模式显示不同的研究界面 */}
      {researchMode === 'general' ? (
        <GeneralResearch />
      ) : (
        <GeneResearch
          urlGeneSymbol={urlGeneSymbol}
          urlOrganism={urlOrganism}
        />
      )}
    </section>
  );
}
```

### 5. 提示词系统整合

```typescript
// src/utils/deep-research/index.ts
export function getPromptsByMode(mode: 'general' | 'gene') {
  if (mode === 'gene') {
    return {
      systemInstruction: geneResearchSystemInstruction,
      questionPrompt: geneResearchQuestionPrompt,
      // ... 其他基因研究提示词
    };
  } else {
    return {
      systemInstruction: generalSystemInstruction,
      questionPrompt: generalQuestionPrompt,
      // ... 其他通用提示词
    };
  }
}
```

### 6. 能力展示组件更新

修改 `src/components/Research/ResearchCapabilities.tsx`，根据模式显示不同的能力：

```typescript
export default function ResearchCapabilities() {
  const { researchMode } = useSettingStore();

  const generalCapabilities = [
    "多源知识整合",
    "智能问答系统",
    "深度文献分析",
    "自动报告生成",
    "知识图谱构建",
    "多语言支持"
  ];

  const geneCapabilities = [
    "分子功能分析",
    "蛋白质结构研究",
    "表达分析",
    "蛋白质相互作用",
    "疾病关联研究",
    "进化分析"
  ];

  const capabilities = researchMode === 'gene'
    ? geneCapabilities
    : generalCapabilities;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {capabilities.map((cap) => (
        <CapabilityCard key={cap} title={cap} />
      ))}
    </div>
  );
}
```

## 实施步骤

### Phase 1: 准备工作（已完成）
- [x] 分析两个项目的差异
- [x] 识别关键文件变更
- [x] 设计融合架构

### Phase 2: 核心功能实现
1. **扩展状态管理**
   - 在 `setting.ts` 中添加 `researchMode` 字段
   - 实现模式切换逻辑

2. **创建模式切换组件**
   - 实现 `ModeSwitch.tsx`
   - 添加样式和国际化支持

3. **恢复通用研究功能**
   - 从 patch 文件中提取原始 Topic.tsx 的代码
   - 创建 `GeneralResearch.tsx` 组件
   - 保留文件上传、爬虫等功能

4. **重构 Topic.tsx**
   - 集成模式切换逻辑
   - 条件渲染 GeneralResearch 或 GeneResearch

### Phase 3: 提示词和工具整合
1. **提示词系统**
   - 在 `deep-research/index.ts` 中实现提示词选择逻辑
   - 确保两种模式使用正确的提示词

2. **能力展示**
   - 更新 `ResearchCapabilities.tsx`
   - 根据模式显示对应能力

### Phase 4: UI/UX 优化
1. **统一样式**
   - 确保两种模式的 UI 风格一致
   - 优化模式切换动画

2. **国际化**
   - 添加模式切换的翻译
   - 更新 `zh-CN.json`, `en-US.json` 等

3. **响应式设计**
   - 确保移动端体验良好

### Phase 5: 测试和部署
1. **功能测试**
   - 测试通用研究模式
   - 测试基因研究模式
   - 测试模式切换

2. **集成测试**
   - 测试提示词切换
   - 测试状态持久化

3. **提交代码**
   - 创建功能分支
   - 提交并推送代码

## 用户体验流程

### 通用研究模式
```
1. 用户访问首页
2. 默认显示"通用模式"
3. 输入研究主题（如："人工智能的发展历史"）
4. 可选：上传相关文件、添加网页链接
5. 点击开始研究
6. 系统使用通用提示词进行研究
7. 生成通用研究报告
```

### 基因研究模式
```
1. 用户访问首页或通过 URL 参数（?gene=TP53&organism=Human）
2. 切换到"专业模式"或自动识别URL参数
3. 选择基因符号和生物体
4. 选择研究焦点和具体方面
5. 可选：输入疾病背景、实验方法、自定义提示
6. 点击开始研究
7. 系统使用基因研究提示词和专业工具
8. 生成专业基因研究报告（包含结构化数据、可视化等）
```

## 技术要点

### 1. 模式切换的状态同步
```typescript
// 使用 Zustand 的持久化功能
const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      researchMode: 'general',
      setResearchMode: (mode) => set({ researchMode: mode }),
      // ...
    }),
    {
      name: 'setting-storage',
    }
  )
);
```

### 2. URL 参数处理
```typescript
// 自动检测基因研究参数
function TopicWithParams() {
  const searchParams = useSearchParams();
  const { researchMode, setResearchMode } = useSettingStore();

  const hasGeneParams = searchParams.has('gene') ||
                        searchParams.has('geneSymbol');

  useEffect(() => {
    if (hasGeneParams && researchMode !== 'gene') {
      setResearchMode('gene');
    }
  }, [hasGeneParams]);

  // ...
}
```

### 3. 动态提示词加载
```typescript
// 在 useDeepResearch hook 中
function useDeepResearch() {
  const { researchMode } = useSettingStore();

  async function askQuestions() {
    const prompts = getPromptsByMode(researchMode);
    // 使用对应的提示词系统
    // ...
  }
}
```

## 兼容性考虑

### 1. 现有数据迁移
- 历史记录中的研究需要标记模式类型
- 设置默认为通用模式，保持向后兼容

### 2. API 兼容性
- 确保两种模式都能正常调用 AI API
- SiliconFlow API 主要用于基因研究模式

### 3. 知识库共享
- 两种模式可以共享知识库
- 文件上传在通用模式下可用
- 基因研究模式也可以支持补充资料上传

## 预期效果

### 功能完整性
- ✅ 保留通用研究的所有功能
- ✅ 保留基因研究的所有专业功能
- ✅ 用户可以无缝切换两种模式
- ✅ 统一的用户界面和体验

### 用户价值
- 🎯 **研究人员**：可以使用通用模式进行文献综述
- 🧬 **生物学家**：可以使用专业模式进行深度基因研究
- 🔄 **灵活切换**：根据不同的研究需求选择合适的模式
- 📊 **专业工具**：基因研究模式提供生物数据库集成和可视化

### 技术优势
- 🏗️ **模块化设计**：两种模式独立但共享核心功能
- 🔌 **易于扩展**：未来可以添加更多专业模式（如医学、化学等）
- 💾 **状态管理**：使用 Zustand 统一管理应用状态
- 🎨 **一致性**：统一的 UI 组件库和设计语言

## 风险和挑战

### 1. 复杂度增加
- **风险**：代码库变得更复杂
- **缓解**：保持模块化，清晰的代码组织

### 2. 性能影响
- **风险**：加载两套系统可能影响性能
- **缓解**：使用动态导入（dynamic import）按需加载

### 3. 用户困惑
- **风险**：用户可能不清楚何时使用哪种模式
- **缓解**：提供清晰的说明和示例，智能模式推荐

## 后续优化方向

1. **智能模式推荐**
   - 根据用户输入自动推荐合适的模式
   - 例如：检测到基因符号格式自动建议切换到基因模式

2. **混合模式**
   - 在通用模式中集成部分基因研究功能
   - 提供更灵活的研究工具组合

3. **更多专业模式**
   - 医学研究模式
   - 化学研究模式
   - 材料科学模式

4. **模式配置预设**
   - 保存用户的模式偏好设置
   - 快速切换常用配置

## 总结

本融合方案通过引入**模式切换机制**，成功地将通用研究和基因专业研究整合到一个统一的平台中。用户可以根据研究需求灵活选择合适的模式，既保留了通用研究的广泛适用性，又提供了基因研究的专业深度。

整个方案遵循以下原则：
- ✨ **用户为中心**：提供简洁直观的模式切换体验
- 🔧 **技术可行**：基于现有架构，最小化重构
- 📈 **可扩展**：为未来添加更多专业模式打下基础
- 🎯 **价值最大化**：两种模式的功能都得到完整保留

---

**创建时间**：2025-11-11
**版本**：v1.0
**状态**：待实施
