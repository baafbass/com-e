import { Heart, Leaf, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80&auto=format&fit=crop';

const VALUES = [
  { icon: Sparkles, title: 'Quality first', text: 'Every product is selected and checked by our team before it reaches our store.' },
  { icon: Heart, title: 'Customer obsessed', text: 'Fast support, easy returns and honest prices, every single time.' },
  { icon: Leaf, title: 'Responsible', text: 'Recyclable packaging and partners who share our sustainability goals.' },
  { icon: Users, title: 'Community', text: 'Reviews from real shoppers help everyone make better choices.' },
];

export default function AboutPage() {
  return (
    <div className="container page">
      <section className="about-hero" aria-labelledby="about-title">
        <div>
          <span className="eyebrow">Our story</span>
          <h1 id="about-title" className="page-title">
            Making online shopping simple, honest and enjoyable
          </h1>
          <p className="page-subtitle">
            ShopSphere started with a simple idea: great products should be easy to find and fair to buy. Today we
            bring together electronics, fashion, home essentials, beauty, sports gear and books in one place, with a
            checkout that takes seconds and support that actually helps.
          </p>
          <Link to="/shop" id="about-shop-now" className="btn btn--primary btn--lg">
            Explore the shop
          </Link>
        </div>
        <img src={ABOUT_IMAGE} alt="Inside a bright, modern clothing store" className="about-hero__image" />
      </section>

      <section className="section" aria-labelledby="values-title">
        <h2 id="values-title" className="section-title section-title--center">
          What we stand for
        </h2>
        <div className="values-grid">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="value-card card">
              <span className="perk__icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
