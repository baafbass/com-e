import { Star } from 'lucide-react';

const STARS = [1, 2, 3, 4, 5];

/** Read-only star rating, e.g. 4.3 renders four filled stars. */
export default function Rating({ value = 0, count, size = 16 }) {
  return (
    <div className="rating" aria-label={`Rated ${value} out of 5`}>
      {STARS.map((star) => (
        <Star
          key={star}
          size={size}
          aria-hidden="true"
          className={star <= Math.round(value) ? 'rating__star rating__star--filled' : 'rating__star'}
        />
      ))}
      {count !== undefined && <span className="rating__count">({count})</span>}
    </div>
  );
}

/** Interactive star picker built on radio inputs for keyboard accessibility. */
export function RatingInput({ name, value, onChange }) {
  return (
    <fieldset className="rating-input">
      <legend className="visually-hidden">Your rating</legend>
      {STARS.map((star) => (
        <label key={star} className="rating-input__option" title={`${star} star${star > 1 ? 's' : ''}`}>
          <input
            type="radio"
            id={`${name}-${star}`}
            name={name}
            value={star}
            checked={Number(value) === star}
            onChange={onChange}
            className="visually-hidden"
          />
          <Star size={26} aria-hidden="true" className={star <= value ? 'rating__star rating__star--filled' : 'rating__star'} />
          <span className="visually-hidden">{star} stars</span>
        </label>
      ))}
    </fieldset>
  );
}
