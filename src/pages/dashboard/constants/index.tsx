import { AddonItemType } from '@/pages/dashboard/types';
import { APP_ROUTE } from '@/routes/route.constant';
import { FaCode } from 'react-icons/fa6';

export const ADDON_ITEM: AddonItemType[] = [
  {
    id: 'json-editor',
    name: 'Json Editor',
    url: APP_ROUTE.JSON_EDITOR,
    icon: <FaCode size={40} className='text-primary' />,
  },
];
