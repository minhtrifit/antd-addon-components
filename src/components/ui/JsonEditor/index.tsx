/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Button, Tooltip } from 'antd';
import { FaEye } from 'react-icons/fa';
import { JsonValue } from './types';
import { JsonNode } from './JsonNode';
import PreviewModal from './PreviewModal';

interface PropType {
  containerClassName?: string;
  toolBarClassName?: string;
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  error?: string;
}

export const JsonEditor = forwardRef<HTMLDivElement, PropType>((props, ref) => {
  const { containerClassName, toolBarClassName, value = {}, onChange, error } = props;

  const { t } = useTranslation();

  const [openPreview, setOpenPreview] = useState<boolean>(false);

  const handlePreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        containerClassName,
        error && 'border border-solid border-red-500',
        'rounded-sm bg-[#FFF] flex flex-col',
      )}
    >
      <PreviewModal jsonContent={value} open={openPreview} onClose={handleClosePreview} />

      {/* Toolbar */}
      <section
        className={cn(
          toolBarClassName,
          error ? 'bg-red-500' : 'bg-primary',
          'w-full p-2 text-[#FFF] rounded-t-sm',
        )}
      >
        <Tooltip title={t('antd-json-editor.preview')}>
          <Button onClick={handlePreview}>
            <FaEye size={15} className='text-primary' />
          </Button>
        </Tooltip>
      </section>

      <section className='p-4'>
        <JsonNode name='root' value={value} path={[]} root={value} onChange={onChange} isRoot />
      </section>

      {error && <div className='p-2 text-sm text-red-500'>{error}</div>}
    </div>
  );
});

JsonEditor.displayName = 'JsonEditor';
