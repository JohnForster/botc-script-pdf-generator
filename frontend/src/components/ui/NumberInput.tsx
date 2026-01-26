interface NumberInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
}: NumberInputProps) {
  return (
    <div className="form-control">
      <label className="form-control-label">
        <span className="form-control-text">{label}</span>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(parseInt((e.target as HTMLInputElement).value))}
          className="number-input"
        />
      </label>
    </div>
  );
}
