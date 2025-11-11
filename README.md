# Deep Research - Unified Platform

A unified research platform combining general research capabilities with specialized gene research tools.

## 🎯 Overview

This project merges two powerful research tools into one unified platform:

- **u14app/deep-research** - General-purpose deep research tool
- **Scilence2022/DeepGeneResearch** - Specialized gene research platform

## ✨ Features

### Dual Research Modes

#### 🔬 General Research Mode
- **Multi-Source Integration**: Documents, web pages, knowledge bases
- **Intelligent Q&A**: AI-powered question answering and reasoning
- **Deep Analysis**: Automatic literature analysis and synthesis
- **Auto-Report**: Generate structured research reports
- **Knowledge Graph**: Build concept relationships automatically
- **Multi-Language**: Support for multiple languages

#### 🧬 Gene Research Mode
- **Molecular Function**: Catalytic activity, binding sites, enzyme classification
- **Protein Structure**: Domains, motifs, 3D structure, PTMs
- **Expression Analysis**: Tissue specificity, developmental patterns
- **Protein Interactions**: PPI, DNA/RNA binding, small molecules
- **Disease Associations**: Mutations, phenotypes, therapeutics
- **Evolutionary Analysis**: Orthologs, paralogs, conservation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Unified User Interface             │
│         (src/app/page.tsx)                   │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │   Mode Switch          │
        │ (ModeSwitch.tsx)       │
        └───────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   ┌────▼────┐           ┌─────▼─────┐
   │General  │           │   Gene    │
   │ Mode    │           │   Mode    │
   └────┬────┘           └─────┬─────┘
        │                      │
   ┌────▼────────┐      ┌─────▼──────────┐
   │GeneralResearch│   │GeneResearch     │
   │  Component   │    │   Component     │
   └──────────────┘    └────────────────┘
```

## 📁 Project Structure

```
deepmerge/
├── MERGE_PLAN.md                      # Detailed merge plan
├── differences.patch                   # Patch file with all changes
├── file_changes.txt                    # List of changed files
├── src/
│   ├── components/
│   │   └── Research/
│   │       ├── Topic.tsx              # Main component with mode integration
│   │       ├── ModeSwitch.tsx         # Mode switcher component
│   │       ├── GeneralResearch.tsx    # General research interface
│   │       ├── GeneResearch.tsx       # Gene research interface
│   │       └── ResearchCapabilities.tsx # Dynamic capabilities display
│   ├── store/
│   │   └── setting.ts                 # State management with researchMode
│   └── locales/
│       ├── zh-CN.json                 # Chinese translations
│       └── en-US.json                 # English translations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Usage

#### General Research Mode

1. Select "General Research" mode
2. Enter your research topic
3. Optionally add:
   - Local files
   - Web pages via crawler
   - Knowledge base entries
4. Click "Start Research"

#### Gene Research Mode

1. Select "Gene Research" mode
2. Enter gene symbol (e.g., TP53)
3. Select organism (e.g., Homo sapiens)
4. Choose research focus:
   - General function
   - Disease associations
   - Protein structure
   - Expression analysis
   - Interactions
   - Evolution
   - Therapeutics
5. Select specific aspects if needed
6. Optionally add disease context or experimental approach
7. Click "Start Research"

#### URL Parameters

You can pre-fill gene research with URL parameters:

```
http://localhost:3000/?gene=TP53&organism=Homo%20sapiens
```

## 🔧 Implementation Details

### State Management

The research mode is managed globally using Zustand:

```typescript
export interface SettingStore {
  researchMode: "general" | "gene";
  setResearchMode: (mode: ResearchMode) => void;
  // ... other settings
}
```

### Mode Switching

The `ModeSwitch` component provides an intuitive toggle:

```tsx
<ModeSwitch
  mode={researchMode}
  onChange={(mode) => setResearchMode(mode)}
/>
```

### Dynamic Capabilities

The `ResearchCapabilities` component automatically adjusts based on the current mode:

```tsx
const capabilities = researchMode === "gene"
  ? geneCapabilities
  : generalCapabilities;
```

## 📊 Merge Statistics

- **57 files changed**
  - 24 new files (gene research components and utilities)
  - 32 modified files (configurations and integrations)
  - 1 deleted file (logo.svg)

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI**: React, Tailwind CSS, shadcn/ui
- **State**: Zustand with persistence
- **Forms**: React Hook Form with Zod validation
- **i18n**: react-i18next
- **Icons**: Lucide React

## 📝 Configuration

### Environment Variables

```env
# AI Provider APIs
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_key
SILICONFLOW_API_KEY=your_key

# Search Provider
TAVILY_API_KEY=your_key
SERPER_API_KEY=your_key

# MCP Settings
MCP_SERVER_TIMEOUT=600
SSE_API_TIMEOUT=600
```

## 🎨 UI/UX Features

- **Dark Mode**: Full support via next-themes
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions between modes
- **Accessibility**: ARIA labels and keyboard navigation
- **Internationalization**: Full i18n support

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

## 📦 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t deep-research .

# Run container
docker run -p 3000:3000 deep-research
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project combines features from:
- u14app/deep-research
- Scilence2022/DeepGeneResearch

Please refer to the original repositories for licensing information.

## 🙏 Acknowledgments

- Original u14app/deep-research project
- Original Scilence2022/DeepGeneResearch project
- All contributors and maintainers

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [MERGE_PLAN.md](./MERGE_PLAN.md) for implementation details

---

**Version**: 1.0.0
**Last Updated**: 2025-11-11
**Status**: ✅ Implementation Complete
