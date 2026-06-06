import { EditorCodeThemeType, NodeType } from './types';

export const TYPE_MENU_ITEMS = [
  { key: NodeType.STRING, label: 'String' },
  { key: NodeType.NUMBER, label: 'Number' },
  { key: NodeType.BOOLEAN, label: 'Boolean' },
  { key: NodeType.OBJECT, label: 'Object' },
  { key: NodeType.ARRAY, label: 'Array' },
  { key: NodeType.NULL, label: 'Null' },
];

export enum ViewMode {
  NODE = 'NODE',
  EDITOR = 'EDITOR',
}

export enum KeyboardKey {
  ENTER = 'Enter',
}

export const EditorCodeTheme: Record<string, EditorCodeThemeType> = {
  light: {
    theme: 'vs',
    background: '#FFFFFF',
  },

  dark: {
    theme: 'vs-dark',
    background: '#141414',
  },
};
