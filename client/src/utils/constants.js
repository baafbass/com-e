// Must match server/src/utils/pricing.js
export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 9.99;

export const PRODUCTS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'rating', label: 'Top rated' },
];

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#eef2ff"/><path d="M150 170h100l-10 90a12 12 0 0 1-12 10h-56a12 12 0 0 1-12-10z" fill="#c7d2fe"/></svg>',
  );
