interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

export function Slider({ value, onChange, label, min = 0, max = 100 }: SliderProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="text-sm text-gray-700">{label}</div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-30 h-1 appearance-none bg-gray-200 rounded cursor-pointer"
        />
        <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>
      </div>
    </div>
  );
}
