interface PropType {
  title: string;
  className?: string;
  required?: boolean;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
}

const Label = (props: PropType) => {
  const { title, required, color = '#262626', fontSize = 14, fontWeight = 600 } = props;

  return (
    <label
      {...props}
      style={{
        color: color,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
      }}
    >
      {title}
      {required && <span className='text-red-500 ml-1'>*</span>}
    </label>
  );
};

export default Label;
