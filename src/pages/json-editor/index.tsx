import { useState } from 'react';
import { JsonEditor } from '@/components/ui/JsonEditor';
import { JsonValue } from '@/components/ui/JsonEditor/types';

const JsonEditorPage = () => {
  const [data, setData] = useState<JsonValue>({});

  return (
    <div className='flex flex-col gap-5'>
      <section className='block__container'>
        <h2>Playground</h2>
        <JsonEditor value={data} onChange={setData} />
      </section>
    </div>
  );
};

export default JsonEditorPage;
