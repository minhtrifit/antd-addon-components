import Editor, { Monaco } from '@monaco-editor/react';
import { EditorCodeTheme } from './constants';
import { EditorCodeThemeType } from './types';

interface PropType {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  baseTheme?: EditorCodeThemeType;
  backgroundColor?: string;
}

export const JsonEditorCode = (props: PropType) => {
  const {
    value,
    onChange,
    height = 400,
    baseTheme = EditorCodeTheme.light,
    backgroundColor,
  } = props;

  const handleBeforeMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('json-editor-code-theme', {
      base: baseTheme.theme,
      inherit: true,
      rules: [],
      colors: {
        'editor.background': backgroundColor ?? baseTheme.background,
      },
    });
  };

  return (
    <Editor
      height={`${height}px`}
      language='json'
      theme='json-editor-code-theme'
      beforeMount={handleBeforeMount}
      value={value}
      onChange={(value) => onChange(value || '')}
      options={{
        minimap: {
          enabled: false,
        },
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
};
