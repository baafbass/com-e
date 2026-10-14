export default function StatCard({ icon: Icon, label, value, tone = 'primary' }) {
  return (
    <article className="stat-card card">
      <span className={`stat-card__icon stat-card__icon--${tone}`} aria-hidden="true">
        <Icon size={22} />
      </span>
      <div>
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
      </div>
    </article>
  );
}
