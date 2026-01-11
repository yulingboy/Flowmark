interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function ToggleSwitch({ checked, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div>
        <div className="text-sm text-gray-700">{label}</div>
        {description && (
          <div className="text-xs text-gray-400 mt-0.5">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
          checked ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
