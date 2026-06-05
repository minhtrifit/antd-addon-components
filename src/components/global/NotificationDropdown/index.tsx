import { Dropdown, Badge, Avatar } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';

const NotificationDropdown = () => {
  const items = [
    {
      key: 'noti-1',
      label: (
        <div className='w-full py-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Avatar size='default' icon={<UserOutlined />} />

            <div className='flex flex-col'>
              <span className='font-semibold text-[0.9rem] max-w-[200px] truncate'>
                Thông báo 1
              </span>
              <span className='text-gray-700 text-[0.7rem]'>10 phút trước</span>
            </div>
          </div>

          <div className='w-[8px] h-[8px] bg-primary rounded-full'></div>
        </div>
      ),
      onClick: () => console.log('Xem thông báo 1'),
    },
    {
      key: 'noti-2',
      label: (
        <div className='w-full py-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Avatar size='default' icon={<UserOutlined />} />

            <div className='flex flex-col'>
              <span className='font-semibold text-[0.9rem] max-w-[200px] truncate'>
                Thông báo 2
              </span>
              <span className='text-gray-700 text-[0.7rem]'>3 giờ trước</span>
            </div>
          </div>

          <div className='w-[8px] h-[8px] bg-primary rounded-full'></div>
        </div>
      ),
      onClick: () => console.log('Xem thông báo 2'),
    },
  ];

  return (
    <Dropdown menu={{ items, className: 'w-[300px]' }} trigger={['click']} placement='bottomRight'>
      <div
        className='h-[64px] flex items-center justify-center'
        onClick={(e) => e.preventDefault()} // tránh nhảy trang
      >
        <Badge count={items.length} offset={[0, 0]}>
          <BellOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;
