import { useSearchParams } from 'react-router-dom';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert URLSearchParams thành object
  const paramsObject = Object.fromEntries(searchParams.entries());

  // Hàm update params, merge với params hiện tại
  const updateParams = (newParams: Record<string, string | null | undefined>) => {
    const updated = { ...paramsObject };

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        delete updated[key]; // Xoá param nếu null/undefined
      } else {
        updated[key] = value;
      }
    });

    setSearchParams(updated);
  };

  return { searchParams, updateParams };
}
