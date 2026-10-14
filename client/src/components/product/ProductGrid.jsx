import ProductCard from './ProductCard';

export default function ProductGrid({ products, id = 'product-grid' }) {
  return (
    <div className="product-grid" id={id}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
