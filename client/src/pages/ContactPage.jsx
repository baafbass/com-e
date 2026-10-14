import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import FormField from '../components/ui/FormField';
import { useForm } from '../hooks/useForm';

const CONTACT_DETAILS = [
  { icon: MapPin, label: 'Visit us', value: '123 Market Street, Downtown' },
  { icon: Phone, label: 'Call us', value: '+1 (555) 010-2030', href: 'tel:+15550102030' },
  { icon: Mail, label: 'Email us', value: 'support@shopsphere.com', href: 'mailto:support@shopsphere.com' },
  { icon: Clock, label: 'Opening hours', value: 'Mon – Sat, 9:00 – 18:00' },
];

const INITIAL_VALUES = { name: '', email: '', subject: 'order', message: '' };

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);
  const { values, handleChange, reset } = useForm(INITIAL_VALUES);

  // There is no messaging backend yet; simulate sending so the form can be demonstrated.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
    setIsSending(false);
  };

  return (
    <div className="container page">
      <header className="page-header page-header--center">
        <h1 className="page-title">Get in touch</h1>
        <p className="page-subtitle">Questions about an order or a product? Our team is happy to help.</p>
      </header>

      <div className="contact-layout">
        <ul className="contact-details">
          {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="contact-detail card">
              <span className="perk__icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <div>
                <h2 className="contact-detail__label">{label}</h2>
                {href ? <a href={href}>{value}</a> : <p>{value}</p>}
              </div>
            </li>
          ))}
        </ul>

        <form id="contact-form" className="card form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField label="Your name" htmlFor="contact-name">
              <input
                type="text"
                id="contact-name"
                name="name"
                className="input"
                placeholder="Jane Doe"
                autoComplete="name"
                minLength={2}
                required
                value={values.name}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Email address" htmlFor="contact-email">
              <input
                type="email"
                id="contact-email"
                name="email"
                className="input"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={values.email}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Subject" htmlFor="contact-subject" className="form-grid__full">
              <select
                id="contact-subject"
                name="subject"
                className="input select"
                value={values.subject}
                onChange={handleChange}
              >
                <option value="order">Order question</option>
                <option value="product">Product information</option>
                <option value="returns">Returns &amp; refunds</option>
                <option value="other">Something else</option>
              </select>
            </FormField>
            <FormField label="Message" htmlFor="contact-message" className="form-grid__full">
              <textarea
                id="contact-message"
                name="message"
                className="input textarea"
                placeholder="How can we help you?"
                rows={6}
                minLength={10}
                maxLength={2000}
                required
                value={values.message}
                onChange={handleChange}
              />
            </FormField>
          </div>
          <button type="submit" id="contact-submit" className="btn btn--primary btn--lg" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}
