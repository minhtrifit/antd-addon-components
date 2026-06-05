import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col gap-5 items-center justify-center'>
        <span>Not Found Page</span>
        <Button
          type='primary'
          onClick={() => {
            navigate('/dashboard');
          }}
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
