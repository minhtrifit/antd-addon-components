import { useEffect, useMemo, useRef, useState } from 'react';
import JoditEditor, { Jodit } from 'jodit-react';

import './styles.scss';

interface TextEditorProps {
  value: string;
  height?: number;
  onChange: (value: string) => void;
  placeholder?: string;
  toolbarSticky?: boolean;
  error?: string;
  [x: string]: any;
}

const buttons = [
  'undo',
  'redo',
  '|',
  'bold',
  'strikethrough',
  'underline',
  'italic',
  '|',
  'superscript',
  'subscript',
  '|',
  'align',
  '|',
  'ul',
  'ol',
  'outdent',
  'indent',
  '|',
  // "font",
  'fontsize',
  'brush',
  'paragraph',
  '|',
  'image',
  'link',
  'table',
  '|',
  'hr',
  'eraser',
  'copyformat',
  '|',
  'fullsize',
  'selectall',
  // "print",
  // "|",
  // "source",
];

export const TextEditor = ({
  value,
  height = 350,
  onChange,
  placeholder = '',
  toolbarSticky = false,
  error,
  ...rest
}: TextEditorProps) => {
  const editorRef = useRef<Jodit>(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height,
      disablePlugins: ['mobile'],
      buttons,
      autofocus: false,
      toolbarSticky,
      placeholder: placeholder || 'Start writing...',
      uploader: {
        insertImageAsBase64URI: true,
      },
    }),
    [height, placeholder, toolbarSticky],
  );

  return (
    <div className='reset-tw'>
      <div className={`${error ? 'border-[1px] border-solid border-red-500' : ''}`}>
        <JoditEditor
          ref={editorRef}
          {...rest}
          value={value}
          config={config}
          className={toolbarSticky ? 'sticky-toolbar' : ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
