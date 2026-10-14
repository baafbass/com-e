import { AlertTriangle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert--error" role="alert">
      <AlertTriangle size={20} aria-hidden="true" />
      <span>{message}</span>
      {onRetry && (
        <button type="button" id="retry-button" className="btn btn--outline btn--sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
