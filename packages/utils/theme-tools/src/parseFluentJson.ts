/** Value types are limited to strings, numbers, booleans, or number arrays (for padding) */
type Value = string | number | boolean | number[];

/** Leaf nodes contain values or Aliases */
export type Leaf = { value?: Value; aliasOf?: string };

/** A branch just contains multiples leafs or branches */
export type FluentJson = { [key: string]: Leaf | FluentJson };

/** Types of entries in the tree */
export type TreeEntry = 'value' | 'alias' | 'branch' | 'omit';

/** Get tree entry type */
export function entryType(entry: any): TreeEntry {
  return typeof entry === 'object' ? (entry.value !== undefined ? 'value' : entry.aliasOf !== undefined ? 'alias' : 'branch') : 'omit';
}

/** Walk to a given key in the tree */
export function walkToKey<T extends object>(obj: T, key: string): any {
  const parts = key.split('.');
  let index = 0;
  while (obj && typeof obj === 'object' && index < parts.length) {
    obj = obj[parts[index++]];
  }
  return index === parts.length ? obj : undefined;
}

function connectAliasesToLeafs(pathRoot: string, target: FluentJson | Leaf): FluentJson | Leaf {
  const targetType = entryType(target);
  if (targetType === 'alias' || targetType === 'value') {
    return { aliasOf: pathRoot };
  } else if (targetType === 'omit') {
    return undefined;
  }
  const result = {};
  Object.keys(target).forEach(key => {
    const keyValue = connectAliasesToLeafs(`${pathRoot}.${key}`, target[key]);
    if (keyValue !== undefined) {
      result[key] = keyValue;
    }
  });
  return result;
}

function processFluentJsonNode(root: FluentJson, entries: FluentJson | Leaf): FluentJson | Leaf {
  const results = { ...entries };
  Object.keys(results).forEach(key => {
    const entry = results[key];
    const type = entryType(entry);
    if (type === 'branch') {
      results[key] = processFluentJsonNode(root, entry);
    } else if (type === 'omit') {
      delete results[key];
    } else if (type === 'alias') {
      results[key] = connectAliasesToLeafs(entry.aliasOf, walkToKey(root, entry.aliasOf));
    }
  });
  return results;
}

/**
 * This function loads a fluent JSON object adn performs two main functions on it. First it will remove entries that are
 * purely informational such as the token version or the IntendedFor field
 *
 * The other, and more subtle pattern is that the JSON can have aliases into branches in the tree rather than leaf nodes.
 * This becomes a problem as some of the values will be flattened in our themes. To help resolve this the aliases will be expanded
 * to the leaf nodes.
 *
 * As an example if there is a set called ControlFill.Color that has three values for Color (such as Rest, Hover, Press) if a
 * user sets up the following:
 * Button: {
 *   BackgroundColor: { aliasOf: 'ControlFill.Color' }
 * }
 *
 * This will be expanded to:
 *   Button: {
 *     BackgroundColor: {
 *       Rest: { aliasOf: 'ControlFill.Color.Rest' },
 *       Hover: { aliasOf: 'ControlFill.Color.Hover' },
 *     }
 * }
 *
 * This ensures that it is safe to move/join branches when we manifpulate the tree
 */
export function parseFluentJson(target: any): FluentJson {
  return processFluentJsonNode(target as FluentJson, target) as FluentJson;
}
