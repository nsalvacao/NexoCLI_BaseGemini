# NexoCLI - Professional Google Gemini CLI

> **NexoCLI** is a professionally customized fork of [Gemini-CLI](https://github.com/google-gemini/gemini-cli) by Google LLC, maintaining full original functionality while adding specific customizations for the Nexo development ecosystem.

**🎯 Focus:** Minimal customization of the original Gemini-CLI with professional branding, custom commands, and preparation for hybrid multi-agent solution integration.

**Maintained by** [Nuno Salvação](mailto:nexo-modeling@outlook.com) | **Licensed under** Apache License 2.0

---

## 📋 **Complete Solution Architecture**

This project is part of a **hybrid solution** composed of 4 components:

### **1. 🔧 NexoCLI** (This repository)
- **Function:** Professional customization of the original Gemini-CLI
- **Responsibility:** Interface with Google Gemini models
- **Status:** Active development
- **Command:** `nexocli`

### **2. 🤖 Ollama**
- **Function:** Local LLM models
- **Responsibility:** Offline model execution
- **Status:** Original solution maintained
- **Command:** `ollama`

### **3. 🎛️ n8n Orchestrator**
- **Function:** Visual agent orchestration
- **Responsibility:** Workflow and routing between agents
- **Status:** Planned integration
- **Interface:** Web dashboard

### **4. 🖥️ Unified Interface**
- **Function:** Single menu for all agents
- **Responsibility:** Consolidated UX
- **Status:** Planned development
- **Type:** Terminal or web menu

---

## ⚡ **Quick Start**

### **Option 1: NPM Installation (Recommended)**

```bash
# Install globally
npm install -g @nsalvacao/nexo-cli

# Use anywhere
nexocli "Hello! This is the professional NexoCLI."
nexocli --version
```

### **Option 2: Local Development**

```bash
# Clone and install
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install

# Build and test
npm run build
./bundle/nexocli.js --version

# Use directly
./bundle/nexocli.js "Hello! This is the professional NexoCLI."
```

---

## 🔧 **Prerequisites**

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Google Account** (for OAuth authentication)
- **Internet connection** (for Google Gemini API access)

### **System Requirements**
- **Linux/macOS/Windows** (all platforms supported)
- **RAM:** 4GB minimum (8GB recommended)
- **Storage:** 500MB free space

---

## 🔐 **Authentication**

NexoCLI uses **separate authentication** from the original Gemini-CLI:

- **Gemini-CLI:** Uses `~/.gemini/` directory
- **NexoCLI:** Uses `~/.nexocli/` directory
- **Migration:** Automatic migration from existing Gemini-CLI credentials

### **Authentication Methods**

1. **OAuth (Recommended - Free)**
   - 60 requests per minute
   - No API key required
   - Automatic browser authentication

2. **API Key (Optional - Higher quotas)**
   - Requires Google Cloud project
   - Higher rate limits available
   - Set via `GOOGLE_API_KEY` environment variable

### **First Run**
```bash
nexocli "test authentication"
# Browser will open for Google OAuth
# Credentials stored in ~/.nexocli/
```

---

## 🚀 **Usage**

### **Basic Commands**
```bash
# Interactive mode
nexocli

# Direct query
nexocli "Explain quantum computing"

# Help
nexocli --help

# Version
nexocli --version
```

### **File Context**
```bash
# Include files in context
nexocli "@src/app.js explain this code"

# Multiple files
nexocli "@src/*.js @docs/README.md review this project"
```

### **Shell Integration**
```bash
# Execute shell commands
nexocli "!ls -la"
nexocli "!npm run test"
```

---

## 📁 **Project Structure**

```
NexoCLI_BaseGemini/
├── packages/
│   ├── cli/                    # CLI interface
│   │   ├── src/ui/components/  # UI components
│   │   ├── src/ui/themes/      # Visual themes
│   │   └── src/config/         # Configuration
│   └── core/                   # Core functionality
│       ├── src/tools/          # Available tools
│       ├── src/core/           # Core logic
│       └── src/utils/          # Utilities
├── bundle/                     # Built application
├── docs/                       # Documentation
├── scripts/                    # Build scripts
└── dev-assets/                 # Development files (excluded from NPM)
```

---

## 🔄 **Uninstall/Reinstall**

### **Uninstall**
```bash
# NPM installation
npm uninstall -g @nsalvacao/nexo-cli

# Local installation
rm -rf ~/.nexocli/  # Remove user settings
```

### **Reinstall**
```bash
# Clean reinstall
npm uninstall -g @nsalvacao/nexo-cli
npm install -g @nsalvacao/nexo-cli

# Verify
nexocli --version
```

---

## 📜 **Licensing and Compliance**

### **Original Attribution**
This project is based on [Gemini-CLI](https://github.com/google-gemini/gemini-cli) by Google LLC.

**Original License:** Apache License 2.0  
**Copyright:** 2025 Google LLC  
**Modifications:** 2025 Nuno Salvação

### **Compliance Requirements**
- All modified files include proper attribution headers
- Original Apache 2.0 license maintained
- Full source code available on GitHub
- Transparent modification documentation

### **Legal Notice**
```
Based on Gemini-CLI (Copyright 2025 Google LLC, Apache 2.0)
Modified by Nuno Salvação, 2025
Part of NexoCLI_BaseGemini - Customization for Nexo ecosystem
```

---

## 🌐 **Hybrid Solution Integration**

### **Future Integration Points**
- **n8n Orchestrator:** Visual workflow management
- **Unified Interface:** Single entry point for all agents
- **API Endpoints:** REST/WebSocket communication
- **Configuration Management:** Centralized settings

### **Planned Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🔧 NexoCLI    │    │   🤖 Ollama     │    │  🎛️ n8n Orch.  │
│ (Google Gemini) │    │ (Local Models)  │    │ (Orchestrator)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  🖥️ Unified     │
                    │   Interface     │
                    └─────────────────┘
```

---

## 📈 **Version History**

- **v0.1.14** - Complete authentication separation
- **v0.1.13** - English internationalization
- **v0.1.12** - NPM publication ready
- **v0.1.11** - Professional branding
- **v0.1.10** - Initial customization

---

## 🤝 **Contributing**

### **Development Guidelines**
1. Follow original Gemini-CLI patterns
2. Maintain Apache 2.0 license compliance
3. Include proper attribution headers
4. Test on multiple platforms
5. Document all changes

### **Attribution Template**
```typescript
// Modified by [Your Name], 2025
// Based on gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Part of NexoCLI_BaseGemini - Customization for Nexo ecosystem
```

---

## 🔗 **Links**

- **Repository:** [GitHub](https://github.com/nsalvacao/NexoCLI_BaseGemini)
- **NPM Package:** [@nsalvacao/nexo-cli](https://www.npmjs.com/package/@nsalvacao/nexo-cli)
- **Original Project:** [Gemini-CLI](https://github.com/google-gemini/gemini-cli)
- **Documentation:** [GitHub Wiki](https://github.com/nsalvacao/NexoCLI_BaseGemini/wiki)
- **Issues:** [GitHub Issues](https://github.com/nsalvacao/NexoCLI_BaseGemini/issues)

---

## 📞 **Support**

**Maintainer:** [Nuno Salvação](mailto:nexo-modeling@outlook.com)  
**Purpose:** Professional AI development tools  
**Ecosystem:** Nexo hybrid multi-agent solution

**For issues:** Please use [GitHub Issues](https://github.com/nsalvacao/NexoCLI_BaseGemini/issues)  
**For questions:** Contact the maintainer directly

---

*NexoCLI - Professional Google Gemini CLI | Based on Gemini-CLI by Google LLC | Apache License 2.0*