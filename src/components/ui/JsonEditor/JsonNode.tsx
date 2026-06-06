import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Button, Dropdown, Input, Popconfirm } from 'antd';
import { FaPlus, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { MdModeEditOutline, MdSwapHoriz } from 'react-icons/md';
import { VscCircleSlash } from 'react-icons/vsc';
import { JsonValue, NodeType } from './types';
import { clone, defaultValueByType, getByPath } from './utils';
import { TYPE_MENU_ITEMS } from './constants';
import ValueEditor from './ValueEditor';

interface PropType {
  name: string;
  value: JsonValue;
  path: (string | number)[];
  root: JsonValue;
  onChange: (value: JsonValue) => void;
  isRoot?: boolean;
}

const Branch = () => {
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className='relative w-[40px] h-[30px] caret-transparent'
    >
      <div className='absolute top-0 left-3 w-[1px] h-[50%] bg-zinc-500' />
      <div className='absolute top-1/2 left-3 w-[50%] h-[1px] bg-zinc-500' />
    </div>
  );
};

export const JsonNode = (props: PropType) => {
  const { name, value, path, root, onChange, isRoot } = props;

  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<boolean>(true);
  const [editingKey, setEditingKey] = useState<boolean>(false);
  const [draftKey, setDraftKey] = useState<string>(name);

  const currentPath = isRoot ? [] : [...path, name];

  const updateRoot = (updater: (draft: any) => void) => {
    const next = clone(root);

    updater(next);

    onChange(next);
  };

  const renameKey = (oldKey: string, newKey: string) => {
    if (!newKey || oldKey === newKey) return;

    updateRoot((draft) => {
      const parent = getByPath(draft, path);

      if (Array.isArray(parent) || parent[newKey] !== undefined) return;

      const entries = Object.entries(parent);

      const nextObj: any = {};

      for (const [key, value] of entries) {
        if (key === oldKey) {
          nextObj[newKey] = value;
        } else {
          nextObj[key] = value;
        }
      }

      // Mutate parent but keep reference structure
      Object.keys(parent).forEach((k) => delete parent[k]);
      Object.assign(parent, nextObj);
    });
  };

  const changeNodeType = (type: NodeType) => {
    updateRoot((draft) => {
      const parent = getByPath(draft, path);

      if (Array.isArray(parent)) {
        parent[Number(name)] = defaultValueByType(type);
      } else {
        parent[name] = defaultValueByType(type);
      }
    });
  };

  const deleteNode = () => {
    updateRoot((draft) => {
      const parent = getByPath(draft, path);

      if (Array.isArray(parent)) {
        const index = Number(name);
        parent.splice(index, 1);
      } else {
        delete parent[name];
      }
    });
  };

  const updateValue = (newValue: JsonValue) => {
    updateRoot((draft) => {
      const parent = getByPath(draft, path);

      if (Array.isArray(parent)) {
        parent[Number(name)] = newValue;
      } else {
        parent[name] = newValue;
      }
    });
  };

  const addProperty = (type: NodeType) => {
    updateRoot((draft) => {
      const target = isRoot ? draft : getByPath(draft, currentPath);

      if (typeof target !== 'object' || target === null) {
        return;
      }

      if (Array.isArray(target)) {
        target.push(defaultValueByType(type));
        setExpanded(true); // Auto expanded child node
        return;
      }

      let index = 1;

      while (target[`newKey${index}`] !== undefined) {
        index++;
      }

      target[`newKey${index}`] = defaultValueByType(type);
      setExpanded(true); // Auto expanded child node
    });
  };

  const isObject = value !== null && typeof value === 'object';

  const isArray = Array.isArray(value);

  return (
    <div className={cn(`${isRoot ? 'ml-0' : 'ml-[24px]'}`)}>
      <div className={cn(`${!isRoot && 'my-3'}`, 'flex items-center gap-2')}>
        {isObject ? (
          <Button
            type='text'
            icon={expanded ? <FaChevronDown /> : <FaChevronRight />}
            onClick={() => setExpanded(!expanded)}
          />
        ) : (
          <Branch />
        )}

        {!isRoot &&
          (editingKey ? (
            <Input
              autoFocus
              value={draftKey}
              style={{
                width: 120,
              }}
              onChange={(e) => setDraftKey(e.target.value)}
              onBlur={() => {
                renameKey(name, draftKey);
                setEditingKey(false);
              }}
              onPressEnter={() => {
                renameKey(name, draftKey);
                setEditingKey(false);
              }}
            />
          ) : (
            <span
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setEditingKey(true)}
              className='group relative px-4 py-2.5 cursor-pointer min-w-[100px] inline-block
                        hover:bg-zinc-100 rounded-sm caret-transparent font-[600]'
            >
              {name}:
              <MdModeEditOutline
                size={20}
                className='absolute top-[-8px] right-[-8px] text-primary opacity-0
                            transition-opacity duration-200 group-hover:opacity-100'
              />
            </span>
          ))}

        {isObject ? (
          <span className='min-w-[20px] text-center text-primary font-semibold'>
            {isArray ? `[${value.length}]` : '{}'}
          </span>
        ) : (
          <ValueEditor value={value} updateValue={updateValue} />
        )}

        {!isRoot && (
          <Dropdown
            menu={{
              items: TYPE_MENU_ITEMS,
              onClick: ({ key }) => changeNodeType(key as NodeType),
            }}
            trigger={['click']}
          >
            <Button type='text' icon={<MdSwapHoriz size={20} />} />
          </Dropdown>
        )}

        {isObject && (
          <Dropdown
            menu={{
              items: TYPE_MENU_ITEMS,
              onClick: ({ key }) => addProperty(key as NodeType),
            }}
            trigger={['click']}
          >
            <Button type='dashed' icon={<FaPlus />} />
          </Dropdown>
        )}

        {!isRoot && (
          <Popconfirm
            title={t('antd-json-editor.confirm')}
            description={t('antd-json-editor.confirm-delete-node')}
            onConfirm={deleteNode}
            okText={t('antd-json-editor.confirm')}
            cancelText={t('antd-json-editor.cancel')}
          >
            <Button type='text' danger icon={<VscCircleSlash size={20} />} />
          </Popconfirm>
        )}
      </div>

      {isObject && expanded && (
        <div>
          {isArray
            ? value.map((item, index) => (
                <JsonNode
                  key={index}
                  name={String(index)}
                  value={item}
                  path={currentPath}
                  root={root}
                  onChange={onChange}
                />
              ))
            : Object.entries(value).map(([key, val]) => (
                <JsonNode
                  key={key}
                  name={key}
                  value={val}
                  path={currentPath}
                  root={root}
                  onChange={onChange}
                />
              ))}
        </div>
      )}
    </div>
  );
};
