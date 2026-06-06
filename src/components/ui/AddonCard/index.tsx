import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { AddonItemType } from '@/pages/dashboard/types';

interface PropType {
  item: AddonItemType;
}

const AddonCard = (props: PropType) => {
  const { item } = props;

  const { t } = useTranslation();

  return (
    <Card
      className='w-full md:w-[400px]'
      title={item.name}
      extra={<Link to={item.url}>{t('view')}</Link>}
    >
      <div className='w-full flex items-center justify-center'>{item.icon}</div>
    </Card>
  );
};

export default AddonCard;
