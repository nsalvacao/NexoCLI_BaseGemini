/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Modificado por Nexo Agent, 2025
// Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Parte do NexoCLI_BaseGemini - Personalização para ecossistema Nexo

import fs from 'fs/promises';
import * as os from 'os';

type WarningCheck = {
  id: string;
  check: (workspaceRoot: string) => Promise<string | null>;
};

// Individual warning checks
const homeDirectoryCheck: WarningCheck = {
  id: 'home-directory',
  check: async (workspaceRoot: string) => {
    try {
      const [workspaceRealPath, homeRealPath] = await Promise.all([
        fs.realpath(workspaceRoot),
        fs.realpath(os.homedir()),
      ]);

      if (workspaceRealPath === homeRealPath) {
        return 'You are running NEXO CLI in your home directory. It is recommended to run in a project-specific directory.';
      }
      return null;
    } catch (_err: unknown) {
      return 'Could not verify the current directory due to a file system error.';
    }
  },
};

// All warning checks
const WARNING_CHECKS: readonly WarningCheck[] = [homeDirectoryCheck];

export async function getUserStartupWarnings(
  workspaceRoot: string,
): Promise<string[]> {
  const results = await Promise.all(
    WARNING_CHECKS.map((check) => check.check(workspaceRoot)),
  );
  return results.filter((msg) => msg !== null);
}
