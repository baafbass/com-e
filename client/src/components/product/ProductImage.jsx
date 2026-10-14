import { PLACEHOLDER_IMAGE } from '../../utils/constants';

/** Product image with lazy loading and a placeholder when the URL is missing or broken. */
export default function ProductImage({ src, alt, className = '', eager = false }) {
  return (
    <img
      src={src || PLACEHOLDER_IMAGE}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = PLACEHOLDER_IMAGE;
      }}
    />
  );
}
