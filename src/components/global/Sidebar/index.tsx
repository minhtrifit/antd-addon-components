import { Children, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMobile } from '@/hooks/useIsMobile';
import { RootState } from '@/store/store';
import { setSidebar } from '@/store/actions/user.action';
import { IoHome } from 'react-icons/io5';
import { FiShoppingBag } from 'react-icons/fi';
import { MdOutlineApps } from 'react-icons/md';
import { VscJson } from 'react-icons/vsc';

import styles from './styles.module.scss';

const APP_NAME = import.meta.env.VITE_APP_NAME;

const { Sider } = Layout;

interface PropType {
  showToggle?: boolean;
}

const Sidebar = (props: PropType) => {
  const { showToggle = true } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const isOpenSidebar: boolean = useSelector((state: RootState) => state.users.isOpenSidebar);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const siderStyle: React.CSSProperties = {
    background: '#252422',
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    top: 0,
    bottom: 0,
  };

  const MENU_ITEMS = [
    {
      key: '/dashboard',
      icon: <IoHome size={20} />,
      label: t('dashboard'),
    },
    {
      key: '/addon',
      icon: <MdOutlineApps size={20} />,
      label: 'Addon',
      children: [
        {
          key: '/addon/json-editor',
          icon: <VscJson size={20} />,
          label: 'Json Editor',
        },
      ],
    },
  ];

  const selectedKey = useMemo(() => {
    // Duyệt toàn bộ menuItems để tìm key phù hợp nhất
    const allKeys: string[] = [];

    MENU_ITEMS.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => allKeys.push(child.key));
      } else {
        allKeys.push(item.key);
      }
    });

    // Tìm key dài nhất mà pathname bắt đầu bằng key đó
    const matchedKey = allKeys
      .filter((key) => location.pathname.startsWith(key))
      .sort((a, b) => b.length - a.length)[0];

    return matchedKey || location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    for (const item of MENU_ITEMS) {
      if (item.children?.some((child) => selectedKey === child.key)) {
        setOpenKeys([item.key]);
        return;
      }
    }

    setOpenKeys([]);
  }, [selectedKey]);

  useEffect(() => {
    if (isMobile) dispatch(setSidebar(false));
    else dispatch(setSidebar(true));
  }, [isMobile]);

  return (
    <Sider style={siderStyle} width={260} collapsible collapsed={!isOpenSidebar} trigger={null}>
      {/* Header */}
      <div
        className={`fixed bg-dark z-10 h-[64px] flex items-center px-[20px] ${
          isOpenSidebar ? 'w-[260px]' : 'w-[80px]'
        }`}
      >
        <div className='w-full flex items-center justify-center'>
          <div
            className={`w-[80px] flex items-center justify-center hover:cursor-pointer`}
            onClick={() => {
              navigate('/dashboard');
            }}
          >
            <img className='w-full h-full' src={`/assets/images/logo.png`} alt='logo' />
          </div>
        </div>
      </div>

      <Menu
        className={`${styles.sidebar} [&_.ant-menu-item-selected]:font-[500]`}
        theme='dark'
        mode='inline'
        openKeys={openKeys}
        selectedKeys={[selectedKey]}
        onOpenChange={(keys) => setOpenKeys(keys)}
        onClick={(e) => navigate(e.key)}
        items={MENU_ITEMS}
      />
    </Sider>
  );
};

export default Sidebar;
