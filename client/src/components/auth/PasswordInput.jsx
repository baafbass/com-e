import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/** Password field with a show/hide toggle. Accepts the same props as <input>. */
export default function PasswordInput(props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-input">
      <input {...props} type={isVisible ? 'text' : 'password'} className="input" />
      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        aria-controls={props.id}
      >
        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
