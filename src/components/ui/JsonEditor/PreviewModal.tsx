import { Modal } from 'antd';
import { JsonValue } from './types';

interface PropType {
  jsonContent: JsonValue;
  open: boolean;
  onClose: () => void;
}

const PreviewModal = (props: PropType) => {
  const { jsonContent, open, onClose } = props;

  return (
    <Modal open={open} footer={null} onCancel={onClose}>
      <pre>{JSON.stringify(jsonContent, null, 2)}</pre>
    </Modal>
  );
};

export default PreviewModal;
