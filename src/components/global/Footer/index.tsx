import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const APP_NAME = import.meta.env.VITE_APP_NAME;

const Footer = () => {
  return (
    <AntFooter className='bg-[#FFF] px-[12px] py-[20px] flex flex-wrap items-center justify-between gap-[10px]'>
      <span className='text-[0.8rem] text-zinc-500'>
        ©{new Date().getFullYear()} All rights reserved{' '}
        <span className='text-primary font-semibold'>{APP_NAME}</span>
      </span>

      <span className='text-[0.8rem] text-zinc-500'>Design & Develop by minhtrifit</span>
    </AntFooter>
  );
};

export default Footer;
