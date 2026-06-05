import { useTranslation } from 'react-i18next';
import { Empty as AntdEmpty } from 'antd';

const Empty = () => {
  const { t } = useTranslation();

  return (
    <div className='w-full flex justify-center'>
      <div className='mt-5 flex flex-col items-center justify-center'>
        <AntdEmpty image={AntdEmpty.PRESENTED_IMAGE_SIMPLE} description={t('empty')} />
      </div>
    </div>
  );
};

export default Empty;
