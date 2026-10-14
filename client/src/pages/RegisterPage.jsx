import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordInput from '../components/auth/PasswordInput';
import FormField from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { getErrorMessage, getFieldErrors } from '../utils/errors';

const PASSWORD_PATTERN = '(?=.*[A-Za-z])(?=.*\\d).{8,72}';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, setErrors, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (values.password !== values.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword: _confirm, ...data } = values;
      const user = await register(data);
      toast.success(`Welcome to ShopSphere, ${user.name.split(' ')[0]}!`);
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast.error(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Join us and start shopping in seconds.">
      <form id="register-form" className="form" onSubmit={handleSubmit}>
        <FormField label="Full name" htmlFor="register-name" error={errors.name}>
          <input
            type="text"
            id="register-name"
            name="name"
            className="input"
            placeholder="Jane Doe"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            autoFocus
            value={values.name}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Email address" htmlFor="register-email" error={errors.email}>
          <input
            type="email"
            id="register-email"
            name="email"
            className="input"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={values.email}
            onChange={handleChange}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="register-password"
          error={errors.password}
          hint="At least 8 characters, including a letter and a number."
        >
          <PasswordInput
            id="register-password"
            name="password"
            placeholder="Create a password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            pattern={PASSWORD_PATTERN}
            title="At least 8 characters, including a letter and a number"
            aria-describedby="register-password-hint"
            required
            value={values.password}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Confirm password" htmlFor="register-confirm-password" error={errors.confirmPassword}>
          <PasswordInput
            id="register-confirm-password"
            name="confirmPassword"
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
            value={values.confirmPassword}
            onChange={handleChange}
          />
        </FormField>

        <label className="choice" htmlFor="accept-terms">
          <input type="checkbox" id="accept-terms" name="acceptTerms" required />
          <span>
            I agree to the <Link to="/faq#terms">Terms of service</Link> and{' '}
            <Link to="/faq#privacy">Privacy policy</Link>
          </span>
        </label>

        <button type="submit" id="register-submit" className="btn btn--primary btn--lg btn--block" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="form__footer">
          Already have an account?{' '}
          <Link to="/login" state={location.state} id="go-to-login">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
