import { Theme } from './Theme.types';

export type ThemeFunction<T> = (theme: Theme) => T;

type AddFunctionToSimpleValues<T> = T extends object ? T : T extends Function ? T : T | ThemeFunction<T>;

/**
 * recursively apply the ability to have theme functions to values within the object
 */
export type WithThemeFunctions<T> = {
  [K in keyof T]: AddFunctionToSimpleValues<WithThemeFunctions<T[K]>>;
};
