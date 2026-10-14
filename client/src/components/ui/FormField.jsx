/**
 * Wraps a form control with its label, optional hint and validation error.
 * The child control must use the same `id` as `htmlFor`.
 */
export default function FormField({ label, htmlFor, error, hint, children, className = '' }) {
  return (
    <div className={`form-field ${error ? 'form-field--invalid' : ''} ${className}`.trim()}>
      <label className="form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <small className="form-hint" id={`${htmlFor}-hint`}>
          {hint}
        </small>
      )}
      {error && (
        <small className="form-error" id={`${htmlFor}-error`} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
