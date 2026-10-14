import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container page not-found">
      <p className="not-found__code">404</p>
      <h1 className="page-title">Page not found</h1>
      <p className="page-subtitle">Sorry, the page you are looking for doesn&apos;t exist or has been moved.</p>
      <div className="hero__actions">
        <Link to="/" id="not-found-home" className="btn btn--primary">
          Back to home
        </Link>
        <Link to="/shop" id="not-found-shop" className="btn btn--outline">
          Browse products
        </Link>
      </div>
    </div>
  );
}
