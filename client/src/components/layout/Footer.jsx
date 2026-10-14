import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const FOOTER_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { to: '/shop', label: 'All products' },
      { to: '/shop?featured=true', label: 'Featured' },
      { to: '/shop?sort=newest', label: 'New arrivals' },
      { to: '/categories', label: 'Categories' },
    ],
  },
  {
    title: 'Customer care',
    links: [
      { to: '/orders', label: 'Track my orders' },
      { to: '/cart', label: 'Shopping cart' },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact us' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/faq#shipping', label: 'Shipping & returns' },
      { to: '/faq#privacy', label: 'Privacy policy' },
      { to: '/faq#terms', label: 'Terms of service' },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
];

function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <form id="newsletter-form" className="newsletter-form" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="footer__heading">
        Join our newsletter
      </label>
      <p className="footer__text">Get exclusive deals and new arrivals straight to your inbox.</p>
      <div className="newsletter-form__row">
        <input
          type="email"
          id="newsletter-email"
          name="email"
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" id="newsletter-submit" className="btn btn--primary">
          Subscribe
        </button>
      </div>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <section className="footer__brand" aria-label="About ShopSphere">
          <Logo id="footer-logo" light />
          <p className="footer__text">
            Quality products, honest prices and fast delivery. Your one-stop shop for everyday essentials.
          </p>
          <ul className="footer__contact">
            <li>
              <MapPin size={16} aria-hidden="true" /> 123 Market Street, Downtown
            </li>
            <li>
              <Phone size={16} aria-hidden="true" /> <a href="tel:+15550102030">+1 (555) 010-2030</a>
            </li>
            <li>
              <Mail size={16} aria-hidden="true" /> <a href="mailto:support@shopsphere.com">support@shopsphere.com</a>
            </li>
          </ul>
        </section>

        {FOOTER_SECTIONS.map((section) => (
          <nav key={section.title} className="footer__column" aria-label={section.title}>
            <h3 className="footer__heading">{section.title}</h3>
            <ul className="footer__links">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer__newsletter">
          <NewsletterForm />
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <ul className="footer__social" aria-label="Social media">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn icon-btn--light">
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
