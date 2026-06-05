import React, { useEffect } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined, MenuOutlined } from '@ant-design/icons';
import AuthProvider from '@/+core/provider/AuthProvider';
import AuthProtectProvider from '@/+core/provider/AuthProtectProvider';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useIsMobile } from '@/hooks/useIsMobile';
import { setSidebar, toggleSidebar } from '@/store/actions/user.action';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar';
import LanguageToggle from '../LanguageToggle';
import UserDropdown from '@/components/ui/UserDropdown';
import NotificationDropdown from '../NotificationDropdown';
import Footer from '../Footer';

const APP_NAME = import.meta.env.VITE_APP_NAME;

const { Header, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const isOpenSidebar: boolean = useSelector((state: RootState) => state.users.isOpenSidebar);

  const getHeaderLeftPosition = (isMobile: boolean) => {
    if (isMobile) return 0;

    if (isOpenSidebar) return 250;

    return 80;
  };

  useEffect(() => {
    if (isMobile) {
      dispatch(setSidebar(false));
    } else {
      dispatch(setSidebar(true));
    }
  }, [isMobile]);

  return (
    <AuthProvider>
      <AuthProtectProvider>
        {isMobile ? (
          <div className='w-full h-screen flex items-center justify-center'>
            <h3 className='text-[0.9rem]'>{t('app-not-support-device')}</h3>
          </div>
        ) : (
          <Layout style={{ minHeight: '100vh' }}>
            <Sidebar showToggle={false} />

            <Layout>
              <Header
                className='flex items-center justify-between px-[15px] transition-all duration-300'
                style={{
                  background: colorBgContainer,
                  position: 'sticky',
                  top: 0,
                  left: getHeaderLeftPosition(isMobile),
                  right: 0,
                  height: 64,
                  zIndex: 1000,
                }}
              >
                <div className='flex items-center justify-between gap-5'>
                  {isMobile ? (
                    <div className='hover:cursor-pointer' onClick={() => dispatch(toggleSidebar())}>
                      <MenuOutlined style={{ color: 'black', fontSize: '1rem' }} />
                    </div>
                  ) : (
                    <div className='hover:cursor-pointer' onClick={() => dispatch(toggleSidebar())}>
                      {isOpenSidebar ? (
                        <MenuFoldOutlined style={{ color: 'black', fontSize: '1rem' }} />
                      ) : (
                        <MenuUnfoldOutlined style={{ color: 'black', fontSize: '1rem' }} />
                      )}
                    </div>
                  )}

                  {/* <Breadcrumb /> */}
                </div>

                <div className='flex items-center gap-8'>
                  <LanguageToggle />
                  <NotificationDropdown />
                  <UserDropdown />
                </div>
              </Header>

              <Content style={{ margin: '12px', marginTop: '14px', marginBottom: '20px' }}>
                <div
                  className='min-h-full'
                  // style={{
                  //   background: colorBgContainer,
                  // }}
                >
                  <Outlet />
                </div>
              </Content>

              <Footer />
            </Layout>
          </Layout>
        )}
      </AuthProtectProvider>
    </AuthProvider>
  );
};

export default DashboardLayout;
