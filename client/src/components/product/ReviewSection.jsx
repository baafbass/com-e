import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import { productsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { getErrorMessage } from '../../utils/errors';
import { formatDate } from '../../utils/format';
import FormField from '../ui/FormField';
import Rating, { RatingInput } from '../ui/Rating';
import Spinner from '../ui/Spinner';

function ReviewForm({ productId, existingReview, onSubmitted }) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) {
      toast.error('Please select a star rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await productsApi.addReview(productId, { rating, comment });
      toast.success(existingReview ? 'Your review was updated' : 'Thanks for your review!');
      onSubmitted();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="review-form" className="review-form card" onSubmit={handleSubmit}>
      <h3 className="review-form__title">{existingReview ? 'Update your review' : 'Write a review'}</h3>
      <RatingInput name="rating" value={rating} onChange={(event) => setRating(Number(event.target.value))} />
      <FormField label="Your review" htmlFor="review-comment">
        <textarea
          id="review-comment"
          name="comment"
          className="input textarea"
          placeholder="What did you like or dislike about this product?"
          rows={4}
          maxLength={1000}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </FormField>
      <button type="submit" id="submit-review" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  );
}

export default function ReviewSection({ product, onReviewAdded }) {
  const { user } = useAuth();
  const location = useLocation();
  const { data: reviews, isLoading, reload } = useAsync(() => productsApi.listReviews(product.id), [product.id]);

  const ownReview = reviews?.find((review) => review.userId === user?.id);

  const handleSubmitted = () => {
    reload();
    onReviewAdded?.();
  };

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <header className="reviews__header">
        <h2 id="reviews-title" className="section-title">
          Customer reviews
        </h2>
        <div className="reviews__summary">
          <strong className="reviews__score">{product.rating.toFixed(1)}</strong>
          <Rating value={product.rating} />
          <span>Based on {product.reviewCount} reviews</span>
        </div>
      </header>

      <div className="reviews__layout">
        <div className="reviews__list">
          {isLoading && <Spinner />}
          {!isLoading && reviews?.length === 0 && (
            <p className="muted">
              <MessageSquare size={16} aria-hidden="true" /> No reviews yet. Be the first to share your thoughts!
            </p>
          )}
          {reviews?.map((review) => (
            <article key={review.id} className="review" id={`review-${review.id}`}>
              <header className="review__header">
                <span className="avatar avatar--sm" aria-hidden="true">
                  {review.userName[0]}
                </span>
                <div>
                  <strong>{review.userName}</strong>
                  <time className="review__date" dateTime={review.createdAt}>
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <Rating value={review.rating} size={14} />
              </header>
              {review.comment && <p className="review__comment">{review.comment}</p>}
            </article>
          ))}
        </div>

        <div className="reviews__form">
          {user ? (
            <ReviewForm
              key={ownReview?.id ?? 'new'}
              productId={product.id}
              existingReview={ownReview}
              onSubmitted={handleSubmitted}
            />
          ) : (
            <div className="card review-form">
              <p>Share your experience with other shoppers.</p>
              <Link to="/login" state={{ from: location }} id="login-to-review" className="btn btn--primary">
                Log in to write a review
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
