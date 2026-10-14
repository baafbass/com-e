import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import FormField from '../ui/FormField';

/** Create/edit form for a category. `onSubmit` receives the payload and should return a promise. */
export default function CategoryForm({ category, onSubmit, onCancel }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const { values, errors, setErrors, handleChange } = useForm({
    name: category?.name ?? '',
    description: category?.description ?? '',
    imageUrl: category?.imageUrl ?? '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError('');
    try {
      await onSubmit(values);
    } catch (error) {
      setErrors(getFieldErrors(error));
      setFormError(getErrorMessage(error));
      setIsSaving(false);
    }
  };

  return (
    <form id="category-form" className="form" onSubmit={handleSubmit}>
      {formError && (
        <p className="alert alert--error" role="alert">
          {formError}
        </p>
      )}

      <FormField label="Category name" htmlFor="category-name" error={errors.name}>
        <input
          type="text"
          id="category-name"
          name="name"
          className="input"
          placeholder="e.g. Electronics"
          minLength={2}
          maxLength={100}
          required
          autoFocus
          value={values.name}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Description" htmlFor="category-description" error={errors.description}>
        <textarea
          id="category-description"
          name="description"
          className="input textarea"
          placeholder="A short description shown on the shop page"
          rows={3}
          maxLength={500}
          value={values.description}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Image URL" htmlFor="category-image" error={errors.imageUrl}>
        <input
          type="url"
          id="category-image"
          name="imageUrl"
          className="input"
          placeholder="https://images.example.com/category.jpg"
          value={values.imageUrl}
          onChange={handleChange}
        />
      </FormField>

      <div className="form-actions">
        <button type="button" id="category-form-cancel" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" id="category-form-submit" className="btn btn--primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : category ? 'Save changes' : 'Create category'}
        </button>
      </div>
    </form>
  );
}
