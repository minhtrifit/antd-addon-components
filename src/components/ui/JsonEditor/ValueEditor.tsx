import { useEffect, useState } from 'react';
import { Input, InputNumber, Switch } from 'antd';
import { MdModeEditOutline } from 'react-icons/md';
import { JsonValue } from './types';
import { KeyboardKey } from './constants';

interface PropType {
  value: JsonValue;
  updateValue: (newValue: JsonValue) => void;
}

const ValueEditor = ({ value, updateValue }: PropType) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<JsonValue>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (value !== null && typeof value === 'object') {
    return null;
  }

  if (typeof value === 'string') {
    if (!isEdit)
      return (
        <span
          className='relative group px-4 py-2.5 caret-transparent
                      hover:cursor-pointer hover:bg-zinc-100 rounded-sm'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsEdit(true)}
        >
          {!value ? `""` : value}
          <MdModeEditOutline
            size={20}
            className='absolute top-[-8px] right-[-8px] text-primary opacity-0
                        transition-opacity duration-200 group-hover:opacity-100'
          />
        </span>
      );

    return (
      <Input
        autoFocus
        value={localValue as string}
        style={{ width: 180 }}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === KeyboardKey.ENTER) {
            updateValue(localValue);
            setIsEdit(false);
          }
        }}
        onBlur={() => {
          updateValue(localValue);
          setIsEdit(false);
        }}
      />
    );
  }

  if (typeof value === 'number') {
    if (!isEdit)
      return (
        <span
          className='px-2 py-2.5 caret-transparent hover:cursor-pointer'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsEdit(true)}
        >
          {value}
        </span>
      );

    return (
      <InputNumber
        autoFocus
        value={localValue as number}
        onChange={(v) => setLocalValue(v ?? 0)}
        onKeyDown={(e) => {
          if (e.key === KeyboardKey.ENTER) {
            updateValue(localValue);
            setIsEdit(false);
          }
        }}
        onBlur={() => {
          updateValue(localValue);
          setIsEdit(false);
        }}
      />
    );
  }

  if (typeof value === 'boolean') {
    return (
      <Switch
        checked={localValue as boolean}
        onChange={(checked) => {
          setLocalValue(checked);
          updateValue(checked);
        }}
      />
    );
  }

  return <span className='px-2 py-2.5 caret-transparent text-orange-500 font-semibold'>null</span>;
};

export default ValueEditor;
