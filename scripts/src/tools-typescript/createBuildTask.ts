import path from 'path';

import { AllPlatforms } from '@rnx-kit/tools-react-native';
import { Project, Service } from '@rnx-kit/typescript-service';
import ts from 'typescript';

import { FileWriter } from './fileWriter';
import { getModuleSuffixes } from './platform';

// create a global service shared across all running tasks executing right now
const service = new Service();

export type BuildTask = () => Promise<[boolean, number]>;
type BuildTaskSync = () => [boolean, number];

export type BuildTaskOptions = {
  // root of the package to build
  pkgRoot: string;

  /// relative path from the package root to the TS source directory
  srcDir: string;

  // relative path from the package root to the TS output directory
  outDir?: string;

  // files to process
  files: string[];

  // TypeScript module setting for transpilation in this lib directory
  module: ts.ModuleKind;

  // optional specifier to perform type-checking for a specific react-native platform
  platform?: AllPlatforms;

  // extra type emit output paths, e.g. ['lib-commonjs', 'lib-amd']
  extraTypeOutputs?: string[];

  // base parsed command line for this command
  cmdLine: ts.ParsedCommandLine;

  // file writer function
  writeFile: FileWriter;
};

function buildFile(project: Project, file: string, libDir: string, writeFile: FileWriter, extraTypePaths?: string[]): boolean {
  const output = project.langService().getEmitOutput(file);
  // if there is no output or the emit was skipped, validate the file
  if (!output || output.emitSkipped) {
    project.validateFile(file);
    return false;
  }
  // now write out the output files: .js, .js.map, .d.ts, .d.ts.map
  output.outputFiles.forEach((o) => {
    const { name, text } = o;
    writeFile(name, text);
    // if we are emitting types to extra locations, write them out
    if (extraTypePaths && (name.endsWith('.d.ts') || name.endsWith('.d.ts.map'))) {
      extraTypePaths.forEach((p) => {
        writeFile(name.replace(libDir, p), text);
      });
    }
  });
  return true;
}

function createBuildTaskWorker({
  platform,
  module,
  files,
  cmdLine,
  outDir,
  extraTypeOutputs,
  writeFile,
}: BuildTaskOptions): [boolean, number] {
  const startTime = performance.now();

  // setup the parsed command line and open the project for typechecking
  const moduleSuffixes = platform ? getModuleSuffixes(platform) : undefined;
  cmdLine = { ...cmdLine, fileNames: files, options: { ...cmdLine.options, module, moduleSuffixes, outDir } };
  const project = service.openProject(cmdLine);

  // now build each file
  let result = true;
  files.forEach((file) => {
    if (!buildFile(project, file, outDir, writeFile, extraTypeOutputs)) {
      result = false;
    }
  });

  return [result, performance.now() - startTime];
}

function createCheckTaskWorker({ platform, module, files, cmdLine }: BuildTaskOptions): [boolean, number] {
  const startTime = performance.now();

  // setup the parsed command line and open the project for typechecking
  const moduleSuffixes = platform ? getModuleSuffixes(platform) : undefined;
  cmdLine = { ...cmdLine, fileNames: files, options: { ...cmdLine.options, module, moduleSuffixes } };
  const project = service.openProject(cmdLine);

  // now validate each file
  let result = true;
  files.forEach((file) => {
    if (!project.validateFile(file)) {
      result = false;
    }
  });

  return [result, performance.now() - startTime];
}

function transpileFile(srcPath: string, libPath: string, fileName: string, options: ts.CompilerOptions, writeFile: FileWriter): boolean {
  const { outputText, sourceMapText } = ts.transpileModule(ts.sys.readFile(fileName), { compilerOptions: options });
  if (outputText) {
    const newFileName = path.join(libPath, path.relative(srcPath, fileName).replace(/(.ts?x$)/, '.js'));
    writeFile(newFileName, outputText);
    if (sourceMapText !== undefined) {
      writeFile(newFileName + '.map', sourceMapText);
    }
  }
  return !!outputText;
}

function createEmitTaskWorker({ srcDir, outDir, pkgRoot, module, files, cmdLine, writeFile }: BuildTaskOptions): [boolean, number] {
  const startTime = performance.now();
  const srcPath = path.join(pkgRoot, srcDir);
  const libPath = path.join(pkgRoot, outDir);
  const options = { ...cmdLine.options, module, outDir };

  let result = true;
  for (const file of files) {
    if (!transpileFile(srcPath, libPath, file, options, writeFile)) {
      result = false;
    }
  }
  return [result, performance.now() - startTime];
}

export function createBuildTask(options: BuildTaskOptions): BuildTaskSync {
  return () => {
    return createBuildTaskWorker(options);
  };
}

export function createCheckTask(options: BuildTaskOptions): BuildTaskSync {
  return () => {
    return createCheckTaskWorker(options);
  };
}

export function createEmitTask(options: BuildTaskOptions): BuildTaskSync {
  return () => {
    return createEmitTaskWorker(options);
  };
}

export function createAsyncBuildTask(options: BuildTaskOptions): BuildTask {
  return async () => {
    return createBuildTaskWorker(options);
  };
}

export function createAsyncCheckTask(options: BuildTaskOptions): BuildTask {
  return async () => {
    return createCheckTaskWorker(options);
  };
}

export function createAsyncEmitTask(options: BuildTaskOptions): BuildTask {
  return async () => {
    return createEmitTaskWorker(options);
  };
}
