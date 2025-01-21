import fs from 'fs';
import path from 'path';

import { AllPlatforms, platformExtensions } from '@rnx-kit/tools-react-native';

import { FileOperationList } from './types';

type PlatformModuleNames = AllPlatforms | 'native' | 'win' | 'none';
const appliesToLookup: { [key in AllPlatforms]: PlatformModuleNames[] } = {
  android: ['android', 'native', 'none'],
  ios: ['ios', 'native', 'none'],
  macos: ['macos', 'native', 'none'],
  windows: ['windows', 'win', 'native', 'none'],
  win32: ['win32', 'win', 'native', 'none'],
};

/**
 * Parse a file path to get a platform extension, if one exists.
 */
function splitFileName(file: string): [string, string | undefined] {
  const match = /^(.*?)(?:\.([a-zA-Z0-9]*))?\.[jt]sx?$/.exec(file);
  return match ? [match[1], match[2]] : [file, undefined];
}

type PlatformFileOperations = {
  [key in AllPlatforms]?: FileOperationList;
};

function addFileToOperationList(file: string, checkOnly: boolean, operationList: FileOperationList): boolean {
  if (!checkOnly) {
    operationList.build.push(file);
  } else {
    operationList.check.push(file);
  }
  return true;
}

type FoundPlatformFiles = { [key in PlatformModuleNames]?: string };
type BuiltPlatformFiles = { [key in PlatformModuleNames]?: boolean };

function addFilesToOperations(
  foundFiles: FoundPlatformFiles,
  checkOnly: boolean,
  basePlatform: string,
  operations: PlatformFileOperations,
) {
  const added: BuiltPlatformFiles = {};
  // go through the operations requested and add the highest level file that matches, each file should only
  // be marked to build once, typechecks should only happen for a platform for the files that will be found
  // e.g. if a file ends in .ios,ts, files ending in .native.ts and .ts will not be found on that platform
  for (const platform in operations) {
    const applyTo = appliesToLookup[platform];
    for (const p of applyTo) {
      if (foundFiles[p]) {
        added[p] = addFileToOperationList(foundFiles[p], checkOnly && !added[p], operations[platform]);
        break;
      }
    }
  }
  // now add any files that haven't been added yet
  for (const p in foundFiles) {
    if (!added[p]) {
      addFileToOperationList(foundFiles[p], checkOnly, operations[basePlatform]);
    }
    // clear out the found files for the next set
    foundFiles[p] = undefined;
  }
}

export function getFileOperations(files: string[], checkOnly: boolean, platforms?: AllPlatforms[]): FileOperationList[] {
  if (files.length === 0) {
    return [];
  } else if (!platforms || platforms.length === 0) {
    return [{ build: checkOnly ? [] : files, check: checkOnly ? files : [] }];
  }
  const operations: { [key in AllPlatforms]?: FileOperationList } = {};
  platforms.forEach((platform) => {
    operations[platform] = { build: [], check: [], platform };
  });
  const defaultPlatform = platforms[0];

  const foundFiles: FoundPlatformFiles = {};
  let lastBaseFile: string | undefined = undefined;
  files.forEach((file) => {
    const [baseFile, platform] = splitFileName(file);
    if (lastBaseFile === baseFile) {
      foundFiles[platform || 'none'] = file;
    } else {
      addFilesToOperations(foundFiles, checkOnly, defaultPlatform, operations);
      lastBaseFile = baseFile;
    }
  });
  addFilesToOperations(foundFiles, checkOnly, defaultPlatform, operations);
  return Object.values(operations);
}

/**
 * Get the module suffix settings for a given platform
 * @param platform - platform to get module suffixes for
 * @returns - array of module suffixes for the given platform, suitable for use in typescript config options
 */
export function getModuleSuffixes(platform: AllPlatforms): string[] {
  return platformExtensions(platform)
    .map((ext) => `.${ext}`)
    .concat('');
}
