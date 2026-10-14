import { Link } from 'react-router-dom';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../utils/constants';
import { formatPrice } from '../utils/format';

const FAQ_SECTIONS = [
  {
    id: 'shipping',
    title: 'Shipping & returns',
    items: [
      {
        question: 'How much does shipping cost?',
        answer: `Shipping is free for orders of ${formatPrice(FREE_SHIPPING_THRESHOLD)} or more. Smaller orders have a flat fee of ${formatPrice(SHIPPING_FEE)}.`,
      },
      {
        question: 'How long does delivery take?',
        answer: 'Orders are usually processed within 1 business day and delivered within 3 to 5 business days.',
      },
      {
        question: 'Can I return a product?',
        answer: 'Yes. You can return any unused product within 30 days of delivery for a full refund.',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders & payment',
    items: [
      {
        question: 'How do I track my order?',
        answer: 'Open "My orders" from the account menu to see the status of every order.',
      },
      {
        question: 'Can I cancel an order?',
        answer: 'You can cancel an order yourself while it is still pending. Once it is processing, contact support.',
      },
      {
        question: 'Which payment methods do you accept?',
        answer: 'This demo store uses pay on delivery. No card details are collected.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy policy',
    items: [
      {
        question: 'What data do you store?',
        answer: 'Only what we need to run your account and deliver orders: your name, email, shipping address and order history. Passwords are stored as secure hashes.',
      },
    ],
  },
  {
    id: 'terms',
    title: 'Terms of service',
    items: [
      {
        question: 'Who can use ShopSphere?',
        answer: 'Anyone can browse. Creating an account and placing orders requires accurate personal information.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container page page--narrow">
      <header className="page-header page-header--center">
        <h1 className="page-title">Frequently asked questions</h1>
        <p className="page-subtitle">
          Can&apos;t find what you need? <Link to="/contact">Contact our support team</Link>.
        </p>
      </header>

      {FAQ_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="faq-section" aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`} className="faq-section__title">
            {section.title}
          </h2>
          {section.items.map((item) => (
            <details key={item.question} className="faq-item">
              <summary className="faq-item__question">{item.question}</summary>
              <p className="faq-item__answer">{item.answer}</p>
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}
