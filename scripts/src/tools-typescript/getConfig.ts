import { findConfigFile, readConfigFile } from '@rnx-kit/typescript-service';
import ts from 'typescript';

const baseMap = new Map<string, ts.ParsedCommandLine>();

export function getBaseConfig(cwd: string): ts.ParsedCommandLine {
  if (baseMap.has(cwd)) {
    return baseMap.get(cwd);
  }

  // now try to find the tsconfig.json file and parse that
  const configFileName = findConfigFile(cwd);
  if (!configFileName) {
    throw new Error('Could not find a valid tsconfig.json.');
  }
  const parsedCmdLine = readConfigFile(configFileName);
  if (!parsedCmdLine) {
    throw new Error('Could not read tsconfig.json.');
  }
  baseMap.set(cwd, parsedCmdLine);
  return parsedCmdLine;
}

export function getConfig(cwd: string, options?: ts.CompilerOptions): ts.ParsedCommandLine {
  const baseConfig = getBaseConfig(cwd);
  if (options) {
    return { ...baseConfig, options: { ...baseConfig.options, ...options } };
  }
  return baseConfig;
}
