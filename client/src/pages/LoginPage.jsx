import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordInput from '../components/auth/PasswordInput';
import FormField from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { getErrorMessage } from '../utils/errors';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { values, handleChange } = useForm({ email: '', password: '' });

  const redirectTo = location.state?.from?.pathname ?? '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Log in" subtitle="Welcome back! Please enter your details.">
      <form id="login-form" className="form" onSubmit={handleSubmit}>
        {formError && (
          <p className="alert alert--error" role="alert">
            {formError}
          </p>
        )}

        <FormField label="Email address" htmlFor="login-email">
          <input
            type="email"
            id="login-email"
            name="email"
            className="input"
            placeholder="you@example.com"
            autoComplete="email"
            required
            autoFocus
            value={values.email}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Password" htmlFor="login-password">
          <PasswordInput
            id="login-password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            value={values.password}
            onChange={handleChange}
          />
        </FormField>

        <button type="submit" id="login-submit" className="btn btn--primary btn--lg btn--block" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>

        <p className="demo-credentials">
          <strong>Demo account:</strong> customer@shopsphere.com / Customer@1234
        </p>

        <p className="form__footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" state={location.state} id="go-to-register">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
