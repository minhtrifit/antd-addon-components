import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { APP_ROUTE } from '@/routes/route.constant';
import { UserType } from '@/types';

// const APP_NAME = import.meta.env.VITE_APP_NAME;

interface PropType {
  children: React.ReactNode;
}

const protectedRoutes = [APP_ROUTE.JSON_EDITOR];

const AuthProtectProvider = ({ children }: PropType) => {
  const { pathname } = useLocation();

  const user: UserType | null = useSelector((state: RootState) => state.users.user);

  const isProtected = protectedRoutes.includes(pathname);

  if (isProtected && !user) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default AuthProtectProvider;
