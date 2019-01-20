/**
 * Generic collection object
 */
export interface Collection<T = any> {
  [key: string]: T | undefined;
}

/**
 * Like Array.prototype.findIndex
 */
export function findIndex<T>(
  obj: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  for (let i = 0; i < obj.length; i++) {
    if (predicate(obj[i], i, obj) === true) {
      return i;
    }
  }
  return -1;
}

/**
 * Like Array.prototype.find
 */
export function find<T>(
  obj: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean
): T | undefined {
  for (let i = 0; i < obj.length; i++) {
    if (predicate(obj[i], i, obj) === true) {
      return obj[i];
    }
  }
}

/**
 * Like Object.assign but wihout symbols
 */
export function assign<T>(target: T): T;
export function assign<T, S>(target: T, source: S): T & S;
export function assign<T, S0, S1>(target: T, s0: S0, s1: S1): T & S0 & S1;
export function assign<T, S0, S1, S2>(
  target: T,
  s0: S0,
  s1: S1,
  s2: S2
): T & S0 & S1 & S2;
export function assign<T, S0, S1, S2, S3>(
  target: T,
  s0: S0,
  s1: S1,
  s2: S2,
  s3: S3
): T & S0 & S1 & S2 & S3;
export function assign(target: any, ...sources: any[]): any {
  if (target === null || target === undefined) {
    throw new TypeError(
      "Object.assign cannot be called with null or undefined"
    );
  }

  const to: any = Object(target);

  for (const source of sources) {
    const from: any = Object(source);

    for (const key in from) {
      if (from.hasOwnProperty(key)) {
        to[key] = from[key];
      }
    }
  }

  return to;
}

/**
 * Returns true if the argument is an array
 */
export function isArray(value: any): value is any[] {
  return value instanceof Array;
}

/**
 * Returns true if the argument is an object
 */
export function isObject(value: any): value is Object {
  return typeof value === "object" && value !== null;
}

/**
 * Returns true if the argument is a function
 */
export function isFunction(value: any): value is Function {
  return typeof value === "function";
}

/**
 * Returns true if the argument is a string
 */
export function isString(value: any): value is string {
  return typeof value === "string";
}

/**
 * Returns true if the argument is a finite number
 */
export function isNumber(value: any): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Like Array.prototype.includes
 */
export function includes<T>(arr: T[], target: T): boolean {
  for (const entry of arr) {
    if (entry === target) {
      return true;
    }
  }
  return false;
}

/**
 * Remove duplicates from an array
 */
export function uniq<T>(arr: T[]): T[] {
  const result: T[] = [];
  for (const entry of arr) {
    if (!includes(result, entry)) {
      result.push(entry);
    }
  }
  return result;
}

/**
 * Remove the targeted element, returns true if the element is removed
 */
export function remove<T>(arr: T[], target: T): boolean {
  const index: number = findIndex(arr, (entry: T): boolean => entry === target);
  if (index >= 0) {
    arr.splice(index, 1);
  }
  return index >= 0;
}

/**
 * Parse object path into tokens array
 */
export function parsePath(path: string): string[] {
  // TODO you can do better than this...
  const tokens: string[] = [];
  while (path.length > 0) {
    if (path[0] === "[") {
      const end: number = path.indexOf("]");
      if (end === -1) {
        throw new Error(`"${path}" is not a valid path`);
      }
      tokens.push(path.substring(1, end));
      path = path.substr(end + 1);
    } else {
      const match: any = path.match(/^[^\.|\[]+/);
      const token: string = match[0];
      tokens.push(token);
      path = path.substr(token.length);
    }
    if (path[0] === ".") {
      path = path.substr(1);
    }
  }
  return tokens;
}

/**
 * Empty function
 */
export function noop(): void {
  // nothing to do
}

/**
 * Element attributes to array of attributes
 */
export function getAttributes(el: HTMLElement) {
  const results: Attr[] = [];
  for (let i = 0; i < el.attributes.length; i++) {
    results.push(el.attributes[i]);
  }
  return results;
}

/**
 * Get parent element
 */
export function parentElement(node: Node): HTMLElement {
  const parent = node.parentElement || node.parentNode;
  if (!parent) {
    throw new Error("Parent element not found");
  }
  if (parent.nodeType !== 1) {
    throw new Error("Invalid parent element");
  }
  return parent as HTMLElement;
}

/**
 * Insert DOM element before another one
 */
export function insertBefore<T extends Node>(newNode: T, oldNode: Node): T {
  parentElement(oldNode).insertBefore(newNode, oldNode);
  return newNode;
}

/**
 * Insert DOM element after another one
 */
export function insertAfter<T extends Node>(newNode: T, oldNode: Node): T {
  parentElement(oldNode).insertBefore(newNode, oldNode.nextSibling);
  return newNode;
}

/**
 * Replace DOM element
 */
export function replaceChild<T extends Node>(newChild: T, oldChild: Node): T {
  parentElement(oldChild).replaceChild(newChild, oldChild);
  return newChild;
}
