interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

export function Slider({ value, onChange, label, min = 0, max = 100 }: SliderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <div style={{ fontSize: '14px', color: '#374151' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '120px',
            height: '4px',
            appearance: 'none',
            backgroundColor: '#e5e7eb',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        />
        <span style={{ fontSize: '12px', color: '#6b7280', width: '32px', textAlign: 'right' }}>{value}%</span>
      </div>
    </div>
  );
}
