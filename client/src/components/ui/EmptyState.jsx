export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <section className="empty-state" aria-label={title}>
      {Icon && (
        <span className="empty-state__icon" aria-hidden="true">
          <Icon size={32} />
        </span>
      )}
      <h2 className="empty-state__title">{title}</h2>
      {message && <p className="empty-state__message">{message}</p>}
      {action}
    </section>
  );
}
