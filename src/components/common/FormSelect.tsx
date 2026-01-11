import { Select } from 'antd';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  disabled?: boolean;
  className?: string;
}

export function FormSelect({ value, onChange, options, disabled = false, className = '' }: FormSelectProps) {
  return (
    <Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      style={{ width: '100%' }}
      options={options}
    />
  );
}
