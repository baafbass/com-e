import { CheckCircle2 } from 'lucide-react';

const BENEFITS = ['Save your cart across devices', 'Track every order in real time', 'Review products you love'];

/** Two-panel layout used by the login and registration pages. */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <aside className="auth-card__aside" aria-hidden="true">
          <h2>Welcome to ShopSphere</h2>
          <p>Your one-stop destination for quality products at honest prices.</p>
          <ul>
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <CheckCircle2 size={18} /> {benefit}
              </li>
            ))}
          </ul>
        </aside>
        <section className="auth-card__main">
          <h1 className="auth-card__title">{title}</h1>
          <p className="auth-card__subtitle">{subtitle}</p>
          {children}
        </section>
      </div>
    </div>
  );
}
