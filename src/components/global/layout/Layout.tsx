import { Outlet } from 'react-router-dom';
import AuthProvider from '@/+core/provider/AuthProvider';
import { Layout as LayoutAntDesign } from 'antd';

const { Content } = LayoutAntDesign;

export default function Layout() {
  return (
    <AuthProvider>
      <Content className='bg-[#F5F5F5] transition duration-500 ease-in-out w-full min-h-screen'>
        <Outlet />
      </Content>
    </AuthProvider>
  );
}
