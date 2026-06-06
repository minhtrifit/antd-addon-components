import cn from 'classnames';
import { Modal } from 'antd';
import { JsonValue } from './types';
import { formatJsonValueToString } from './utils';

interface PropType {
  jsonContent: JsonValue;
  open: boolean;
  onClose: () => void;
  className?: string;
}

const PreviewModal = (props: PropType) => {
  const { jsonContent, open, onClose, className } = props;

  return (
    <Modal open={open} footer={null} onCancel={onClose}>
      <div className={cn(className, `mt-8 max-h-[400px] overflow-y-auto`)}>
        <pre>{formatJsonValueToString(jsonContent)}</pre>
      </div>
    </Modal>
  );
};

export default PreviewModal;
