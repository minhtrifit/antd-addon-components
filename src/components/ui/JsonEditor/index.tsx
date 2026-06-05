/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { forwardRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Button, message, Popconfirm, Tooltip, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { FaEye, FaTrash } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { MdFileUpload } from 'react-icons/md';
import { JsonValue } from './types';
import { JsonNode } from './JsonNode';
import PreviewModal from './PreviewModal';
import { downloadJsonFile, isValidJson, readJsonFile } from './utils';

interface PropType {
  containerClassName?: string;
  toolBarClassName?: string;
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  error?: string;
  enablePreview?: boolean;
  enableDownload?: boolean;
  enableUpload?: boolean;
  enableClear?: boolean;
}

export const JsonEditor = forwardRef<HTMLDivElement, PropType>((props, ref) => {
  const {
    containerClassName,
    toolBarClassName,
    value = {},
    onChange,
    error,
    enablePreview = true,
    enableDownload = true,
    enableUpload = true,
    enableClear = true,
  } = props;

  const { t } = useTranslation();

  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const memoValidJsonValue: boolean = useMemo(() => {
    if (!value) return false;
    return isValidJson(JSON.stringify(value, null, 2));
  }, [value]);

  const handlePreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleDownloadFile = (data: JsonValue) => {
    const stringData = JSON.stringify(data, null, 2);

    const checkValidJson = isValidJson(stringData);

    if (!checkValidJson) {
      message.error(t('antd-json-editor.invalid-json'));
      return;
    }

    downloadJsonFile(stringData, 'data');
    message.success(t('antd-json-editor.download-successfully'));
  };

  const handleUploadFile = async (file: RcFile) => {
    try {
      setUploadLoading(true);

      const data: JsonValue = await readJsonFile(file);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onChange(data);
      message.success(t('antd-json-editor.upload-successfully'));
    } catch {
      message.error(t('antd-json-editor.invalid-json'));
    } finally {
      setUploadLoading(false);
    }

    return false; // not upload to server
  };

  const handleDeleteAllNode = () => {
    onChange({});
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        containerClassName,
        error && 'border border-solid border-red-500',
        'w-full rounded-sm bg-[#FFF] flex flex-col',
      )}
    >
      <PreviewModal jsonContent={value} open={openPreview} onClose={handleClosePreview} />

      {/* Toolbar */}
      <section
        className={cn(
          toolBarClassName,
          error ? 'bg-red-500' : 'bg-primary',
          'w-full p-2 text-[#FFF] rounded-t-sm flex flex-wrap items-center gap-2',
        )}
      >
        {enablePreview && (
          <Tooltip title={t('antd-json-editor.preview')}>
            <Button onClick={handlePreview}>
              <FaEye size={20} className='text-primary' />
            </Button>
          </Tooltip>
        )}

        {enableDownload && (
          <Tooltip title={t('antd-json-editor.download')}>
            <Button
              disabled={!memoValidJsonValue}
              className={cn(`${!memoValidJsonValue && '!bg-zinc-200'}`)}
              onClick={() => handleDownloadFile(value)}
            >
              <IoMdDownload
                size={20}
                className={cn(`${!memoValidJsonValue ? 'text-zinc-400' : 'text-primary'}`)}
              />
            </Button>
          </Tooltip>
        )}

        {enableUpload && (
          <Tooltip title={t('antd-json-editor.upload')}>
            <Upload accept='.json' showUploadList={false} beforeUpload={handleUploadFile}>
              <Button loading={uploadLoading}>
                <MdFileUpload size={20} className='text-primary' />
              </Button>
            </Upload>
          </Tooltip>
        )}

        {enableClear && (
          <Tooltip title={t('antd-json-editor.clear-all')}>
            <Popconfirm
              title={t('antd-json-editor.confirm')}
              description={t('antd-json-editor.confirm-delete-all-node')}
              onConfirm={handleDeleteAllNode}
              okText={t('antd-json-editor.confirm')}
              cancelText={t('antd-json-editor.cancel')}
            >
              <Button danger>
                <FaTrash size={20} />
              </Button>
            </Popconfirm>
          </Tooltip>
        )}
      </section>

      <section className='p-4'>
        <JsonNode name='root' value={value} path={[]} root={value} onChange={onChange} isRoot />
      </section>

      {error && <div className='p-2 text-sm text-red-500'>{error}</div>}
    </div>
  );
});

JsonEditor.displayName = 'JsonEditor';
