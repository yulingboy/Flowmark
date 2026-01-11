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
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`
          flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-blue-500
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      {showValue && (
        <span className={`text-sm min-w-[3rem] text-right ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {value}
        </span>
      )}
    </div>
  );
}
