import { useTranslation } from 'react-i18next';
import { Dropdown, Avatar, Typography, Space } from 'antd';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const items = [
    {
      key: 'vi-lang',
      label: 'VI',
      icon: <img className='w-4 h-4' src='/assets/icons/icon-vi.png' alt='vi-icon' />,
      onClick: () => changeLanguage('vi'),
    },
    {
      key: 'en-lang',
      label: 'EN',
      icon: <img className='w-4 h-4' src='/assets/icons/icon-en.png' alt='vi-icon' />,
      onClick: () => changeLanguage('en'),
    },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const renderLanguage = (lang: string): { label: string; icon: string } => {
    if (lang === 'vi') {
      return {
        label: lang,
        icon: '/assets/icons/icon-vi.png',
      };
    }

    if (lang === 'en') {
      return {
        label: lang,
        icon: '/assets/icons/icon-en.png',
      };
    }

    return {
      label: lang,
      icon: '/assets/icons/icon-vi.png',
    };
  };

  return (
    <Dropdown menu={{ items, className: 'w-[100px]' }} trigger={['click']} placement='bottomRight'>
      <div
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        onClick={(e) => e.preventDefault()} // tránh nhảy trang
      >
        <Space>
          <Avatar src={renderLanguage(i18n.language).icon} />

          <Typography>{renderLanguage(i18n.language).label}</Typography>
        </Space>
      </div>
    </Dropdown>
  );
};

export default LanguageToggle;
