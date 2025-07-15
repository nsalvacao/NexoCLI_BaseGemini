# NexoCLI Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.14] - 2025-07-15 (CURRENT)

### Added
- **Complete authentication separation** between Gemini-CLI and NexoCLI
- **Automatic migration system** from `.gemini` to `.nexocli` directories
- **Migration logging** for transparency during OAuth and account cache migration
- **Professional project structure** with dev-assets organization

### Changed
- **GEMINI_DIR constant** changed from `.gemini` to `.nexocli` in core paths
- **OAuth credentials storage** now uses `.nexocli/oauth_creds.json`
- **Google account cache** now uses `.nexocli/google_accounts.json`
- **User settings** now stored in `.nexocli/settings.json`
- **Project structure** reorganized with non-executable files in `dev-assets/`

### Fixed
- **Authentication sharing issue** between Gemini-CLI and NexoCLI
- **Coexistence problem** that prevented true independence
- **Configuration conflicts** between both CLI tools
- **Migration edge cases** for existing users

### Technical
- **Migration system** in `oauth2.ts` and `user_account.ts`
- **Automatic directory creation** for new `.nexocli` structure
- **Fallback mechanisms** for migration failures
- **Compliance headers** added to all modified files

---

## [0.1.13] - 2025-07-15

### Added
- **English internationalization** for complete interface
- **Professional branding** across all UI components
- **NEXO.md reference** in tips and documentation
- **Settings directory separation** from original Gemini-CLI

### Changed
- **Tips component** fully translated to English
- **Welcome messages** and interface elements translated
- **File references** updated from GEMINI.md to NEXO.md
- **Settings directory** changed to `.nexocli`

### Fixed
- **Language inconsistencies** in user interface
- **Mixed Portuguese/English** in welcome messages
- **Branding inconsistencies** across components

### Technical
- **Tips.tsx** completely rewritten in English
- **Settings.ts** updated with new directory structure
- **Professional color themes** maintained

---

## [0.1.12] - 2025-07-14

### Added
- **NPM publication** as `@nsalvacao/nexo-cli`
- **Global installation** capability via `npm install -g`
- **Professional ASCII art** with "NEXO CLI" branding
- **Custom welcome messages** and interface elements
- **Professional color themes** (nexoLightTheme, nexoDarkTheme)
- **Windows compatibility** testing and validation

### Changed
- **Command name** from `gemini` to `nexocli`
- **Package configuration** for NPM publication
- **Build output** to generate `nexocli.js`
- **Branding elements** throughout the interface
- **Color palette** to professional themes

### Fixed
- **Build configuration** for proper executable generation
- **Windows compatibility** issues
- **Package.json** configuration for global installation

### Technical
- **AsciiArt.ts** updated with professional Nexo branding
- **Theme.ts** updated with professional color schemes
- **Package.json** configured for NPM publication
- **Build scripts** updated for nexocli output

---

## [0.1.11] - 2025-07-14

### Added
- **Initial customization** of Gemini-CLI fork
- **Project structure** for NexoCLI development
- **Basic rebranding** from gemini to nexocli
- **Development environment** setup

### Changed
- **Initial rebranding** of core components
- **Package name** preparation for customization
- **Build configuration** for nexocli output

### Technical
- **Fork initialization** from Gemini-CLI
- **Basic structure** for customization
- **Development environment** configuration

---

## [0.1.10] - 2025-07-14

### Added
- **Project documentation** complete setup
- **AGENTS.md** - Agent guide with complete context
- **README.md** - Customized main documentation
- **CONTRIBUTING.md** - Contribution workflow
- **ROADMAP.md** - Development roadmap
- **Development log structure** for tracking changes

### Changed
- **Documentation structure** adapted for NexoCLI
- **Compliance framework** for Apache 2.0
- **Development methodology** documentation

### Technical
- **Documentation templates** created
- **Compliance checklist** established
- **Development workflow** documented

---

## [Base] - Original Gemini-CLI Fork

### Inherited Features
- **Complete Gemini-CLI functionality**
  - Google OAuth authentication system
  - Complete command-line interface
  - Session and context management
  - Google Gemini API integration
  - Slash commands (/clear, /help, /memory, /theme)
  - Theme system and visual customization

- **Original modular architecture**
  - Separation of packages/cli and packages/core
  - Build system with esbuild
  - Workspace dependency management
  - TypeScript + React (Ink) configuration
  - Testing with vitest

- **Advanced features**
  - File processing and context
  - MCP (Model Context Protocol) integration
  - Integrated tools (grep, edit, shell, etc.)
  - Memory and history system
  - Multimodal support (text, images)

### Technical Base
- **Node.js**: 18+ (Windows compatible)
- **TypeScript**: Complete configuration
- **React**: Interface via Ink
- **Build**: esbuild + automated scripts
- **Tests**: vitest + integration
- **License**: Apache 2.0 (Google LLC)

### Original Attribution
- **Original Project**: [Gemini-CLI](https://github.com/google-gemini/gemini-cli)
- **Developer**: Google LLC
- **License**: Apache License 2.0
- **Base Version**: 0.1.12

---

## Development History

### Phase 0: Preparation and Documentation (COMPLETED)
**Date**: July 14, 2025
- ✅ Complete Gemini-CLI architecture analysis
- ✅ Organized project structure
- ✅ Customized documentation
- ✅ Configured isolated development environment
- ✅ Verified legal compliance

### Phase 1: Professional Branding (COMPLETED)
**Dates**: July 14-15, 2025
- ✅ Global command functional via NPM
- ✅ Professional ASCII art implemented
- ✅ Interface fully rebranded
- ✅ NPM publication achieved
- ✅ Complete authentication separation
- ✅ Windows compatibility validated

### Future Phases (PLANNED)
- **Phase 2**: Custom commands (`/nexo info`, `/nexo status`, `/nexo config`)
- **Phase 3**: Integration preparation (APIs, webhooks)
- **Phase 4**: Unified interface foundation
- **Phase 5**: n8n orchestration integration

---

## Installation and Usage

### Current Installation
```bash
# Global installation
npm install -g @nsalvacao/nexo-cli

# Usage
nexocli "your query"
nexocli --version
nexocli --help
```

### Development Installation
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

## Compliance and Attribution

### Legal Requirements
- **Original License**: Apache 2.0 maintained
- **Attribution**: Gemini-CLI (Google LLC) referenced
- **Modifications**: Documented and traceable
- **Transparency**: Complete process documented

### Attribution Template
```typescript
// Modified by [Developer Name], 2025
// Based on gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Part of NexoCLI_BaseGemini - Customization for Nexo ecosystem
```

### Compliance Checklist
- ✅ Legal attribution in all modified files
- ✅ Apache 2.0 license maintained
- ✅ Process documented in AGENTS.md
- ✅ Modifications traceable
- ✅ Original copyright preserved

---

## Support and Resources

### Project Links
- **Repository**: [GitHub](https://github.com/nsalvacao/NexoCLI_BaseGemini)
- **NPM Package**: [@nsalvacao/nexo-cli](https://www.npmjs.com/package/@nsalvacao/nexo-cli)
- **Original Project**: [Gemini-CLI](https://github.com/google-gemini/gemini-cli)

### Contact
- **Maintainer**: [Nuno Salvação](mailto:nexo-modeling@outlook.com)
- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions

---

*Developed by [Nuno Salvação](mailto:nexo-modeling@outlook.com) | Based on Gemini-CLI (Google LLC, Apache 2.0) | Part of the Nexo ecosystem*