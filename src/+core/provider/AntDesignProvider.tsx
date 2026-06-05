import React from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import { useTranslation } from 'react-i18next';

export default function AntDesignProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  // Chọn locale Antd dựa vào i18n
  const antdLocale = i18n.language === 'vi' ? viVN : enUS;

  // Chọn locale dayjs
  dayjs.locale(i18n.language === 'vi' ? 'vi' : 'en');

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        token: {
          colorPrimary: '#003c9c',
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Form: {
            itemMarginBottom: 0,
          },
          Input: {
            controlHeight: 40,
          },
          InputNumber: {
            controlHeight: 40,
          },
          Select: {
            controlHeight: 40,
          },
          Button: {
            controlHeight: 40,
          },
          DatePicker: {
            controlHeight: 40,
          },
          Table: {
            cellPaddingBlock: 12, // padding top/bottom (mặc định là 16)
            cellPaddingInline: 10, // padding left/right (mặc định là 16)
            headerBg: '#f6f8fb',
            headerColor: '#6b7280',
            headerBorderRadius: 0,
            fontWeightStrong: 700,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
