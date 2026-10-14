import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { categoriesApi, productsApi } from '../../api';
import ProductForm from '../../components/admin/ProductForm';
import ProductImage from '../../components/product/ProductImage';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { getErrorMessage } from '../../utils/errors';
import { formatPrice } from '../../utils/format';

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null = closed, {} = new product, product = edit
  const [deleting, setDeleting] = useState(null);
  const debouncedSearch = useDebounce(search);

  const categories = useAsync(() => categoriesApi.list(), []);
  const products = useAsync(
    () =>
      productsApi.list({
        search: debouncedSearch || undefined,
        category: category || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    [debouncedSearch, category, page],
  );

  const closeForm = () => setEditing(null);

  const saveProduct = async (payload) => {
    const isNew = !editing.id;
    await (isNew ? productsApi.create(payload) : productsApi.update(editing.id, payload));
    toast.success(isNew ? 'Product created' : 'Product updated');
    closeForm();
    products.reload();
  };

  const deleteProduct = async () => {
    try {
      await productsApi.remove(deleting.id);
      toast.success('Product deleted');
      products.reload();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const resetPageAnd = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.data?.pagination.total ?? 0} products in your catalog</p>
        </div>
        <button type="button" id="add-product" className="btn btn--primary" onClick={() => setEditing({})}>
          <Plus size={18} aria-hidden="true" /> Add product
        </button>
      </header>

      <div className="card">
        <div className="admin-toolbar">
          <div className="input-icon">
            <Search size={18} aria-hidden="true" />
            <label htmlFor="admin-product-search" className="visually-hidden">
              Search products
            </label>
            <input
              type="search"
              id="admin-product-search"
              name="search"
              className="input"
              placeholder="Search by name or description..."
              value={search}
              onChange={resetPageAnd(setSearch)}
            />
          </div>
          <label htmlFor="admin-category-filter" className="visually-hidden">
            Filter by category
          </label>
          <select
            id="admin-category-filter"
            name="category"
            className="input select"
            value={category}
            onChange={resetPageAnd(setCategory)}
          >
            <option value="">All categories</option>
            {categories.data?.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {products.isLoading && <Spinner />}
        {products.error && <ErrorMessage message={products.error} onRetry={products.reload} />}

        {products.data && !products.isLoading && (
          <>
            <div className="table-wrapper">
              <table className="table" id="admin-products-table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Featured</th>
                    <th scope="col">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="table__empty">
                        No products match your search.
                      </td>
                    </tr>
                  )}
                  {products.data.items.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="table__product">
                          <ProductImage src={product.imageUrl} alt="" className="table__thumb" />
                          <Link to={`/product/${product.slug}`}>{product.name}</Link>
                        </div>
                      </td>
                      <td>{product.categoryName ?? <span className="muted">—</span>}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        <span className={product.stock < 5 ? 'text-danger' : undefined}>{product.stock}</span>
                      </td>
                      <td>{product.isFeatured ? <span className="badge badge--delivered">Yes</span> : 'No'}</td>
                      <td>
                        <div className="table__actions">
                          <button
                            type="button"
                            id={`edit-product-${product.id}`}
                            className="icon-btn"
                            onClick={() => setEditing(product)}
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            id={`delete-product-${product.id}`}
                            className="icon-btn icon-btn--danger"
                            onClick={() => setDeleting(product)}
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={products.data.pagination.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal
        id="product-modal"
        title={editing?.id ? 'Edit product' : 'Add product'}
        isOpen={editing !== null}
        onClose={closeForm}
        size="lg"
      >
        <ProductForm
          key={editing?.id ?? 'new'}
          product={editing?.id ? editing : null}
          categories={categories.data ?? []}
          onSubmit={saveProduct}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleting !== null}
        title="Delete product?"
        message={`"${deleting?.name}" will be removed from the store. Past orders keep their details.`}
        confirmLabel="Delete"
        onConfirm={deleteProduct}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
