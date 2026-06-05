import { JsonValue } from './types';

export const clone = <T, __>(obj: T): T => structuredClone(obj);

export const getByPath = (obj: any, path: (string | number)[]) => {
  let current = obj;

  for (const p of path) {
    current = current[p];
  }

  return current;
};

export const defaultValueByType = (type: string): JsonValue => {
  switch (type) {
    case 'string':
      return '';

    case 'number':
      return 0;

    case 'boolean':
      return false;

    case 'object':
      return {};

    case 'array':
      return [];

    case 'null':
      return null;

    default:
      return '';
  }
};
