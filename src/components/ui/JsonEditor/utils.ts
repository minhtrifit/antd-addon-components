import { JsonValue, NodeType } from './types';

export const clone = <T, __>(obj: T): T => structuredClone(obj);

export const getByPath = (obj: any, path: (string | number)[]) => {
  let current = obj;

  for (const p of path) {
    current = current[p];
  }

  return current;
};

export const defaultValueByType = (type: NodeType): JsonValue => {
  switch (type) {
    case NodeType.STRING:
      return '';

    case NodeType.NUMBER:
      return 0;

    case NodeType.BOOLEAN:
      return false;

    case NodeType.OBJECT:
      return {};

    case NodeType.ARRAY:
      return [];

    case NodeType.NULL:
      return null;

    default:
      return '';
  }
};

export const isValidJson = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const downloadJsonFile = (jsonString: string, fileName: string) => {
  const fileExt = '.json';
  const downloadName = `${fileName}${fileExt}`;

  const blob = new Blob([jsonString], {
    type: 'application/json;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = downloadName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const readJsonFile = async <T = any>(file: File): Promise<T> => {
  if (!file.name.endsWith('.json')) throw new Error('Please choose json file');

  const text = await file.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Invalid json');
  }
};
