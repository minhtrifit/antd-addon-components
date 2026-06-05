import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, message, Typography } from 'antd';
import authApi from '@/+core/api/auth.api';
import { UserType } from '@/types';
import { setUser } from '@/store/actions/user.action';

const APP_NAME = import.meta.env.VITE_APP_NAME;

const { Text } = Typography;

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSchema = z.object({
    username: z.string().nonempty({ message: 'Vui lòng nhập username' }),
    password: z
      .string()
      .nonempty({ message: 'Vui lòng nhập mật khẩu' })
      .min(6, { message: 'Mật khẩu phải ít nhất 6 ký tự' }),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'mor_2314',
      password: '83r5^_',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const authRes = await authApi.login(data);

      console.log('AUTH RES >>>>>:', authRes.data);

      if (authRes.status === 201) {
        message.success('Đăng nhập thành công!');

        const profileRes = await authApi.getProfile(authRes.data.token);

        if (profileRes.status === 200) {
          // console.log('PROFILE RES >>>>>:', profileRes.data);

          const AuthUser: UserType = {
            token: authRes.data.token,
            ...profileRes.data,
          };

          console.log('USER PROFILE:', AuthUser);

          // Save session to Cookies
          Cookies.set(APP_NAME, JSON.stringify(AuthUser), {
            expires: 7, // 7 ngày
            path: '/', // toàn bộ site
          });

          dispatch(setUser(AuthUser));

          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      message.error(error.message || 'Đăng nhập thất bại');
    }
  };

  const onError = (errors: any) => {
    console.error('Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  return (
    <form
      className='bg-[#FFF] p-4 pb-6 rounded-md w-[400px] max-w-[400px] flex flex-col gap-5 shadow-md'
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <div className='flex flex-col items-center justify-center gap-3 mb-5'>
        <img className='w-[100px] object-cover' src='./assets/images/logo.png' alt='logo' />

        <span className='text-[0.8rem] text-zinc-500'>Sign in with your account!</span>
      </div>

      <Controller
        control={control}
        name='username'
        render={({ field }) => {
          return (
            <div className='w-full flex flex-col gap-2'>
              <label className='text-[0.95rem] font-semibold text-primary'>Tài khoản</label>

              <Input
                {...field}
                placeholder='Nhập username'
                status={errors.username ? 'error' : ''}
              />

              {errors.username && (
                <Text type='danger' style={{ fontSize: 12 }}>
                  {errors.username.message}
                </Text>
              )}
            </div>
          );
        }}
      />

      <Controller
        control={control}
        name='password'
        render={({ field }) => {
          return (
            <div className='w-full flex flex-col gap-2'>
              <label className='text-[0.95rem] font-semibold text-primary'>Mật khẩu</label>

              <Input.Password
                {...field}
                placeholder='Nhập mật khẩu'
                status={errors.password ? 'error' : ''}
              />

              {errors.password && (
                <Text type='danger' style={{ fontSize: 12 }}>
                  {errors.password.message}
                </Text>
              )}
            </div>
          );
        }}
      />

      <Button htmlType='submit' type='primary' loading={isSubmitting}>
        Đăng nhập
      </Button>
    </form>
  );
};

export default LoginForm;
