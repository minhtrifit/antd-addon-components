import AddonCard from '@/components/ui/AddonCard';
import { ADDON_ITEM } from './constants';

const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-5'>
      <section className='flex flex-wrap gap-5'>
        {ADDON_ITEM.map((item) => {
          return <AddonCard key={item.id} item={item} />;
        })}
      </section>
    </div>
  );
};

export default DashboardPage;
