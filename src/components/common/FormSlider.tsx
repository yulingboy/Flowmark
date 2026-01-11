import { Slider } from 'antd';

interface FormSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  disabled = false,
  className = '',
}: FormSliderProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="flex-1"
      />
      {showValue && (
        <span className={`text-sm min-w-[3rem] text-right ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {value}
        </span>
      )}
    </div>
  );
}
