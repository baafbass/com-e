import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../api';
import PasswordInput from '../components/auth/PasswordInput';
import FormField from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { getErrorMessage, getFieldErrors } from '../utils/errors';
import { capitalize, formatDate } from '../utils/format';

function ProfileForm() {
  const { user, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const { values, errors, setErrors, handleChange } = useForm({ name: user.name, email: user.email });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      setUser(await authApi.updateProfile(values));
      toast.success('Profile updated');
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form id="profile-form" className="card form" onSubmit={handleSubmit}>
      <h2 className="card__title">Personal details</h2>
      <FormField label="Full name" htmlFor="profile-name" error={errors.name}>
        <input
          type="text"
          id="profile-name"
          name="name"
          className="input"
          placeholder="Your full name"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          value={values.name}
          onChange={handleChange}
        />
      </FormField>
      <FormField label="Email address" htmlFor="profile-email" error={errors.email}>
        <input
          type="email"
          id="profile-email"
          name="email"
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={values.email}
          onChange={handleChange}
        />
      </FormField>
      <button type="submit" id="save-profile" className="btn btn--primary" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}

function PasswordForm() {
  const [isSaving, setIsSaving] = useState(false);
  const { values, errors, setErrors, handleChange, reset } = useForm({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (values.newPassword !== values.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsSaving(true);
    try {
      await authApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      toast.success('Password changed');
      reset();
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form id="password-form" className="card form" onSubmit={handleSubmit}>
      <h2 className="card__title">Change password</h2>
      <FormField label="Current password" htmlFor="current-password" error={errors.currentPassword}>
        <PasswordInput
          id="current-password"
          name="currentPassword"
          placeholder="Enter your current password"
          autoComplete="current-password"
          required
          value={values.currentPassword}
          onChange={handleChange}
        />
      </FormField>
      <FormField
        label="New password"
        htmlFor="new-password"
        error={errors.newPassword}
        hint="At least 8 characters, including a letter and a number."
      >
        <PasswordInput
          id="new-password"
          name="newPassword"
          placeholder="Create a new password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          value={values.newPassword}
          onChange={handleChange}
        />
      </FormField>
      <FormField label="Confirm new password" htmlFor="confirm-new-password" error={errors.confirmPassword}>
        <PasswordInput
          id="confirm-new-password"
          name="confirmPassword"
          placeholder="Repeat the new password"
          autoComplete="new-password"
          required
          value={values.confirmPassword}
          onChange={handleChange}
        />
      </FormField>
      <button type="submit" id="change-password" className="btn btn--primary" disabled={isSaving}>
        {isSaving ? 'Updating...' : 'Update password'}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container page page--narrow">
      <header className="page-header">
        <h1 className="page-title">My profile</h1>
        <p className="page-subtitle">
          {capitalize(user.role)} account · member since {formatDate(user.createdAt)}
        </p>
      </header>
      <div className="stack">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
}
