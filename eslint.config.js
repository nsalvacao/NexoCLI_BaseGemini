// Modificado por Nuno Salvação, 2025
// Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    ignores: ['0.ModelosOriginais/**'],
  },
];
