/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Modificado por Nexo, 2025
// Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Parte do NexoCLI_BaseGemini - Personalização para ecossistema Nexo

import React from 'react';
import { Box, Text } from 'ink';
import { Colors } from '../colors.js';
import { type Config } from '@google/gemini-cli-core';

interface TipsProps {
  config: Config;
}

export const Tips: React.FC<TipsProps> = ({ config }) => {
  const geminiMdFileCount = config.getGeminiMdFileCount();
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color={Colors.Foreground}>🔧 Dicas para começar com NexoCLI:</Text>
      <Text color={Colors.Foreground}>
        1. Faz perguntas, edita ficheiros ou executa comandos.
      </Text>
      <Text color={Colors.Foreground}>
        2. Sê específico para melhores resultados.
      </Text>
      {geminiMdFileCount === 0 && (
        <Text color={Colors.Foreground}>
          3. Cria ficheiros{' '}
          <Text bold color={Colors.AccentPurple}>
            GEMINI.md
          </Text>{' '}
          para personalizar as interações com Gemini.
        </Text>
      )}
      <Text color={Colors.Foreground}>
        {geminiMdFileCount === 0 ? '4.' : '3.'} Usa{' '}
        <Text bold color={Colors.AccentPurple}>
          /help
        </Text>{' '}
        para mais informações ou{' '}
        <Text bold color={Colors.AccentPurple}>
          /nexo info
        </Text>{' '}
        para detalhes do ecossistema.
      </Text>
    </Box>
  );
};
