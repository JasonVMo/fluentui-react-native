import fs from 'fs';
import path from 'path';

import { AllPlatforms } from '@rnx-kit/tools-react-native';
import { readConfigFile } from '@rnx-kit/typescript-service';
import findUp from 'find-up';
import ts from 'typescript';

export interface PackageBuildInfo {
  // reference to the root directory of the package
  pkgRoot: string;

  // reference to the package's name
  name: string;

  // react-native platforms that are relevant to this package, if any
  platforms?: AllPlatforms[];

  // parsed tsconfig.json options for this package
  cmdLine?: ts.ParsedCommandLine;
}

/**
 * Load the tsconfig.json file for the package
 * @param pkgRoot - the root directory of the package
 * @returns the parsed tsconfig.json file, if found
 */
function loadTypescriptConfig(pkgRoot: string): ts.ParsedCommandLine | undefined {
  const configPath = ts.findConfigFile(pkgRoot, ts.sys.fileExists, 'tsconfig.json');
  if (configPath) {
    return readConfigFile(configPath);
  }
  return undefined;
}

/**
 * See if any of the react-native platform dependencies are present in the given dependencies object
 * @param deps - an object containing the package's dependencies, can be one of [peer|dev]dependencies
 * @param foundPlatforms - adds any react-native platform dependencies to the foundPlatforms object
 */
function findReactNativePlatforms(deps: object, foundPlatforms: { [key in AllPlatforms]?: boolean }) {
  if (deps['react-native']) {
    foundPlatforms.android = true;
    foundPlatforms.ios = true;
  }
  if (deps['react-native-windows']) {
    foundPlatforms.windows = true;
  }
  if (deps['react-native-macos']) {
    foundPlatforms.macos = true;
  }
  if (deps['@office-iss/react-native-win32']) {
    foundPlatforms.win32 = true;
  }
}

// cache for package build information, keyed on the package root directory
const packageCache = new Map<string, PackageBuildInfo>();

/**
 * Get the build information for a package including the parsed tsconfig and relevant react-native platforms
 *
 * @param startDir - The directory to start searching for the package.json file. Defaults to the current working directory.
 * @returns - A (potentially cached) PackageBuildInfo object containing the package's build information.
 */
export function getPackageBuildInfo(startDir: string = process.cwd()): PackageBuildInfo {
  // look up the package in the cache first, otherwise find the package.json file
  if (packageCache.has(startDir)) {
    return packageCache.get(startDir);
  }
  const packageJsonPath = findUp.sync('package.json', { cwd: startDir });
  if (!packageJsonPath) {
    throw new Error('Could not find package.json');
  }
  const pkgRoot = path.dirname(packageJsonPath);
  if (pkgRoot !== startDir && packageCache.has(pkgRoot)) {
    return packageCache.get(pkgRoot);
  }

  // parse the package.json file to find the package name and react-native platforms that apply
  const foundPlatforms: { [key in AllPlatforms]?: boolean } = {};
  const { name, dependencies, peerDependencies, devDependencies } = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: 'utf-8' }));
  [dependencies, peerDependencies, devDependencies].forEach((deps) => {
    if (deps && typeof deps === 'object') {
      findReactNativePlatforms(deps, foundPlatforms);
    }
  });
  const platformsRaw = Object.keys(foundPlatforms) as AllPlatforms[];
  const platforms = platformsRaw && platformsRaw.length > 0 ? platformsRaw : undefined;

  const cmdLine = loadTypescriptConfig(pkgRoot);
  if (!cmdLine) {
    throw new Error('Could not find tsconfig.json for package ' + name);
  }

  const result: PackageBuildInfo = { pkgRoot, name, platforms, cmdLine };
  packageCache.set(pkgRoot, result);
  return result;
}
