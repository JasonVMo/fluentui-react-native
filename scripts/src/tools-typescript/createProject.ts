import { AllPlatforms } from '@rnx-kit/tools-react-native';
import { Service, Project } from '@rnx-kit/typescript-service';
import ts from 'typescript';

import { getConfig } from './getConfig';

// create a global service shared across all running tasks executing right now
const globalService = new Service();

export type TsToolOptions = {
  platform?: AllPlatforms;
};

export type ProjectResults = {
  project: Project;
  options: ts.ParsedCommandLine;
  resolveTime: number;
};

export function createProject(cwd: string, _toolOptions: TsToolOptions = {}, tsOptions?: ts.CompilerOptions): ProjectResults {
  const parsedOptions = getConfig(cwd, tsOptions);
  const moduleKind = parsedOptions.options.module === ts.ModuleKind.ESNext ? ts.ModuleKind.ESNext : ts.ModuleKind.CommonJS;
  const projectResults = { resolveTime: 0, options: parsedOptions, project: undefined };
  /*
  const oxcResolver = new ResolverFactory({
    conditionNames: ['node', moduleKind === ts.ModuleKind.ESNext ? 'import' : 'require'],
    extensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
  });
  */

  const enhanceLanguageServiceHost = (host: ts.LanguageServiceHost) => {
    // add a resolver
    host.resolveModuleNames = (
      moduleNames: string[],
      containingFile: string,
      _reusedNames: string[] | undefined,
      redirectedReference: ts.ResolvedProjectReference | undefined,
      options: ts.CompilerOptions,
    ) => {
      const results: ts.ResolvedModule[] = [];
      const startTime = performance.now();

      for (const moduleName of moduleNames) {
        const resolution = ts.resolveModuleName(moduleName, containingFile, options, host, undefined, redirectedReference, moduleKind);
        results.push(resolution.resolvedModule);
      }
      projectResults.resolveTime += performance.now() - startTime;
      return results;
    };

    host.resolveTypeReferenceDirectives = (
      typeDirectiveNames: string[] | readonly ts.FileReference[],
      containingFile: string,
      redirectedReference: ts.ResolvedProjectReference | undefined,
      options: ts.CompilerOptions,
      containingFileMode: ts.SourceFile['impliedNodeFormat'] | undefined,
    ) => {
      const resolutions: (ts.ResolvedTypeReferenceDirective | undefined)[] = [];
      const startTime = performance.now();

      for (const typeDirectiveName of typeDirectiveNames) {
        const name = typeof typeDirectiveName === 'string' ? typeDirectiveName : typeDirectiveName.fileName.toLowerCase();
        const { resolvedTypeReferenceDirective: directive } = ts.resolveTypeReferenceDirective(
          name,
          containingFile,
          options,
          host,
          redirectedReference,
          undefined,
          containingFileMode,
        );

        projectResults.resolveTime += performance.now() - startTime;
        resolutions.push(directive);
      }
      return resolutions;
    };
  };
  projectResults.project = globalService.openProject(parsedOptions, enhanceLanguageServiceHost);
  return projectResults;
}
