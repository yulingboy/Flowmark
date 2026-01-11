import { Switch } from 'antd';

interface FormToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function FormToggle({ label, description, checked, onChange, disabled = false }: FormToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
        {description && (
          <p className={`text-xs ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
