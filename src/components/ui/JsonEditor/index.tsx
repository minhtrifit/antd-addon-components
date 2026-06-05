import { useState } from 'react';
import { Button, Dropdown, Input, InputNumber, Switch } from 'antd';
import { DownOutlined, RightOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface PropType {
  value: JsonValue;
  onChange: (value: JsonValue) => void;
}

const clone = <T, __>(obj: T): T => structuredClone(obj);

const getByPath = (obj: any, path: (string | number)[]) => {
  let current = obj;

  for (const p of path) {
    current = current[p];
  }

  return current;
};

const defaultValueByType = (type: string): JsonValue => {
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

const TYPE_MENU_ITEMS = [
  { key: 'string', label: 'String' },
  { key: 'number', label: 'Number' },
  { key: 'boolean', label: 'Boolean' },
  { key: 'object', label: 'Object' },
  { key: 'array', label: 'Array' },
  { key: 'null', label: 'Null' },
];

export const JsonEditor = (props: PropType) => {
  const { value, onChange } = props;

  return (
    <div>
      <JsonNode name='root' value={value} path={[]} root={value} onChange={onChange} isRoot />
    </div>
  );
};

interface NodePropType {
  name: string;
  value: JsonValue;
  path: (string | number)[];
  root: JsonValue;
  onChange: (value: JsonValue) => void;
  isRoot?: boolean;
}

const JsonNode = (props: NodePropType) => {
  const { name, value, path, root, onChange, isRoot } = props;

  const [expanded, setExpanded] = useState(true);
  const [editingKey, setEditingKey] = useState(false);
  const [draftKey, setDraftKey] = useState(name);

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

      if (Array.isArray(parent) || parent[newKey] !== undefined) {
        return;
      }

      parent[newKey] = parent[oldKey];
      delete parent[oldKey];
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

  const addProperty = (type: string) => {
    updateRoot((draft) => {
      const target = isRoot ? draft : getByPath(draft, currentPath);

      if (typeof target !== 'object' || target === null) {
        return;
      }

      if (Array.isArray(target)) {
        target.push(defaultValueByType(type));
        return;
      }

      let index = 1;

      while (target[`newKey${index}`] !== undefined) {
        index++;
      }

      target[`newKey${index}`] = defaultValueByType(type);
    });
  };

  const renderValueEditor = () => {
    if (value !== null && typeof value === 'object') {
      return null;
    }

    if (typeof value === 'string') {
      return (
        <Input value={value} style={{ width: 180 }} onChange={(e) => updateValue(e.target.value)} />
      );
    }

    if (typeof value === 'number') {
      return <InputNumber value={value} onChange={(v) => updateValue(v ?? 0)} />;
    }

    if (typeof value === 'boolean') {
      return <Switch checked={value} onChange={(checked) => updateValue(checked)} />;
    }

    return <Button onClick={() => updateValue('')}>null</Button>;
  };

  const isObject = value !== null && typeof value === 'object';

  const isArray = Array.isArray(value);

  return (
    <div
      style={{
        marginLeft: isRoot ? 0 : 24,
      }}
    >
      <div className='my-2 flex items-center gap-3'>
        {isObject ? (
          <Button
            type='text'
            icon={expanded ? <DownOutlined /> : <RightOutlined />}
            onClick={() => setExpanded(!expanded)}
          />
        ) : (
          <div
            style={{
              width: 40,
            }}
          />
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
              onDoubleClick={() => setEditingKey(true)}
              className='p-2 hover:bg-zinc-100 rounded-md'
              style={{
                cursor: 'pointer',
                minWidth: 100,
                display: 'inline-block',
              }}
            >
              &quot;{name}&quot;
            </span>
          ))}

        {isObject ? (
          <span className='text-primary font-semibold'>{isArray ? `[${value.length}]` : '{}'}</span>
        ) : (
          renderValueEditor()
        )}

        {isObject && (
          <Dropdown
            menu={{
              items: TYPE_MENU_ITEMS,
              onClick: ({ key }) => addProperty(key),
            }}
            trigger={['click']}
          >
            <Button icon={<PlusOutlined />} />
          </Dropdown>
        )}

        {!isRoot && <Button danger icon={<DeleteOutlined />} onClick={deleteNode} />}
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
