import { ScriptAnalyzerContext } from './types';
import { Node } from '@babel/types';
import { SourceRange } from './component';

export function isNotNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function createSourceRange(context: ScriptAnalyzerContext, node: Node): SourceRange {
  return {
    source: context.source.substring(node.start!, node.end!),
    start: { offset: node.start!, line: node.loc!.start.line, column: node.loc!.start.column },
    end: { offset: node.end!, line: node.loc!.end.line, column: node.loc!.end.column },
  } as any;
}

const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null);
  return ((str: string) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  }) as any;
};

const camelizeRE = /-(\w)/g;
/**
 * @private
 */
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});

const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */
export const hyphenate = cacheStringFunction((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});

/**
 * @private
 */
export const capitalize = cacheStringFunction((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

export const pascalCase = cacheStringFunction((str: string) => capitalize(camelize(str)));
export const kebabCase = hyphenate;

export function isKebabCase(str: string) {
  return str.includes('-');
}
