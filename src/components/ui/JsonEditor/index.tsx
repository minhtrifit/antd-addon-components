/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Button, Divider, message, Popconfirm, Space, Tooltip, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { FaEye, FaTrash, FaCodeBranch, FaCode } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { MdFileUpload } from 'react-icons/md';
import { JsonValue } from './types';
import { ViewMode } from './constants';
import { downloadJsonFile, formatJsonValueToString, isValidJson, readJsonFile } from './utils';
import { JsonNode } from './JsonNode';
import PreviewModal from './PreviewModal';
import { JsonEditorCode } from './JsonEditorCode';

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
  viewMode?: ViewMode;
  height?: number;
  nodeModeMaxHeight?: number;
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
    viewMode = ViewMode.NODE,
    height = 400,
    nodeModeMaxHeight,
  } = props;

  const { t } = useTranslation();

  const [mode, setMode] = useState<ViewMode>(viewMode);
  const [internalEditorValue, setInternalEditorValue] = useState<string>('');
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const isValidJsonValue: boolean = useMemo(() => {
    const checkValidSourceValue = isValidJson(formatJsonValueToString(value));
    const checkValidInternalEditorValue = isValidJson(internalEditorValue);

    if (mode === ViewMode.NODE && checkValidSourceValue) return true;

    if (!checkValidSourceValue || !checkValidInternalEditorValue) return false;

    return true;
  }, [mode, value, internalEditorValue]);

  const handleChangeViewMode = (sourceValue: JsonValue, modeValue: ViewMode) => {
    setMode(modeValue);

    if (modeValue === ViewMode.EDITOR) {
      setInternalEditorValue(formatJsonValueToString(sourceValue));
    }
  };

  const handleChangeEditorCode = (value: string) => {
    setInternalEditorValue(value);
  };

  const handlePreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleDisableViewNodeMode = (mode: ViewMode, editorValue: string) => {
    const checkValidJson = isValidJson(editorValue);

    if (mode === ViewMode.EDITOR && !checkValidJson) return true;

    return false;
  };

  const handleDownloadFile = (data: JsonValue) => {
    const stringData = formatJsonValueToString(data);

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
      setInternalEditorValue(formatJsonValueToString(data));
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
    setInternalEditorValue('{}');
  };

  // Sync JSON value from EDITOR_CODE_MODE => NODE_MODE
  useEffect(() => {
    const handleSyncJsonValue = () => {
      if (mode === ViewMode.NODE) return;

      const checkValid = isValidJson(internalEditorValue);

      if (!checkValid) return;

      onChange(JSON.parse(internalEditorValue));
    };

    handleSyncJsonValue();
  }, [mode, internalEditorValue]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        containerClassName,
        error ? 'border-red-500' : 'border-primary',
        'w-full rounded-sm bg-[#FFF] flex flex-col border border-solid',
      )}
    >
      <PreviewModal jsonContent={value} open={openPreview} onClose={handleClosePreview} />

      {/* Toolbar */}
      <section
        className={cn(
          toolBarClassName,
          'w-full p-2 text-[#FFF] rounded-t-sm flex flex-wrap items-center gap-2',
          'border-b border-t-transparent border-x-transparent border-solid border-primary',
        )}
      >
        <Space.Compact>
          <Tooltip
            title={
              handleDisableViewNodeMode(mode, internalEditorValue)
                ? t('antd-json-editor.node-view-mode-disable')
                : undefined
            }
          >
            <Button
              icon={<FaCodeBranch />}
              disabled={handleDisableViewNodeMode(mode, internalEditorValue)}
              type={mode === ViewMode.NODE ? 'primary' : 'default'}
              onClick={() => handleChangeViewMode(value, ViewMode.NODE)}
            >
              Node
            </Button>
          </Tooltip>
          <Button
            icon={<FaCode />}
            type={mode === ViewMode.EDITOR ? 'primary' : 'default'}
            onClick={() => handleChangeViewMode(value, ViewMode.EDITOR)}
          >
            Editor
          </Button>
        </Space.Compact>

        <Divider
          type='vertical'
          style={{
            height: 24,
            borderColor: '#d9d9d9',
          }}
        />

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
              disabled={!isValidJsonValue}
              className={cn(`${!isValidJsonValue && '!bg-zinc-200'}`)}
              onClick={() => handleDownloadFile(value)}
            >
              <IoMdDownload
                size={20}
                className={cn(`${!isValidJsonValue ? 'text-zinc-400' : 'text-primary'}`)}
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

      {mode === ViewMode.NODE && (
        <section
          style={{
            minHeight: height,
          }}
          className={cn(
            'p-4',
            `${nodeModeMaxHeight && `max-h-[${nodeModeMaxHeight}px] overflow-y-auto`}`,
          )}
        >
          <JsonNode name='root' value={value} path={[]} root={value} onChange={onChange} isRoot />
        </section>
      )}

      {mode === ViewMode.EDITOR && (
        <JsonEditorCode
          height={height}
          value={internalEditorValue}
          onChange={handleChangeEditorCode}
        />
      )}

      {error && <div className='p-2 text-sm text-red-500'>{error}</div>}
    </div>
  );
});

JsonEditor.displayName = 'JsonEditor';
