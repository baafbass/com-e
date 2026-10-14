import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { categoriesApi } from '../../api';
import CategoryForm from '../../components/admin/CategoryForm';
import ProductImage from '../../components/product/ProductImage';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { useAsync } from '../../hooks/useAsync';
import { getErrorMessage } from '../../utils/errors';

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, error, reload } = useAsync(() => categoriesApi.list(), []);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, category = edit
  const [deleting, setDeleting] = useState(null);

  const closeForm = () => setEditing(null);

  const saveCategory = async (payload) => {
    const isNew = !editing.id;
    await (isNew ? categoriesApi.create(payload) : categoriesApi.update(editing.id, payload));
    toast.success(isNew ? 'Category created' : 'Category updated');
    closeForm();
    reload();
  };

  const deleteCategory = async () => {
    try {
      await categoriesApi.remove(deleting.id);
      toast.success('Category deleted');
      reload();
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError));
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organise your catalog into collections.</p>
        </div>
        <button type="button" id="add-category" className="btn btn--primary" onClick={() => setEditing({})}>
          <Plus size={18} aria-hidden="true" /> Add category
        </button>
      </header>

      <div className="card">
        {isLoading && <Spinner />}
        {error && <ErrorMessage message={error} onRetry={reload} />}
        {categories && (
          <div className="table-wrapper">
            <table className="table" id="admin-categories-table">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Products</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="table__empty">
                      No categories yet.
                    </td>
                  </tr>
                )}
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="table__product">
                        <ProductImage src={category.imageUrl} alt="" className="table__thumb" />
                        <div>
                          <strong>{category.name}</strong>
                          <p className="muted table__description">{category.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code>{category.slug}</code>
                    </td>
                    <td>{category.productCount}</td>
                    <td>
                      <div className="table__actions">
                        <button
                          type="button"
                          id={`edit-category-${category.id}`}
                          className="icon-btn"
                          onClick={() => setEditing(category)}
                          aria-label={`Edit ${category.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          id={`delete-category-${category.id}`}
                          className="icon-btn icon-btn--danger"
                          onClick={() => setDeleting(category)}
                          aria-label={`Delete ${category.name}`}
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
        )}
      </div>

      <Modal
        id="category-modal"
        title={editing?.id ? 'Edit category' : 'Add category'}
        isOpen={editing !== null}
        onClose={closeForm}
      >
        <CategoryForm
          key={editing?.id ?? 'new'}
          category={editing?.id ? editing : null}
          onSubmit={saveCategory}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleting !== null}
        title="Delete category?"
        message={`"${deleting?.name}" will be deleted. Its ${deleting?.productCount ?? 0} products will stay in the store without a category.`}
        confirmLabel="Delete"
        onConfirm={deleteCategory}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
