# Contributing to NexoCLI

> **NexoCLI** is a professionally customized fork of [Gemini-CLI](https://github.com/google-gemini/gemini-cli) by Google LLC (Apache 2.0). All contributions must respect the original licensing and follow specific guidelines for the Nexo ecosystem.

**🎯 Objective:** Minimal customization of Gemini-CLI maintaining 100% compatibility and preparing integration with hybrid solution.

**Maintained by** [Nuno Salvação](mailto:nexo-modeling@outlook.com) | **Licensed under** Apache License 2.0

---

## 📋 **Prerequisites for Contributing**

### **🔍 Required Reading**
Before any contribution, you must read **completely**:

1. **[AGENTS.md](AGENTS.md)** - Complete guide for agents and collaborators
2. **[README.md](README.md)** - Main project documentation
3. **[CHANGELOG.md](CHANGELOG.md)** - Change history
4. **This document** - Contribution workflow

### **📚 Project Context**
- **Original Project:** [Gemini-CLI](https://github.com/google-gemini/gemini-cli) (Google LLC)
- **License:** Apache License 2.0 (maintained)
- **Type:** Customized fork with minimal personalization
- **Focus:** Rebranding `gemini` → `nexocli` + hybrid solution integration

### **🏗️ Solution Architecture**
NexoCLI is part of a 4-component ecosystem:
- **NexoCLI** (This repo) - Gemini-CLI customization
- **Ollama** - Local LLM models
- **n8n Orchestrator** - Visual orchestration
- **Unified Interface** - Consolidated menu

---

## 🚀 **Development Setup**

### **1. Fork and Clone**
```bash
# Fork on GitHub and clone locally
git clone https://github.com/YOUR_USERNAME/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini

# Add upstream remote
git remote add upstream https://github.com/nsalvacao/NexoCLI_BaseGemini
```

### **2. Dependency Installation**
```bash
# Install dependencies
npm install

# Verify installation
npm run build
./bundle/nexocli.js --version
```

### **3. Isolated Development Environment**
```bash
# ⚠️ IMPORTANT: Never use npm link
# Always run locally to avoid affecting global installation

# Create alias for development
echo 'alias nexocli-dev="./bundle/nexocli.js"' >> ~/.bashrc
source ~/.bashrc

# Test functionality
nexocli-dev "Development test"
```

---

## 📝 **Contribution Workflow**

### **1. Before Starting**
```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create branch for feature/fix
git checkout -b type/descriptive-name

# Examples:
git checkout -b feat/nexo-ascii-art
git checkout -b fix/slash-command-config
git checkout -b docs/update-readme
```

### **2. Development**

#### **2.1. Pre-Development Checklist**
- [ ] Read [AGENTS.md](AGENTS.md) for specific guidelines
- [ ] Verify change doesn't break compatibility
- [ ] Plan Windows VM testing
- [ ] Identify files to modify

#### **2.2. Implementation**
```bash
# Make changes following AGENTS.md
# Add attribution header in modified files:

# Example for TypeScript:
// Modified by [Your Name], 2025
// Based on gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Part of NexoCLI_BaseGemini - Customization for Nexo ecosystem
```

#### **2.3. Mandatory Testing**
```bash
# Basic local tests
npm run build                   # Error-free build
./bundle/nexocli.js --version   # Correct version
./bundle/nexocli.js "test"      # Basic functionality
./bundle/nexocli.js --help      # Functional help

# Verify rebranding
./bundle/nexocli.js --version | grep -i nexo

# Test specific commands if applicable
./bundle/nexocli.js /help
./bundle/nexocli.js /clear
```

### **3. Documentation**

#### **3.1. Update Documentation**
- **README.md:** If adding functionality
- **CHANGELOG.md:** MANDATORY for all changes
- **AGENTS.md:** If changing workflow or adding guidelines

#### **3.2. Development Log**
Create detailed log in `dev-assets/Dev_Logs/`:

**Format:** `[Your Name]_[action]_[YYYYMMDD_HHMMSS].md`

**Template:**
```markdown
# Development Log - [ACTION] - [DATE]

## Context
- **Feature/Bug:** [Description]
- **Branch:** [branch-name]
- **Modified Files:** [list]

## Implemented Changes
- [Technical detail 1]
- [Technical detail 2]

## Tests Performed
- [ ] npm run build
- [ ] ./bundle/nexocli.js --version
- [ ] ./bundle/nexocli.js "test"
- [ ] Specific functionality test

## Next Steps
- [If applicable]
```

### **4. Commit and Push**
```bash
# Add changes
git add .

# Commit with structured message
git commit -m "type: brief description

- Change detail 1
- Change detail 2
- Log: [created-log-name].md

Refs: #issue-number (if applicable)"

# Push to your fork
git push origin type/descriptive-name
```

### **5. Pull Request**

#### **5.1. Create PR**
- **Title:** `[TYPE] Clear description of change`
- **Description:** Use template below

**PR Template:**
```markdown
## Implemented Changes
- [ ] Feature/fix implemented
- [ ] Basic tests performed
- [ ] Documentation updated
- [ ] Compliance verified

## Modified Files
- `path/to/file1.ts` - [description]
- `path/to/file2.tsx` - [description]

## Tests Performed
- [ ] Local build without errors
- [ ] Basic functionality verified
- [ ] Compatibility maintained
- [ ] Windows VM testing (if applicable)

## Compliance Checklist
- [ ] Attribution header added
- [ ] Apache 2.0 respected
- [ ] CHANGELOG.md updated
- [ ] Development log created

## Development Log
`dev-assets/Dev_Logs/[log-name].md`

## Notes
[Any additional information]
```

---

## ✅ **Specific Guidelines**

### **🔒 Compliance and Licensing**

#### **Mandatory in ALL Commits:**
- [ ] Attribution header in modified files
- [ ] Never include credentials or API keys
- [ ] CHANGELOG.md updated
- [ ] Development log created

#### **Legal Attribution:**
```typescript
// Modified by [Your Name], 2025
// Based on gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Part of NexoCLI_BaseGemini - Customization for Nexo ecosystem
```

### **🎯 Types of Accepted Contributions**

#### **✅ Welcome:**
- **Rebranding:** `gemini` → `nexocli`
- **ASCII art:** Personalized Nexo logo
- **Slash commands:** `/nexo info`, `/nexo status`, etc.
- **Interface:** Personalized welcome messages
- **Documentation:** Improvements and corrections
- **Bug fixes:** Corrections that maintain compatibility

#### **⚠️ Require Discussion:**
- **Architecture:** Significant changes
- **Dependencies:** Adding/removing dependencies
- **API:** Changes to public interfaces
- **Integration:** Preparation for n8n/hybrid solution

#### **❌ Not Accepted:**
- **Breaking changes** without justification
- **Features** that break original compatibility
- **Unnecessary dependencies**
- **Code** without proper attribution

### **🧪 Testing and Validation**

#### **Before Submitting PR:**
```bash
# Mandatory checklist
npm run build                   # ✅ Build success
./bundle/nexocli.js --version   # ✅ Version OK
./bundle/nexocli.js "test"      # ✅ Basic functionality
grep -r "API_KEY" .            # ✅ No credentials in code
```

#### **Windows VM Testing:**
- **Mandatory** for significant changes
- **Recommended** for all contributions
- **Document** results in development log

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Command not found: nexocli"**
```bash
# ✅ Correct: Use local path
./bundle/nexocli.js

# ❌ Incorrect: Try to use global command
nexocli
```

#### **"Build failed"**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **"Cannot overwrite global installation"**
```bash
# ⚠️ NEVER use npm link
# Always develop locally
cd /path/to/NexoCLI_BaseGemini
./bundle/nexocli.js
```

### **Getting Help**
1. **Consult [AGENTS.md](AGENTS.md)** - Complete guide
2. **Check logs** in `dev-assets/Dev_Logs/` - Detailed history
3. **Open issue** - For specific questions
4. **Direct email** - [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)

---

## 🎯 **Contribution Roadmap**

### **Phase 1: Basic Rebranding** (Current - COMPLETED)
- ✅ Change `package.json`: `"bin": {"nexocli": "bundle/nexocli.js"}`
- ✅ Professional ASCII art in `AsciiArt.ts`
- ✅ Welcome messages in `Header.tsx`
- ✅ Build configured for `nexocli.js`
- ✅ NPM publication as `@nsalvacao/nexo-cli`
- ✅ Complete authentication separation

### **Phase 2: Custom Commands** (PLANNED)
- [ ] `/nexo info` - System information
- [ ] `/nexo status` - Agent status
- [ ] `/nexo config` - Specific configuration
- [ ] Extension of `slashCommandProcessor.ts`

### **Phase 3: Integration Preparation** (PLANNED)
- [ ] n8n endpoints
- [ ] Communication APIs
- [ ] Modular configuration

### **Phase 4: Unified Interface** (PLANNED)
- [ ] Consolidated menu
- [ ] Integration with other agents

---

## 👥 **Community and Support**

### **Primary Maintainer**
- **Name:** Nuno Salvação
- **Email:** [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)
- **GitHub:** [@nsalvacao](https://github.com/nsalvacao)

### **How to Contribute**
1. **Issues:** For bugs and suggestions
2. **Discussions:** For general ideas and questions
3. **Pull Requests:** For code contributions
4. **Email:** For compliance or architecture questions

### **Code of Conduct**
- **Respectful:** Professional communication
- **Collaborative:** Team spirit
- **Compliance:** Respect licensing
- **Quality:** Well-tested and documented code

---

## 📄 **Additional Resources**

### **Official Documentation**
- **[Original Gemini-CLI](https://github.com/google-gemini/gemini-cli)** - Base project
- **[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)** - License
- **[Keep a Changelog](https://keepachangelog.com/)** - Changelog format
- **[Semantic Versioning](https://semver.org/)** - Versioning

### **Development Tools**
- **Node.js 18+** - Required runtime
- **npm** - Dependency management
- **TypeScript** - Primary language
- **esbuild** - Build system

---

## 📊 **Current Project Status**

### **Completed Features**
- ✅ **NPM Publication:** Available as `@nsalvacao/nexo-cli`
- ✅ **Professional Branding:** Complete interface rebranding
- ✅ **Authentication Separation:** Independent from Gemini-CLI
- ✅ **Windows Compatibility:** Tested and validated
- ✅ **Automatic Migration:** Seamless transition from Gemini-CLI

### **Installation and Usage**
```bash
# Global installation
npm install -g @nsalvacao/nexo-cli

# Usage
nexocli "your query"
nexocli --version
nexocli --help
```

### **Development Installation**
```bash
# Clone and build
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install
npm run build

# Use locally
./bundle/nexocli.js "your query"
```

---

**Thank you for contributing to NexoCLI! 🚀**

*Developed by [Nuno Salvação](mailto:nexo-modeling@outlook.com) | Based on Gemini-CLI (Google LLC, Apache 2.0) | Part of the Nexo ecosystem*