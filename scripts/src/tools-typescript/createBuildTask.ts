import path from 'path';

import { AllPlatforms } from '@rnx-kit/tools-react-native';
import { Project, Service } from '@rnx-kit/typescript-service';
import ts from 'typescript';

// create a global service shared across all running tasks executing right now
const service = new Service();

export type BuildTask = () => [boolean, number];

export type BuildTaskOptions = {
  // root of the package to build
  pkgRoot: string;

  /// relative path from the package root to the TS source directory, defaults to 'src'
  srcDir?: string;

  // relative path from the package root to the TS output directory, defaults to 'lib'
  libDir?: string;

  // TypeScript module setting for transpilation in this lib directory
  module: ts.ModuleKind;

  // optional specifier to perform type-checking for a specific react-native platform
  platform?: AllPlatforms;

  // extra type emit output paths, e.g. ['lib-commonjs', 'lib-amd']
  extraTypeOutputs?: string[];

  // base parsed command line for this command
  cmdLine: ts.ParsedCommandLine;

  // file names to build and type-check
  buildFiles?: string[];

  // file names to type-check only
  checkFiles?: string[];

  // files names to emit only
  emitFiles?: string[];
};

function buildFile(project: Project, file: string, libDir: string, extraTypePaths?: string[]): boolean {
  const output = project.langService().getEmitOutput(file);
  // if there is no output or the emit was skipped, validate the file
  if (!output || output.emitSkipped) {
    project.validateFile(file);
    return false;
  }
  // now write out the output files: .js, .js.map, .d.ts, .d.ts.map
  output.outputFiles.forEach((o) => {
    const { name, text } = o;
    ts.sys.writeFile(name, text);
    // if we are emitting types to extra locations, write them out
    if (extraTypePaths && (name.endsWith('.d.ts') || name.endsWith('.d.ts.map'))) {
      extraTypePaths.forEach((p) => {
        ts.sys.writeFile(name.replace(libDir, p), text);
      });
    }
  });
  return true;
}

function transpileFile(srcPath: string, libPath: string, fileName: string, options: ts.CompilerOptions): boolean {
  const { outputText, sourceMapText } = ts.transpileModule(ts.sys.readFile(fileName), { compilerOptions: options });
  if (outputText) {
    const newFileName = path.join(libPath, path.relative(srcPath, fileName).replace(/(.ts?x$)/, '.js'));
    ts.sys.writeFile(newFileName, outputText);
    if (sourceMapText !== undefined) {
      ts.sys.writeFile(newFileName + '.map', sourceMapText);
    }
  }
  return !!outputText;
}

export function createBuildTask({
  pkgRoot,
  srcDir = 'src',
  libDir = 'lib',
  module,
  // platform,
  extraTypeOutputs,
  cmdLine,
  buildFiles,
  checkFiles,
  emitFiles,
}: BuildTaskOptions): BuildTask {
  // clone the cmdLine to reflect an overridden module and platform
  cmdLine = { ...cmdLine, options: { ...cmdLine.options, module, outDir: libDir } };

  // create a project if we have buildFiles or checkFiles, emit doesn't require a full project
  const project = buildFiles || checkFiles ? service.openProject(cmdLine) : undefined;

  // make the lib paths into absolute paths
  const libPath = path.join(pkgRoot, libDir);

  // now return a worker function that will execute the task and return success/failure + time
  return () => {
    const startTime = performance.now();
    let result = true;
    if (project) {
      // iterate through and build files
      for (const file of buildFiles) {
        if (!buildFile(project, file, libDir, extraTypeOutputs)) {
          result = false;
        }
      }

      // if we have files to type-check only, do that next
      if (checkFiles) {
        for (const file of checkFiles) {
          if (!project.validateFile(file)) {
            result = false;
          }
        }
      }
    }
    // if we have files to emit only, do that now
    if (emitFiles) {
      const srcPath = path.join(pkgRoot, srcDir);
      for (const file of emitFiles) {
        if (!transpileFile(srcPath, libPath, file, cmdLine.options)) result = false;
      }
    }
    return [result, performance.now() - startTime];
  };
}
