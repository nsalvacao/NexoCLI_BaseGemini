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
      <Text color={Colors.Foreground}>🔧 Tips to get started with NexoCLI:</Text>
      <Text color={Colors.Foreground}>
        1. Ask questions, edit files, or run commands.
      </Text>
      <Text color={Colors.Foreground}>
        2. Be specific for better results.
      </Text>
      {geminiMdFileCount === 0 && (
        <Text color={Colors.Foreground}>
          3. Create files{' '}
          <Text bold color={Colors.AccentPurple}>
            NEXO.md
          </Text>{' '}
          to customize interactions with Gemini.
        </Text>
      )}
      <Text color={Colors.Foreground}>
        {geminiMdFileCount === 0 ? '4.' : '3.'} Usa{' '}
        <Text bold color={Colors.AccentPurple}>
          /help
        </Text>{' '}
        for more information or{' '}
        <Text bold color={Colors.AccentPurple}>
          /nexo info
        </Text>{' '}
        for ecosystem details.
      </Text>
    </Box>
  );
};
