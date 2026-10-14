export default function Spinner({ fullPage = false, label = 'Loading' }) {
  return (
    <div className={fullPage ? 'spinner-wrapper spinner-wrapper--page' : 'spinner-wrapper'} role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="visually-hidden">{label}...</span>
    </div>
  );
}
