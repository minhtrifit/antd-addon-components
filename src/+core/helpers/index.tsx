export const handleRenderFormModeText = (mode: 'create' | 'edit' | 'view') => {
  if (mode === 'create') return 'Thêm mới';
  if (mode === 'edit') return 'Chỉnh sửa';
  if (mode === 'view') return 'Chi tiết';

  return '';
};
