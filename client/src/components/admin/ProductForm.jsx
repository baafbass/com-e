import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import ProductImage from '../product/ProductImage';
import FormField from '../ui/FormField';

const toFormValues = (product) => ({
  name: product?.name ?? '',
  description: product?.description ?? '',
  price: product?.price ?? '',
  compareAtPrice: product?.compareAtPrice ?? '',
  stock: product?.stock ?? 0,
  imageUrl: product?.imageUrl ?? '',
  categoryId: product?.categoryId ?? '',
  isFeatured: product?.isFeatured ?? false,
});

const toPayload = (values) => ({
  ...values,
  price: Number(values.price),
  compareAtPrice: values.compareAtPrice === '' ? null : Number(values.compareAtPrice),
  stock: Number(values.stock),
  categoryId: values.categoryId === '' ? null : Number(values.categoryId),
});

/** Create/edit form for a product. `onSubmit` receives the API payload and should return a promise. */
export default function ProductForm({ product, categories, onSubmit, onCancel }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const { values, errors, setErrors, handleChange } = useForm(toFormValues(product));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError('');
    try {
      await onSubmit(toPayload(values));
    } catch (error) {
      setErrors(getFieldErrors(error));
      setFormError(getErrorMessage(error));
      setIsSaving(false);
    }
  };

  return (
    <form id="product-form" className="form" onSubmit={handleSubmit}>
      {formError && (
        <p className="alert alert--error" role="alert">
          {formError}
        </p>
      )}

      <div className="form-grid">
        <FormField label="Product name" htmlFor="product-name" error={errors.name} className="form-grid__full">
          <input
            type="text"
            id="product-name"
            name="name"
            className="input"
            placeholder="e.g. Wireless Headphones"
            minLength={2}
            maxLength={150}
            required
            autoFocus
            value={values.name}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Description" htmlFor="product-description" error={errors.description} className="form-grid__full">
          <textarea
            id="product-description"
            name="description"
            className="input textarea"
            placeholder="Describe the product's features and benefits"
            rows={4}
            maxLength={5000}
            value={values.description}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Price ($)" htmlFor="product-price" error={errors.price}>
          <input
            type="number"
            id="product-price"
            name="price"
            className="input"
            placeholder="0.00"
            min={0}
            step="0.01"
            required
            value={values.price}
            onChange={handleChange}
          />
        </FormField>

        <FormField
          label="Compare-at price ($)"
          htmlFor="product-compare-price"
          error={errors.compareAtPrice}
          hint="Optional original price, shown struck through."
        >
          <input
            type="number"
            id="product-compare-price"
            name="compareAtPrice"
            className="input"
            placeholder="Optional"
            min={0}
            step="0.01"
            value={values.compareAtPrice}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Stock quantity" htmlFor="product-stock" error={errors.stock}>
          <input
            type="number"
            id="product-stock"
            name="stock"
            className="input"
            placeholder="0"
            min={0}
            step={1}
            required
            value={values.stock}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Category" htmlFor="product-category" error={errors.categoryId}>
          <select
            id="product-category"
            name="categoryId"
            className="input select"
            value={values.categoryId}
            onChange={handleChange}
          >
            <option value="">Uncategorised</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Image URL" htmlFor="product-image" error={errors.imageUrl} className="form-grid__full">
          <input
            type="url"
            id="product-image"
            name="imageUrl"
            className="input"
            placeholder="https://images.example.com/product.jpg"
            value={values.imageUrl}
            onChange={handleChange}
          />
        </FormField>

        {values.imageUrl && (
          <div className="form-grid__full image-preview">
            <ProductImage src={values.imageUrl} alt="Product image preview" className="image-preview__img" />
          </div>
        )}

        <label className="choice form-grid__full" htmlFor="product-featured">
          <input
            type="checkbox"
            id="product-featured"
            name="isFeatured"
            checked={values.isFeatured}
            onChange={handleChange}
          />
          <span>Show this product in the featured section</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" id="product-form-cancel" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" id="product-form-submit" className="btn btn--primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : product ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
}
