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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
        bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'cursor-pointer'}
        ${className}
      `}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
