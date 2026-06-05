import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserType } from '@/types';
import { setUser } from '@/store/actions/user.action';
import authApi from '../api/auth.api';
import FullScreenLoading from '@/components/global/FullScreenLoading';

const APP_NAME = import.meta.env.VITE_APP_NAME;

interface PropType {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: PropType) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(true); // App loading state

  const handleGetUserProfile = async (token: string) => {
    try {
      const authRes = await authApi.getProfile(token);
      const userProfile = authRes?.data;

      if (!userProfile) {
        Cookies.remove(APP_NAME);

        return;
      }

      const AuthUser: UserType = {
        token: token,
        ...userProfile,
      };

      console.log('AUTH PROVIDER:', AuthUser);

      Cookies.set(APP_NAME, JSON.stringify(AuthUser), {
        expires: 7, // 7 ngày
        path: '/', // toàn bộ site
      });

      // Set to global store
      dispatch(setUser(AuthUser));

      // Navigate to current path
      const currentPath = location.pathname;
      const currtentSearchParams = location.search;
      const redirectPath = `${currentPath}${currtentSearchParams}`;

      navigate(redirectPath ?? '/dashboard');
    } catch (error) {
      Cookies.remove(APP_NAME);

      console.error('Lỗi lấy thông tin người dùng');
    } finally {
      // setIsLoading(false); // Kết thúc loading sau khi gọi xong API

      // Config app loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const session = Cookies.get(APP_NAME);

    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        const token = parsedSession?.token;

        if (!token) {
          Cookies.remove(APP_NAME);
          setIsLoading(false);
          return;
        }

        handleGetUserProfile(token);
      } catch (error) {
        Cookies.remove(APP_NAME);

        console.error('Không thể parse session:', error);

        setIsLoading(false);
      }
    } else {
      // Config app loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  // Hiển thị loading trong khi đang gọi API
  if (isLoading) {
    return <FullScreenLoading />;
  }

  return <>{children}</>;
};

export default AuthProvider;
