import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top of the page on every route change (or to the #hash target). */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}
