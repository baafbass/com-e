import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchBar({ id = 'navbar-search', onSearch }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('search') ?? '');

  // Keep the input in sync when the URL changes (e.g. filters cleared).
  useEffect(() => {
    setTerm(searchParams.get('search') ?? '');
  }, [searchParams]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = term.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
    onSearch?.();
  };

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <label htmlFor={id} className="visually-hidden">
        Search products
      </label>
      <input
        type="search"
        id={id}
        name="search"
        className="search-bar__input"
        placeholder="Search for products, brands..."
        autoComplete="off"
        maxLength={100}
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
      <button type="submit" className="search-bar__btn" aria-label="Submit search">
        <Search size={18} />
      </button>
    </form>
  );
}
