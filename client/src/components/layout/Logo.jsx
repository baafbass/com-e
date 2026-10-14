import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ id = 'site-logo', light = false }) {
  return (
    <Link to="/" id={id} className={`logo ${light ? 'logo--light' : ''}`} aria-label="ShopSphere home">
      <span className="logo__mark" aria-hidden="true">
        <ShoppingBag size={20} />
      </span>
      <span className="logo__text">
        Shop<strong>Sphere</strong>
      </span>
    </Link>
  );
}
