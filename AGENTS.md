# AGENTS.md - Official Guide for NexoCLI Agents

**Title:** "AGENTS.md - NexoCLI"  
**Version:** v2.0  
**Created:** 2025-07-14  
**Last Updated:** 2025-07-15  
**Node:** ["NexoCLI"]  
**Purpose:** ["Agent guide", "Licensing compliance", "Structured workflow", "Development context"]  
**Origin:** ["Nuno Salvação", "Gemini-CLI fork by Google LLC"]  
**Reusable:** true  
**Status:** "active"  
**Dependencies:** ["LICENSE", "README.md", "CHANGELOG.md", "ROADMAP.md"]  
**Tags:** ["@compliance", "@agents", "@logging", "@licensing", "@workflow", "@nexocli"]

---

# AGENTS.md — Official Guide for NexoCLI Agents

## 1. NexoCLI Project Context

### 1.1. Overview
**NexoCLI** is a professionally customized fork of [Gemini-CLI](https://github.com/google-gemini/gemini-cli) by Google LLC (Apache 2.0), focused on **minimal customization** and **integration with hybrid multi-agent solution**.

### 1.2. Complete Solution Architecture
The project is part of a 4-component ecosystem:

1. **🔧 NexoCLI** (This repository) - Professional Gemini-CLI customization
2. **🤖 Ollama** - Local LLM models (original solution)
3. **🎛️ n8n Orchestrator** - Visual agent orchestration
4. **🖥️ Unified Interface** - Consolidated menu (terminal/web)

### 1.3. NexoCLI Specific Objectives
- **Minimal customization:** Maintain 100% compatibility with original Gemini-CLI
- **Professional branding:** `gemini` → `nexocli` without breaking changes
- **Integration preparation:** APIs for n8n orchestration
- **Isolated development:** Without affecting global installation

---

## 2. Compliance and Licensing Rules

### 2.1. Mandatory Legal Attribution
**CRITICAL:** All modified files must include:

```typescript
// Modified by [Agent Name], 2025
// Based on gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Part of NexoCLI_BaseGemini - Customization for Nexo ecosystem
```

### 2.2. Compliance Checklist
Before any change:
- [ ] Attribution header in modified files
- [ ] No API keys or credentials in code
- [ ] `package.json` configured with `"bin": {"nexocli": "bundle/nexocli.js"}`
- [ ] Build and functionality tests performed
- [ ] Documentation updated as needed
- [ ] Development log created

### 2.3. Mandatory Documentation
- **README.md** - Main documentation (customized)
- **AGENTS.md** - This file (agent instructions)
- **CHANGELOG.md** - Change history
- **LICENSE** - Apache 2.0 (original maintained)
- **ROADMAP.md** - Future planning

---

## 3. Current and Planned Customizations

### 3.1. ✅ Implemented
- **Complete rebranding:** `gemini` → `nexocli` in package.json
- **Professional ASCII art:** "NEXO CLI" logo implemented
- **NPM publication:** Available as `@nsalvacao/nexo-cli`
- **Authentication separation:** Uses `.nexocli` instead of `.gemini`
- **Automatic migration:** Seamless transition from existing Gemini-CLI
- **Windows compatibility:** Tested and validated
- **English internationalization:** Complete interface in English

### 3.2. 🔄 In Planning
- **Custom slash commands:** `/nexo info`, `/nexo status`, `/nexo config`
- **n8n integration:** Endpoints for orchestration
- **Unified interface:** Consolidated menu for multiple agents
- **Modular configuration:** Nexo-specific settings

### 3.3. 📋 Planned
- **n8n integration:** Endpoints for orchestration
- **Unified interface:** Consolidated menu
- **Modular configuration:** Nexo-specific settings

---

## 4. Project Structure

### 4.1. Main Directories
```
NexoCLI_BaseGemini/
├── packages/
│   ├── cli/                    # CLI interface
│   │   ├── src/ui/components/  # UI components
│   │   │   ├── AsciiArt.ts    # 🎯 CUSTOMIZED: Nexo logo
│   │   │   ├── Header.tsx     # 🎯 CUSTOMIZED: Welcome messages
│   │   │   └── Tips.tsx       # 🎯 CUSTOMIZED: English tips
│   │   └── src/ui/hooks/
│   │       └── slashCommandProcessor.ts # 🎯 CUSTOMIZE: Commands
│   └── core/                   # Core logic (MAINTAIN)
│       ├── src/tools/          # Available tools
│       ├── src/utils/          # Utilities
│       └── src/code_assist/    # Authentication
├── bundle/                     # 🎯 OUTPUT: nexocli.js
├── docs/                       # Documentation
├── scripts/                    # Build scripts
├── dev-assets/                 # Development files (excluded from NPM)
│   └── Dev_Logs/              # Development logs
└── [documentation]             # README, AGENTS, etc.
```

### 4.2. Key Files for Customization
- `package.json` - Main configuration (bin, name, version)
- `packages/cli/src/ui/components/AsciiArt.ts` - ASCII art
- `packages/cli/src/ui/components/Header.tsx` - Header
- `packages/cli/src/ui/components/Tips.tsx` - Tips and welcome messages
- `packages/cli/src/ui/hooks/slashCommandProcessor.ts` - Slash commands
- `packages/core/src/utils/paths.ts` - Directory paths
- `packages/core/src/code_assist/oauth2.ts` - OAuth authentication
- `packages/core/src/utils/user_account.ts` - User account management

---

## 5. Development Workflow

### 5.1. Isolated Development Environment
```bash
# Initial setup
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install

# Safe development (doesn't affect global installation)
npm run build
./bundle/nexocli.js --version
./bundle/nexocli.js "functionality test"

# Development alias
alias nexocli-dev="./bundle/nexocli.js"
```

### 5.2. Modification Process
1. **Identify file** to modify
2. **Add attribution header**
3. **Implement minimal change**
4. **Test locally:** `npm run build && ./bundle/nexocli.js`
5. **Validate basic functionality**
6. **Document change** in log

### 5.3. Mandatory Testing
```bash
# Basic tests
npm run build                   # Build success
./bundle/nexocli.js --version   # Version OK
./bundle/nexocli.js "test"      # Basic functionality

# Customization tests
./bundle/nexocli.js --version | grep -i nexo
./bundle/nexocli.js /help      # Available commands
```

---

## 6. Current Project Status

### 6.1. Completed Phase 1: Professional Branding
**Status:** ✅ Completed and exceeded expectations
**Achievements:**
- ✅ Global NPM publication: `npm install -g @nsalvacao/nexo-cli`
- ✅ Complete authentication separation from Gemini-CLI
- ✅ Professional ASCII art and branding
- ✅ English internationalization
- ✅ Windows compatibility validation
- ✅ Automatic migration system

### 6.2. NPM Versions Published
1. **0.1.12** - Initial functional version
2. **0.1.13** - Branding improvements and English internationalization
3. **0.1.14** - Complete authentication separation and project reorganization

### 6.3. Current Installation
```bash
# Global installation (recommended)
npm install -g @nsalvacao/nexo-cli

# Usage
nexocli "your query"
nexocli --version
nexocli --help
```

---

## 7. Customization Implementation

### 7.1. Basic Rebranding
**File:** `package.json`
```json
{
  "name": "@nsalvacao/nexo-cli",
  "bin": {
    "nexocli": "bundle/nexocli.js"
  }
}
```

### 7.2. Professional ASCII Art
**File:** `packages/cli/src/ui/components/AsciiArt.ts`
```typescript
// Modified by [Agent], 2025
// Based on gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

export const shortAsciiLogo = `
 ███   ██ ███████ ██   ██  ██████  
 ████  ██ ██       ██ ██  ██    ██ 
 ██ ██ ██ █████     ███   ██    ██ 
 ██  ████ ██       ██ ██  ██    ██ 
 ██   ███ ███████ ██   ██  ██████  
`;

export const longAsciiLogo = `
 ███   ██ ███████ ██   ██  ██████   ██████ ██      ██ 
 ████  ██ ██       ██ ██  ██    ██ ██      ██      ██ 
 ██ ██ ██ █████     ███   ██    ██ ██      ██      ██ 
 ██  ████ ██       ██ ██  ██    ██ ██      ██      ██ 
 ██   ███ ███████ ██   ██  ██████   ██████ ███████ ██ 
`;
```

### 7.3. Custom Slash Commands (Planned)
**File:** `packages/cli/src/ui/hooks/slashCommandProcessor.ts`
```typescript
// Modified by [Agent], 2025
// Based on gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

// Add Nexo commands
export const nexoCommands = {
  '/nexo info': () => showNexoInfo(),
  '/nexo status': () => showNexoStatus(),
  '/nexo config': () => showNexoConfig(),
  '/nexo orchestrate': () => showNexoOrchestration(),
};

function showNexoInfo() {
  return `
🔧 NexoCLI - Professional Gemini-CLI Customization
├── Version: ${getVersion()}
├── Provider: Google Gemini (OAuth)
├── Integration: n8n ready
└── Maintainer: Nuno Salvação
  `;
}
```

### 7.4. Authentication Separation
**Files:** `packages/core/src/utils/paths.ts`, `packages/core/src/code_assist/oauth2.ts`
- **Directory change:** `.gemini` → `.nexocli`
- **Automatic migration:** Seamless transition from existing installations
- **Complete separation:** No shared authentication with Gemini-CLI

---

## 8. Security and Best Practices

### 8.1. Safe Development
- **Never use `npm link`** - Overwrites global installation
- **Always run locally:** `./bundle/nexocli.js`
- **Test before commit:** Build and basic functionality
- **Maintain OAuth:** Use original Google authentication

### 8.2. Credential Management
- **Google OAuth:** Primary method (free)
- **API Keys:** Only for higher quotas (optional)
- **Never commit:** Credentials in code
- **Local environment:** All configurations

### 8.3. Change Validation
```bash
# Security checklist
npm run build                   # Build without errors
./bundle/nexocli.js --version   # Correct output
./bundle/nexocli.js "test"      # Functionality OK
grep -r "API_KEY" .             # No credentials in code
```

---

## 9. Integration with Hybrid Solution

### 9.1. n8n Preparation
**Future endpoints for orchestration:**
```typescript
// API mode for n8n
nexocli --api-mode
nexocli --webhook-url=http://localhost:5678/webhook/nexo
```

### 9.2. Future Unified Interface
```bash
# Consolidated menu (planned)
nexo                            # Main command
├── 🔧 NexoCLI (Google Gemini)
├── 🤖 Ollama (Local Models)
├── 🎛️ n8n (Orchestration)
└── ⚙️ Settings
```

### 9.3. Communication Architecture
- **NexoCLI:** REST endpoints for n8n
- **n8n:** Visual workflow orchestration
- **Interface:** Single menu for all agents
- **Communication:** JSON via HTTP/WebSocket

---

## 10. Logging and Documentation

### 10.1. Development Log
**Naming pattern:** `[Agent]_[action]_[timestamp].md`

**Template:**
```markdown
# NexoCLI Development Log - [ACTION] - [DATE]

## Original Prompt
[Complete user prompt]

## Analysis
[Technical analysis and decisions]

## Implemented Changes
- **File:** `path/to/file.ts`
- **Change:** Specific description
- **Impact:** Affected functionality

## Tests Performed
- [ ] npm run build
- [ ] ./bundle/nexocli.js --version
- [ ] ./bundle/nexocli.js "test"
- [ ] Specific functionality

## Next Steps
[Recommendations for continuation]
```

### 10.2. Automatic Documentation
- **README.md:** Updated with new features
- **AGENTS.md:** Instructions for future agents
- **CHANGELOG.md:** Change history
- **Code:** Comments on significant changes

---

## 11. Common Troubleshooting

### 11.1. Build Issues
```bash
# Error: Command not found
# Solution: Use complete path
./bundle/nexocli.js instead of nexocli

# Error: Module not found
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 11.2. Conflicts with Global Installation
```bash
# Check if global gemini exists
which gemini

# Isolated development
cd /path/to/NexoCLI_BaseGemini
./bundle/nexocli.js "$@"
```

### 11.3. Authentication Issues
```bash
# Use Google OAuth (default)
# No configuration needed
./bundle/nexocli.js "auth test"
```

---

## 12. Contact and Support

### 12.1. Maintainer
- **Name:** Nuno Salvação
- **Email:** [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)
- **Role:** Architecture and development

### 12.2. For AI Agents
- **Strictly follow** this document
- **Consult relevant sections** before changes
- **Validate compliance** in each modification
- **Document all changes** in logs

### 12.3. Reference Resources
- **Original Gemini-CLI:** https://github.com/google-gemini/gemini-cli
- **Apache License 2.0:** http://www.apache.org/licenses/LICENSE-2.0
- **Node.js Documentation:** https://nodejs.org/docs/
- **n8n Documentation:** https://docs.n8n.io/

---

## 13. Context for Future Prompts

### 13.1. Essential Information
**Always include in NexoCLI-related prompts:**

```
NEXOCLI CONTEXT:
- Project: Professional customized fork of Gemini-CLI (Google LLC, Apache 2.0)
- Objective: Minimal customization + hybrid solution integration
- Focus: Rebranding gemini→nexocli, custom commands
- Development: Isolated, without affecting global installation
- Structure: 4 components (NexoCLI, Ollama, n8n, Interface)
- Compliance: Mandatory attribution, complete documentation
- Testing: npm run build && ./bundle/nexocli.js
- Status: Phase 1 completed, NPM published as @nsalvacao/nexo-cli
```

### 13.2. Key Files for Reference
- `package.json` - Main configuration
- `packages/cli/src/ui/components/AsciiArt.ts` - ASCII art
- `packages/cli/src/ui/components/Header.tsx` - Interface
- `packages/cli/src/ui/components/Tips.tsx` - Tips and messages
- `packages/cli/src/ui/hooks/slashCommandProcessor.ts` - Commands
- `packages/core/src/utils/paths.ts` - Directory paths
- `packages/core/src/code_assist/oauth2.ts` - Authentication

### 13.3. Essential Commands
```bash
# Development
npm run build
./bundle/nexocli.js --version
./bundle/nexocli.js "test"

# Production
npm install -g @nsalvacao/nexo-cli
nexocli --version

# Validation
npm run build && ./bundle/nexocli.js --version
```

---

## 14. Current Project Status Summary

### 14.1. Completed Achievements
- **✅ NPM Publication:** Available as `@nsalvacao/nexo-cli`
- **✅ Professional Branding:** Complete interface rebranding
- **✅ Authentication Separation:** Independent from Gemini-CLI
- **✅ Automatic Migration:** Seamless transition system
- **✅ Windows Compatibility:** Tested and validated
- **✅ English Internationalization:** Complete interface translation

### 14.2. Next Development Phases
- **Phase 2:** Custom slash commands (`/nexo info`, `/nexo status`, `/nexo config`)
- **Phase 3:** Integration preparation (APIs, webhooks)
- **Phase 4:** Unified interface foundation
- **Phase 5:** n8n orchestration integration

### 14.3. Usage Instructions
```bash
# Current installation
npm install -g @nsalvacao/nexo-cli

# Basic usage
nexocli "your query"
nexocli --version
nexocli --help

# Development
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install && npm run build
./bundle/nexocli.js "development test"
```

---

**Final Note:** This document is **mandatory** for any collaboration on NexoCLI. Strictly following these instructions ensures legal, architectural, and functional compliance of the project.

---

*Created by Nuno Salvação | Based on Gemini-CLI (Google LLC, Apache 2.0) | Part of the Nexo ecosystem*