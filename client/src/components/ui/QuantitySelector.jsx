import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ id, value, max, onChange, disabled = false }) {
  const setValue = (next) => onChange(Math.min(Math.max(next, 1), max));

  return (
    <div className="quantity-selector" role="group" aria-label="Quantity">
      <button
        type="button"
        className="quantity-selector__btn"
        aria-label="Decrease quantity"
        onClick={() => setValue(value - 1)}
        disabled={disabled || value <= 1}
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        id={id}
        name="quantity"
        className="quantity-selector__input"
        value={value}
        min={1}
        max={max}
        inputMode="numeric"
        aria-label="Quantity"
        disabled={disabled}
        onChange={(event) => setValue(Number(event.target.value) || 1)}
      />
      <button
        type="button"
        className="quantity-selector__btn"
        aria-label="Increase quantity"
        onClick={() => setValue(value + 1)}
        disabled={disabled || value >= max}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
